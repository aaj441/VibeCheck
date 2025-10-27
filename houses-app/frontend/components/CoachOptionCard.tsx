"use client";

import React from "react";

export type CoachOption = {
  title: string;
  script: string;
  why: string;
  vibe: string;
  risk: string;
  followUp: string;
  texting?: string;
  inPerson?: string;
};

export default function CoachOptionCard({
  option,
  onCopy,
}: {
  option: CoachOption;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{option.title}</h3>
        <button
          onClick={() => onCopy(option.script)}
          className="inline-flex items-center rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 transition"
          aria-label="Copy script"
        >
          Copy
        </button>
      </div>
      <p className="mt-2 text-neutral-800 leading-relaxed">{option.script}</p>
      <div className="mt-3 grid gap-1 text-sm text-neutral-600">
        <p><span className="font-medium text-neutral-800">Why:</span> {option.why}</p>
        <p><span className="font-medium text-neutral-800">Vibe:</span> {option.vibe}</p>
        <p><span className="font-medium text-neutral-800">Risk:</span> {option.risk}</p>
        <p><span className="font-medium text-neutral-800">Follow-up:</span> {option.followUp}</p>
        {option.texting && (
          <p className="mt-1"><span className="font-medium text-neutral-800">Texting tweak:</span> {option.texting}</p>
        )}
        {option.inPerson && (
          <p className="mt-1"><span className="font-medium text-neutral-800">In‑person tweak:</span> {option.inPerson}</p>
        )}
      </div>
    </div>
  );
}