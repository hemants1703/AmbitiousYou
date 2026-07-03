import { LoginForm } from "@/components/(auth)/login/login-form";
import type { LoginState } from "@/lib/actions/(auth)/login/login";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const initialState: LoginState = { error: null };

function renderLoginForm(action: (state: LoginState, formData: FormData) => Promise<LoginState>) {
  return render(<LoginForm action={action} initialState={initialState} />);
}

describe("LoginForm", () => {
  it("shows inline error when the action returns one", async () => {
    const action = vi.fn(async (): Promise<LoginState> => ({ error: "Invalid email or password." }));
    const user = userEvent.setup();

    renderLoginForm(action);

    await user.type(screen.getByLabelText("Email"), "bad@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    const alert = await screen.findByText("Invalid email or password.");
    expect(alert).toBeInTheDocument();
    expect(alert.closest("[aria-live='polite']")).not.toBeNull();
  });

  it("disables submit and shows spinner while the action is pending", async () => {
    let resolveAction: (value: LoginState) => void = () => undefined;
    const action = vi.fn(
      () =>
        new Promise<LoginState>((resolve) => {
          resolveAction = resolve;
        }),
    );
    const user = userEvent.setup();

    renderLoginForm(action);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: "Login" }));

    const submitButton = await screen.findByRole("button", { name: /Logging in/ });
    expect(submitButton).toBeDisabled();

    resolveAction({ error: null });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
    });
  });

  it("submits when Enter is pressed in the password field", async () => {
    const action = vi.fn(async (): Promise<LoginState> => ({ error: null }));
    const user = userEvent.setup();

    renderLoginForm(action);

    const form = screen.getByRole("heading", { name: "Login to your account" }).closest("form");
    expect(form).not.toBeNull();

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    const formData = action.mock.calls[0]?.[1] as FormData;
    expect(formData.get("email")).toBe("user@example.com");
    expect(formData.get("password")).toBe("secret");
  });
});
