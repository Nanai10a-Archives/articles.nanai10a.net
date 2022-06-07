import type { PromiseType } from "utility-types";

import * as fpe from "fp-ts/Either";
import * as io from "io-ts";
import { constants as fsc, promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

const readDocsDir: (kind: string) => Promise<Array<[string, string]>> = async (kind) => {
  const docs_dir = path.join(process.cwd(), "docs", kind);

  let dirExists: boolean;
  try {
    await fs.access(docs_dir, fsc.R_OK);
    dirExists = true;
  } catch (e) {
    const decoded = io.type({ code: io.string }).decode(e);
    if (fpe.isRight(decoded) && decoded.right.code.toLowerCase() === "eacces") {
      dirExists = false;
    } else {
      throw e;
    }
  }

  if (!dirExists) return [];

  return (await fs.readdir(docs_dir)).map((f) => [f, path.join(docs_dir, f)]);
};

const readFile = (path: string) => fs.readFile(path);

const compileMDX = async (src: Buffer) => {
  const { data, content } = matter(src);

  const decoded = Matter.decode(data);
  if (fpe.isLeft(decoded)) return null;

  const vfile = await compile(content, { outputFormat: "function-body" });
  return {
    source: vfile.toString(),
    matter: {
      ...decoded.right,
    },
  };
};

export type Content = {
  name: string;
  matter: Matter;
  source: string;
};

const Matter = io.type({
  title: io.string,
  description: io.string,
  tags: io.array(io.string),
  emoji: io.string,
});

export type Matter = io.TypeOf<typeof Matter>;

let contentsCache: PromiseType<ReturnType<typeof getContents>> | undefined = undefined;
export const getContents = async (
  revalidate?: boolean,
): Promise<Record<string, Record<string, Content>>> => {
  if (!revalidate && contentsCache !== undefined) return contentsCache;

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

  const contents = Object.fromEntries(await Promise.all(contentPendings));

  contentsCache = contents;
  return contents;
};
