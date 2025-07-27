"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId, useSwitchChain, useSendTransaction } from "wagmi";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { parseEther } from "viem";
import { supabase } from "@/lib/supabaseClient";

const TEST_ENV = typeof window !== "undefined" && window.location.hostname === "localhost";

// Translations for EN and JP
const translations = {
  en: {
    headline: "Protect Your Crypto Privacy",
    subheadline: "Guides and tools for ultimate anonymity in the crypto world.",
    aboutTitle: "Available Guidelines",
    aboutContent:
      "Choose from our range of privacy guides designed to help you protect your wallets, stay anonymous, and avoid security pitfalls.",
    cta: "Mint",
    ctaMatic: "Mint (Polygon)",
    langSwitch: "日本語",
    walletConnect: "Connect Wallet",
    manualPayment: "Manual Mint (QR)",
    download: "Get Your Guide",
  },
  jp: {
    headline: "暗号資産のプライバシーを守る",
    subheadline: "究極の匿名性を実現するためのガイドとツール。",
    aboutTitle: "利用可能なガイドライン",
    aboutContent:
      "ウォレットの保護、匿名性の維持、セキュリティの落とし穴を回避するためのプライバシーガイドをお選びください。",
    cta: "ミント",
    ctaMatic: "ミント (Polygon)",
    langSwitch: "EN",
    walletConnect: "ウォレット接続",
    manualPayment: "手動ミント (QR)",
    download: "ガイドを取得",
  },
};

export default function LandingPage() {
  const [lang, setLang] = useState("en");
  const [qrVisible, setQrVisible] = useState(null); // Track which product ID shows QR code
  const [showDownload, setShowDownload] = useState(null); // Track which product ID shows download button
  const [products, setProducts] = useState([]);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sendTransaction, isSuccess } = useSendTransaction();
  const t = translations[lang];

  const paymentAddress = TEST_ENV ? "0x4fd0aF8c713A197f1558DDf2845182dC422606dC" : "0x4fd0aF8c713A197f1558DDf2845182dC422606dC";

  // If transaction is successful, allow download
  useEffect(() => {
    if (isSuccess && products.length > 0) {
      setShowDownload(products[0].id);
    }
  }, [isSuccess, products]);

  // Fetch all guides from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!error) setProducts(data);
      else console.error("Error fetching products:", error);
    };
    fetchProducts();
  }, []);

  // Handle mint action
  const handleMint = async (chain, amount, productId) => {
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
    setShowDownload(productId);
  };

  const commonBtnClasses =
    "transition-colors duration-300 text-white hover:brightness-110 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-white";

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Background image */}
      <img
        src="/images/hero.png"
        alt="Crypto Privacy Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl w-full bg-white/10 backdrop-blur-md shadow-lg rounded-3xl p-8 text-center"
      >
        {/* Language switch & wallet connect */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            className={`border-gray-400 bg-gray-700 hover:bg-gray-600 ${commonBtnClasses}`}
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
              className={`border-gray-400 bg-gray-700 hover:bg-gray-600 ${commonBtnClasses}`}
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

        {/* Display guidelines (products) */}
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="mb-8 p-4 bg-black/40 rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">{product.title_en}</h2>
              <p className="text-gray-300 text-sm mb-4">{product.description_en}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <Button
                  className={`bg-teal-500 hover:bg-teal-600 ${commonBtnClasses}`}
                  onClick={() => handleMint(1, product.mint_price_eth, product.id)}
                >
                  {t.cta} {product.mint_price_eth} ETH
                </Button>
                <Button
                  className={`bg-purple-600 hover:bg-purple-700 ${commonBtnClasses}`}
                  onClick={() => handleMint(137, product.mint_price_matic, product.id)}
                >
                  {t.ctaMatic} {product.mint_price_matic} MATIC
                </Button>
                <Button
                  variant="outline"
                  className={`border-gray-400 bg-gray-700 hover:bg-gray-600 ${commonBtnClasses}`}
                  onClick={() => setQrVisible(qrVisible === product.id ? null : product.id)}
                >
                  {t.manualPayment}
                </Button>
              </div>

              {/* QR code for this guide */}
              {qrVisible === product.id && (
                <div className="p-4 bg-white rounded-lg inline-block mb-6">
                  <QRCodeCanvas value={paymentAddress} size={128} />
                  <p className="text-black text-sm mt-2">{paymentAddress}</p>
                </div>
              )}

              {/* Download button after minting */}
              {showDownload === product.id && (
                <a
                  href={product.file_url}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-2xl text-white shadow-md"
                  download
                >
                  {t.download}
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-300 mb-6">Loading guidelines...</p>
        )}

        {/* About section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">{t.aboutTitle}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{t.aboutContent}</p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 mt-6 text-sm text-gray-400">
        © 2025 CryptoPrivacy • <a href="#" className="underline">Privacy Policy</a>
      </footer>
    </div>
  );
}

