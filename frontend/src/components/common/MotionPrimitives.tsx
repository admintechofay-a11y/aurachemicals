import React, { useEffect, useState, useRef } from 'react';
import {
  LazyMotion,
  m,
  useReducedMotion,
  useInView,
} from 'framer-motion';
import { MOTION_TOKENS, transitions, getStaggerDelay } from '../../utils/motion';

const loadFeatures = () => import('../../utils/motionFeatures').then((res) => res.default);

/**
 * LazyMotion Provider to bundle only domAnimation features asynchronously
 */
export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
};

/**
 * Technical Hairline Draw Primitive
 * Signature motion: thin 1px accent line that draws in from left (scaleX 0 -> 1, 500ms, once)
 */
export interface LineDrawProps {
  width?: string | number;
  height?: number;
  color?: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LineDraw: React.FC<LineDrawProps> = ({
  width = '100%',
  height = 1,
  color = 'var(--color-accent)',
  delay = 0,
  className,
  style,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.8 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={MOTION_TOKENS.viewport}
      transition={
        shouldReduceMotion
          ? transitions.reduced
          : {
              duration: MOTION_TOKENS.duration.hairline,
              ease: MOTION_TOKENS.ease,
              delay,
            }
      }
      style={{
        width,
        height,
        backgroundColor: color,
        transformOrigin: 'left center',
        display: 'block',
        ...style,
      }}
    />
  );
};

/**
 * Standard Element Reveal Primitive
 * Smooth 16px entrance fade (or LCP-safe immediate reveal)
 */
export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  immediate?: boolean; // When true (for LCP/H1), starts visible and does not block first paint
  className?: string;
  style?: React.CSSProperties;
  as?: any;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  duration = MOTION_TOKENS.duration.slow,
  yOffset = MOTION_TOKENS.offset.y,
  immediate = false,
  className,
  style,
  as: Component = m.div,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If immediate (for H1 / LCP elements), keep opacity 1 at initial render with a subtle 12px rise
  if (immediate) {
    return (
      <Component
        className={className}
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0.9, y: MOTION_TOKENS.offset.heroY }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? transitions.reduced
            : {
                duration: MOTION_TOKENS.duration.base,
                ease: MOTION_TOKENS.ease,
                delay,
              }
        }
        style={style}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={MOTION_TOKENS.viewport}
      transition={
        shouldReduceMotion
          ? transitions.reduced
          : {
              duration,
              ease: MOTION_TOKENS.ease,
              delay,
            }
      }
      style={style}
    >
      {children}
    </Component>
  );
};

/**
 * Staggered Group Reveal Primitive
 * Orchestrates entrance of child cards/items with a 60ms stagger, capped at 6 items
 */
export interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export const RevealGroup: React.FC<RevealGroupProps> = ({
  children,
  className,
  style,
  delay = 0,
}) => {
  return (
    <div className={className} style={style}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <RevealItem index={index} baseDelay={delay}>
            {child}
          </RevealItem>
        );
      })}
    </div>
  );
};

export const RevealItem: React.FC<{
  children: React.ReactNode;
  index: number;
  baseDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, index, baseDelay = 0, className, style }) => {
  const shouldReduceMotion = useReducedMotion();
  const itemDelay = getStaggerDelay(index, baseDelay);

  return (
    <m.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: MOTION_TOKENS.offset.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={MOTION_TOKENS.viewport}
      transition={
        shouldReduceMotion
          ? transitions.reduced
          : {
              duration: MOTION_TOKENS.duration.slow,
              ease: MOTION_TOKENS.ease,
              delay: itemDelay,
            }
      }
      style={{ height: '100%', ...style }}
    >
      {children}
    </m.div>
  );
};

/**
 * Image Reveal Primitive
 * High-performance, calm industrial image reveal with reserved aspect ratio & optional slow scale 1.04 -> 1
 */
export interface ImageRevealProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  maxHeight?: string | number;
  borderRadius?: string;
  overlay?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  aspectRatio = '16 / 10',
  maxHeight,
  borderRadius = 'var(--radius-md)',
  overlay = false,
  priority = false,
  className,
  style,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        maxHeight,
        borderRadius,
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        ...style,
      }}
    >
      <m.img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (imgSrc !== '/images/chemical-2.jpg') {
            setImgSrc('/images/chemical-2.jpg');
          }
        }}
        initial={
          shouldReduceMotion || priority
            ? { opacity: 1, scale: 1 }
            : { opacity: 0.85, scale: 1.04 }
        }
        animate={
          isLoaded || priority
            ? { opacity: 1, scale: 1 }
            : { opacity: 0.85, scale: 1.04 }
        }
        whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
        transition={
          shouldReduceMotion
            ? transitions.reduced
            : {
                duration: MOTION_TOKENS.duration.image,
                ease: MOTION_TOKENS.ease,
              }
        }
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          willChange: 'transform, opacity',
        }}
      />
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(11, 37, 69, 0.05) 0%, rgba(11, 37, 69, 0.25) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

/**
 * CountUp Numeric Animation Primitive
 * Strictly animates ONLY numeric values from WordPress (e.g. 400+), preserving suffixes
 * Screen-reader friendly: final text remains statically accessible in the DOM
 */
export interface CountUpProps {
  value: number | string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  suffix = '',
  duration = 1.2,
  className,
  style,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Extract number and suffix from string if needed (e.g., "400+")
  const rawString = String(value);
  const match = rawString.match(/^(\d+)(.*)$/);
  const numericPart = match ? parseInt(match[1], 10) : (typeof value === 'number' ? value : null);
  const detectedSuffix = match && match[2] ? match[2] : suffix;

  const [currentValue, setCurrentValue] = useState<number>(shouldReduceMotion || !numericPart ? (numericPart || 0) : 0);

  useEffect(() => {
    if (shouldReduceMotion || !numericPart || !isInView) {
      if (numericPart) setCurrentValue(numericPart);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutCubic: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrentValue(Math.floor(easeProgress * numericPart));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(numericPart);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, numericPart, duration, shouldReduceMotion]);

  if (!value && value !== 0) return null;

  return (
    <span
      ref={ref}
      className={className}
      style={style}
      aria-label={`${numericPart !== null ? numericPart : value}${detectedSuffix}`}
    >
      {numericPart !== null ? currentValue : value}
      {detectedSuffix}
    </span>
  );
};

/**
 * Route Page Transition Primitive
 * Smooth 200ms opacity fade on route change with auto-scroll to top
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <m.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: MOTION_TOKENS.duration.fast + 0.05, // 200ms
        ease: MOTION_TOKENS.ease,
      }}
      style={{ width: '100%', minHeight: '100%' }}
    >
      {children}
    </m.div>
  );
};
