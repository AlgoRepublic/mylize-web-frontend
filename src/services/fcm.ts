/**
 * FCM (Firebase Cloud Messaging) service — retrieves and caches the device token
 * for use with logout and other backend APIs that require it.
 *
 * Set VITE_FIREBASE_* and VITE_FIREBASE_VAPID_KEY in .env (see .env.example).
 *
 * IMPORTANT: VITE_FIREBASE_VAPID_KEY must be your **public** VAPID key (from Firebase
 * Console > Project Settings > Cloud Messaging > Web Push certificates). Never put
 * the private key in the frontend — use it only on your backend when sending push messages.
 */

const FCM_TOKEN_STORAGE_KEY = 'fcmToken';

/** Normalize VAPID key: trim and ensure base64url (Push API expects URL-safe base64, no padding). */
function normalizeVapidKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return trimmed;
  return trimmed.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_VAPID_KEY?: string;
}

function getFirebaseConfig(): Record<string, string> | null {
  const env = (import.meta as unknown as { env: ImportMetaEnv }).env;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = env.VITE_FIREBASE_APP_ID;
  if (!apiKey || !projectId || !messagingSenderId || !appId) return null;
  return {
    apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId,
    appId,
  };
}

let messagingInstance: unknown = null;

async function getMessaging(): Promise<unknown> {
  if (messagingInstance) return messagingInstance;
  const config = getFirebaseConfig();
  if (!config) return null;
  try {
    const { initializeApp } = await import('firebase/app');
    const { getMessaging } = await import('firebase/messaging');
    const app = initializeApp(config);
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch {
    return null;
  }
}

/**
 * Returns the current FCM token: from cache (localStorage), or by requesting it from Firebase.
 * Resolves to null if Firebase is not configured, permission is denied, or token retrieval fails.
 */
export async function getFcmToken(): Promise<string | null> {
  const cached = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  if (cached) return cached;

  const rawVapid = (import.meta as unknown as { env: ImportMetaEnv }).env.VITE_FIREBASE_VAPID_KEY;
  if (!rawVapid) return null;
  const vapidKey = normalizeVapidKey(rawVapid);
  if (!vapidKey) return null;

  const messaging = await getMessaging();
  if (!messaging) return null;

  try {
    const { getToken } = await import('firebase/messaging');
    const token = await getToken(messaging as import('firebase/messaging').Messaging, { vapidKey });
    if (token) {
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
      return token;
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (/applicationServerKey|not valid|InvalidAccessError/i.test(msg)) {
      console.warn(
        '[FCM] Invalid VAPID key. Use the **public** key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates (not the private key).',
        error
      );
    } else {
      console.warn('[FCM] getToken failed:', error);
    }
  }
  return null;
}

/**
 * Synchronously returns the last known FCM token from cache (no async request).
 * Use when you need the token immediately (e.g. logout). Call getFcmToken() after login to populate cache.
 */
export function getCachedFcmToken(): string | null {
  return localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
}

/**
 * Clears the cached FCM token (e.g. after logout).
 */
export function clearCachedFcmToken(): void {
  localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
}
