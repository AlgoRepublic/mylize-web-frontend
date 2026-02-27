declare module 'firebase/app' {
  export function initializeApp(config: Record<string, string>): unknown;
}

declare module 'firebase/messaging' {
  export interface Messaging {
    app: { name: string };
  }
  export function getMessaging(app: unknown): Messaging;
  export function getToken(messaging: Messaging, options: { vapidKey: string }): Promise<string | null>;
}
