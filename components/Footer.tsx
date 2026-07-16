import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-navy-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
            Know what to automate before you automate. FlowNet helps churches,
            small businesses, nonprofits, and solo founders find the systems
            that save the most time.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Tools</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/assessment" className="hover:text-teal-300">Automation Readiness Index</Link></li>
            <li><Link href="/audit" className="hover:text-teal-300">Website Automation Audit</Link></li>
            <li><Link href="/dashboard" className="hover:text-teal-300">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/pricing" className="hover:text-teal-300">Pricing</Link></li>
            <li><Link href="/pricing" className="hover:text-teal-300">Book a Strategy Session</Link></li>
            <li><Link href="/" className="hover:text-teal-300">About FlowNet</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800 py-5 text-center text-xs text-navy-400">
        © {new Date().getFullYear()} FlowNet Automation. All rights reserved.
      </div>
    </footer>
  );
}
