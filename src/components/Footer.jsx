export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} CryptoPrivacy Pro. All rights reserved.</p>
        <div className="mt-4">
          {/* Monetizacija: CTA, newsletter, sponzorirani linkovi (placeholder) */}
          <div className="bg-white rounded-lg shadow p-4 inline-block">
            <p className="mb-2 font-medium text-gray-800">
              Support our mission for private crypto freedom.
            </p>
            <a
              href="#"
              className="inline-block px-4 py-2 bg-black text-white text-xs rounded hover:bg-gray-800 transition"
            >
              Donate or Sponsor
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

