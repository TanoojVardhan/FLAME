"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FlamesFormPage() {
  const [myName, setMyName] = useState("");
  const [theirName, setTheirName] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    // Save to Firestore
    await addDoc(collection(db, "flames_results"), {
      myName,
      theirName,
      summary,
      createdAt: new Date(),
    });
    setLoading(false);
    setSuccess(true);
    setMyName("");
    setTheirName("");
    setSummary("");
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">FLAMES Submission</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">My Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={myName}
            onChange={e => setMyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Their Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={theirName}
            onChange={e => setTheirName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Summary Output</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {success && <p className="text-green-600 mt-2">Submission saved!</p>}
      </form>
    </div>
  );
}
