import type { FetchedPage } from "./scanner";

/**
 * Detects automation-relevant signals in fetched HTML.
 *
 * Everything here is evidence-based: each field records what was actually
 * found in the markup, and the vendor lists are named so the audit can tell a
 * visitor *what* it spotted rather than asserting a vague judgement.
 *
 * Limitation worth surfacing to users: this reads server-rendered HTML only,
 * so widgets injected later by JavaScript (common on SPA builders) can be
 * missed. `looksJsRendered` flags pages where that's likely.
 */

interface VendorGroup {
  [vendor: string]: RegExp;
}

const FORM_PROVIDERS: VendorGroup = {
  HubSpot: /hsforms\.(net|com)|js\.hs-scripts\.com/i,
  Mailchimp: /list-manage\.com|chimpstatic\.com|mc\.us\d+\.list-manage/i,
  ConvertKit: /convertkit\.com|ck\.page/i,
  Typeform: /typeform\.com/i,
  Jotform: /jotform\.(com|co)/i,
  "Google Forms": /docs\.google\.com\/forms/i,
  Gravity: /gravityforms|gform_wrapper/i,
  "Contact Form 7": /wpcf7|contact-form-7/i,
  GoHighLevel: /leadconnectorhq\.com|msgsndr\.com/i,
};

const CRM_AUTOMATION: VendorGroup = {
  HubSpot: /js\.hs-scripts\.com|hs-analytics\.net/i,
  ActiveCampaign: /activehosted\.com|prism\.app-us1\.com/i,
  Klaviyo: /klaviyo\.com/i,
  Mailchimp: /chimpstatic\.com|mailchimp\.com/i,
  Drip: /getdrip\.com/i,
  ConvertKit: /convertkit\.com/i,
  GoHighLevel: /leadconnectorhq\.com|msgsndr\.com/i,
  Salesforce: /pardot\.com|salesforce\.com\/embedded/i,
  Brevo: /sendinblue\.com|brevo\.com/i,
};

const BOOKING_PROVIDERS: VendorGroup = {
  Calendly: /calendly\.com/i,
  Acuity: /acuityscheduling\.com|squarespacescheduling\.com/i,
  "GoHighLevel Booking": /leadconnectorhq\.com\/widget\/(booking|appointment)/i,
  Cal: /cal\.com/i,
  YouCanBookMe: /youcanbook\.me/i,
  SimplyBook: /simplybook\.(me|it)/i,
  "Square Appointments": /squareup\.com\/appointments/i,
};

const PAYMENT_PROVIDERS: VendorGroup = {
  Stripe: /js\.stripe\.com|checkout\.stripe\.com/i,
  PayPal: /paypal\.com\/(sdk|donate)|paypalobjects\.com/i,
  Square: /squareup\.com|squarecdn\.com/i,
  Shopify: /shopify\.com|myshopify\.com/i,
  "Tithe.ly": /tithe\.ly/i,
  Donorbox: /donorbox\.org/i,
  Givebutter: /givebutter\.com/i,
  Pushpay: /pushpay\.com/i,
  WooCommerce: /woocommerce/i,
};

const CHAT_WIDGETS: VendorGroup = {
  Intercom: /intercom\.(io|com)/i,
  Drift: /drift\.com|driftt\.com/i,
  "tawk.to": /tawk\.to/i,
  Tidio: /tidio\.(co|com)/i,
  Crisp: /crisp\.chat/i,
  "GoHighLevel Chat": /leadconnectorhq\.com\/widget\/chat/i,
  "Facebook Messenger": /connect\.facebook\.net.*Messenger|fb-customerchat/i,
  Zendesk: /zdassets\.com|zendesk\.com\/embeddable/i,
};

const REVIEW_PLATFORMS: VendorGroup = {
  "Google Reviews": /google\.com\/maps|elfsight.*google-reviews/i,
  Trustpilot: /trustpilot\.com/i,
  Birdeye: /birdeye\.com/i,
  Yotpo: /yotpo\.com/i,
  "Facebook Reviews": /facebook\.com\/.*\/reviews/i,
};

