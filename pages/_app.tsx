import type { AppProps } from "next/app";
import type { VFC } from "react";

import { useRef, useReducer } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import "../styles/globals.css";

const BASE_TITLE = "Nanai10a Articles";

type State = {
  title: string;
  description: string;
};

type Action =
  | { type: "changeTitle"; title?: string }
  | { type: "changeDescription"; description: string };

type Reducer = (state: State, action: Action) => State;

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "changeTitle": {
      const { title } = action;
      let newTitle = BASE_TITLE;

      if (typeof title === "string") {
        newTitle = `${title} - ${newTitle}`;
      }

      return {
        ...state,
        title: newTitle,
      };
    }
    case "changeDescription": {
      const { description } = action;

      return {
        ...state,
        description,
      };
    }
  }
};

export type Forwards = {
  __setTitle: (title?: string) => void;
  __setDescription: (description: string) => void;
};

// Tips: declaration: `AppProps<Forwards>` is not working (for type-checking) because `pageProps` is `any`.
const App: VFC<AppProps<Forwards>> = ({ Component, pageProps }) => {
  const [state, dispatcher] = useReducer<Reducer>(reducer, {
    title: BASE_TITLE,
    description: "",
  });

  const forwards = useRef<Forwards>({
    __setTitle: (title) => {
      dispatcher({ type: "changeTitle", title });
    },
    __setDescription: (description) => {
      dispatcher({ type: "changeDescription", description });
    },
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <title>{state.title}</title>
        <meta name={"description"} content={state.description} />

        {/* Preconnecting to Google API */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        {/* Import: Zen Kaku Gothic New */}
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Layout>
        <Component {...pageProps} {...forwards.current} />
      </Layout>
    </>
  );
};

export default App;
