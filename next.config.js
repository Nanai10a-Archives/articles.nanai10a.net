/** @type {import('next').NextConfig} */
module.exports = {
  images: { formats: ["image/avif", "image/webp"] },
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  swcMinify: true,
};
