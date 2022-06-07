import type { NextApiHandler } from "next";

import path from "path";
import fs from "fs/promises";

const handler: NextApiHandler<string> = async (req, res) => {
  const { kind, name } = req.query;

  if (typeof kind !== "string" || typeof name !== "string")
    return res.status(500).send("not matched types of query datas.");

  if (!name.endsWith(".svg")) return res.status(404).send("");

  let filePath: string | null;
  switch (kind) {
    case "material":
      const trimName = name.replace(".svg", "");
      filePath = `node_modules/@material-icons/svg/svg/${trimName}/baseline.svg`;
      break;

    case "simple":
      filePath = `node_modules/simple-icons/icons/${name}`;
      break;

    default:
      filePath = null;
  }
  if (filePath === null) return res.status(404).send("couldn't resolve query.");

  const fileAbsolutePath = path.join(process.cwd(), filePath);
  let fileData: Buffer | null;
  try {
    fileData = await fs.readFile(fileAbsolutePath);
  } catch (e: any) {
    if (typeof e.code === "string" && (e.code as string).toLowerCase() === "enoent") {
      fileData = null;
    } else {
      throw e;
    }
  }
  if (fileData === null) return res.status(404).send("couldn't resolve query.");

  const svg = fileData.toString();

  const modifiedSvg = svg.replace("<svg", '<svg id="icon"');
  res.status(200).setHeader("content-type", "image/svg+xml").send(modifiedSvg);
};

export default handler;
