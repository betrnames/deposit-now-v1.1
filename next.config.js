/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Allows a second `next dev` (e.g. logov1 preview on :3001) without lock conflict.
  distDir: process.env.NEXT_DEV_DIST_DIR || '.next',
};

module.exports = nextConfig;
