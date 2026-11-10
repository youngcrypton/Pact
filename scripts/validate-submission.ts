import crypto from 'crypto';

/**
 * Pact - Official Hackathon Submission Payload Validator
 * Validates the submission payload against the exact rules in HACKATHON.md
 * and generates a unique requestId.
 */

export interface SubmissionPayload {
  requestId?: string;
  projectName: string;
  leadName: string;
  email: string;
  size: '1' | '2 - 4' | '4 - 6' | '6 - 8' | '8+';
  tracks: string[];
  nearAddress: string;
  projectUrl: string;
  demoUrl: string;
  idea: string;
  consent: boolean;
  website?: never; // Explicitly forbidden honeypot trap
}

const ALLOWED_TRACKS = [
  'defi', 'thesis', 'privacy', 'business', 'swarms',
  'security', 'agents', 'realworld', 'games', 'nfts',
  'memecoins', 'social', 'open'
];

const ALLOWED_SIZES = ['1', '2 - 4', '4 - 6', '6 - 8', '8+'];

export function validateSubmission(data: Record<string, any>): { isValid: boolean; errors: string[]; payload?: SubmissionPayload } {
  const errors: string[] = [];

  // 1. Check Anti-Spam Honeypot Trap
  if (data.website !== undefined && data.website !== '') {
    errors.push('CRITICAL: Forbidden "website" honeypot field detected! The server will reject this as spam. Remove it.');
  }

  // 2. Project Name
  if (!data.projectName || data.projectName.length < 2 || data.projectName.length > 80) {
    errors.push('projectName must be between 2 and 80 characters.');
  }

  // 3. Lead Name
  if (!data.leadName || data.leadName.length < 2 || data.leadName.length > 80) {
    errors.push('leadName must be between 2 and 80 characters.');
  }

  // 4. Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email) || data.email.length > 160) {
    errors.push('email must be a valid email address (max 160 chars).');
  }

  // 5. Team Size
  if (!ALLOWED_SIZES.includes(data.size)) {
    errors.push(`size must be exactly one of: ${ALLOWED_SIZES.join(', ')}`);
  }

  // 6. Tracks
  if (!Array.isArray(data.tracks) || data.tracks.length === 0) {
    errors.push('tracks must be an array with at least one valid track id.');
  } else {
    for (const t of data.tracks) {
      if (!ALLOWED_TRACKS.includes(t)) {
        errors.push(`Invalid track: "${t}". Allowed: ${ALLOWED_TRACKS.join(', ')}`);
      }
    }
  }

  // 7. NEAR Address (Mainnet)
  const nearRegex = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
  if (!data.nearAddress || !nearRegex.test(data.nearAddress) || data.nearAddress.length < 2 || data.nearAddress.length > 64) {
    errors.push('nearAddress must be a valid lowercase NEAR Mainnet account address.');
  }

  // 8. Public Repository URL
  if (!data.projectUrl || !data.projectUrl.startsWith('http')) {
    errors.push('projectUrl must be a valid public repository URL (max 300 chars).');
  }

  // 9. Demo URL (X Post)
  if (!data.demoUrl || !data.demoUrl.startsWith('http')) {
    errors.push('demoUrl must be a valid public demo post URL (max 300 chars).');
  }

  // 10. Idea Description
  if (!data.idea || data.idea.length < 20 || data.idea.length > 2000) {
    errors.push('idea must be between 20 and 2000 characters.');
  }

  // 11. Consent
  if (data.consent !== true) {
    errors.push('consent must be true.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const payload: SubmissionPayload = {
    requestId: data.requestId || crypto.randomUUID(),
    projectName: data.projectName,
    leadName: data.leadName,
    email: data.email,
    size: data.size,
    tracks: data.tracks,
    nearAddress: data.nearAddress,
    projectUrl: data.projectUrl,
    demoUrl: data.demoUrl,
    idea: data.idea,
    consent: true
  };

  return { isValid: true, errors: [], payload };
}

// Test validation if run directly
console.log('Submission validator loaded.');
console.log('Run this before submitting to https://nearhackathon.com/api/applications');

