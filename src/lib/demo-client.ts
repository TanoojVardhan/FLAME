
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";


// Add a demo document to Firestore (client-side)
export async function addDemo() {
  await addDoc(collection(db, "flames_demo"), {
    name1: "Alice",
    name2: "Bob",
    result: "Friends",
    explanation: "Alice and Bob are friends according to the FLAMES algorithm.",
    createdAt: new Date(),
  });
}

// Add James and Amy to Firestore (client-side)
export async function addJamesAndAmy() {
  await addDoc(collection(db, "flames_demo"), {
    name1: "James",
    name2: "Amy",
    result: "Affection",
    explanation: "James and Amy are affectionate according to the FLAMES algorithm.",
    createdAt: new Date(),
  });
}

// Fetch all demo documents from Firestore (client-side)
export async function fetchDemos() {
  const querySnapshot = await getDocs(collection(db, "flames_demo"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
