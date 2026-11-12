import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { Bounty, ContributorProfile } from './types.js';

export interface StorageSnapshot {
  bounties: Bounty[];
  contributors: ContributorProfile[];
  usedProofUrls: [string, string][]; // [proof_url, bounty_id]
  updatedAt: number;
}

export class PactStorage {
  private supabaseUrl: string | null = null;
  private supabaseKey: string | null = null;
  private localFilePath: string;
  private isCloud: boolean = false;

  constructor(options?: { supabaseUrl?: string; supabaseKey?: string; localFilePath?: string }) {
    const isTest = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('test'));

    // In unit test runs, isolate to local test storage unless explicitly passed in options
    if (!isTest || options?.supabaseUrl) {
      this.supabaseUrl = options?.supabaseUrl || process.env.SUPABASE_URL || null;
      this.supabaseKey = options?.supabaseKey || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || null;
    }
    this.localFilePath = options?.localFilePath || path.resolve(process.cwd(), 'data', 'pact-store.json');

    if (this.supabaseUrl && this.supabaseKey) {
      this.isCloud = true;
    }
  }

  public getStorageMode(): 'supabase' | 'local-durable' {
    return this.isCloud ? 'supabase' : 'local-durable';
  }

  public isCloudActive(): boolean {
    return this.isCloud;
  }

  /**
   * Load entire state from Supabase Cloud or Local Durable Storage
   */
  public async loadState(): Promise<StorageSnapshot | null> {
    if (this.isCloud) {
      try {
        const cloudState = await this.loadFromSupabase();
        if (cloudState) return cloudState;
      } catch (err: any) {
        console.warn(`[PactStorage] Supabase cloud load failed (${err.message}). Falling back to local storage.`);
      }
    }
    return this.loadFromLocal();
  }

  /**
   * Persist full snapshot to active storage engine
   */
  public async saveState(snapshot: {
    bounties: Bounty[];
    contributors: ContributorProfile[];
    usedProofUrls: Map<string, string>;
  }): Promise<void> {
    const serializedSnapshot: StorageSnapshot = {
      bounties: snapshot.bounties,
      contributors: snapshot.contributors,
      usedProofUrls: Array.from(snapshot.usedProofUrls.entries()),
      updatedAt: Date.now()
    };

    // Always persist to local durable storage as a resilient write-ahead copy
    this.saveToLocal(serializedSnapshot);

    // If cloud is enabled, write to Supabase
    if (this.isCloud) {
      try {
        await this.syncToSupabase(serializedSnapshot);
      } catch (err: any) {
        console.warn(`[PactStorage] Supabase cloud write failed: ${err.message}. Local durable backup safe.`);
      }
    }
  }

  /**
   * Save a single bounty update
   */
  public async saveBounty(bounty: Bounty): Promise<void> {
    if (this.isCloud) {
      try {
        await this.supabaseRequest('/rest/v1/bounties', {
          method: 'POST',
          headers: {
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: bounty.id,
            title: bounty.title,
            description: bounty.description,
            amount_formatted: bounty.amount_formatted,
            amount_yocto: bounty.amount_near,
            category: bounty.category,
            status: bounty.status,
            approval_tier: bounty.required_tier,
            claimed_by: bounty.claimed_by,
            proof_url: bounty.proof_url,
            created_by: bounty.created_by,
            escrow_status: bounty.escrow_status,
            escrow_vault_id: 'pact-dao-064783.testnet',
            escrow_tx_hash: bounty.escrow_tx_hash,
            dispute_status: bounty.dispute_status || 'NONE',
            disputed_by: bounty.disputed_by || null,
            dispute_reason: bounty.dispute_reason || null,
            dispute_challenged_at: bounty.dispute_challenged_at ? new Date(bounty.dispute_challenged_at).toISOString() : null,
            updated_at: new Date().toISOString()
          })
        });
      } catch (err: any) {
        console.warn(`[PactStorage] Cloud sync for bounty ${bounty.id} deferred: ${err.message}`);
      }
    }
  }

  /**
   * Save a single contributor update
   */
  public async saveContributor(profile: ContributorProfile): Promise<void> {
    if (this.isCloud) {
      try {
        await this.supabaseRequest('/rest/v1/contributors', {
          method: 'POST',
          headers: {
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            account_id: profile.account_id,
            trust_points: profile.trust_score,
            current_tier: profile.current_tier,
            completed_bounties_count: profile.completed_bounties_count,
            total_earned_near: profile.total_earned_formatted,
            total_earned_yocto: profile.total_earned_yocto,
            badges: profile.history || [],
            updated_at: new Date().toISOString()
          })
        });
      } catch (err: any) {
        console.warn(`[PactStorage] Cloud sync for contributor ${profile.account_id} deferred: ${err.message}`);
      }
    }
  }

  /**
   * Save a verified deliverable link
   */
  public async saveProofUrl(proofUrl: string, bountyId: string, claimant: string): Promise<void> {
    if (this.isCloud) {
      try {
        await this.supabaseRequest('/rest/v1/used_proof_urls', {
          method: 'POST',
          headers: {
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            proof_url: proofUrl,
            bounty_id: bountyId,
            claimant: claimant,
            created_at: new Date().toISOString()
          })
        });
      } catch (err: any) {
        console.warn(`[PactStorage] Cloud sync for proof URL deferred: ${err.message}`);
      }
    }
  }

  // -----------------------------------------------------------------------
  // Local File System Engine (Durable Offline Fallback)
  // -----------------------------------------------------------------------

  private loadFromLocal(): StorageSnapshot | null {
    try {
      if (!fs.existsSync(this.localFilePath)) {
        return null;
      }
      const raw = fs.readFileSync(this.localFilePath, 'utf-8');
      return JSON.parse(raw) as StorageSnapshot;
    } catch (err: any) {
      console.warn(`[PactStorage] Failed to read local store: ${err.message}`);
      return null;
    }
  }

  private saveToLocal(snapshot: StorageSnapshot): void {
    try {
      const dir = path.dirname(this.localFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmpPath = `${this.localFilePath}.${Date.now()}.${Math.random().toString(36).substring(7)}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(snapshot, null, 2), 'utf-8');
      try {
        fs.renameSync(tmpPath, this.localFilePath);
      } catch {
        // Safe fallback for Windows file locks (EPERM / EBUSY)
        fs.copyFileSync(tmpPath, this.localFilePath);
        try { fs.unlinkSync(tmpPath); } catch {}
      }
    } catch (err: any) {
      console.error(`[PactStorage] Local file write failed: ${err.message}`);
    }
  }

  // -----------------------------------------------------------------------
  // Supabase PostgREST Engine
  // -----------------------------------------------------------------------

  private async supabaseRequest(endpoint: string, init?: RequestInit): Promise<any> {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL or Key missing');
    }

    const url = `${this.supabaseUrl.replace(/\/$/, '')}${endpoint}`;
    const headers: Record<string, string> = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string> || {})
    };

    const res = await fetch(url, { ...init, headers });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Supabase returned HTTP ${res.status}: ${errText}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    return null;
  }

  private async loadFromSupabase(): Promise<StorageSnapshot | null> {
    const bountiesRaw = await this.supabaseRequest('/rest/v1/bounties?select=*');
    const contributorsRaw = await this.supabaseRequest('/rest/v1/contributors?select=*');
    const proofsRaw = await this.supabaseRequest('/rest/v1/used_proof_urls?select=*');

    if (!Array.isArray(bountiesRaw) || bountiesRaw.length === 0) {
      return null;
    }

    const bounties: Bounty[] = bountiesRaw.map((b: any) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      amount_near: b.amount_yocto || '0',
      amount_formatted: Number(b.amount_formatted),
      category: b.category,
      created_by: b.created_by,
      claimed_by: b.claimed_by,
      claimed_at: b.claimed_by ? Date.now() : null,
      proof_url: b.proof_url,
      submission_notes: null,
      status: b.status,
      escrow_status: b.escrow_status || 'ESCROWED',
      escrow_tx_hash: b.escrow_tx_hash || null,
      required_tier: b.approval_tier || 'TIER_2_SINGLE_COUNCIL',
      council_approved_by: b.status === 'APPROVED' ? 'council.testnet' : null,
      sputnik_proposal_id: null,
      dispute_status: b.dispute_status || 'NONE',
      disputed_by: b.disputed_by || null,
      dispute_reason: b.dispute_reason || null,
      dispute_challenged_at: b.dispute_challenged_at ? new Date(b.dispute_challenged_at).getTime() : null,
      created_at: b.created_at ? new Date(b.created_at).getTime() : Date.now(),
      completed_at: b.status === 'APPROVED' ? Date.now() : null
    }));

    const contributors: ContributorProfile[] = (contributorsRaw || []).map((c: any) => ({
      account_id: c.account_id,
      trust_score: Number(c.trust_points),
      completed_bounties_count: c.completed_bounties_count || 0,
      total_earned_yocto: c.total_earned_yocto || '0',
      total_earned_formatted: Number(c.total_earned_near || 0),
      current_tier: c.current_tier || 'NEWBIE',
      near_social_badge_minted: true,
      history: []
    }));

    const usedProofUrls: [string, string][] = (proofsRaw || []).map((p: any) => [p.proof_url, p.bounty_id]);

    return {
      bounties,
      contributors,
      usedProofUrls,
      updatedAt: Date.now()
    };
  }

  private async syncToSupabase(snapshot: StorageSnapshot): Promise<void> {
    for (const b of snapshot.bounties) {
      await this.saveBounty(b);
    }
    for (const c of snapshot.contributors) {
      await this.saveContributor(c);
    }
    for (const [url, bountyId] of snapshot.usedProofUrls) {
      await this.saveProofUrl(url, bountyId, 'system');
    }
  }
}

