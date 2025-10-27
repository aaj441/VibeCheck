import React, { useMemo, useState } from "react";
import Toast from "./Toast";
import CoachOptionCard, { CoachOption } from "./CoachOptionCard";

type Medium = "text" | "in-person";
type Goal = "connect" | "clarify" | "boundary" | "ask-out";
type Energy = "low" | "medium" | "high";

type Context = {
  medium: Medium;
  goal: Goal;
  energy: Energy;
  avoid?: string;
};

function tweakForMedium(line: string, medium: Medium, energy: Energy) {
  if (medium === "text") {
    const emoji = energy === "high" ? " 🙂" : energy === "medium" ? " 🙂" : "";
    return line.replaceAll("—", "-") + (emoji ? emoji : "");
  }
  return line;
}

function makeOptions(ctx: Context, firstThoughtRaw: string): CoachOption[] {
  const firstThought = firstThoughtRaw.trim() || "car engines";
  const avoid = ctx.avoid?.trim();
  const avoidNote = avoid ? ` (let's skip ${avoid})` : "";

  const playfulScript = tweakForMedium(
    `Plot twist: I’m not great at small talk, but I can nerd out about ${firstThought}—want to trade fun facts?`,
    ctx.medium,
    ctx.energy
  );

  const curiousScript = tweakForMedium(
    `Random thought—do you enjoy learning how things work? I get curious about ${firstThought}. What grabs your attention lately?`,
    ctx.medium,
    ctx.energy
  );

  const sincereScript = tweakForMedium(
    `I get a bit awkward sometimes. Cozy topics help—${firstThought} calms me. What feels cozy for you?`,
    ctx.medium,
    ctx.energy
  );

  const directBase =
    ctx.goal === "boundary"
      ? `I’m not up for that topic${avoidNote}—can we switch to something lighter or mutual?`
      : ctx.goal === "ask-out"
      ? `I’d like to take you out. Let’s pick something we both enjoy—${firstThought} for me; what’s yours?`
      : `I’d love to hear what lights you up—can we choose a topic we both enjoy? ${firstThought} for me; what’s yours?`;

  const directScript = tweakForMedium(directBase, ctx.medium, ctx.energy);

  const textingTweak =
    ctx.medium === "text"
      ? "Keep lines short; soften punctuation; one emoji max."
      : undefined;

  const inPersonTweak =
    ctx.medium === "in-person"
      ? "Gentle voice, comfortable pacing; relaxed eye contact if it feels good."
      : undefined;

  return [
    {
      title: "1) Playful weave‑in",
      script: playfulScript,
      why: "Turns a pause into shared play; invites reciprocity with light flirt if comfy.",
      vibe: "Playful, gently flirty",
      risk: "Low",
      followUp: "Your turn—what’s a weird skill you have?",
      texting: textingTweak,
      inPerson: inPersonTweak,
    },
    {
      title: "2) Curious bridge",
      script: curiousScript,
      why: "Invites their preferences; shows attentiveness without pressure.",
      vibe: "Curious, warm",
      risk: "Low–Medium",
      followUp: "What’s something you’ve gotten nerdy about lately?",
      texting: textingTweak,
      inPerson: inPersonTweak,
    },
    {
      title: "3) Sincere + cozy",
      script: sincereScript,
      why: "Normalizes awkwardness; fosters intimacy with gentle tone.",
      vibe: "Sincere, softly sensual",
      risk: "Medium",
      followUp: "Is there a topic that feels cozy for you?",
      texting: textingTweak,
      inPerson: inPersonTweak,
    },
    {
      title: "4) Direct ask / boundary",
      script: directScript,
      why: "Clear intention and consent-forward choice.",
      vibe: "Direct, respectful",
      risk: "Medium–Higher",
      followUp:
        ctx.goal === "ask-out"
          ? "If not this weekend, what’s a better time?"
          : "Want to trade two minutes each?",
      texting: textingTweak,
      inPerson: inPersonTweak,
    },
  ];
}

export default function ConversationCoach() {
  const [medium, setMedium] = useState<Medium>("in-person");
  const [goal, setGoal] = useState<Goal>("connect");
  const [energy, setEnergy] = useState<Energy>("medium");
  const [avoid, setAvoid] = useState<string>("");
  const [firstThought, setFirstThought] = useState<string>("");
  const [options, setOptions] = useState<CoachOption[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("Generated 4 options");

  const ctx: Context = useMemo(
    () => ({ medium, goal, energy, avoid }),
    [medium, goal, energy, avoid]
  );

  const generate = () => {
    const result = makeOptions(ctx, firstThought);
    setOptions(result);
    setToastMsg("Generated 4 options");
    setToastOpen(true);
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setToastMsg("Copied to clipboard");
      setToastOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold tracking-tight">Conversation Coach</h1>
      <p className="mt-2 text-neutral-600">
        Share your context and a first thought. Hitch will offer four pro‑social options—playful, curious, sincere, and direct—with a gentle, sensual tone when it fits.
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-neutral-800">Medium</label>
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value as Medium)}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
            >
              <option value="text">Text</option>
              <option value="in-person">In‑person</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
            >
              <option value="connect">Connect</option>
              <option value="clarify">Clarify</option>
              <option value="boundary">Boundary</option>
              <option value="ask-out">Ask out</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">Energy</label>
            <select
              value={energy}
              onChange={(e) => setEnergy(e.target.value as Energy)}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">Topics to avoid (optional)</label>
            <input
              value={avoid}
              onChange={(e) => setAvoid(e.target.value)}
              placeholder="e.g., politics"
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-neutral-800">First thought</label>
            <textarea
              value={firstThought}
              onChange={(e) => setFirstThought(e.target.value)}
              placeholder="e.g., car engines"
              rows={3}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 transition"
          >
            Generate 4 options
          </button>
        </div>
      </div>

      {options.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {options.map((opt) => (
            <CoachOptionCard key={opt.title} option={opt} onCopy={handleCopy} />
          ))}
        </div>
      )}

      <Toast message={toastMsg} open={toastOpen} onClose={() => setToastOpen(false)} />
    </div>
  );
}