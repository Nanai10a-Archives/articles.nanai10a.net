/** @type {import('next').NextConfig} */
module.exports = require("@next/mdx")({
  extension: /\.mdx?$/,
})({
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  swcMinify: true,
})
