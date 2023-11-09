let registration: ServiceWorkerRegistration;

export async function enableNotifications() {
  if ("serviceWorker" in navigator) {
    registration = await navigator.serviceWorker.register("/service-worker.js");

    navigator.serviceWorker.ready.then(async () => {
      const result = await window.Notification.requestPermission();
      if (result === "granted") {
        await sendNotification("Notifications enabled", "SQUAAAANCH");
      }
    });
  } else {
    alert("Service worker not supported");
  }
}

export async function sendNotification(body: string, title?: string) {
  if (registration) {
    await registration.showNotification(title ? title : "New Crunch", {
      body: body,
      icon: "/favicon.ico",
    });
  }
}
