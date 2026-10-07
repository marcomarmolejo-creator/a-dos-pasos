/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1"],
  agentRules: false,
  images: { unoptimized: true }
};

export default nextConfig;
