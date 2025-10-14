/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd, // ✨ هنا بقى السحر — بيوقف الـPWA أثناء التطوير
});

const nextConfig = withPWA({
  output: "export",
  images: {
    unoptimized: true,
  },
});

module.exports = nextConfig;
