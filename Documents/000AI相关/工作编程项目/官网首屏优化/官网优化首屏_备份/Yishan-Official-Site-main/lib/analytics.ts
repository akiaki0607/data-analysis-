// Google Analytics utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for tracking
export const trackContactFormSubmit = (company: string) => {
  event({
    action: "submit",
    category: "Contact Form",
    label: company,
  });
};

export const trackBlogView = (slug: string) => {
  event({
    action: "view",
    category: "Blog",
    label: slug,
  });
};

export const trackCaseStudyView = (id: string) => {
  event({
    action: "view",
    category: "Case Study",
    label: id,
  });
};

export const trackCTAClick = (location: string) => {
  event({
    action: "click",
    category: "CTA",
    label: location,
  });
};

