# Task: Optimize Car Image Loading with Redis and Frontend Enhancements

The goal is to fix the delay in car images appearing on the landing page's Fleet section.

## 1. Backend Optimization (Redis)
- **Aggressive Caching**: Ensure the pricing data (including image URLs) is cached in Redis with high availability.
- **Cache Preheating**: (Optional) Could add a way to ensure the cache is warm.
- **Improved Controller**: Ensure the `getAllPricing` controller returns the cached data as fast as possible.

## 2. Frontend Optimization
- **Eliminate useEffect Delay**: Instead of updating state in `useEffect` (which causes an extra render cycle and wait), derive the fleet data directly from the `usePricing()` data during the render phase.
- **Fix "Flash of No Image"**: Show a skeleton loader or a better placeholder while the images are downloading.
- **Improve Image Loading Strategy**:
    - Change `loading="lazy"` to `loading="eager"` for the fleet section if it's near the top.
    - Use `fetchPriority="high"` for the images.
- **Smooth Transitions**: Add a better CSS fade-in effect so that when images do appear, it doesn't look like a "glitch".

## 3. Image URL Mapping
- Ensure the `initialFleet` names match the `cabType` in the database exactly.

## Verification
- Test that on page load, if data is cached, images appear immediately (or much faster).
- Verify Redis logs show hits.
