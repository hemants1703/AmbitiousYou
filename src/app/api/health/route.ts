import { NextResponse } from "next/server";

export async function GET() {
  const notificationsUrl = process.env.NOTIFICATIONS_SERVICE_BASE_URL;

  if (!notificationsUrl) {
    return NextResponse.json(
      { error: "NOTIFICATIONS_SERVICE_BASE_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${notificationsUrl}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Notifications service unhealthy", status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      mainApp: "healthy",
      notificationsService: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reach notifications service",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
