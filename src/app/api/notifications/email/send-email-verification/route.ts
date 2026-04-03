import confirmSession from "@/lib/auth/confirmSession";
import AzureMailService from "@/services/azureMailService";
import fs from "fs";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { fileURLToPath } from "url";
import z from "zod";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await confirmSession();

    if (!session) {
        redirect("/login", RedirectType.replace);
    }

    const validatedData = z.object({
        address: z.email(),
        username: z.string().min(1),
        verificationLink: z.url(),
    }).safeParse(await request.json());

    if (!validatedData.success) {
        return NextResponse.json({
            message: validatedData.error.message,
            errors: z.treeifyError(validatedData.error),
        }, { status: 400 });
    }

    const { address, username, verificationLink } = validatedData.data;

    const templatePath = fileURLToPath(new URL("./verify-email.html", import.meta.url));
    let html = fs.readFileSync(templatePath, "utf8");

    html = html.replace("{{USERNAME}}", username);
    html = html.replace("{{VERIFICATION_LINK}}", verificationLink);

    const subject = "Verify Your Email for AmbitiousYou!";

    const azureMailService = new AzureMailService();

    try {
        const info = await azureMailService.sendHtmlEmail(address, subject, html);
        if (info instanceof Error) throw new Error(info.message);
        return NextResponse.json({ message: "Verification email sent successfully", info }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error sending verification email", error }, { status: 500 });
    }
}