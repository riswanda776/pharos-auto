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

3. Create a `privateKeys.txt` file in the root directory with your private keys (one per line):
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
├── privateKeys.txt      # Private keys file
├── package.json         # Project dependencies
└── README.md           # This file
```

## Security Notes

- Never share your private keys
- Use a dedicated wallet for testing
- Monitor your transactions

## License

This project is licensed under the MIT License - see the LICENSE file for details. 