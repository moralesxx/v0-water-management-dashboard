/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANTE: Se eliminó output: 'export' para habilitar las API Routes
  // El proyecto ahora usa Next.js en modo servidor (Vercel serverless)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
