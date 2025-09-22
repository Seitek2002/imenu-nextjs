# iMenu NextJS

Next.js port of the web-menu project. App Router (src/app), dynamic SEO via `generateMetadata`, SSR-friendly image handling, and parity with the original SPA design/logic.

## Scripts

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm start` — start production server

## Environment

Create `.env.local` if needed:

```
NEXT_PUBLIC_API_BASE_URL=https://imenu.kg/api/
```

## Notes

- Dynamic metadata for routes `/:venue/...` is resolved server-side from the Venue API.
- All images use `next/image` with fallbacks to avoid empty `src=""`.
- Styles and UI behavior are preserved from the original web-menu, adapted for Next.js.
