declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    APP_BASE_URL?: string;
    CRON_SECRET?: string;
    FOUNDER_PLAN_EMAILS?: string;
    AZURE_CONNECTION_STRING?: string;
    VAPID_PUBLIC_KEY?: string;
    VAPID_PRIVATE_KEY?: string;
    VAPID_SUBJECT?: string;
  }
}
