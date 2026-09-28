/**
 * Motion Tokens & Constants
 * Aura Chemicals - Premium B2B Pharmaceutical & Chemical Motion Architecture
 *
 * Strict Motion Constraints:
 * - Ease: cubic-bezier(0.22, 1, 0.36, 1) - calm, mechanical, high-precision industrial deceleration
 * - Durations: fast 150ms / base 250ms / slow 400ms / hairline 500ms / image 900ms
 * - Reveal offset: 16px (subtle, no bouncy or floaty displacement)
 * - Stagger: 60ms, capped at index 6 (remaining items reveal together)
 * - Viewport: once: true, amount: 0.2
 * - Prefers-reduced-motion: 0px displacement, opacity only, max 150ms
 */

export const MOTION_TOKENS = {
  duration: {
    fast: 0.15,
    base: 0.25,
    slow: 0.40,
    hairline: 0.50,
    image: 0.90,
  },
  ease: [0.22, 1, 0.36, 1] as const,
  offset: {
    y: 16,
    heroY: 12,
  },
  stagger: 0.06,
  staggerCap: 6,
  viewport: {
    once: true,
    amount: 0.2,
  },
} as const;

/**
 * Standard transition presets using Framer Motion syntax
 */
export const transitions = {
  fast: {
    duration: MOTION_TOKENS.duration.fast,
    ease: MOTION_TOKENS.ease,
  },
  base: {
    duration: MOTION_TOKENS.duration.base,
    ease: MOTION_TOKENS.ease,
  },
  slow: {
    duration: MOTION_TOKENS.duration.slow,
    ease: MOTION_TOKENS.ease,
  },
  hairline: {
    duration: MOTION_TOKENS.duration.hairline,
    ease: MOTION_TOKENS.ease,
  },
  image: {
    duration: MOTION_TOKENS.duration.image,
    ease: MOTION_TOKENS.ease,
  },
  reduced: {
    duration: MOTION_TOKENS.duration.fast,
    ease: 'linear' as const,
  },
};

/**
 * Helper to get staggered delay capped at index 6
 */
export function getStaggerDelay(index: number, baseDelay: number = 0): number {
  const effectiveIndex = Math.min(index, MOTION_TOKENS.staggerCap);
  return baseDelay + effectiveIndex * MOTION_TOKENS.stagger;
}
