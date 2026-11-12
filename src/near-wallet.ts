import { keyStores, KeyPair, utils } from 'near-api-js';
import { NEAR_CONFIG } from './config.js';

export interface WalletSession {
  accountId: string;
  walletType: 'mynearwallet' | 'meteor' | 'here' | 'nightly' | 'ledger' | 'direct';
  publicKey?: string;
  connectedAt: number;
}

export interface SignatureChallenge {
  message: string;
  nonce: string;
  recipient: string;
  callbackUrl?: string;
}

export class NearWalletService {
  private keyStore: keyStores.InMemoryKeyStore;
  private currentSession: WalletSession | null = null;

  constructor() {
    this.keyStore = new keyStores.InMemoryKeyStore();
  }

  /**
   * Generates a standard NEP-413 authentication message challenge
   */
  public createAuthChallenge(accountId: string): SignatureChallenge {
    const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const message = `Sign in to Pactt Earned Trust Protocol on NEAR\nAccount: ${accountId}\nNonce: ${nonce}`;
    return {
      message,
      nonce,
      recipient: NEAR_CONFIG.pactContract || 'pact.testnet'
    };
  }

  /**
   * Cryptographically verifies an Ed25519 signature payload
   */
  public verifySignature(
    message: string,
    signatureHexOrBase64: string,
    publicKeyStr: string
  ): boolean {
    try {
      const pubKey = utils.PublicKey.fromString(publicKeyStr);
      const msgBytes = Buffer.from(message, 'utf-8');
      
      let sigBytes: Buffer;
      if (signatureHexOrBase64.length === 128) {
        sigBytes = Buffer.from(signatureHexOrBase64, 'hex');
      } else {
        sigBytes = Buffer.from(signatureHexOrBase64, 'base64');
      }

      return pubKey.verify(msgBytes, sigBytes);
    } catch (err: any) {
      console.warn(`[NearWalletService] Signature verification failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Resolves standard NEAR web wallet redirect URL for authentication
   */
  public getWebWalletAuthUrl(walletType: 'mynearwallet' | 'meteor' | 'here', contractId: string, successUrl: string): string {
    const baseUrl = walletType === 'mynearwallet' 
      ? 'https://testnet.mynearwallet.com/login/'
      : walletType === 'meteor'
      ? 'https://wallet.meteorwallet.app/login/'
      : 'https://my.herewallet.app/';

    const url = new URL(baseUrl);
    url.searchParams.set('contract_id', contractId);
    url.searchParams.set('success_url', successUrl);
    url.searchParams.set('failure_url', successUrl);
    return url.toString();
  }

  /**
   * Validate account ID conforms to NEAR testnet/mainnet naming rules
   */
  public isValidAccountId(accountId: string): boolean {
    if (!accountId || accountId.length < 2 || accountId.length > 64) {
      return false;
    }
    // Standard NEAR account naming regex: lowercase alphanumeric, hyphens, underscores, dots
    const nearAccountPattern = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
    return nearAccountPattern.test(accountId);
  }

  /**
   * Create mock keypair for local/testnet verification
   */
  public generateTestKeyPair(): { publicKey: string; secretKey: string } {
    const keyPair = KeyPair.fromRandom('ed25519');
    return {
      publicKey: keyPair.getPublicKey().toString(),
      secretKey: keyPair.toString()
    };
  }
}
