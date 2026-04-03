import AzureMailService from "@/services/azureMailService";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { fileURLToPath } from "url";
import z from "zod";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const validatedData = z.object({
        address: z.email(),
        username: z.string().min(1),
    }).safeParse(await request.json());

    if (!validatedData.success) {
        return NextResponse.json({
            message: validatedData.error.message,
            errors: z.treeifyError(validatedData.error),
        }, { status: 400 });
    }

    const { address, username } = validatedData.data;

    const templatePath = fileURLToPath(new URL("./signup-welcome.html", import.meta.url));
    let html = fs.readFileSync(templatePath, "utf8");

    html = html.replace("{{USERNAME}}", username);
    html = html.replace("{{DASHBOARD_LINK}}", `${process.env.APP_BASE_URL}/login`);

    const subject = "Welcome to AmbitiousYou!";

    const azureMailService = new AzureMailService();

    try {
        const info = await azureMailService.sendHtmlEmail(address, subject, html);
        if (info instanceof Error) throw new Error(info.message);
        return NextResponse.json({ message: "Welcome email sent successfully", info }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error sending welcome email", error }, { status: 500 });
    }
}