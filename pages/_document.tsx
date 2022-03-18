import type { DocumentProps } from "next/document";
import type { VFC } from "react";

import { Html, Head, Main, NextScript } from "next/document";

const Document: VFC<DocumentProps> = () => (
  <Html>
    <Head>
      {/* Preconnecting to Google API */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

      {/* Import: Zen Kaku Gothic New */}
      <link
        href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New&display=swap"
        rel="stylesheet"
      />

      {/* Import: Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
