"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { isSupported, getAnalytics, type Analytics } from "firebase/analytics";

// These come from your Firebase project settings → Project settings → General → Your apps → SDK setup.
// Create a `.env.local` file (see `.env.local.example`) and fill these in — the site will not
// connect to Firebase until they're set. Nothing here is a secret you need to hide; Firebase web
// config is safe to ship to the browser, access is controlled by your Firestore security rules.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let analyticsInstance: Analytics | null = null;

if (firebaseEnabled) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);

  // Analytics only works in the browser and only when the environment supports it
  // (e.g. not during server-side rendering, not in some privacy-hardened browsers).
  if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    isSupported()
      .then((supported) => {
        if (supported && app) analyticsInstance = getAnalytics(app);
      })
      .catch(() => {
        // analytics is optional — fail silently if unsupported
      });
  }
}

export const auth = authInstance;
export const db = dbInstance;
export const getAnalyticsInstance = () => analyticsInstance;
export default app;
