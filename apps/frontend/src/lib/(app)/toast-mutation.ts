import { toast } from "sonner";

export type ToastMutationMessages<T> = {
  loading: string;
  success: string | ((data: T) => string);
  error?: string | ((error: string) => string);
};

export type ToastMutationOptions<T> = {
  /** Return an error string when the result represents failure. */
  getError?: (data: T) => string | null | undefined;
  /**
   * When true (default), failed results update the toast to error.
   * When false, the loading toast is dismissed so the caller can use inline errors.
   */
  toastOnError?: boolean;
};

/**
 * Shows a Sonner loading toast, runs `work`, then updates the same toast to
 * success or error. Fits server actions that return `{ error }` without throwing.
 */
export async function toastMutation<T>(work: () => Promise<T>, messages: ToastMutationMessages<T>, options?: ToastMutationOptions<T>): Promise<T> {
  const id = toast.loading(messages.loading);
  const toastOnError = options?.toastOnError ?? true;

  try {
    const data = await work();
    const err = options?.getError?.(data);
    if (err) {
      if (toastOnError) {
        const errorMsg = typeof messages.error === "function" ? messages.error(err) : (messages.error ?? err);
        toast.error(errorMsg, { id });
      } else {
        toast.dismiss(id);
      }
      return data;
    }

    const successMsg = typeof messages.success === "function" ? messages.success(data) : messages.success;
    toast.success(successMsg, { id });
    return data;
  } catch (e) {
    const fallback = e instanceof Error ? e.message : "Something went wrong. Please try again.";
    if (toastOnError) {
      const errorMsg = typeof messages.error === "function" ? messages.error(fallback) : (messages.error ?? fallback);
      toast.error(errorMsg, { id });
    } else {
      toast.dismiss(id);
    }
    throw e;
  }
}