const ANALYTICS: VendorGroup = {
  "Google Analytics": /googletagmanager\.com\/gtag|google-analytics\.com|gtag\(/i,
  "Google Tag Manager": /googletagmanager\.com\/gtm/i,
  "Meta Pixel": /connect\.facebook\.net.*fbevents|fbq\(/i,
  Hotjar: /hotjar\.com/i,
  Clarity: /clarity\.ms/i,
  Plausible: /plausible\.io/i,
  Fathom: /usefathom\.com/i,
};

function detectVendors(html: string, group: VendorGroup): string[] {
  return Object.entries(group)
    .filter(([, pattern]) => pattern.test(html))
    .map(([vendor]) => vendor);
}

/** Action-oriented CTA phrasing, as opposed to "submit" / "click here". */
const CTA_LANGUAGE =
  /\b(book|schedule|get started|get your|start (your|free)|request (a|your)|claim|download|sign up|subscribe|contact us|call now|apply|join|donate|give now|shop now|buy now|order|reserve|free (quote|consultation|trial|demo))\b/i;

const TESTIMONIAL_LANGUAGE =
  /\b(testimonial|what our (clients|customers|members) say|review|rated|5[- ]star|five[- ]star|success stor)/i;

export interface SiteSignals {
  // Lead capture
  formCount: number;
  hasEmailInput: boolean;
  formProviders: string[];
  // CTA
  ctaCount: number;
  buttonCount: number;
  // Follow-up
  crmProviders: string[];
  chatWidgets: string[];
  // Booking / payment
  bookingProviders: string[];
  paymentProviders: string[];
  // Trust
  reviewPlatforms: string[];
  hasReviewSchema: boolean;
  hasTestimonialLanguage: boolean;
  // SEO / technical
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  hasOpenGraph: boolean;
  hasStructuredData: boolean;
  analytics: string[];
  hasViewportMeta: boolean;
  hasResponsiveImages: boolean;
  isHttps: boolean;
  responseTimeMs: number;
  /** Heuristic: little server-rendered text + a JS bundle implies SPA. */
  looksJsRendered: boolean;
}

function textContentLength(html: string): number {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

export function detectSignals(page: FetchedPage): SiteSignals {
  const { html } = page;

  const forms = html.match(/<form\b/gi) ?? [];
  const emailInputs =
    /<input[^>]*type=["']?email/i.test(html) ||
    /<input[^>]*name=["']?[^"'>]*email/i.test(html);

  // Count CTA-flavored anchors and buttons rather than every link on the page.
  const clickables = html.match(/<(a|button)\b[^>]*>[\s\S]{0,120}?<\/\1>/gi) ?? [];
  const ctaCount = clickables.filter((el) =>
    CTA_LANGUAGE.test(el.replace(/<[^>]+>/g, " "))
  ).length;

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
  );

  return {
    formCount: forms.length,
    hasEmailInput: emailInputs,
    formProviders: detectVendors(html, FORM_PROVIDERS),

    ctaCount,
    buttonCount: (html.match(/<button\b/gi) ?? []).length,

    crmProviders: detectVendors(html, CRM_AUTOMATION),
    chatWidgets: detectVendors(html, CHAT_WIDGETS),

    bookingProviders: detectVendors(html, BOOKING_PROVIDERS),
    paymentProviders: detectVendors(html, PAYMENT_PROVIDERS),

    reviewPlatforms: detectVendors(html, REVIEW_PLATFORMS),
    hasReviewSchema: /"@type"\s*:\s*"(Review|AggregateRating)"/i.test(html),
    hasTestimonialLanguage: TESTIMONIAL_LANGUAGE.test(html),

    title: titleMatch ? titleMatch[1].trim().slice(0, 300) || null : null,
    metaDescription: descMatch ? descMatch[1].trim().slice(0, 500) || null : null,
    h1Count: (html.match(/<h1\b/gi) ?? []).length,
    hasOpenGraph: /<meta[^>]+property=["']og:/i.test(html),
    hasStructuredData: /application\/ld\+json/i.test(html),
    analytics: detectVendors(html, ANALYTICS),

    hasViewportMeta: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasResponsiveImages: /<img[^>]+srcset=/i.test(html) || /<picture\b/i.test(html),
    isHttps: page.isHttps,
    responseTimeMs: page.responseTimeMs,

    looksJsRendered:
      textContentLength(html) < 1000 &&
      /<script[^>]+src=[^>]*\.js/i.test(html),
  };
}
