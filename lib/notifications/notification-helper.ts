export function enableNotifications() {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    sendNotification("Notifications already enabled");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        sendNotification("Notifications turned on for squanch.college");
      }
    });
  }
}

export function sendNotification(text: string) {
  const notification = new Notification(text, {
    icon: "/favicon.ico",
  });
}
