import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const sessionToken = (await cookies()).get("sessionToken");

  if (!sessionToken) {
    return new Response(null, { status: 204 });
  }

  await fetch(`${process.env.API_URL}/auth/logout`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken.value}` },
  });

  (await cookies()).delete("sessionToken");

  redirect("/");
}
