import { NEAR_CONFIG } from '../src/config.js';

/**
 * Pact Testnet Deployment Guide & Automation Script
 *
 * This script documents and automates deploying the Pact Protocol
 * to NEAR Testnet so you do not need to rely on localhost.
 */

console.log('=== PACT TESTNET DEPLOYMENT GUIDE ===\n');

console.log('Step 1: Create a free NEAR Testnet Account');
console.log('------------------------------------------');
console.log('You can create an account in 30 seconds using MyNearWallet Testnet:');
console.log('👉 https://testnet.mynearwallet.com/create\n');
console.log('Example account name: pact-<yourname>.testnet\n');

console.log('Step 2: Fund with Free Testnet NEAR');
console.log('------------------------------------------');
console.log('Testnet accounts come pre-funded with 10 free NEAR.');
console.log('Need more? Visit the official testnet faucet:');
console.log('👉 https://near-faucet.io\n');

console.log('Step 3: Broadcast Protocol Badges & Connect to Sputnik DAO');
console.log('----------------------------------------------------------');
console.log('Pactt acts as an Earned Trust Coordination Layer that routes payouts to Sputnik DAO');
console.log('and mints verifiable reputation badges directly to NEAR Social (SocialDB: v1.social08.testnet).');
console.log('Run the live on-chain broadcast script:');
console.log('npx tsx scripts/broadcast-testnet.ts\n');

console.log('Step 4: Verify On-Chain Transaction on NearBlocks');
console.log('----------------------------------------------------------');
console.log('Inspect live transactions on NEARBlocks:');
console.log('https://testnet.nearblocks.io/address/pact-dao-064783.testnet\n');

