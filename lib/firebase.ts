import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "dummy_api_key",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "dummy_auth_domain",
    projectId: process.env.FIREBASE_PROJECT_ID || "dummy_project_id",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "dummy_storage_bucket",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "dummy_sender_id",
    appId: process.env.FIREBASE_APP_ID || "dummy_app_id"
};

// Initialize Firebase securely (avoiding double initialization in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
