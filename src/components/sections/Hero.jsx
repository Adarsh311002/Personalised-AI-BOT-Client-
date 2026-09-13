import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Container, Eyebrow } from "../ui/Section";

const STATUS_ROWS = [
  { label: "knowledge", value: "resume + curated notes" },
  { label: "model", value: "gpt-oss-120b -> gpt-oss-20b" },
  { label: "memory", value: "session-scoped, 3 turns" },
];

const Hero = ({ onOpenChat }) => {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
        };

  return (
    <section id="top" className="relative pt-40 pb-24 sm:pt-48 sm:pb-32">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <motion.div {...fadeUp(0)}>
            <Eyebrow>PersonaAI — Custom AI Systems</Eyebrow>
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            className="text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-50 text-balance sm:text-5xl lg:text-6xl"
          >
            Turn your knowledge into an intelligent conversation.
          </motion.h1>

          <motion.p
            {...fadeUp(0.12)}
            className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg"
          >
            This page runs Mait, a retrieval-grounded assistant that answers
            questions about Adarsh&apos;s projects, skills, and experience — using
            his actual resume and notes, not open-ended guessing.
          </motion.p>

          <motion.div {...fadeUp(0.2)} className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenChat}
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-950 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:scale-[0.98]"
            >
              Try the Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium text-neutral-300 transition-colors hover:text-neutral-100"
            >
              See how it works
              <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.28)} className="relative">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                system status
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                online
              </span>
            </div>
            <dl className="mt-4 flex flex-col gap-3.5">
              {STATUS_ROWS.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 font-mono text-xs sm:text-[13px]">
                  <dt className="text-neutral-500">{row.label}</dt>
                  <dd className="truncate text-right text-neutral-300">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
              {["RAG", "Knowledge-grounded", "Context-aware"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Hero;
