/* AmbitiousYou push service worker — handles on-device ambition reminders. */

self.addEventListener("push", (event) => {
  let payload = {
    title: "AmbitiousYou",
    body: "You have something due today.",
    href: "/dashboard",
    tag: "ambition-reminder",
  };

  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() };
    }
  } catch {
    // keep defaults
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: { href: payload.href },
      tag: payload.tag,
      renotify: true,
      icon: "/png_logos/icon_192.png",
      badge: "/png_logos/favicon_32px.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = event.notification?.data?.href || "/dashboard";
  const url = new URL(href, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client && client.url.startsWith(self.location.origin)) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
      return undefined;
    }),
  );
});
