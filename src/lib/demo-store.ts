import { saveFlamesSubmission } from "@/lib/firestore-server";

// Demo function to create and store a sample flames submission
async function createDemoSubmission() {
  await saveFlamesSubmission({
    name1: "Alice",
    name2: "Bob",
    result: "Friends",
    explanation: "Alice and Bob are friends according to the FLAMES algorithm."
  });
}

// Run the demo when this script is executed
createDemoSubmission().then(() => {
  console.log("Demo submission stored in Firestore.");
});
