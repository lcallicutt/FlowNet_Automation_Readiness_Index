/**
 * FlowNet Automation consultation booking calendar (GrowthHub365).
 * All paid-upgrade and consultation CTAs route here until Stripe
 * checkout is built.
 */
export const BOOKING_URL =
  "https://api.growthhub365.com/widget/booking/UjrHn0RU4NZstAw53cYW";

/**
 * Paid tier checkout links.
 *
 * TODO: these are PLACEHOLDERS, not live payment links. Replace each with the
 * real checkout URL before the pricing page sees traffic. Every button using
 * them opens in a new tab, so a wrong value sends a buyer off site silently
 * rather than throwing anything visible.
 */
export const DEEP_DIVE_AUDIT_PAYMENT_URL = "[DEEP_DIVE_AUDIT_PAYMENT_URL]";
export const STRATEGY_SESSION_PAYMENT_URL = "[STRATEGY_SESSION_PAYMENT_URL]";
export const CARE_PLAN_PAYMENT_URL = "[CARE_PLAN_PAYMENT_URL]";
