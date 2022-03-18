import type { Diff } from "utility-types";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import type { Forwards } from "../_app";
import type { Content } from "../../lib/docs";

import { useEffect } from "react";
import * as runtime from "react/jsx-runtime";
import { runSync } from "@mdx-js/mdx";
import { getContents } from "../../lib/docs";

type Props = Forwards & Content;

const Page: NextPage<Props> = ({ __setTitle, matter, source }) => {
  useEffect(() => __setTitle(matter.title), [__setTitle, matter.title]);
  const Content = runSync(source, runtime).default;

  return (
    <main>
      <Content />
    </main>
  );
};

export default Page;

// TODO: change error messages
export const getStaticProps: GetStaticProps<Diff<Props, Forwards>> = async ({ params }) => {
  if (params === undefined) return { notFound: true };

  const kind = params?.["kind"];
  if (typeof kind !== "string") return { notFound: true };

  const id = params?.["id"];
  if (typeof id !== "string") return { notFound: true };

  const content = (await getContents())[kind]?.[id];
  if (content === undefined) return { notFound: true };

  return {
    props: content,
  };
};

export const getStaticPaths: GetStaticPaths<{ kind: string; id: string }> = async () => ({
  paths: Object.entries(await getContents())
    .map(([kind, rec]) => Object.keys(rec).map((id) => ({ params: { kind, id } })))
    .flat(1),
  fallback: false,
});
