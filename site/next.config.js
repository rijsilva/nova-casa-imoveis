/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

// Adaptador Cloudflare (só ativo no build de produção para Pages)
const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

module.exports = nextConfig;
