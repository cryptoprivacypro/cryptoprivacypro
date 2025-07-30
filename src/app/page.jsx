"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId, useSwitchChain, useSendTransaction } from "wagmi";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { parseEther } from "viem";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const TEST_ENV = typeof window !== "undefined" && window.location.hostname === "localhost";

const translations = {
  en: {
    headline: "Protect Your Crypto Privacy",
    subheadline: "Guides and tools for ultimate anonymity in the crypto world.",
    aboutTitle: "Available Guidelines",
    langSwitch: "日本語",
    walletConnect: "Connect Wallet",
    manualMint: "Manual Mint (QR)",
  },
  jp: {
    headline: "暗号資産のプライバシーを守る",
    subheadline: "究極の匿名性を実現するためのガイドとツール。",
    aboutTitle: "利用可能なガイドライン",
    langSwitch: "EN",
    walletConnect: "ウォレット接続",
    manualMint: "手動ミント (QR)",
  },
};

export default function LandingPage() {
  const [lang, setLang] = useState("en");
  const [qrVisible, setQrVisible] = useState(null);
  const [products, setProducts] = useState([]);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  const t = translations[lang];

  // Wallet address (prod vs test)
  const walletAddress = TEST_ENV
    ? process.env.NEXT_PUBLIC_TEST_WALLET || "0xTestWalletAddress"
    : process.env.NEXT_PUBLIC_WALLET_ADDRESS || "0x0000000000000000000000000000000000000000";

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true);
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  // Handle mint
  const handleMint = async (product, chain, amount) => {
    if (!isConnected) {
      await open();
      return;
    }
    if (chainId !== chain) {
      try {
        await switchChain?.({ chainId: chain });
      } catch (err) {
        console.error("Network switch failed:", err);
        return;
      }
    }
    sendTransaction?.({ to: walletAddress, value: parseEther(amount.toString()) });
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Background hero image */}
      <img
        src="/images/hero.png"
        alt="Crypto Privacy Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl w-full bg-white/10 backdrop-blur-md shadow-lg rounded-3xl p-8 text-center"
      >
        {/* Top controls */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            className="border-gray-400 text-gray-200 bg-black/40 hover:bg-gray-700"
            onClick={() => setLang(lang === "en" ? "jp" : "en")}
          >
            {t.langSwitch}
          </Button>
          {address ? (
            <span className="text-sm text-green-400">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          ) : (
            <Button
              variant="outline"
              className="border-gray-400 text-gray-200 bg-black/40 hover:bg-gray-700"
              onClick={() => open()}
            >
              {t.walletConnect}
            </Button>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
          {t.headline}
        </h1>
        <p className="text-lg text-gray-300 mb-6">{t.subheadline}</p>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center justify-between bg-black/50 p-4 rounded-2xl shadow-lg relative"
            >
              <h2 className="text-xl font-bold mb-2">{product.title_en}</h2>
              <p className="text-gray-300 text-sm mb-4">{product.description_en}</p>

              {/* Mint buttons */}
              <div className="flex flex-col gap-3 w-full">
                <Button
                  className="bg-teal-500 hover:bg-teal-600 w-full flex items-center justify-center gap-2"
                  onClick={() => handleMint(product, 1, product.price_eth)}
                >
                  <Image src="/icons/eth.svg" alt="ETH" width={20} height={20} />
                  Mint {product.price_eth} ETH
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 w-full flex items-center justify-center gap-2"
                  onClick={() => handleMint(product, 137, product.price_matic)}
                >
                  <Image src="/icons/pol.svg" alt="POL" width={20} height={20} />
                  Mint {product.price_matic} POL
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-400 text-gray-200 w-full bg-black/40 hover:bg-gray-700"
                  onClick={() => setQrVisible(qrVisible === product.id ? null : product.id)}
                >
                  {t.manualMint}
                </Button>
              </div>

              {/* QR Code */}
              {qrVisible === product.id && (
                <div className="p-3 mt-4 bg-white rounded-lg shadow-md w-full">
                  <QRCodeCanvas value={walletAddress} size={128} className="mx-auto" />
                  <p className="text-black text-xs mt-2 break-words text-center">
                    {walletAddress}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <h2 className="text-2xl font-semibold mb-2">{t.aboutTitle}</h2>
        <footer className="relative z-10 mt-4 text-sm text-gray-400">
          © 2025 CryptoPrivacy • <a href="#" className="underline">Privacy Policy</a>
        </footer>
      </motion.div>
    </div>
  );
}

