function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export function isStandaloneDisplayMode(): boolean {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = "standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
  return media || iosStandalone;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function canUseWebPush(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function ensurePushServiceWorker(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function subscribeToWebPush(vapidPublicKey: string): Promise<PushSubscription> {
  const registration = await ensurePushServiceWorker();
  await navigator.serviceWorker.ready;

  // Wait until the worker is actually controlling the page when possible.
  if (navigator.serviceWorker.controller == null) {
    await new Promise<void>((resolve) => {
      const onControllerChange = () => {
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
        resolve();
      };
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
      // Don't hang forever if the SW was already active without a controller change.
      window.setTimeout(() => {
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
        resolve();
      }, 1500);
    });
  }

  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    // Re-subscribe if the endpoint looks stale after VAPID key rotation.
    try {
      await existing.unsubscribe();
    } catch {
      // continue to a fresh subscribe
    }
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  });
}

export async function unsubscribeFromWebPush(): Promise<string | null> {
  if (!canUseWebPush()) return null;
  const registration = await navigator.serviceWorker.ready.catch(() => null);
  if (!registration) return null;
  const existing = await registration.pushManager.getSubscription();
  if (!existing) return null;
  const endpoint = existing.endpoint;
  await existing.unsubscribe();
  return endpoint;
}

export function subscriptionToJson(subscription: PushSubscription): {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
} {
  const json = subscription.toJSON();
  return {
    endpoint: json.endpoint!,
    expirationTime: json.expirationTime ?? null,
    keys: {
      p256dh: json.keys!.p256dh!,
      auth: json.keys!.auth!,
    },
  };
}
