"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * prefers-reduced-motion without hydration mismatches.
 * The server cannot know the visitor's setting, so the first client render must match the
 * server (no preference). The real value applies right after hydration.
 */
export function useReducedMotionSafe(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!reduce : false;
}
