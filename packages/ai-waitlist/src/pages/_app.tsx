import React from 'react'
import { AppProps } from 'next/app'
import { AuthProvider } from '../lib/auth/auth-client'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const authContent = <Component {...pageProps} />

  return <React.Fragment>{authContent}</React.Fragment>
}

export default MyApp
