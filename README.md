# YENDO
AI-powered infrastructure for interacting with the Solana blockchain.

YENDO is a Solana-powered application that enables users to seamlessly interact with the blockchain—managing wallets, sending and receiving assets, executing transactions, and automating on-chain actions through an intuitive interface.

It evolves beyond basic functionality by integrating smart automation and AI-driven recommendations, allowing users to navigate and operate within the crypto ecosystem more efficiently.

⸻

Current Version (MVP)

The current public build focuses on validating YENDO’s core wallet infrastructure.

Users can:
	•	Securely create an account
	•	Authenticate using Supabase
	•	Connect a Phantom wallet
	•	View live SOL balance
	•	Send SOL directly through YENDO AI using natural language
	•	Approve transactions securely through Phantom
	•	View transaction signatures
	•	Open transactions in Solana Explorer
	•	Automatically refresh balances after successful transactions
	•	Store user profiles and wallet connections

⸻

Example Commands

YENDO understands plain English.
Examples:
.Send 0.05 SOL to Fx...

.Send 0.003 SOL to 6Yk...

.What's my balance?

.What can you do?

.Show my wallet address

No complicated CLI commands.

Just type naturally.

⸻

Tech Stack

Frontend
	•	HTML
	•	CSS
	•	JavaScript

Backend
	•	Node.js
	•	Express

Blockchain
	•	Solana Web3.js
	•	Phantom Wallet
	•	Solana Mainnet

Database
	•	Supabase Authentication
	•	Supabase PostgreSQL

Deployment
	•	Vercel
	•	Render

⸻

Live Demo

Application

https://yendo-cli.vercel.app

Backend API

https://yendo-cli-1.onrender.com

⸻

Demo Video

https://www.loom.com/share/d4a0c0708eb74ca390124865d627924d

⸻

Current Architecture
User

     │
     ▼
YENDO Frontend (Vercel)

     │
     ▼
YENDO Backend (Render)

     │
     ▼
Solana Mainnet RPC

     │
     ▼
Phantom Wallet

Roadmap

The current version is only the foundation.

YENDO’s long-term vision includes:

AI Wallet Assistant
	•	Portfolio analysis
	•	Transaction explanations
	•	Spending insights
	•	Smart recommendations

Wallet Automation
	•	Scheduled transfers
	•	Automated recurring payments
	•	Smart triggers
	•	On-chain workflows

Multi-Asset Support
	•	SPL Tokens
	•	NFTs
	•	Stablecoins
	•	DeFi positions

Portfolio Dashboard
	•	Asset tracking
	•	Performance analytics
	•	Historical charts
	•	Transaction insights

DeFi Integrations
	•	Staking
	•	Lending
	•	Swaps
	•	Yield optimization

AI Agent Layer

Eventually, YENDO will become an intelligent blockchain operating system where users can simply describe what they want in natural language while AI handles the blockchain interactions.

⸻

Current Status

✅ Authentication

✅ Wallet Connection

✅ Mainnet SOL Transfers

✅ Natural Language Commands

✅ Transaction Confirmation

✅ Balance Refresh

🚧 AI Automation Layer

🚧 SPL Tokens

🚧 NFT Support

🚧 Portfolio Analytics

🚧 Wallet Automation

⸻

Repository

https://github.com/ricchiooo/yendo-cli

⸻

Connect

Twitter/X

https://x.com/ricchioo

Discord

https://discord.gg/m7FJRw5c

⸻

Contributing

Contributions are welcome.

1.	Fork the repository

2.	Create a feature branch - 
git checkout -b feature-name

3.	Commit your changes - 
git commit -m "Add feature"

4.	Push - 
git push origin feature-name

5.	Open a Pull Request

⸻

License

ISC License
