import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Client Firebase Configuration using the VectorAI project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyVectorAIPlatform2026',
  authDomain: 'vectorai-506214.firebaseapp.com',
  projectId: 'vectorai-506214',
  storageBucket: 'vectorai-506214.appspot.com',
  messagingSenderId: '1095732803414',
  appId: '1:1095732803414:web:vectorai506214machine'
};

// Initialize Firebase safely (prevent duplicate initializations)
let app: FirebaseApp;
let db: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization note:', error);
  // Re-attempt fallback initialization
  app = initializeApp(firebaseConfig, 'vectorai-fallback');
  db = getFirestore(app);
}

export { app, db };
