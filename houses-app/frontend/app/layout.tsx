import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Interaction Coach - Neurodivergent Support',
  description: 'Empathetic coaching for dates, interviews, and social situations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-calm-50 to-primary-50">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-primary-600">🤝</span>
                Social Interaction Coach
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Empathetic support for neurodivergent individuals
              </p>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200 mt-auto">
            <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
              <p>Remember: You are valued exactly as you are. This tool is here to support, not change you. 💙</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}