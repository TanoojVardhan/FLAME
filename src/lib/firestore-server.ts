// Firestore write utility for server actions
import { initializeApp, applicationDefault, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseConfig = {
  credential: applicationDefault(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

const app = getFirebaseAdmin();
const db = getFirestore(app);

export async function saveFlamesSubmission({ name1, name2, feeling, result, explanation }: { name1: string; name2: string; feeling?: string; result: string; explanation: string }) {
  try {
    await db.collection('flames_submissions').add({
      name1,
      name2,
      ...(feeling ? { feeling } : {}),
      result,
      explanation,
      createdAt: new Date(),
    });
  } catch (e) {
    // Ignore Firestore errors for user experience
    console.error('Firestore write error:', e);
  }
}
