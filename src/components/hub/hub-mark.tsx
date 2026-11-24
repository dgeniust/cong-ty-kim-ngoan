/** Square brand mark: "K" stroke plus one dot per sector colour. Decorative (aria-hidden). */
export function HubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <rect width="48" height="48" rx="12" className="fill-hub-ink" />
      <path
        d="M14 12v24M14 24l12-12M14 24l12 12"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="34" cy="14" r="4" className="fill-sector-phanbon" />
      <circle cx="34" cy="24" r="4" className="fill-sector-lopxe" />
      <circle cx="34" cy="34" r="4" className="fill-sector-satthep" />
    </svg>
  );
}
