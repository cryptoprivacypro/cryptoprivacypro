'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MintModal from '../../../components/MintModal'

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const params = useParams()

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?id=eq.${params.id}&select=*`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
          cache: 'no-store',
        }
      )
      const data = await res.json()
      setProduct(data[0] || null)
    }

    if (params?.id) {
      fetchProduct()
    }
  }, [params?.id])

  if (!product) {
    return <div className="text-center text-red-500 mt-12">Loading or not found.</div>
  }

  return (
    <section className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.title_en}</h1>
      {product.description_en && (
        <p className="text-gray-700 mb-4">{product.description_en}</p>
      )}
      <div className="space-y-2 text-gray-800 text-sm">
        {product.mint_price_eth && <p>Price: {product.mint_price_eth} ETH</p>}
        {product.mint_price_matic && <p>Price: {product.mint_price_matic} POL</p>}
        <p>Max Supply: {product.max_supply}</p>
        <p>Minted: {product.minted_count}</p>
      </div>
      <div className="mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition"
        >
          Mint this document
        </button>
      </div>

      {showModal && (
        <MintModal product={product} onClose={() => setShowModal(false)} />
      )}
    </section>
  )
}

