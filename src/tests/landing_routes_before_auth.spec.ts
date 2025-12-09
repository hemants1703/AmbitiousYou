import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("navigation links work correctly", async ({ page }) => {
    // Test logo link
    await page.getByRole("link", { name: "AmbitiousYou Logo AmbitiousYou" }).first().click();
    await expect(page).toHaveURL("http://localhost:3000/");

    // Test nav links
    await page.getByRole("link", { name: "Home" }).first().click();
    await page.getByRole("link", { name: "Experience" }).click();
    await page.getByRole("link", { name: "Features" }).click();

    // Test theme toggle
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("button", { name: "Toggle theme" }).click();
  });

  test("hero section displays correctly", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "For Those Who Dare to Dream" })).toBeVisible();
    await expect(page.getByText("Reduce your mental overload")).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Started" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Try It Now" })).toBeVisible();
  });

  test("features section displays correctly", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Transform How You Achieve" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Goal Hierarchy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Priority Management" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Progress Tracking" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Private & Secure" })).toBeVisible();
  });

  test("CTA section displays correctly", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Ready to Achieve Your Dreams?" })
    ).toBeVisible();
    await expect(page.getByText("Join AmbitiousYou today and")).toBeVisible();
    await expect(page.getByRole("button", { name: "Get Started" })).toBeVisible();
  });

  test("footer displays correctly", async ({ page }) => {
    await expect(
      page.locator("footer").getByRole("link", { name: "AmbitiousYou Logo AmbitiousYou" })
    ).toBeVisible();
    await expect(page.getByText("Helping you become superhuman")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Explore" })).toBeVisible();
    await expect(page.getByText("© 2025 AmbitiousYou. All")).toBeVisible();
  });
});

test.describe("Experience Page", () => {
  test("experience page displays correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/experience");

    await expect(page.getByRole("heading", { name: "See Yourself in Action" })).toBeVisible();
    await expect(page.getByText("Interactive Experience")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Your Journey" })).toBeVisible();
  });

  test("demo ambition showcase displays correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/experience");

    // Start journey to reveal demo
    await page.getByRole("button", { name: "Start Your Journey" }).click();

    await expect(page.getByText("Find Your Journey")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Which path resonates with you?" })
    ).toBeVisible();
  });
});

test.describe("Auth Pages", () => {
  test("login page displays correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await expect(page.getByText("Welcome Back")).toBeVisible();
    await expect(page.getByText("Log in to your account")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Forgot Password?" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up", exact: true })).toBeVisible();
  });

  test("signup page displays correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");

    await expect(page.getByText("Join AmbitiousYou")).toBeVisible();
    await expect(page.getByText("Create an account to get")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Full Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
  });

  test("forgot password page displays correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/forgot-password");

    await expect(page.getByText("Forgot Password")).toBeVisible();
    await expect(page.getByText("Enter your email to reset")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
  });

  test("can navigate between auth pages", async ({ page }) => {
    // Start at login
    await page.goto("http://localhost:3000/login");

    // Go to signup
    await page.getByRole("link", { name: "Sign Up", exact: true }).click();
    await expect(page).toHaveURL(/.*signup/);

    // Go back to login
    await page.getByRole("link", { name: "Log In", exact: true }).click();
    await expect(page).toHaveURL(/.*login/);

    // Go to forgot password
    await page.getByRole("link", { name: "Forgot Password?" }).click();
    await expect(page).toHaveURL(/.*forgot-password/);
  });
});

test.describe("Navigation from Landing to Auth", () => {
  test("Get Started links navigate to signup", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.getByRole("link", { name: "Get Started" }).first().click();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("Log in link navigates to login", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.getByRole("link", { name: "Log in" }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("Sign up link navigates to signup", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.getByRole("link", { name: "Sign up", exact: true }).click();
    await expect(page).toHaveURL(/.*signup/);
  });
});
