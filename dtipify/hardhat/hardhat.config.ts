import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config({ path: ".env" });

const config: HardhatUserConfig = {
  networks: {
    avalanche: {
      url: process.env.AVALANCHE_QUICKNODE_MAINNET_URL,
      accounts: [`0x` + process.env.PRIVATE_KEY],
      chainId: 43114,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [`0x` + process.env.PRIVATE_KEY],
      chainId: 43113,
    },
    "polygon_mainnet": {
      url: process.env.POLYGON_MAINNET_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 137
    },
    "polygon_mumbai": {
      url: process.env.POLYGON_MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 80001
    },
    zkEVM: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [process.env.PRIVATE_KEY as string],
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.VERIFY_API_KEY as string
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
  paths: {
    artifacts: '../react-app/artifacts'
  },
};

export default config;
