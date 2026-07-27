import { BOOKING_URL } from "@/lib/config";

interface BookingLinkProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * CTA that routes to the FlowNet consultation booking calendar.
 * Opens in a new tab so visitors keep their results page. Replace with
 * Stripe checkout later where an instant purchase is wanted.
 */
export default function BookingLink({ className = "btn-primary", children }: BookingLinkProps) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} w-full`}
    >
      {children}
    </a>
  );
}
