import Document, { Html, Head as NextHead, Main, NextScript } from 'next/document'

import Head from 'app/core/lib/Head'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head />
        <NextHead></NextHead>

        <body className="dark:bg-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
