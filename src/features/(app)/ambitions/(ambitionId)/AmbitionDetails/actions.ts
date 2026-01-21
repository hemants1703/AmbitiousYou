"use server";

import { Ambition, ambitions } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { editAmbitionDetailsSchema } from "./validation";
import z from "zod";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface EditAmbitionDetailsActionState extends Partial<Ambition> {
    errors?: Record<string, string[]>,
    success?: boolean;
}

export async function editAmbitionDetails(_: EditAmbitionDetailsActionState, formData: FormData): Promise<EditAmbitionDetailsActionState> {
    const session = await confirmSession();

    if (!session) {
        return {
            success: false,
            errors: { general: ["Unauthorized"] }
        }
    }

    const submittedFormData = {
        userId: formData.get("userId") as string,
        ambitionId: formData.get("ambitionId") as string,
        ambitionName: formData.get("ambitionName") as string,
        ambitionDefinition: formData.get("ambitionDefinition") as string
    }

    const validatedData = editAmbitionDetailsSchema.safeParse(submittedFormData);

    console.log(formData);

    if (!validatedData.success) {
        return {
            success: false,
            errors: z.flattenError(validatedData.error).fieldErrors,
            ...submittedFormData
        }
    }

    const editAmbitionDetails = await db.update(ambitions).set({
        ambitionName: submittedFormData.ambitionName,
        ambitionDefinition: submittedFormData.ambitionDefinition
    }).where(and(eq(ambitions.userId, validatedData.data.userId), eq(ambitions.id, validatedData.data.ambitionId)));

    if (!editAmbitionDetails) {
        return {
            errors: {
                general: ["Failed to update Ambition"],
            },
            ...submittedFormData,
        };
    }

    revalidatePath(`/ambitions/${validatedData.data.ambitionId}`);
    return {
        success: true,
        ...submittedFormData,
    };
}