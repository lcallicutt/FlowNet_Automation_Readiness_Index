import type { Metadata } from "next";
import GhlForm from "@/components/GhlForm";

export const metadata: Metadata = {
  title: "Book a FlowNet Automation Consultation",
  description:
    "Request a FlowNet Automation strategy session. Tell us about your business and we'll map out what to automate first.",
};

export default function BookPage() {
  return (
    <div className="bg-navy-50/60 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="eyebrow">Work With FlowNet</span>
          <h1 className="section-title">Book a FlowNet Automation Consultation</h1>
          <p className="mt-3 text-navy-600">
            Tell us a little about your business and we&apos;ll reach out to
            schedule your strategy session — a clear plan for what to automate
            first, built around your readiness score.
          </p>
        </div>

        <div className="card !p-4 sm:!p-6">
          <GhlForm />
        </div>

        <ul className="mx-auto mt-8 grid max-w-lg gap-2 text-sm text-navy-600 sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <span className="text-teal-500">✓</span> 60-minute session
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-500">✓</span> Custom roadmap
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-500">✓</span> Tool recommendations
          </li>
        </ul>
      </div>
    </div>
  );
}
