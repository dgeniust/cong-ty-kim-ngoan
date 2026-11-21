import type { Stat } from "@/lib/hub/home";
import { HUB_STATS_LABEL } from "@/lib/content/hub-home";
import { cn } from "@/lib/utils";
import { HUB_WRAP } from "./ui";

/** Thẻ số liệu nổi lên mép dưới hero. */
export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label={HUB_STATS_LABEL} className={cn(HUB_WRAP, "relative z-10 -mt-20 md:-mt-16")}>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-hub-canvas shadow-[0_12px_40px_rgba(30,45,25,0.08)] lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <li key={label} className="flex items-center gap-4 bg-hub-paper p-5 sm:p-6 lg:p-7">
            <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-hub-blue-tint text-hub-blue sm:grid">
              <Icon className="size-6" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-none tracking-tight tabular-nums text-hub-ink">{value}</span>
              <span className="mt-1.5 block text-small leading-snug text-hub-ink-soft">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
