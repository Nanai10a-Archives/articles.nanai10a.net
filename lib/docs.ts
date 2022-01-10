import type { PromiseType } from "utility-types";

import { constants as fsc, promises as fsp } from "fs";
import path from "path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

// Tips: this was executed from ".next/server/pages/a" ( === `__dirname`)
const DOCS_DIR = path.join(__dirname, "../../../../docs");

const readDocsDir: () => Promise<Array<[string, string]>> = async () => {
  let dirExists = false;
  try {
    await fsp.access(DOCS_DIR, fsc.R_OK);
    dirExists = true;
  } catch {
    // eslint-disable-next-line no-empty
  }

  if (!dirExists) return [];

  return (await fsp.readdir(DOCS_DIR)).map((f) => [f, path.join(DOCS_DIR, f)]);
};

const readFile = (path: string) => fsp.readFile(path);

const compileMDX = async (src: Buffer) => {
  const {
    data: { title, description, tags, emoji },
    content,
  } = matter(src);

  const assertFieldsType =
    typeof title === "string" &&
    typeof description === "string" &&
    Array.isArray(tags) &&
    tags.filter((t) => typeof t === "string").length === tags.length &&
    typeof emoji === "string";

  if (!assertFieldsType) return null;

  const vfile = await compile(content, { outputFormat: "function-body" });
  return {
    showable: vfile.toString(),
    matter: {
      title,
      description,
      tags: tags as Array<string>,
      emoji,
    },
  };
};

export type Article = {
  name: string;
  matter: Matter;
  showable: string;
};

export type Matter = {
  title: string;
  description: string;
  tags: Array<string>;
  emoji: string;
};

export const getArticles = async () => {
  const readPendings = (await readDocsDir()).map<Promise<[string, Buffer]>>(
    async ([name, path]) => [name, await readFile(path)],
  );

  type cMDXReturn = PromiseType<ReturnType<typeof compileMDX>>;

  const compilePendings = (await Promise.all(readPendings)).map<Promise<[string, cMDXReturn]>>(
    async ([name, buffer]) => [name, await compileMDX(buffer)],
  );

  const newArticles = (await Promise.all(compilePendings))
    .filter(([_name, compiled]) => compiled !== null)
    .map<Article>(([name, compiled]) => ({ name, ...(compiled as NonNullable<cMDXReturn>) }))
    .map<[string, Article]>((a) => [a.name, a]);

  return Object.fromEntries(newArticles);
};
