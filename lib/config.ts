/**
 * FlowNet Automation consultation booking calendar (GrowthHub365).
 * All paid-upgrade and consultation CTAs route here until Stripe
 * checkout is built.
 */
export const BOOKING_URL =
  "https://api.growthhub365.com/widget/booking/UjrHn0RU4NZstAw53cYW";

/**
 * Paid tier checkout links (GrowthHub365 payment links).
 *
 * The Care Plan and Strategy Session ids differ by only a few characters, so
 * check the full id when changing either one.
 */
export const DEEP_DIVE_AUDIT_PAYMENT_URL =
  "https://api.growthhub365.com/payment-link/6a99715da7f78e147447ea55";
export const STRATEGY_SESSION_PAYMENT_URL =
  "https://api.growthhub365.com/payment-link/6a9971a3ceb12d9fc1a8ad4e";
export const CARE_PLAN_PAYMENT_URL =
  "https://api.growthhub365.com/payment-link/6a9971d3ceb12d9fc1a8ad50";
