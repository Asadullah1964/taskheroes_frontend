const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
};

export const subscribeUserToPush = async (): Promise<PushSubscription | null> => {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers are not supported.");
    return null;
  }

  if (!("PushManager" in window)) {
    console.warn("Push Notifications are not supported.");
    return null;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.warn("Notification permission denied.");
    return null;
  }

  let registration = await navigator.serviceWorker.getRegistration();

if (!registration) {
  registration = await navigator.serviceWorker.register("/sw.js");
}

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
) as BufferSource,
    });
  }

  return subscription;
};