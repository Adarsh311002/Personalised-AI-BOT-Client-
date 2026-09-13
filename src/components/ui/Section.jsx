import { motion, useReducedMotion } from "framer-motion";

// Shared layout primitives so every section uses the same rhythm: the same
// max-width, the same heading treatment, the same entrance motion. Redesigning
// a section means composing these, not reinventing spacing each time.

export const Container = ({ className = "", children }) => (
  <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10 ${className}`}>
    {children}
  </div>
);

// A tracked, uppercase micro-label with a small tick - the "eyebrow" that
// precedes every section heading. Kept text-only and small on purpose: this is
// a technical product, not a poster.
export const Eyebrow = ({ children }) => (
  <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">
    <span className="h-1 w-1 rounded-full bg-indigo-400" aria-hidden="true" />
    {children}
  </div>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  size = "md",
}) => {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const titleSize =
    size === "lg"
      ? "text-3xl sm:text-4xl lg:text-5xl"
      : "text-2xl sm:text-3xl lg:text-4xl";

  return (
    <div className={`flex flex-col ${alignClass} ${align === "center" ? "max-w-2xl" : "max-w-2xl"}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={`${titleSize} font-semibold tracking-tight text-neutral-50 text-balance`}>
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};

// One-shot entrance: fades and lifts into place when scrolled into view, once.
// Reduced-motion visitors get the final state immediately with no animation.
export const Reveal = ({ children, delay = 0, className = "" }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// A thin top divider used between sections instead of empty margin - it reads
// as intentional structure rather than a gap.
export const SectionDivider = () => (
  <div className="border-t border-white/[0.06]" aria-hidden="true" />
);

// The page's only background layer: a faint dot grid plus two restrained radial
// glows. Mounted once, fixed, behind everything. No blur blobs, no motion -
// this is texture, not a light show.
export const GridBackdrop = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div
      className="absolute inset-0 opacity-[0.4]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
      }}
    />
    <div
      className="absolute left-1/2 top-[-10%] h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
      style={{
        background:
          "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)",
      }}
    />
    <div
      className="absolute bottom-[-15%] right-[-10%] h-[420px] w-[560px] rounded-full opacity-[0.12] blur-[120px]"
      style={{
        background: "radial-gradient(circle, rgba(34,211,238,0.3), transparent 70%)",
      }}
    />
  </div>
);
