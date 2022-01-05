import type { AppProps } from "next/app";
import type { VFC } from "react";

import Head from "next/head";
import "../styles/globals.css";

type State = {
  title: string;
  description: string;
};

type Action =
  | { type: "changeTitle"; title?: string }
  | { type: "changeDescription"; description: string };

type Reducer = (state: State, action: Action) => State;

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
