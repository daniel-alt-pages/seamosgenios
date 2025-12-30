// Firebase Configuration - Seamos Genios Admin Panel
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuración de Firebase
// Usa variables de entorno si están disponibles, sino usa valores por defecto
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC3J8mjVK20PJQCRvhJOyWOyI9A7rH20_8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "seamosgenios-94122.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "seamosgenios-94122",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "seamosgenios-94122.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1022591625581",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1022591625581:web:6d6102dd272742ffc51264",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GED0TZB7JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics (solo si está soportado en el navegador)
let analytics = null;
isSupported().then(supported => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

export { analytics };
export default app;

