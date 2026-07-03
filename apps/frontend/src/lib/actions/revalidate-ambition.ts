import { revalidatePath } from "next/cache";

export function revalidateAmbition(ambitionId: string, scopes: Array<"detail" | "list" | "dashboard">) {
  if (scopes.includes("detail")) {
    revalidatePath(`/ambitions/${ambitionId}`);
  }
  if (scopes.includes("list")) {
    revalidatePath("/ambitions");
  }
  if (scopes.includes("dashboard")) {
    revalidatePath("/dashboard");
  }
}
