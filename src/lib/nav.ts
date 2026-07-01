// Route map — design prototype hashes → production routes.
// Mirrors design_handoff/IMPLEMENTATION_PLAN.md §3 (Route map).

export const routes = {
  home: "/",
  how: "/how-it-works",
  quality: "/quality",
  gallery: "/gallery",
  faq: "/faq",
  contact: "/contact",
  cart: "/cart",
  tracking: "/track",
  program: "/creators",
  apply: "/creators/apply",
  claim: "/support/claim",
  shipping: "/legal/shipping",
  returns: "/legal/returns",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  rights: "/legal/content-rights",
  agreement: "/legal/creator-agreement",
} as const;

// Primary top-nav (design: How It Works · Quality · Gallery · FAQ)
export const topNav = [
  { label: "How It Works", href: routes.how },
  { label: "Quality", href: routes.quality },
  { label: "Gallery", href: routes.gallery },
  { label: "FAQ", href: routes.faq },
] as const;

export const footerNav = {
  explore: [
    { label: "How It Works", href: routes.how },
    { label: "Quality", href: routes.quality },
    { label: "Gallery", href: routes.gallery },
    { label: "FAQ", href: routes.faq },
  ],
  support: [
    { label: "Contact", href: routes.contact },
    { label: "Shipping", href: routes.shipping },
    { label: "Track an order", href: routes.tracking },
    { label: "Returns", href: routes.returns },
    { label: "Report an issue", href: routes.claim },
  ],
  company: [
    { label: "Creator Program", href: routes.program },
    { label: "Privacy", href: routes.privacy },
    { label: "Terms", href: routes.terms },
    { label: "Content & Image Rights", href: routes.rights },
    { label: "Creator Agreement", href: routes.agreement },
  ],
} as const;
