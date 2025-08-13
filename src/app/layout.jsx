import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'CryptoPrivacy Pro',
  description: 'Privacy-first crypto document minting platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main className="min-h-screen px-4 py-8 container mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

