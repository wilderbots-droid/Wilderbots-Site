import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo-alone.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-alone.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Pioneering the next generation of wearable tech and interactive education. Product. Service. Education." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

