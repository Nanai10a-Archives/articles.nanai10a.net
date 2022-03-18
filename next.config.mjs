/** @type {import('next').NextConfig} */
const config = {
  images: { formats: ["image/avif", "image/webp"] },
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  swcMinify: true,
};

export default config;
