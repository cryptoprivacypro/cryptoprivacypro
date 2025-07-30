"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId, useSwitchChain, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
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
    aboutTitle: "利用可能なガイド",
    langSwitch: "EN",
    walletConnect: "ウォレット接続",
    manualMint: "手動ミント (QR)",
  },
};

export default function LandingPage() {
  const [lang, setLang] = useState("en");
  const [qrVisible, setQrVisible] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
  const [products, setProducts] = useState([]);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sendTransaction, isSuccess } = useSendTransaction();
  const t = translations[lang];

  const paymentAddress = TEST_ENV
    ? process.env.NEXT_PUBLIC_TEST_WALLET_ADDRESS || "0xTestWalletAddress"
    : process.env.NEXT_PUBLIC_WALLET_ADDRESS || "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    if (isSuccess) setShowDownload(true);
  }, [isSuccess]);

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true);
      if (error) console.error("Error fetching products:", error);
      else setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleMint = async (chain, amount) => {
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
    sendTransaction?.({ to: paymentAddress, value: parseEther(amount.toString()) });
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <img
        src="/images/hero.png"
        alt="Crypto Privacy Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div className="relative z-10 max-w-5xl w-full bg-white/10 backdrop-blur-md shadow-lg rounded-3xl p-8 text-center">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            className="border-gray-400 text-gray-200 bg-gray-800 hover:bg-gray-700"
            onClick={() => setLang(lang === "en" ? "jp" : "en")}
          >
            {t.langSwitch}
          </Button>
          {address ? (
            <span className="text-sm text-green-400">{address.slice(0, 6)}...{address.slice(-4)}</span>
          ) : (
            <Button
              variant="outline"
              className="border-gray-400 text-gray-200 bg-gray-800 hover:bg-gray-700"
              onClick={() => open()}
            >
              {t.walletConnect}
            </Button>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
          {t.headline}
        </h1>
        <p className="text-lg text-gray-300 mb-6">{t.subheadline}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {products.map((product, idx) => (
            <div key={product.id} className="bg-black/40 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-between min-h-[300px]">
              <h3 className="text-xl font-bold mb-2">{product.title_en}</h3>
              <p className="text-gray-400 text-sm mb-4">{product.description_en}</p>

              {/* ETH Mint Button */}
              <Button
                className="w-full bg-teal-500 hover:bg-teal-600 mb-2 flex items-center justify-center gap-2"
                onClick={() => handleMint(1, product.price_eth)}
              >
                <Image src="/icons/eth.svg" alt="ETH" width={18} height={18} />
                Mint {product.price_eth} ETH
              </Button>

              {/* POL Mint Button */}
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 mb-2 flex items-center justify-center gap-2"
                onClick={() => handleMint(137, product.price_matic)}
              >
                <Image src="/icons/pol.svg" alt="POL" width={18} height={18} />
                Mint {product.price_matic} POL
              </Button>

              {/* Manual Mint Button */}
              <Button
                variant="outline"
                className="border-gray-400 w-full bg-gray-800 text-white hover:bg-gray-700"
                onClick={() => setQrVisible(qrVisible === idx ? null : idx)}
              >
                {t.manualMint}
              </Button>

              {qrVisible === idx && (
                <div className="p-4 bg-white rounded-lg inline-block mt-4">
                  <QRCodeCanvas value={paymentAddress} size={128} />
                  <p className="text-black text-sm mt-2">{paymentAddress}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {showDownload && (
          <div className="mb-6">
            <a
              href="/downloads/guide.pdf"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-2xl text-white shadow-md"
              download
            >
              Download Your Guide
            </a>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-2">{t.aboutTitle}</h2>
        <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto">
          Choose from a range of guides designed to help you stay anonymous, secure your wallets, and ensure maximum privacy in your crypto transactions.
        </p>
      </div>

      <footer className="relative z-10 mt-6 text-sm text-gray-400">
        © 2025 CryptoPrivacy • <a href="#" className="underline">Privacy Policy</a>
      </footer>
    </div>
  );
}

