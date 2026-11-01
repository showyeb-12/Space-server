export const SITE_NAME = "StudioSpace";
export const SITE_TAGLINE = "Creative spaces, booked beautifully.";

export const THEME_STORAGE_KEY = "studiospace-theme";

export const THEME_SCRIPT = `(function(){try{var key='${THEME_STORAGE_KEY}';var stored=localStorage.getItem(key);var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=stored==='studiodark'||stored==='studiolight'?stored:(dark?'studiodark':'studiolight');document.documentElement.setAttribute('data-theme',theme);}catch(error){}})();`;

export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;

export type StudioCategory = (typeof STUDIO_CATEGORIES)[number];

export const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
] as const;

export const CATEGORY_DESCRIPTIONS: Record<StudioCategory, string> = {
  "Photo Studio": "Daylight lofts, cycloramas, and prop rooms.",
  "Film Stage": "Open stages, blackout rooms, and production corners.",
  "Podcast Lounge": "Treatments, mics, and rooms that sound right.",
  "Music Suite": "Rehearsal rooms, writing desks, and live-ready gear.",
  Workshop: "Flexible tables, natural light, and room to make.",
};
