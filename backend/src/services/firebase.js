import "../config/env.js";
import admin from "firebase-admin";

let db = null;
let auth = null;

const hasCredentials =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

//console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
//console.log("CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
//console.log("PRIVATE_KEY exists:", !!process.env.FIREBASE_PRIVATE_KEY);

if (hasCredentials) {
  try {
    const serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

//console.log("Firebase initialized successfully");
    db = admin.firestore();
    auth = admin.auth();
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error.message);
  }
} else {
  console.warn("Firebase credentials are not configured in environment variables. Running in offline/mock mode.");

  // Expose mock auth/db interfaces so imports do not crash
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => {},
        update: async () => {},
        delete: async () => {}
      })
    })
  };

  auth = {
    verifyIdToken: async (token) => {
      console.log("Mock verifying ID token:", token);
      return { uid: "mock-user-id", email: "mock@example.com" };
    }
  };
}

export { admin, db, auth };
