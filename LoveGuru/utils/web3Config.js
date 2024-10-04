import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { Chain } from "wagmi/chains";
import { parseEther } from 'ethers/lib/utils';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const neoXT4 = {
  id: 12227332,
  name: 'NeoX T4',
  network: 'neoxt4',
  nativeCurrency: {
    decimals: 18,
    name: 'GAS',
    symbol: 'GAS',
  },
  rpcUrls: {
    public: { http: ['https://neoxt4seed1.ngd.network'] },
    default: { http: ['https://neoxt4seed1.ngd.network'] },
  },
  blockExplorers: {
    default: { name: 'NeoX T4 Explorer', url: 'https://xt4scan.ngd.network/' },
  },
  testnet: true,
};

const metadata = {
  name: "Crypto Investment Advisor AI",
  description: "AI-powered crypto investment advisor",
  url: "https://your-website.com",
  icons: ["https://your-website.com/icon.png"],
};

export const config = defaultWagmiConfig({
  chains: [neoXT4],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const coffeeContractABI = [
  {
    "inputs": [],
    "name": "RECIPIENT",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "COFFEE_PRICE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyCoffee",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "CoffeeBought",
    "type": "event"
  }
];

export const coffeeContractAddress = "0xE6D72f0ddA42FeF53b43cDaE4393309147390fff";