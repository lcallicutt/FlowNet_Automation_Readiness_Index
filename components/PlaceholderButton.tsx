"use client";

import { useState } from "react";

type Kind = "stripe" | "pdf" | "booking";

const MESSAGES: Record<Kind, string> = {
  stripe: "Stripe checkout coming soon — this button will start a secure payment.",
  pdf: "PDF reports are coming soon — this button will download your full report.",
  booking: "Consultation booking is coming soon — this button will open the FlowNet calendar.",
};

interface PlaceholderButtonProps {
  kind: Kind;
  className?: string;
  children: React.ReactNode;
}

/**
 * Placeholder for Stripe checkout / PDF generation / booking integrations.
 * Replace onClick with the real integration when it's connected.
 */
export default function PlaceholderButton({ kind, className = "btn-primary", children }: PlaceholderButtonProps) {
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className={`${className} w-full`}
        onClick={() => {
          setShowNote(true);
          setTimeout(() => setShowNote(false), 3200);
        }}
      >
        {children}
      </button>
      {showNote && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-lg bg-navy-900 px-4 py-3 text-center text-xs font-medium text-white shadow-lift">
          {MESSAGES[kind]}
        </div>
      )}
    </div>
  );
}
