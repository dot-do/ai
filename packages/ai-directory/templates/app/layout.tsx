import React from 'react'
import './globals.css'

export const metadata = {
  title: 'AI-Powered Directory',
  description: 'Generated with ai-directory',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <h1 className="site-title">Directory</h1>
            <nav className="main-nav">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </header>

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
