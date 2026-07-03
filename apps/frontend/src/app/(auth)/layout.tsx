import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createPrivateMetadata("AmbitiousYou");

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
