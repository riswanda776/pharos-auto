# Pharos Testnet Automation Tool (Node.js Version)

This is a Node.js implementation of the Pharos Testnet automation tool. It helps automate various tasks on the Pharos testnet, including token swaps, transfers, and staking.

## Features

- Wallet authentication
- Daily check-in
- Faucet requests
- Random token transfers
- Staking operations
- Points tracking

## Prerequisites

- Node.js v18 or higher
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pharos-node
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following configuration:
```env
BASE_URL=https://testnet.pharosnetwork.xyz
RPC_URL=https://testnet.dplabs-internal.com
CHAIN_ID=688688
DELAY_BETWEEN_REQUESTS=[3,10]
USE_PROXY=false
REF_CODE=

# Token amounts
AMOUNT_SWAP=[0.001,0.002]
AMOUNT_SEND=[0.001,0.002]
PERCENT_STAKE=[5,10]

# Contract addresses
WPHRS_ADDRESS=0x76aaada469d23216be5f7c596fa25f282ff9b364
USDC_ADDRESS=0x4d21582f50Fb5D211fd69ABF065AD07E8738870D
USDT_ADDRESS=0x2eD344c586303C98FC3c6D5B42C5616ED42f9D9d
SWAP_ROUTER_ADDRESS=0x1a4de519154ae51200b0ad7c90f7fac75547888a
STAKING_CONTRACT=0x0000000000000000000000000000000000000000
```

4. Create a `privateKeys.txt` file in the root directory with your private keys (one per line):
```
0x123...
0x456...
```

## Usage

Run the bot:
```bash
npm start
```

## Project Structure

```
pharos-node/
├── src/
│   ├── bot.js           # Main bot class
│   ├── index.js         # Entry point
│   ├── contracts/
│   │   └── abis.js      # Contract ABIs
│   └── utils/
│       └── index.js     # Utility functions
├── .env                 # Environment configuration
├── privateKeys.txt      # Private keys file
├── package.json         # Project dependencies
└── README.md           # This file
```

## Security Notes

- Never share your private keys
- Keep your `.env` file secure
- Use a dedicated wallet for testing
- Monitor your transactions

## License

This project is licensed under the MIT License - see the LICENSE file for details. 