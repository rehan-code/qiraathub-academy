import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Explicitly allow indexing for all site pages
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
      {
        // Ensure API endpoints are not indexed
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
  images: {
    domains: ["qiraathub.com"],
  },
};

export default nextConfig;
