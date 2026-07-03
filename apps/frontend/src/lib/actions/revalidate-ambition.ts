import { revalidatePath } from "next/cache";

export type RevalidateScope = "detail" | "list" | "dashboard";

export function revalidateAmbition(ambitionId: string, scopes: RevalidateScope[]) {
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
