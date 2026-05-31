import admin from "firebase-admin";

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
};

console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("PRIVATE_KEY exists:", !!process.env.FIREBASE_PRIVATE_KEY);

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase initialized successfully");

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
