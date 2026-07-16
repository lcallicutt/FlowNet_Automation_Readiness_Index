import Link from "next/link";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-navy-700 shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block text-base font-bold tracking-tight ${dark ? "text-white" : "text-navy-900"}`}>
          FlowNet
        </span>
        <span className={`block text-[10px] font-semibold uppercase tracking-widest ${dark ? "text-teal-300" : "text-teal-600"}`}>
          Automation Readiness Index
        </span>
      </span>
    </Link>
  );
}
