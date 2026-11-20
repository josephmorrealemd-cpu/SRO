import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const ADMIN_EMAILS = ["josephmorrealemd@gmail.com"];

export const ADMIN_MAX_AUTH_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours
export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export async function isVerifiedAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;

  const email = user.email?.toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return false;
  }

  if (user.emailVerified !== true) {
    return false;
  }

  const hasGoogleProvider = user.providerData.some(
    (provider) => provider.providerId === "google.com"
  );
  if (!hasGoogleProvider) {
    return false;
  }

  try {
    const tokenResult = await user.getIdTokenResult();
    const authTimeSeconds = Number(tokenResult.claims?.auth_time);
    if (!Number.isFinite(authTimeSeconds) || authTimeSeconds <= 0) {
      return false;
    }

    const authAgeMs = Date.now() - authTimeSeconds * 1000;
    if (authAgeMs > ADMIN_MAX_AUTH_AGE_MS) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function signInAdminWithGoogle(auth: Auth) {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

export async function enforceAdminOrSignOut(
  auth: Auth,
  user: User | null
): Promise<boolean> {
  if (!user) return false;
  const isValid = await isVerifiedAdminUser(user);
  if (!isValid) {
    await signOut(auth).catch(() => {});
    return false;
  }
  return true;
}

export function watchAdminIdleTimeout(
  onTimeout: () => void,
  timeoutMs: number = ADMIN_IDLE_TIMEOUT_MS
): () => void {
  let lastActivityAt = Date.now();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const cleanup = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

  const triggerTimeout = () => {
    if (stopped) return;
    stopped = true;
    cleanup();
    onTimeout();
  };

  const resetTimer = () => {
    if (stopped) return;
    lastActivityAt = Date.now();
    if (timer) clearTimeout(timer);
    timer = setTimeout(triggerTimeout, timeoutMs);
  };

  const handleVisibilityChange = () => {
    if (stopped) return;
    if (
      document.visibilityState === "visible" &&
      Date.now() - lastActivityAt >= timeoutMs
    ) {
      triggerTimeout();
    }
  };

  const events: Array<keyof WindowEventMap> = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "click",
  ];

  events.forEach((evt) =>
    window.addEventListener(evt, resetTimer, { passive: true })
  );
  document.addEventListener("visibilitychange", handleVisibilityChange);
  resetTimer();

  return () => {
    stopped = true;
    cleanup();
  };
}
