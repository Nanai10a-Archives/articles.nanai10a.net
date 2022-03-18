import type { PromiseType } from "utility-types";

import { constants as fsc, promises as fsp } from "fs";
import path from "path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

// Tips: this was executed from ".next/server/pages${path}", so `__dirname` isn't decisive
const getRootDir = () => {
  const split_dirname = __dirname.split(path.sep);
  if (typeof split_dirname[0] !== "string" || split_dirname[0].length !== 0)
    throw new Error("`__dirname` is not absolute path");

  let rootIndex;
  for (
    rootIndex = split_dirname.length - 4;
    !(
      split_dirname[rootIndex + 0] === ".next" &&
      split_dirname[rootIndex + 1] === "server" &&
      split_dirname[rootIndex + 2] === "pages"
    );
    rootIndex--
  )
    if (rootIndex < 0)
      throw new Error('couldn\'t find path of ".next/server/pages" in `__dirname`');
  split_dirname.length = rootIndex;
  return path.join("/", ...split_dirname);
};

const readDocsDir: (kind: string) => Promise<Array<[string, string]>> = async (kind) => {
  const docs_dir = path.join(getRootDir(), "docs", kind);

  let dirExists = false;
  try {
    await fsp.access(docs_dir, fsc.R_OK);
    dirExists = true;
  } catch {
    // eslint-disable-next-line no-empty
  }

  if (!dirExists) return [];

  return (await fsp.readdir(docs_dir)).map((f) => [f, path.join(docs_dir, f)]);
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
    source: vfile.toString(),
    matter: {
      title,
      description,
      tags: tags as Array<string>,
      emoji,
    },
  };
};

export type Content = {
  name: string;
  matter: Matter;
  source: string;
};

export type Matter = {
  title: string;
  description: string;
  tags: Array<string>;
  emoji: string;
};

export const getContents = async (): Promise<Record<string, Record<string, Content>>> => {
  const contentPendings = ["articles"].map(async (kind) => {
    const readPendings = (await readDocsDir(kind)).map<Promise<[string, Buffer]>>(
      async ([name, path]) => [name, await readFile(path)],
    );

    type cMDXReturn = PromiseType<ReturnType<typeof compileMDX>>;

    const compilePendings = (await Promise.all(readPendings)).map<Promise<[string, cMDXReturn]>>(
      async ([name, buffer]) => [name, await compileMDX(buffer)],
    );

    const newContents = (await Promise.all(compilePendings))
      .filter(([_name, compiled]) => compiled !== null)
      .map<Content>(([name, compiled]) => ({ name, ...(compiled as NonNullable<cMDXReturn>) }))
      .map<[string, Content]>((a) => [a.name, a]);

    return [kind, Object.fromEntries(newContents)];
  });

  return Object.fromEntries(await Promise.all(contentPendings));
};
