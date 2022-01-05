import type { AppProps } from "next/app";
import type { VFC } from "react";

import Head from "next/head";
import "../styles/globals.css";

const App: VFC<AppProps<Forwards>> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
    </>
  );
};

export default App;
