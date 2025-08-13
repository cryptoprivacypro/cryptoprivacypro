'use client'

import { useState } from 'react'

export default function MintModal({ product, onClose }) {
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedChain, setSelectedChain] = useState(null)
  const [step, setStep] = useState('form') // form | confirmed | error
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleMint = async () => {
    if (!email || !walletAddress || !selectedChain) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          email,
          wallet_address: walletAddress,
          amount:
            selectedChain === 'ETH'
              ? product.mint_price_eth
              : product.mint_price_matic,
          currency: selectedChain === 'POL' ? 'MATIC' : selectedChain, // ← FIX ovdje
        }),
      })

      if (!res.ok) throw new Error('Failed to create payment')
      const data = await res.json()

      // Redirekt na NOWPayments invoice
      window.location.href = data.payment_url
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const resetAndClose = () => {
    setEmail('')
    setWalletAddress('')
    setSelectedChain(null)
    setStep('form')
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={resetAndClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
          ✕
        </button>

        {step === 'form' && (
          <>
            <h2 className="text-xl font-bold mb-4">Mint access to this document</h2>
            <input
              type="email"
              placeholder="Your email"
              className="w-full mb-3 px-4 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your wallet address"
              className="w-full mb-4 px-4 py-2 border rounded"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <div className="mb-4 space-y-2">
              {product.mint_price_eth && (
                <button
                  onClick={() => setSelectedChain('ETH')}
                  className={`w-full px-4 py-2 border rounded ${
                    selectedChain === 'ETH' ? 'bg-black text-white' : ''
                  }`}
                >
                  Pay {product.mint_price_eth} ETH
                </button>
              )}
              {product.mint_price_matic && (
                <button
                  onClick={() => setSelectedChain('POL')}
                  className={`w-full px-4 py-2 border rounded ${
                    selectedChain === 'POL' ? 'bg-black text-white' : ''
                  }`}
                >
                  Pay {product.mint_price_matic} POL
                </button>
              )}
            </div>
            <button
              onClick={handleMint}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Redirecting...' : 'Proceed to Payment'}
            </button>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </>
        )}

        {step === 'error' && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
            <p className="text-sm text-gray-700 mb-4">
              Something went wrong during payment setup.
            </p>
            <button
              onClick={resetAndClose}
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}

