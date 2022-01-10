import type { Diff } from "utility-types";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import type { Forwards } from "../_app";
import type { Article } from "../../lib/docs";

import { useEffect } from "react";
import * as runtime from "react/jsx-runtime";
import { runSync } from "@mdx-js/mdx";
import { getArticles } from "../../lib/docs";

type Props = Forwards & Article;

const Page: NextPage<Props> = ({ __setTitle, matter, showable }) => {
  useEffect(() => __setTitle(matter.title), [__setTitle, matter.title]);
  const Content = runSync(showable, runtime).default;

  return (
    <main>
      <Content />
    </main>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Diff<Props, Forwards>> = async ({ params }) => {
  const id = params?.["id"];
  if (id === undefined || typeof id !== "string") return { notFound: true };

  const article = (await getArticles())[id];
  if (article === undefined) return { notFound: true };

  return {
    props: article,
  };
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  return {
    paths: Object.keys(await getArticles()).map((key) => ({ params: { id: key } })),
    fallback: false,
  };
};
