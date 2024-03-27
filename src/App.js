import React, { useState } from "react";
import "./style.css";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SwapPrice from "./components/SwapPrice";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  walletConnectWallet,
  rainbowWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { cronos } from "./components/helperConstants";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
const { chains, provider } = configureChains([cronos], [publicProvider()]);
// const { connectors } = getDefaultWallets({
//   appName: "My RainbowKit App",
//   chains,
// });
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }),
      metaMaskWallet({ chains }),
    ],
  },
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
export default function App() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [tokens, setTokens] = useState({
    token1: "null",
    token2: "0x7C8b5501A40D382e8A11889834c80b2D7Fa1Fc4F",
  });
  const [userInput, setUserInput] = useState("0");
  const [outPutTokens, setOutPutTokens] = useState(0);
  const [convertToken, setConvertToken] = useState(1);
  const [parameters, setParameters] = useState([]);
  const [isCro, setIsCro] = useState(false);
  const [reload, setReload] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor: "#E2A700",
          accentColorForeground: "black",
          overlayBlur: "small",
          borderRadius: "medium",
        })}
      >
        <div className="App">
          <Navbar />
          <HomePage
            setUserInput={setUserInput}
            userInput={userInput}
            outPutTokens={outPutTokens}
            convertToken={convertToken}
            setIsCro={setIsCro}
            parameters={parameters}
            isCro={isCro}
            setReload={setReload}
            reload={reload}
            tokens={tokens}
            setTokens={setTokens}
            tokenBalance={tokenBalance}
            isDataLoading={isDataLoading}
          />
          <SwapPrice
            userInput={userInput}
            setOutPutTokens={setOutPutTokens}
            setConvertToken={setConvertToken}
            isCro={isCro}
            setParameters={setParameters}
            reload={reload}
            tokens={tokens}
            setTokens={setTokens}
            setTokenBalance={setTokenBalance}
            setIsDataLoading={setIsDataLoading}
          />
          <Footer />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
