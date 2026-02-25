import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ── Turbopack root fix ──────────────────────────────────────────────
    turbopack: {
        root: resolve(__dirname),
    },

    // ── Static Export for Cloudflare Pages (production build only) ──────
    // Only apply static export when explicitly building for production.
    // In dev mode (npm run dev), Next.js runs normally with full features.
    ...(process.env.NODE_ENV === 'production' ? {
        output: 'export',
        trailingSlash: false,        // Keep false to avoid pathname mismatch bugs
        images: { unoptimized: true },
    } : {}),

    distDir: '.next',
    outputFileTracingRoot: resolve(__dirname),
};

export default nextConfig;
