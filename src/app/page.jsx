import ProductCard from '../components/ProductCard'

async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=*`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('Failed to fetch products')
    return []
  }

  const data = await res.json()
  return data.filter((p) => p.is_active)
}

export default async function HomePage() {
  const products = await fetchProducts()

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Available Documents</h1>
      {products.length === 0 ? (
        <p>No active documents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow p-4 bg-white">
              <ProductCard product={product} />
              {product.file_url && (
                <a
                  href={product.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-600 underline text-sm"
                >
                  View Document
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

