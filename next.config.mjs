import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],

  experimental: {
    outputFileTracingExcludes: {
      "*": [
        ".pnpm-store/**/*",
        "**/.pnpm-store/**/*",
        "node_modules/.cache/**/*",
        "public/videos/**/*",
        "public/audio/**/*",
        "public/sfx/**/*",
        "public/galleries/**/*",
        "public/content/articles/**/*",
        "public/content/talks/**/*",
        "public/downloads/**/*",
      ],
    },
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    config.module.rules.push({
      test: /\.(mp3)$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[path][name].[hash][ext]",
      },
    });

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vsupu83zlkfucch6.public.blob.vercel-storage.com",
        port: "",
        pathname: "/content/**",
      },
    ],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);