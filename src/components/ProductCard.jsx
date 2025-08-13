'use client'

import { useRouter } from 'next/navigation'

export default function ProductCard({ product }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/product/${product.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg bg-white shadow hover:shadow-lg transition p-4 flex flex-col justify-between h-full"
    >
      <div>
        <h2 className="text-lg font-semibold mb-2">{product.title_en}</h2>
        {product.description_en && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description_en}</p>
        )}
      </div>
      <div className="mt-auto text-sm text-gray-800 font-medium">
        {product.mint_price_eth && (
          <p>Mint Price: {product.mint_price_eth} ETH</p>
        )}
        {!product.mint_price_eth && product.mint_price_matic && (
          <p>Mint Price: {product.mint_price_matic} POL</p>
        )}
      </div>
    </div>
  )
}

