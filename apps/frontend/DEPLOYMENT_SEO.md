# SEO & GEO deployment checklist

After each production deploy to `https://www.ambitiousyou.pro`, verify:

## Environment variables

- `NEXT_PUBLIC_SITE_URL` = `https://www.ambitiousyou.pro`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — from Google Search Console
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` — from Bing Webmaster Tools (optional)

## Canonical host

Vercel redirects apex `ambitiousyou.pro` → `www.ambitiousyou.pro` via [`vercel.json`](vercel.json).

## Automated on every build

- `sitemap.xml` — all indexable routes from `src/lib/seo/pages.ts`
- `robots.txt` — public allow, private disallow; AI citation bots allowed; `CCBot` disallowed
- `manifest.webmanifest` — PWA icons (PNG generated in prebuild)
- Per-route `opengraph-image` — social preview images (file-based; metadata does not hardcode Cloudinary)
- Marketing pages — SSG via `force-static`
- `llms.txt` / `llms-full.txt` — AI crawler summaries
- `pricing.md` — machine-readable pricing
- `/okf/` — Open Knowledge Format bundle (`/okf` → `/okf/index.md`)

## Manual validation

1. **Sitemap**: https://www.ambitiousyou.pro/sitemap.xml
2. **Robots**: https://www.ambitiousyou.pro/robots.txt (confirm GPTBot / PerplexityBot / ClaudeBot allowed)
3. **llms.txt**: https://www.ambitiousyou.pro/llms.txt
4. **llms-full.txt**: https://www.ambitiousyou.pro/llms-full.txt
5. **pricing.md**: https://www.ambitiousyou.pro/pricing.md
6. **OKF**: https://www.ambitiousyou.pro/okf/index.md
7. **OG images**: View source on `/features`, `/guides/...`, `/compare/todoist` — `og:image` should be the generated route image, not a stale Cloudinary override
8. **Rich results**: [Google Rich Results Test](https://search.google.com/test/rich-results) on `/`, `/features`, `/pricing`, `/guides/how-to-track-long-term-goals`
9. **Lighthouse**: `npx lighthouse https://www.ambitiousyou.pro --only-categories=performance,seo,accessibility,best-practices`
10. **Search Console**: Submit sitemap, monitor Coverage and FAQ/HowTo enhancements

## AI visibility (monthly DIY)

Track 15–20 queries across ChatGPT, Perplexity, and Google AI Overviews (cited? competitors cited? which page?):

- What is ambition management?
- Best long-term goal tracker
- AmbitiousYou vs Todoist / Notion / Asana / Habitica
- How to track long-term goals
- Goal tracker vs todo app
- AmbitiousYou pricing

## Third-party presence (ops, not code)

Citation ≠ recommendation. Improve recommendation odds via authentic presence (Wikipedia if notable, review sites, Reddit, industry roundups) — never spam.

## Target scores

- SEO: 100
- Performance: 90+ on `/`, `/features`, `/experience`, `/guides`
- All private routes (`/dashboard`, `/login`, etc.) return `noindex` in HTML
