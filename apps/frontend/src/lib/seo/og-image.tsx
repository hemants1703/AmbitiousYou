import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export interface OgImageOptions {
  title: string;
  subtitle?: string;
}

/** Shared OG image layout — brand gradient + page title, generated at build time. */
export function createOgImageResponse(options: OgImageOptions): ImageResponse {
  const { title, subtitle = siteConfig.name } = options;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #001a33 0%, #003366 45%, #005699 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
            fontSize: 28,
            fontWeight: 600,
            color: "#64ccc5",
          }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #0090FF, #03FFFF)",
            }}
          />
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 900 }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.4, color: "rgba(255,255,255,0.85)", maxWidth: 800 }}>{subtitle}</div>
      </div>
    ),
    { ...ogImageSize },
  );
}
