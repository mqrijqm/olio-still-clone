// Ikone koje je nacrtao Codex (gpt-6-sol) u stilu linijskih crteža sa OLIO etikete.
import type { ReactNode, SVGProps } from "react";

const paths: Record<string, ReactNode> = {
  "arrow": (
    <><path d="M6 26c10-2 22-2 35-4"/>
  <path d="M31 13c3 3 6 6 10 9-3 4-6 7-10 11"/></>
  ),
  "cart": (
    <><path d="M11 17h26l-2 25H13l-2-25Z"/>
  <path d="M17 20v-7a7 7 0 0 1 14 0v7"/>
  <path d="M31 22c4-2 7-2 10 0-1 4-4 6-9 5"/>
  <path d="M32 27c2-2 5-4 8-5"/></>
  ),
  "harvest": (
    <><path d="M12 21c-2-2-2-6 1-8s6 0 6 4c0 2-1 4-2 5"/>
  <path d="M20 20c-1-4 1-7 4-7s5 3 4 7"/>
  <path d="M31 22c-2-2-2-6 1-8s6 0 6 4c0 2-1 4-2 5"/>
  <path d="M8 22c9 3 23 3 32 0"/>
  <path d="M9 24c2 7 4 13 7 17 5 2 11 2 16 0 3-4 5-10 7-17"/>
  <path d="M13 29c7 3 15 3 22 0"/>
  <path d="M15 35c6 2 12 2 18 0"/>
  <path d="M19 26c0 5 1 10 2 15"/>
  <path d="M29 26c0 5-1 10-2 15"/></>
  ),
  "koroneiki": (
    <><path d="M25 8c-2 5-2 9-1 13"/>
  <path d="M24 15c-5-4-10-5-14-3 3 4 7 6 13 5"/>
  <path d="M25 13c4-5 8-7 13-7-2 5-6 8-12 9"/>
  <path d="M24 21c-5-1-9 4-9 10 0 6 4 11 9 11s9-5 9-11c0-6-4-11-9-10Z"/></>
  ),
  "oleic": (
    <><path d="M9 32c4-2 5-8 11-8s6 6 12 5c4-.5 5-5 7-8"/>
  <circle cx="9" cy="32" r="2.5"/>
  <circle cx="20" cy="24" r="2.5"/>
  <circle cx="32" cy="29" r="2.5"/>
  <circle cx="39" cy="21" r="2.5"/>
  <path d="M39 19c-1-6 1-10 6-13 1 6-1 10-6 13Z"/></>
  ),
  "origin": (
    <><path d="M24 44c-4-6-14-16-14-25a14 14 0 0 1 28 0c0 9-10 19-14 25Z"/>
  <path d="M17 27c8-2 13-7 15-14-8 1-13 6-15 14Z"/>
  <path d="M18 26c4-4 8-7 13-11"/></>
  ),
  "polyphenols": (
    <><path d="M24 5c-4 8-14 18-14 26a14 14 0 0 0 28 0C38 23 28 13 24 5Z"/>
  <path d="m24 18 7 4v8l-7 4-7-4v-8l7-4Z"/>
  <circle cx="24" cy="18" r="1.25" fill="currentColor" stroke="none"/>
  <circle cx="31" cy="30" r="1.25" fill="currentColor" stroke="none"/>
  <circle cx="17" cy="30" r="1.25" fill="currentColor" stroke="none"/></>
  ),
  "press": (
    <><circle cx="24" cy="19" r="11"/>
  <circle cx="24" cy="19" r="3"/>
  <path d="M11 31c8 2 18 2 26 0l2 4H9l2-4Z"/>
  <path d="M24 35c-1 3-3 5-3 7a3 3 0 0 0 6 0c0-2-2-4-3-7Z"/></>
  ),
  "tin": (
    <><path d="M9 14 31 11l8 5-1 25-22 3-7-5V14Z"/>
  <path d="m9 14 7 5 23-3"/>
  <path d="M16 19v25"/>
  <path d="M31 11v-3h5v4"/>
  <path d="M17 12V8c0-2 2-3 5-3s5 1 5 3v3"/>
  <path d="M21 27c2-2 5-2 7 0-2 4-5 6-7 6-2-2-2-4 0-6Z"/>
  <path d="M22 34c2-4 4-6 7-8"/></>
  ),
  "vitamin-e": (
    <><circle cx="18" cy="24" r="9"/>
  <line x1="18" y1="10" x2="18" y2="7"/>
  <line x1="8" y1="14" x2="6" y2="12"/>
  <line x1="4" y1="24" x2="7" y2="24"/>
  <line x1="8" y1="34" x2="6" y2="36"/>
  <line x1="18" y1="38" x2="18" y2="41"/>
  <line x1="30" y1="24" x2="33" y2="24"/>
  <path d="M13 39c10-5 18-14 24-29"/>
  <path d="M17 36c12 0 19-9 20-26-11 4-18 12-20 26Z"/></>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 24, ...rest }: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
