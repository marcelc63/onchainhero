import * as React from 'react'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import { Settings } from 'luxon'

import '~/styles/globals.scss'
import store from '~/store/store'

import ProtectRoute from '~/components/ProtectRoute'

const MyApp: React.FC<AppProps> = (props: AppProps) => {
  // Set Luxon's Locale
  Settings.defaultLocale = 'en-EN'

  return (
    <Provider store={store}>
      <Head>
        <title>OnChainHero</title>
        <meta name="description" content="Get your superhero license!" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LCVJMC05DE"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-47867706-3', { page_path: window.location.pathname });`,
          }}
        ></script>
      </Head>
      <ProtectRoute {...props} />
    </Provider>
  )
}

export default MyApp
