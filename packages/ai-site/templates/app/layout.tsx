import React from 'react'
import './globals.css'

export const metadata = {
  title: 'AI-Powered Site',
  description: 'Generated with ai-site',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <p>© {new Date().getFullYear()}</p>
            <nav>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}
