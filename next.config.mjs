/** @type {import('next').NextConfig} */

const nextConfig = {
  images: { domains: ["oaidalleapiprodscus.blob.core.windows.net"] },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_HOST + "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
