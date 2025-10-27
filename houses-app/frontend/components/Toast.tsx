import React, { useEffect } from "react";
"use client";

type ToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  variant?: "success" | "info";
};

export default function Toast({ message, open, onClose, variant = "info" }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, 1800);
    return () => clearTimeout(id);
  }, [open, onClose]);

  if (!open) return null;
  const bg = variant === "success" ? "bg-emerald-600" : "bg-neutral-900";

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <div className={`${bg} text-white px-4 py-2 rounded-md shadow-lg`}>
        {message}
      </div>
    </div>
  );
}