import type { AppProps } from "next/app";
import {getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createConfig, WagmiConfig, } from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { SessionProvider } from "next-auth/react"
import {polygonMumbai, polygon, polygonZkEvmTestnet, avalancheFuji, avalanche } from "viem/chains";
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { Toaster } from 'react-hot-toast';

import {
  Montserrat,
} from '@next/font/google';
// import { Alfajores } from "@celo/rainbowkit-celo/chains";

const montserrat =   Montserrat({
  subsets: ['latin'],
  // this will be the css variable
  variable: '--font-montserrat',
  // weight: ['400']
});


const projectId = process.env.NEXT_PUBLIC_PROJECTID as string // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
  [polygonMumbai, polygon, polygonZkEvmTestnet, avalancheFuji, avalanche],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }) })],
  // [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_MUMBAI_API_KEY as string })],
  // [jsonRpcProvider({
  //   rpc: (chain: Chain) => {
  //     if (chain.id === avalanche.id) return { http: chain.rpcUrls.default };
  //     if (chain.id === avalancheFuji.id) return { http: chain.rpcUrls.default };
  //     if (chain.id === polygon.id) return { http: chain.rpcUrls.default };
  //     if (chain.id === polygonMumbai.id) return { http: chain.rpcUrls.default };
  //     return null;
  //   }
  // }),]
);
  
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: projectId,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});


function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${montserrat.variable} font-sans`}>
      <SessionProvider session={pageProps.session}>
      <WagmiConfig config={wagmiConfig}>

      <RainbowKitProvider chains={chains} coolMode={true}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster/>
      </RainbowKitProvider>
      </WagmiConfig>

    </SessionProvider>
    </main>  

  )
}

export default App;