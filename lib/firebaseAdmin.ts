import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

// Lazy Firebase Admin init. Returns a Firestore handle, or null when the
// service account isn't configured — so the whole app keeps working
// (orders just fall back to email/console) until you paste credentials.

let cached: Firestore | null = null
let tried = false

export function getDb(): Firestore | null {
  if (tried) return cached
  tried = true

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) return null

  try {
    const json = JSON.parse(raw)
    // Env vars escape newlines in the private key — restore them.
    if (typeof json.private_key === 'string') {
      json.private_key = json.private_key.replace(/\\n/g, '\n')
    }
    const app: App = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert(json) })
    cached = getFirestore(app)
    // Let documents omit optional fields (oldPrice, badge, note, …) instead of
    // throwing on `undefined`.
    try {
      cached.settings({ ignoreUndefinedProperties: true })
    } catch {
      /* settings can only be applied once; ignore if already set */
    }
    return cached
  } catch (err) {
    console.error('[Firebase] init failed — check FIREBASE_SERVICE_ACCOUNT', err)
    return null
  }
}

export function isFirebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT)
}
