"use client";

import { useMemo } from "react";
import { ChevronDown, Globe2 } from "lucide-react";
import { getUtcOffsetLabel } from "@/lib/availability";

const FALLBACK_ZONES = [
  "UTC",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Nairobi",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/New_York",
  "America/Sao_Paulo",
  "America/Toronto",
  "Asia/Dhaka",
  "Asia/Dubai",
  "Asia/Jakarta",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Kuala_Lumpur",
  "Asia/Riyadh",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Europe/Berlin",
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Moscow",
  "Europe/Paris",
  "Pacific/Auckland",
];

function listTimeZones(): string[] {
  const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
  try {
    if (typeof intl.supportedValuesOf === "function") {
      const zones = intl.supportedValuesOf("timeZone");
      if (zones.length) return zones;
    }
  } catch {
    // fall through to the static list
  }
  return FALLBACK_ZONES;
}

interface TimeZoneSelectProps {
  value: string;
  onChange: (timeZone: string) => void;
}

export function TimeZoneSelect({ value, onChange }: TimeZoneSelectProps) {
  const options = useMemo(() => {
    const zones = listTimeZones();
    const all = zones.includes(value) ? zones : [value, ...zones];
    return all.map((zone) => ({
      value: zone,
      label: `${zone.replace(/_/g, " ")} (${getUtcOffsetLabel(zone)})`,
    }));
  }, [value]);

  return (
    <label className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-2.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus-within:ring-2 focus-within:ring-theme_primary/40">
      <Globe2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <span className="sr-only">Show times in timezone</span>
      <span className="relative flex min-w-0 items-center">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="max-w-[190px] cursor-pointer appearance-none truncate bg-transparent pr-5 outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-slate-400" />
      </span>
    </label>
  );
}
