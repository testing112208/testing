# 🚀 Production Deployment Protocol: Cab Serves

This document outlines the professional deployment strategy for the project, optimized for security, performance, and cross-platform compatibility.

## 🏗️ Architecture Overview
- **Backend**: Node.js/Express hosted on **Render.com**.
- **Frontend**: Next.js hosted on **Cloudflare Pages** (using Static Site Generation).
- **Database**: MongoDB Atlas (Primary) + Redis (Caching).
- **Communication**: WhatsApp (Baileys) + Telegram (Alerts).

---

## 🔒 Security Hardening (Red Team Verified)
1. **Fail-Secure Config**: The backend is configured to crash immediately if `JWT_SECRET` is missing, preventing insecure execution.
2. **Git Exposure Prevention**: `.env` is globally ignored in the root `.gitignore`.
3. **Dynamic CORS**: The backend only allows requests from the `CLIENT_URL` defined in the environment variables, plus local development origins.
4. **Secret Audit**: No hardcoded secrets were found in the source code. All sensitive data is injected via environment variables.

---

## ☁️ Deployment Instructions

### 1. Backend (Render.com)
Render is configured via `render.yaml` for a "One-Click" style experience.
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Populate all keys from `.env.production.example`.

### 2. Frontend (Cloudflare Pages)
Cloudflare Pages is configured for Static Site Generation (SSG).
- **Framework Preset**: `Next.js (Static HTML Export)`
- **Build Command**: `npm run build`
- **Build Output Directory**: `out`
- **Root Directory**: `frontend`
- **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: Set this to your Render service URL (e.g., `https://cab-serves-api.onrender.com`).
    - `NEXT_PUBLIC_WHATSAPP_PHONE`: Set to the default driver/admin phone (e.g., `919359570497`).

---

## 🤖 Service Persistence & Performance (Render)
The WhatsApp service and backend are optimized:
- **Stateless Reconnection**: Sessions are stored in MongoDB. Render server restarts will NOT require a QR re-scan.
- **Keep-Alive Self-Ping**: The backend automatically pings itself every 14 minutes if `RENDER_EXTERNAL_URL` is set, preventing the free tier from sleeping.
- **RAM Efficiency**: Uses `@whiskeysockets/baileys` (Raw WebSocket) instead of Puppeteer, allowing it to run reliably on Render's free tier.

---

## 🛠️ Push-to-Deploy Workflow
1. Ensure all changes are committed.
2. Push to the `main` branch: `git push origin main`.
3. Render and Vercel will automatically trigger builds.
4. Monitor logs for the first deployment to ensure `MONGO_URI` and `JWT_SECRET` are correctly injected.

---

## 📊 Environment Audit
The required keys are documented in `.env.production.example`. Ensure these are set in your platform dashboards before the first build.
