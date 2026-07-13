import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";
import { firebaseAdminEnabled } from "./firebaseAdmin";

/**
 * Verifies a Firebase Auth ID token (sent from the client as `Authorization: Bearer <token>`)
 * and confirms the signed-in user's email is in the ADMIN_EMAILS allowlist.
 *
 * ADMIN_EMAILS is a server-only env var — a comma-separated list of email addresses,
 * e.g. ADMIN_EMAILS=you@noxa.com,partner@noxa.com
 *
 * Returns the decoded token (with .email, .uid, etc.) if authorized, otherwise null.
 */
export async function verifyAdmin(idToken: string | undefined | null) {
  if (!idToken || !firebaseAdminEnabled || !getApps().length) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!decoded.email || !adminEmails.includes(decoded.email.toLowerCase())) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/** Pulls the bearer token out of a Next.js Request's Authorization header. */
export function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}
