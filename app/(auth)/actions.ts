"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LoginSchema, SignupSchema } from "./_lib/definitions";
import { revalidatePath } from "next/cache";
import { LoginState } from "./login/LoginForm";
import { SignupState } from "./signup/SignUpForm";

// TODO: CREATE A NEW PROFILES TABLE AND SAVE THE USER FIRST AND LAST NAME IN THAT TABLE
// This function is called when the user submits the signup form
export async function signupAction(previousState: SignupState, formData: FormData) {
    // Validate the form data submitted by the user
    const validationResult = SignupSchema.safeParse({
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

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // SIGN UP THE USER
    const { error } = await supabase.auth.signUp(data)

    if (error) {
        if (error.status === 422 && error.code === "user_already_exists") {
            return {
                errors: {
                    // email: "An account with email already exists, try logging in instead.",
                    message: "An account with this email already exists. Please log in instead.",
                },
            }
        }

        // redirect('/error')
    } else {

        const createdUser = await supabase.auth.getUser();

        if (createdUser.error) {
            return {
                errors: {
                    email: "An error occurred while creating your account.",
                },
            }
        }

        const userData = createdUser.data.user;

        console.log("user created: ", userData);


        revalidatePath('/', 'layout');
        redirect('/dashboard');
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