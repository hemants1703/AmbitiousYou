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
- `robots.txt` — public allow, private disallow
- `manifest.webmanifest` — PWA icons (PNG generated in prebuild)
- Per-route `opengraph-image` — social preview images
- Marketing pages — SSG via `force-static`
- `llms.txt` — AI crawler summary at `/llms.txt`

## Manual validation

1. **Sitemap**: https://www.ambitiousyou.pro/sitemap.xml (expect 16+ URLs)
2. **Robots**: https://www.ambitiousyou.pro/robots.txt
3. **llms.txt**: https://www.ambitiousyou.pro/llms.txt
4. **Rich results**: [Google Rich Results Test](https://search.google.com/test/rich-results) on `/`, `/features`, `/pricing`
5. **Lighthouse**: `npx lighthouse https://www.ambitiousyou.pro --only-categories=performance,seo,accessibility,best-practices`
6. **Search Console**: Submit sitemap, monitor Coverage and FAQ enhancements

## Target scores

- SEO: 100
- Performance: 90+ on `/`, `/features`, `/experience`
- All private routes (`/dashboard`, `/login`, etc.) return `noindex` in HTML
