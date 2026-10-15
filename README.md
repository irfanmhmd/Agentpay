# AgentPay

AgentPay currently contains a React + Vite dashboard and an Express API. The dashboard's connected browser wallet is a personal identity wallet; it does not authorize backend signing or autonomous payments. The dedicated AgentPay address is read from backend configuration and remains a separate wallet.

## Local development

1. Install dependencies with `npm install` or `bun install`.
2. Copy `.env.example` to `.env`. Do not place backend credentials in any `VITE_*` variable.
3. Set `AGENTPAY_WALLET_ADDRESS` to the existing dedicated AgentPay address. The application does not generate or replace wallets.
4. Optional RPC variables are `BASE_SEPOLIA_RPC_URL` and `BASE_MAINNET_RPC_URL`; public Base RPC endpoints are used if these are omitted. Network specific USDC variables may be set to the verified Circle addresses shown in `.env.example`; a different address is rejected for USDC balance reads.
5. Start the integrated frontend and API with `npm run dev` in one PowerShell terminal. Vite serves the React app and the same Express API router, so a separate backend terminal is not required. To run the API by itself, use `npm run dev:api` in a second terminal; it listens on port 3001.

The supported networks are Base Sepolia (84532) and Base (8453). The network selector explicitly requests a switch in MetaMask. Connecting MetaMask displays its public account and has no effect on the dedicated AgentPay wallet's signing authority. `GET /api/wallet?chainId=84532` or `?chainId=8453` returns the configured AgentPay address and available balances, or separate RPC/balance status. `GET /api/networks` reports network metadata and payment enablement.

Mainnet autonomous payments default to disabled (`MAINNET_ENABLED=false` and `MAINNET_AUTONOMOUS_PAYMENTS_ENABLED=false`). Payment execution is not implemented, and enabling these flags does not enable payments by itself. Do not configure a signer key until a reviewed backend signing mechanism and policy engine exist. Groq, x402, persistence, task orchestration, and verified transaction history are not implemented yet; existing task, transaction, policy, and service screens still contain demo data.

## Verification

Run `npm run lint` and `npm run build` after installing dependencies. No real transaction or testnet payment has been submitted by this implementation.
