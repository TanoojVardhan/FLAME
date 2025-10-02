
// import { db } from "@/lib/firebase";
// import { collection, addDoc, getDocs } from "firebase/firestore";
import { saveDemoSubmission } from "@/lib/firestore-demo-server";


// Add a demo document to Firestore (server-side)
export async function addDemo() {
  'use server';
  await saveDemoSubmission({
    name1: "Alice",
    name2: "Bob",
    result: "Fling",
    explanation: "Alice and Bob have a short-term fling according to the FLAMES algorithm."
  });
}

// Add James and Amy to Firestore (server-side)
export async function addJamesAndAmy() {
  'use server';
  await saveDemoSubmission({
    name1: "James",
    name2: "Amy",
    result: "Fling",
    explanation: "James and Amy have a passionate fling according to the FLAMES algorithm."
  });
}

// Fetch all demo documents from Firestore (client-side)
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
export async function fetchDemos() {
  const querySnapshot = await getDocs(collection(db, "flames_demo"));
  return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}
