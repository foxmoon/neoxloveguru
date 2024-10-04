# NeoX Love Guru AI

NeoX Love Guru AI is an innovative project that combines blockchain technology with artificial intelligence to provide personalized relationship advice. The project consists of two main components: LoveGuru (the frontend application) and LoveGuruContract (the smart contract for handling transactions).

## Table of Contents
1. [LoveGuru](#loveguru)
   - [Features](#features)
   - [Installation](#installation)
   - [Usage](#usage)
2. [LoveGuruContract](#lovegurucontract)
   - [Contract Details](#contract-details)
   - [Deployment](#deployment)
   - [Interaction](#interaction)

## LoveGuru

LoveGuru is a Next.js-based web application that provides users with AI-powered relationship advice from a diverse panel of virtual love gurus.

### Features

- Multiple AI advisors with unique perspectives
- Web3 wallet integration for secure transactions
- Personalized advice based on user questions and risk tolerance
- Consensus opinion synthesizing multiple AI viewpoints

### Homepage Screenshot

![LoveGuru Homepage](public/screen.png)
### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/neox-love-guru-ai.git
   cd neox-love-guru-ai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_PROJECT_ID=your_web3_project_id
   LLM_API_KEY=your_llm_api_key
   DEFAULT_LLM_ENDPOINT=your_default_llm_endpoint
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Usage

1. Connect your Web3 wallet (e.g., MetaMask) to the application.
2. Choose your openness level for advice.
3. Enter your relationship question in the input field.
4. Click "Ask" to receive advice from multiple AI love gurus.
5. Review the individual advice and consensus opinion.

## LoveGuruContract

LoveGuruContract is a Solidity smart contract that handles the coffee purchase transactions for the AI advisors.

### Contract Details

- Contract Address: 0xE6D72f0ddA42FeF53b43cDaE4393309147390fff
- Network: NeoX T4 TestNet

### Deployment

1. Install Hardhat:
   ```
   npm install --save-dev hardhat
   ```

2. Compile the contract:
   ```
   npx hardhat compile
   ```

3. Deploy the contract:
   ```
   npx hardhat run scripts/deploy.js --network neoxt4
   ```

### Interaction

The LoveGuru frontend interacts with the LoveGuruContract through the `buyCoffee` function. Here's a snippet of how it's implemented:
