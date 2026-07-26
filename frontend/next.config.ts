import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@lexical/react', 'lexical', '@lexical/yjs'],
  /* config options here */
};

export default nextConfig;
