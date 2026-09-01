
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseProvider } from './provider';
import type { ReactNode } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyCctSHf8ygo1lwd8ut36-arEhFNR76bXlM",
  authDomain: "gespark-e743a.firebaseapp.com",
  projectId: "gespark-e743a",
  storageBucket: "gespark-e743a.appspot.com",
  messagingSenderId: "721086523981",
  appId: "1:721086523981:web:59af1e85b3b5373ac50a04",
  measurementId: "G-WRL5NYF97D"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
