---
name: Mourya Green World routing
description: Key routing and data-binding decisions for the Mourya Green World Replit app
---

## Wouter Switch route ordering
In wouter's `<Switch>`, the most specific admin routes (`/admin/products`, `/admin/categories`, etc.) must come BEFORE the general `/admin` (Dashboard) route. If the Dashboard route is placed first, it can capture sub-routes before they are matched.

**Why:** Wouter's Switch returns the first matching route. Even with exact matching, placing `/admin` before `/admin/products/new` is risky — always order specific before general.

**How to apply:** In `App.tsx` admin Switch, keep the `/admin` Dashboard route as the last named route, just before the `<Route component={NotFound} />` fallback.

## Brand name binding
Navbar and Footer must import `usePublicData` from `AdminContext` and use `settings.storeName` — never hardcode the store name string. The AdminContext persists settings to localStorage so changes in Admin → Settings are reflected instantly everywhere.

**Why:** Admin Settings panel updates `settings.storeName` in localStorage via AdminContext. If components hardcode the name, those changes never appear on the public site.

## SPA routing
`artifact.toml` already has `from = "/*"` → `"/index.html"` rewrite for production. The Vite dev server uses the default `appType: 'spa'` which handles direct navigation to any path (e.g. `/admin`) in development. No extra config needed.
