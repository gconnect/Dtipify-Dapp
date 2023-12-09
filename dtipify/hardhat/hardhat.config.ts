import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config({ path: ".env" });

const config: HardhatUserConfig = {
  networks: {
    "celo-mainnet": {
      url: "https://forno.celo.org",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 42220
    },
    "alfajores": {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 44787
    }
  },
  etherscan: {
    apiKey: {
      opera: process.env.VERIFY_API_KEY as string
    }
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};

export default config;
