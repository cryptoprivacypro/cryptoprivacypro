"use client";

import "./globals.css";
import { WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { defaultWagmiConfig, createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient instance
const queryClient = new QueryClient();

// Tvoj Project ID sa Reown
const projectId = "ab71c88717319bbf87b1a5315037f475";

// Chains
const chains = [mainnet, polygon];

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: "CryptoPrivacy",
    description: "Crypto privacy and anonymity guides",
    url:
      typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://cryptoprivacy.pro",
    icons: ["https://cryptoprivacy.pro/icon.png"],
  },
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <QueryClientProvider client={queryClient}>
          <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
        </QueryClientProvider>
      </body>
    </html>
  );
}

