/** Class names for the no-JS / pre-hydration track <select>.
 *  `flex` must not win over the HTML `hidden` attribute (E-21): when the
 *  control is hidden, use Tailwind `hidden` and `[&[hidden]]:hidden` so
 *  display:none beats display:flex. */
export const WAITLIST_JS_TRACK_CLASS = "waitlist-js-track";

const NATIVE_SELECT_BASE =
  "h-12 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-base text-foreground shadow-sm transition-[color,background-color,border-color,box-shadow] duration-200 ease-out [&[hidden]]:hidden";

export function waitlistNativeSelectClass(hydrated: boolean): string {
  return `${NATIVE_SELECT_BASE} ${hydrated ? "hidden" : "flex"}`;
}

export function waitlistRadixTrackProps(hydrated: boolean): {
  className: string;
  hidden: boolean;
  "aria-hidden": boolean;
} {
  return {
    className: WAITLIST_JS_TRACK_CLASS,
    hidden: !hydrated,
    "aria-hidden": !hydrated,
  };
}

export function waitlistNativeSelectProps(
  hydrated: boolean,
  idPrefix: string,
): {
  id: string;
  name: "track";
  hidden: boolean;
  "aria-hidden": boolean;
  tabIndex: number | undefined;
  className: string;
} {
  return {
    id: hydrated ? `${idPrefix}-track-native` : `${idPrefix}-track`,
    name: "track",
    hidden: hydrated,
    "aria-hidden": hydrated,
    tabIndex: hydrated ? -1 : undefined,
    className: waitlistNativeSelectClass(hydrated),
  };
}
