import type { GrayMatterFile } from "gray-matter";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";

const DOCS_DIR = path.join(__dirname, "../docs");
const files = fs.existsSync(DOCS_DIR) ? fs.readdirSync(DOCS_DIR) : [];

type Article = {
  name: string;
  matter: Matter;
  src: MDXRemoteSerializeResult;
  isMDX: boolean;
};

type Matter = {
  title: string;
  description: string;
  tags: Array<string>;
  emoji: string;
};

const articlesPending = files
  .map<[string, Array<string>]>((n) => [path.join(DOCS_DIR, n), n.split(".")])
  .filter(([_p, ss]) => ss?.length === 2 && typeof ss[1] === "string" && /^mdx?$/.test(ss[1]))
  .filter(
    ([p, [name, extension]]) =>
      typeof p === "string" && typeof name === "string" && typeof extension === "string",
  )
  .map<[string, string, string]>(([p, [name, extension]]) => [
    p,
    name as string,
    extension as string,
  ])
  .map<[Pick<Article, "name" | "isMDX">, Buffer]>(([p, name, extension]) => [
    { name, isMDX: extension === "mdx" },
    fs.readFileSync(p),
  ])
  .map<[Pick<Article, "name" | "isMDX">, GrayMatterFile<Buffer>]>(([obj, buffer]) => [
    obj,
    matter(buffer),
  ])
  .filter(
    ([_obj, fo]) =>
      typeof fo.data["title"] === "string" &&
      typeof fo.data["description"] === "string" &&
      Array.isArray(fo.data["tags"]) &&
      typeof fo.data["emoji"] === "string",
  )
  .filter(
    ([_obj, fo]) =>
      fo.data["tags"].filter((v: unknown) => typeof v === "string").length ===
      fo.data["tags"].length,
  )
  .map<Promise<Article>>(
    async ([
      { name, isMDX },
      {
        data: { title, description, tags, emoji },
        content,
      },
    ]) => {
      return {
        name,
        matter: {
          title,
          description,
          tags,
          emoji,
        },
        src: await serialize(content),
        isMDX,
      };
    },
  );

let articles: Record<string, Article | undefined> | null = null;
export const getArticles = async () => {
  if (articles === null)
    articles = Object.fromEntries((await Promise.all(articlesPending)).map((a) => [a.name, a]));

  return articles;
};
