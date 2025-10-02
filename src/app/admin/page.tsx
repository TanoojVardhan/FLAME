"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface FlamesEntry {
  id: string;
  name1: string;
  name2: string;
  result: string;
  explanation: string;
  createdAt?: { seconds: number; nanoseconds: number } | Date;
}

export default function FlamesAdminPage() {
  const [entries, setEntries] = useState<FlamesEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      const q = query(collection(db, "flames_results"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FlamesEntry[];
      setEntries(data);
      setLoading(false);
    }
    fetchEntries();
  }, []);

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">FLAMES Admin Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="border rounded p-4">
              <div className="font-semibold text-lg mb-1">
                {entry.name1} &amp; {entry.name2}
              </div>
              <div className="mb-1">
                <span className="font-bold">Result:</span> {entry.result}
              </div>
              <div className="mb-1">
                <span className="font-bold">Explanation:</span> {entry.explanation}
              </div>
              <div className="text-xs text-muted-foreground">
                {entry.createdAt &&
                  (entry.createdAt instanceof Date
                    ? entry.createdAt.toLocaleString()
                    : new Date(
                        (entry.createdAt as any).seconds * 1000
                      ).toLocaleString())}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
