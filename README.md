# YENDO
AI automation tool for interacting with Solana wallets, balances, and on-chain actions.
**Automation layer for Solana wallets**  

YENDO is a Solana-based automation and wallet monitoring tool that allows users to **connect wallets, track balances, and trigger automated actions** based on on-chain conditions. Built as a CLI-first tool, YENDO is designed to **make Solana wallet management intuitive, automated, and scalable** for both individual users and developers.

---

## 🚀 Current Features

YENDO’s backend is fully functional and testable. Current capabilities include:

- **Wallet connection** – Connect any Solana wallet and verify ownership.  
- **Real-time SOL balance monitoring** – Fetch live balances from the blockchain.  
- **CLI command engine** – Run commands directly in the terminal for instant actions.  
- **Token transfer** – Send SOL or SPL tokens to other wallets.  
- **NFT interaction** – Check NFT ownership and transfers.  
- **Solana RPC integration** – Communicate with the Solana blockchain efficiently.

---

## 💻 Demo Instructions

You can run YENDO locally to test its current functionality:

1. Clone the repo:  
```bash
git clone https://github.com/ricchiooo/yendo-cli.git
cd yendo-cli

## Installation

Install dependencies:

npm install

## Usage

You can use YENDO's CLI to interact with Solana wallets directly from the terminal.

### Check Wallet Balance

Run the following command to check the SOL balance of a wallet:

```bash
node src/index.js balance 3Ve645zXw5ZuS6asgJGrH5geKNwhHwEhxb446PqtbckZ
```

Example output:

```
Wallet: 3Ve645zXw5ZuS6asgJGrH5geKNwhHwEhxb446PqtbckZ
Network: Devnet
Balance: 0.00 SOL
Status: Connected
```

### Transfer SOL

Run the following command to send SOL from one wallet to another (recommended on devnet/testnet):

```bash
node src/index.js transfer 3Ve645zXw5ZuS6asgJGrH5geKNwhHwEhxb446PqtbckZ CryX4FRYdYB4SyUZ3qyxBKG3g68mFG6qZrbzha38Piwc 0.1
```

Where:

- `3Ve645zXw5ZuS6asgJGrH5geKNwhHwEhxb446PqtbckZ` → sender wallet  
- `CryX4FRYdYB4SyUZ3qyxBKG3g68mFG6qrbzha38Piwc` → receiver wallet  
- `0.1` → amount of SOL to transfer

Example output:

```
Transaction submitted successfully

Sender: 3Ve645zXw5ZuS6asgJGrH5geKNwhHwEhxb446PqtbckZ
Receiver: CryX4FRYdYB4SyUZ3qyxBKG3g68mFG6qZrbzha38Piwc
Amount: 0.1 SOL
Network: Devnet
Status: Confirmed
```

### Generic Command Format

You can also run the commands using placeholders:

```bash
node src/index.js balance <wallet-address>
```

```bash
node src/index.js transfer <sender-wallet> <receiver-wallet> <amount>
```

Replace the placeholders with real wallet addresses and the desired transfer amount.
## Demo Page

The demo page is located in:

frontend/public/index.html

Open this file in a browser to interact with a simple interface that connects to YENDO's CLI commands.

## Tech Stack

• Node.js  
• JavaScript (CommonJS)  
• Solana Web3.js  
• Commander.js (CLI command parsing)  
• Dotenv (environment variables)

## Future Roadmap

YENDO is currently under active development. Planned features include:

• Web interface for wallet monitoring  
• Automated wallet triggers based on on-chain events  
• AI-powered wallet insights and analytics  
• NFT dashboard for asset tracking  
• Integration with Solana ecosystem grants and bounties

## Links

Website /Project Demo - https://yendo-cli-1.onrender.com
https://www.loom.com/share/d4a0c0708eb74ca390124865d627924d

Twitter/X - https://x.com/ricchioo

GitHub Repository- https://github.com/ricchiooo/yendo-cli

Discord  - https://discord.gg/m7FJRw5c

## How to Contribute

1. Fork the repository  
2. Create a branch for your feature  
   git checkout -b feature-name  
3. Commit your changes  
   git commit -m "Add feature"  
4. Push to the branch  
   git push origin feature-name  
5. Open a Pull Request

## License

This project is licensed under the ISC License.

