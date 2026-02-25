# Plan: Migrate Cab Serves Frontend to Next.js (Streaming SSR)

This plan outlines the migration from a Vite-based SPA to a Next.js App Router application to enable Streaming SSR while staying within Vercel's Free Tier limits.

## Phase 1: Preparation & Setup
- [ ] Initialize Next.js dependencies in the `frontend` directory.
- [ ] Configure `tailwind.config.js` and `postcss.config.js` for Next.js compatibility.
- [ ] Standardize environment variables (change `VITE_` to `NEXT_PUBLIC_`).

## Phase 2: Core Architecture (Root Layout)
- [ ] Create `app/layout.tsx` (the "Shell" of the app).
- [ ] Migrate global styles (`index.css`) to `app/globals.css`.
- [ ] Set up metadata for SEO (title, description, icons).
- [ ] Integrate current Components (Navbar, Footer) into the root layout.

## Phase 3: Page Porting (Public Routes)
- [ ] `src/pages/Index.tsx` -> `app/page.tsx` (Server Component for SEO).
- [ ] `src/pages/PrivacyPolicy.tsx` -> `app/privacy/page.tsx` (Static Generation).
- [ ] `src/pages/TermsOfService.tsx` -> `app/terms/page.tsx` (Static Generation).
- [ ] Implement `loading.tsx` for smooth streaming transitions.

## Phase 4: Admin Dashboard (Streaming SSR)
- [ ] `src/pages/admin/AdminLogin.tsx` -> `app/admin/login/page.tsx` (Client Component).
- [ ] `src/pages/admin/DashboardPage.tsx` -> `app/admin/dashboard/page.tsx`.
- [ ] Use `Suspense` for data fetching in Bookings, Customers, and Pricing pages to enable component-level streaming.

## Phase 5: Routing & Optimization
- [ ] Replace `react-router-dom`'s `Link` and `useNavigate` with `next/link` and `next/navigation`.
- [ ] Optimize images using `next/image`.
- [ ] Final verification on Vercel Free Tier (Serverless Function limits check).

## Verification Criteria
- [ ] Site loads faster with initial HTML content visible before JS.
- [ ] Admin dashboard data streams in without blocking the layout.
- [ ] All forms (Booking, Login) remain functional.
- [ ] SEO audit shows improved metadata and semantic structure.
