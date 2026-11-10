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

console.log('Step 3: Deploy via NEAR CLI-RS');
console.log('------------------------------------------');
console.log('Run the following command in your terminal:');
console.log('npx near-cli-rs contract deploy <your-account>.testnet use-file dist/src/index.js without-init-call network-config testnet sign-with-keychain send\n');

console.log('Step 4: Share Contract ID with React Teammate');
console.log('------------------------------------------');
console.log('Give your teammate the deployed contract name (e.g. "pact.testnet").');
console.log('They will add it to their React .env file:');
console.log('NEXT_PUBLIC_CONTRACT_ID=pact-<yourname>.testnet');
console.log('NEXT_PUBLIC_NETWORK_ID=testnet\n');

