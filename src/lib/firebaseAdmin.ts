import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Server-only. Requires FIREBASE_SERVICE_ACCOUNT_KEY — the full service account JSON
// (Firebase console → Project settings → Service accounts → Generate new private key),
// minified to one line and set as a single environment variable. See .env.local.example.
let adminApp: App | null = null;
let adminDb: Firestore | null = null;

export const firebaseAdminEnabled = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (firebaseAdminEnabled && !getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    adminApp = initializeApp({ credential: cert(serviceAccount) });
    adminDb = getFirestore(adminApp);
  } catch (err) {
    console.error("Failed to initialize Firebase Admin — check FIREBASE_SERVICE_ACCOUNT_KEY:", err);
  }
} else if (getApps().length) {
  adminApp = getApps()[0];
  adminDb = getFirestore(adminApp);
}

export { adminDb };
