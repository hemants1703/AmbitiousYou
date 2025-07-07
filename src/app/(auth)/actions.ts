"use server";

import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import { LoginSchema, SignupSchema } from "./_lib/definitions";
import { revalidatePath } from "next/cache";
import { LoginState } from "./login/LoginForm";
import { SignupState } from "./signup/SignUpForm";
import { pricingPlans } from "@/src/lib/content/pricingPlans";

// This function is called when the user submits the signup form
export async function signupAction(previousState: SignupState, formData: FormData) {
    // Validate the form data submitted by the user
    const validationResult = SignupSchema.safeParse({
        plan: formData.get("plan") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })

    // If the validation fails, return the errors to the client
    if (!validationResult.success) {
        console.log("validationResult", validationResult.error.flatten().fieldErrors);
        return {
            errors: validationResult.error.flatten().fieldErrors,
        }
    }

    // Create a SSR Supabase client instance
    const supabase = await createClient()

    const signupData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // SIGN UP THE USER
    const { error: signupError } = await supabase.auth.signUp(signupData)

    if (signupError) {
        if (signupError.status === 422 && signupError.code === "user_already_exists") {
            return {
                errors: {
                    // email: "An account with email already exists, try logging in instead.",
                    message: "An account with this email already exists. Please log in instead.",
                },
            }
        }

        // redirect('/error')
    }

    const createdUser = await supabase.auth.getUser();

    if (createdUser.error) {
        return {
            errors: {
                email: "An error occurred while creating your account.",
            },
        }
    } else {

        const { data: { user } } = createdUser;

        const userId = user.id;
        const { firstName, lastName } = validationResult.data;

        console.log("createdUser: ", createdUser);

        const { data: profileCreationData, error: profileCreationError } = await supabase
            .from('profiles')
            .insert(
                { userId, firstName, lastName, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            )
            .select();

        if (profileCreationError) {
            console.error("Error creating user profile:", profileCreationError);
            return {
                errors: {
                    message: "An error occurred while creating your profile.",
                },
            }
        }

        console.log("user created: ", profileCreationData);

        const planMonthlyPrice = pricingPlans.find((plan) => plan.slug.toLowerCase() === validationResult.data.plan.toLowerCase())?.planMonthlyPrice;
        const planYearlyPrice = pricingPlans.find((plan) => plan.slug.toLowerCase() === validationResult.data.plan.toLowerCase())?.planYearlyPrice;

        const { data: planCreationData, error: planCreationError } = await supabase
            .from('plans')
            .insert(
                { userId, planName: validationResult.data.plan, planMonthlyPrice, planYearlyPrice, planPeriod: "none", planStatus: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            )
            .select();

        if (planCreationError) {
            console.error("Error creating user plan:", planCreationError);
            return {
                errors: {
                    message: "An error occurred while creating your plan.",
                },
            }
        }

        console.log("user plan created: ", planCreationData);

        revalidatePath('/', 'layout');
        redirect('/onboarding');
    }
}

// This function is called when the user submits the login form
export async function loginUserAction(previousState: LoginState, formData: FormData) {
    // Validate the form data submitted by the user
    const valiadationResult = LoginSchema.safeParse({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })

    // If the validation fails, return the errors to the client
    if (!valiadationResult.success) {
        console.log("validationResult", valiadationResult.error.flatten().fieldErrors);
        return {
            errors: valiadationResult.error.flatten().fieldErrors,
        }
    }

    // Create a SSR Supabase client instance
    const supabase = await createClient();

    // LOGIN THE USER
    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })

    console.log("Login data: ", data);

    if (error) {
        console.error("Error signing in:", error);
        if (error.status === 400 && error.code === "invalid_credentials") {
            return {
                errors: {
                    message: "Invalid email or password.",
                }
            }
        }
        return {
            errors: {
                message: "An error occurred while signing in.",
            }
        }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard");
}

// This function is called when the user submits the logout form
export async function logoutAction() {
    const supabase = await createClient();

    // LOGOUT THE USER
    // The `scope` parameter is used to specify the type of authentication method to use
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
        console.error("Error signing out:", error);
        return {
            success: false,
            status: error.status,
            code: error.code,
            errorMessage: "An error occurred while signing out.",
        }
    }

    revalidatePath("/", "layout")
    redirect("/login?redirected=true");
}