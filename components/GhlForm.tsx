"use client";

import Script from "next/script";

/**
 * GrowthHub365 (GoHighLevel) embedded form.
 * The external form_embed.js script auto-resizes the iframe.
 */
export default function GhlForm() {
  return (
    <div className="w-full">
      <iframe
        src="https://api.growthhub365.com/widget/form/ewV6CEDMG7rf7mNvObEN"
        style={{
          width: "100%",
          height: "100%",
          minHeight: 434,
          border: "none",
          borderRadius: "8px",
        }}
        id="inline-ewV6CEDMG7rf7mNvObEN"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Form 12"
        data-height="434"
        data-layout-iframe-id="inline-ewV6CEDMG7rf7mNvObEN"
        data-form-id="ewV6CEDMG7rf7mNvObEN"
        title="Form 12"
      />
      <Script
        src="https://api.growthhub365.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
