"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  SCALE_LABELS,
  calculateResults,
} from "@/lib/assessment";
import { saveAssessment, saveUser } from "@/lib/storage";

const BUSINESS_TYPES = [
  "Church / Ministry",
  "Small Business",
  "Nonprofit",
  "Coach / Consultant",
  "Solo Founder / Creator",
  "Local Service Provider",
  "Other",
];

export default function AssessmentPage() {
  const router = useRouter();
  // Steps 0..9 are categories; step 10 is the email capture step.
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = CATEGORIES.length + 1;
  const isEmailStep = step === CATEGORIES.length;
  const category = isEmailStep ? null : CATEGORIES[step];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const stepComplete = isEmailStep
    ? /.+@.+\..+/.test(email)
    : category!.questions.every((q) => answers[q.id] !== undefined);

  function selectAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setError("");
  }

  function next() {
    if (!stepComplete) {
      setError(
        isEmailStep
          ? "Please enter a valid email address to see your results."
          : "Please answer all three questions before continuing."
      );
      return;
    }
    setError("");
    if (isEmailStep) {
      submit();
    } else {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    setError("");
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function submit() {
    setSubmitting(true);
    const result = calculateResults(answers, email, businessType);
    saveAssessment(result);
    saveUser({ email });
    router.push("/results");
  }

  const progress = Math.round(
    ((isEmailStep ? 30 : answeredCount) / 30) * 100
  );

  return (
    <div className="bg-navy-50/60 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-navy-900">
              {isEmailStep
                ? "Almost done!"
                : `Step ${step + 1} of ${totalSteps}: ${category!.name}`}
            </span>
            <span className="font-medium text-navy-500">{progress}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-navy-100">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!isEmailStep && category ? (
          <div className="card !p-6 sm:!p-8">
            <div className="mb-6">
              <span className="text-3xl">{category.icon}</span>
              <h1 className="mt-2 text-2xl font-bold text-navy-900">{category.name}</h1>
              <p className="mt-1 text-sm text-navy-500">{category.description}</p>
            </div>

            <div className="space-y-8">
              {category.questions.map((q, qi) => (
                <fieldset key={q.id}>
                  <legend className="text-sm font-semibold leading-relaxed text-navy-800">
                    {qi + 1}. {q.text}
                  </legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-5">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const selected = answers[q.id] === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => selectAnswer(q.id, value)}
                          className={`rounded-lg border px-2 py-2.5 text-center transition ${
                            selected
                              ? "border-teal-500 bg-teal-50 ring-2 ring-teal-200"
                              : "border-navy-200 bg-white hover:border-teal-300"
                          }`}
                        >
                          <span
                            className={`block text-lg font-bold ${
                              selected ? "text-teal-600" : "text-navy-900"
                            }`}
                          >
                            {value}
                          </span>
                          <span className="mt-0.5 block text-[10px] font-medium leading-tight text-navy-500">
                            {SCALE_LABELS[value]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        ) : (
          <div className="card !p-6 sm:!p-8">
            <span className="text-3xl">🎉</span>
            <h1 className="mt-2 text-2xl font-bold text-navy-900">
              Your results are ready
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              Tell us where to associate your report. You&apos;ll see your score
              immediately on the next screen.
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div>
                <label htmlFor="businessType" className="label">What best describes you?</label>
                <select
                  id="businessType"
                  className="input"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-navy-400">
                We&apos;ll use your email to save your results. No spam — ever.
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn-secondary disabled:invisible"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={submitting}
            className="btn-primary !px-8"
          >
            {isEmailStep
              ? submitting
                ? "Calculating…"
                : "See My Results →"
              : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
