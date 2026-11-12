import test from 'node:test';
import assert from 'node:assert';
import { NearWalletService } from '../src/near-wallet.js';
import { KeyPair } from 'near-api-js';

test('Bug 2: NEAR Wallet Selector & Cryptographic Authentication', async (t) => {
  const walletService = new NearWalletService();

  await t.test('1. Validates standard NEAR named account formats', () => {
    assert.strictEqual(walletService.isValidAccountId('alex.testnet'), true);
    assert.strictEqual(walletService.isValidAccountId('dev-hub.sputnik-dao.testnet'), true);
    assert.strictEqual(walletService.isValidAccountId('pact-dao-933742.testnet'), true);
    assert.strictEqual(walletService.isValidAccountId('alice'), true);

    // Invalid formats
    assert.strictEqual(walletService.isValidAccountId(''), false);
    assert.strictEqual(walletService.isValidAccountId('INVALID_CAPS.testnet'), false);
    assert.strictEqual(walletService.isValidAccountId('invalid@character.testnet'), false);
    assert.strictEqual(walletService.isValidAccountId('a'.repeat(65)), false);
  });

  await t.test('2. Generates NEP-413 compliant signature challenge', () => {
    const challenge = walletService.createAuthChallenge('alex.testnet');
    assert.ok(challenge.nonce);
    assert.ok(challenge.message.includes('alex.testnet'));
    assert.ok(challenge.message.includes(challenge.nonce));
    assert.strictEqual(challenge.recipient, 'pact.testnet');
  });

  await t.test('3. Cryptographic Ed25519 key-pair signature and verification roundtrip', () => {
    const keyPair = KeyPair.fromRandom('ed25519');
    const pubKeyStr = keyPair.getPublicKey().toString();
    const challenge = walletService.createAuthChallenge('alex.testnet');
    
    // Sign challenge message with private key
    const msgBytes = Buffer.from(challenge.message, 'utf-8');
    const signature = keyPair.sign(msgBytes);
    const sigBase64 = Buffer.from(signature.signature).toString('base64');

    // Verify signature
    const isValid = walletService.verifySignature(challenge.message, sigBase64, pubKeyStr);
    assert.strictEqual(isValid, true);

    // Tampered message must fail verification
    const isTamperedValid = walletService.verifySignature(
      challenge.message + ' (tampered)',
      sigBase64,
      pubKeyStr
    );
    assert.strictEqual(isTamperedValid, false);
  });

  await t.test('4. Generates standard wallet login redirect URLs', () => {
    const mnwUrl = walletService.getWebWalletAuthUrl(
      'mynearwallet',
      'pact.testnet',
      'https://pactt.xyz/callback'
    );
    assert.ok(mnwUrl.startsWith('https://testnet.mynearwallet.com/login/'));
    assert.ok(mnwUrl.includes('contract_id=pact.testnet'));
    assert.ok(mnwUrl.includes('success_url=https%3A%2F%2Fpactt.xyz%2Fcallback'));

    const meteorUrl = walletService.getWebWalletAuthUrl(
      'meteor',
      'pact.testnet',
      'https://pactt.xyz/callback'
    );
    assert.ok(meteorUrl.startsWith('https://wallet.meteorwallet.app/login/'));
  });
});
