import https from 'https';
import crypto from 'crypto';
import { KeyPair, connect, keyStores, utils } from 'near-api-js';

/**
 * Pact Protocol — Automated Live Testnet Broadcast Script
 * 
 * 1. Creates a funded account on NEAR Testnet via the official helper
 * 2. Connects to NEAR Testnet RPC
 * 3. Signs and broadcasts a real on-chain transaction to NEAR Social (v1.social08.testnet)
 * 4. Outputs the clickable NEARBlocks explorer link!
 */

async function main() {
  console.log('====================================================');
  console.log('   🤝 PACT PROTOCOL — BROADCASTING TO NEAR TESTNET   ');
  console.log('====================================================\n');

  // 1. Generate local Ed25519 KeyPair
  const keyPair = KeyPair.fromRandom('ed25519');
  const publicKeyStr = keyPair.getPublicKey().toString();
  const accountId = `pact-dao-${Date.now().toString().slice(-6)}.testnet`;

  console.log(`[1/4] Generating KeyPair for account: ${accountId}`);
  console.log(`      Public Key: ${publicKeyStr}`);

  // 2. Request account creation & 10 free NEAR from Testnet Helper
  console.log(`\n[2/4] Requesting account creation & funding from NEAR Testnet Helper...`);
  const createAccountPayload = JSON.stringify({
    newAccountId: accountId,
    newAccountPublicKey: publicKeyStr
  });

  const createResult = await new Promise<{ status: number; body: string }>((resolve, reject) => {
    const req = https.request('https://helper.testnet.near.org/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(createAccountPayload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode || 500, body }));
    });
    req.on('error', reject);
    req.write(createAccountPayload);
    req.end();
  });

  if (createResult.status !== 200) {
    throw new Error(`Failed to create account: ${createResult.body}`);
  }

  const creationTx = JSON.parse(createResult.body);
  console.log(`      Account created successfully!`);
  console.log(`      Creation Tx Hash: ${creationTx.transaction?.hash}`);
  console.log(`      Explorer Link: https://testnet.nearblocks.io/txns/${creationTx.transaction?.hash}`);

  // 3. Connect to NEAR Testnet and sign a transaction
  console.log(`\n[3/4] Initializing NEAR connection & KeyStore...`);
  const keyStore = new keyStores.InMemoryKeyStore();
  await keyStore.setKey('testnet', accountId, keyPair);

  const near = await connect({
    networkId: 'testnet',
    keyStore,
    nodeUrl: 'https://rpc.testnet.near.org'
  });

  const account = await near.account(accountId);

  // 4. Broadcast on-chain badge data to NEAR Social (SocialDB: v1.social08.testnet)
  console.log(`\n[4/4] Broadcasting Pact Contributor Badge to NEAR Social (v1.social08.testnet)...`);
  
  const badgePayload = {
    [accountId]: {
      profile: {
        name: "Pact Protocol Verified Contributor",
        description: "Decentralized earned trust coordination on Sputnik DAO",
        badges: {
          pact: JSON.stringify({
            title: "Pact Verified Contributor (Tier 2)",
            trustScore: 75,
            awardedAt: new Date().toISOString(),
            protocol: "Pact"
          })
        }
      }
    }
  };

  // Call SocialDB `set` method with a 0.05 NEAR storage deposit
  const callResult = await account.functionCall({
    contractId: 'v1.social08.testnet',
    methodName: 'set',
    args: { data: badgePayload },
    gas: BigInt('100000000000000'), // 100 TGas
    attachedDeposit: BigInt('50000000000000000000000') // 0.05 NEAR for storage
  });

  const txHash = callResult.transaction.hash;
  console.log('\n====================================================');
  console.log('       🎉 TRANSACTION SUCCESSFULLY BROADCAST!        ');
  console.log('====================================================');
  console.log(`Account ID:     ${accountId}`);
  console.log(`Contract:       v1.social08.testnet (NEAR Social DB)`);
  console.log(`Method:         set`);
  console.log(`Tx Hash:        ${txHash}`);
  console.log(`\n👉 VERIFY ON EXPLORER:`);
  console.log(`https://testnet.nearblocks.io/txns/${txHash}`);
  console.log('====================================================\n');

  return { accountId, txHash, explorerUrl: `https://testnet.nearblocks.io/txns/${txHash}` };
}

main().catch((err) => {
  console.error('\n❌ Broadcast error:', err.message);
  process.exit(1);
});
