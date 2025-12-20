## Project memory

- **Vercel/CI stability (Dec 2025)**: `package-lock.json` was invalid JSON (breaking `npm ci`). Regenerated lockfile and switched Vercel to `installCommand: "npm ci"` for deterministic installs.
- **Next.js versions**: Removed duplicate dependency entries and pinned to **Next 16.1.0** + matching **eslint-config-next 16.1.0**.
- **Sitemap**: `src/app/sitemap.ts` must be `dynamic = 'force-dynamic'` because it fetches WordPress at request-time; otherwise `next build` can error with dynamic server usage on Vercel.
