"use server";

import { getSessionToken } from "@/lib/auth";
import { revalidateAmbition, type RevalidateScope } from "@/lib/actions/revalidate-ambition";

export type { RevalidateScope };

export interface MutateApiOptions<T> {
  path: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  ambitionId?: string;
  revalidate?: RevalidateScope[];
  revalidateFromResponse?: (data: T) => { ambitionId: string; scopes: RevalidateScope[] };
  errorMessage?: string;
}

export interface MutateApiResult<T> {
  data: T | null;
  error: string | null;
}

export async function mutateApi<T>(options: MutateApiOptions<T>): Promise<MutateApiResult<T>> {
  const sessionToken = await getSessionToken();
  const {
    path,
    method = "POST",
    body,
    ambitionId,
    revalidate,
    revalidateFromResponse,
    errorMessage = "Something went wrong. Please try again.",
  } = options;

  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      return { data: null, error: errorMessage };
    }

    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? ((await response.json()) as T) : (null as T);

    if (revalidateFromResponse && data) {
      const { ambitionId: id, scopes } = revalidateFromResponse(data);
      revalidateAmbition(id, scopes);
    } else if (ambitionId && revalidate?.length) {
      revalidateAmbition(ambitionId, revalidate);
    }

    return { data, error: null };
  } catch {
    return { data: null, error: "Unable to reach the server. Check your connection and try again." };
  }
}
