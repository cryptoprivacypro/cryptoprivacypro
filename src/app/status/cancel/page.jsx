'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentCancelPage() {
  const router = useRouter()
  const productId = useSearchParams().get('product_id')

  return (
    <div className="container mx-auto px-4 py-12 text-center max-w-xl">
      <h1 className="text-3xl font-bold mb-2">Payment cancelled</h1>
      <p className="text-gray-700 mb-6">
        Your payment was cancelled. You can try again at any time.
      </p>
      <div className="space-x-2">
        {productId ? (
          <button
            onClick={() => router.push(`/product/${productId}`)}
            className="px-5 py-2 rounded bg-black text-white hover:bg-gray-900"
          >
            Back to product
          </button>
        ) : null}
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-50"
        >
          Home
        </button>
      </div>
    </div>
  )
}

