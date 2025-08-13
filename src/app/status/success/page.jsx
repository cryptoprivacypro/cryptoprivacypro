'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('product_id')

  const [product, setProduct] = useState(null)
  const [tx, setTx] = useState(null) // last known transaction for this product/email (optional later)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!productId) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=*`,
          { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }, cache: 'no-store' }
        )
        const data = await res.json()
        setProduct(data?.[0] || null)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId])

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-gray-600">Loading…</div>
  }

  if (!productId || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-3">Missing or invalid product</h1>
        <p className="text-gray-600 mb-6">We couldn’t find the product connected to this payment.</p>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 rounded bg-black text-white hover:bg-gray-900"
        >
          Back to home
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Payment received (processing)</h1>
      <p className="text-gray-700 mb-6">
        Thanks! Your payment was created successfully. Once it’s <b>confirmed on-chain</b>, you’ll get access to the
        document.
      </p>

      <div className="rounded border bg-white p-4 shadow">
        <h2 className="font-semibold text-lg mb-2">{product.title_en}</h2>
        {product.description_en && <p className="text-gray-600 mb-3">{product.description_en}</p>}
        <div className="text-sm text-gray-800 space-y-1">
          {product.mint_price_eth && <p>Price: {product.mint_price_eth} ETH</p>}
          {product.mint_price_matic && <p>Price: {product.mint_price_matic} MATIC</p>}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>
          You can safely close this tab. We’ll email you the download link as soon as the payment is confirmed.
          If you think something’s off, contact us.
        </p>
      </div>

      <div className="mt-8">
        <button onClick={() => router.push('/')} className="px-5 py-2 rounded bg-black text-white hover:bg-gray-900">
          Go to home
        </button>
      </div>
    </div>
  )
}

