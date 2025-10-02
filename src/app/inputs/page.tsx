// This page displays all inputs received in the current session/request.
// No data is persisted or kept after navigation.

import React from 'react';

const getInputsFromQuery = (searchParams: URLSearchParams) => {
  const entries: [string, string][] = [];
  for (const [key, value] of searchParams.entries()) {
    entries.push([key, value]);
  }
  return entries;
};

export default function InputsPage({ searchParams }: { searchParams: { [key: string]: string | string[] } }) {
  // Convert searchParams to entries for display
  const entries = Object.entries(searchParams);

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submitted Inputs</h1>
      {entries.length === 0 ? (
        <p>No inputs found in this request.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map(([key, value]) => (
            <li key={key} className="border-b pb-2">
              <span className="font-semibold">{key}:</span> {Array.isArray(value) ? value.join(', ') : value}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export const dynamic = 'force-dynamic'; // Ensure this page is always rendered fresh
