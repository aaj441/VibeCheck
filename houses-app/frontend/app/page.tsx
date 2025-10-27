import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold tracking-tight">Houses — Conversation Coach</h1>
      <p className="mt-3 text-neutral-600">
        A gentle, neurodivergent-friendly guide for awkward or romantic moments. Share your context and a first thought, and get four ways to respond—playful, curious, sincere, and direct.
      </p>
      <div className="mt-6">
        <Link
          href="/conversation-coach"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 transition"
        >
          Open Conversation Coach
        </Link>
      </div>
    </main>
  );
}