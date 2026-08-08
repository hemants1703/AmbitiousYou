import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/site";


/** Point `/okf` at the OKF index markdown in `/public/okf/`. */
export function GET() {
  return NextResponse.redirect(absoluteUrl("/okf/index.md"), 308);
}
