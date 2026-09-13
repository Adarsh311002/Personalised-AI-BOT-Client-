import { ArrowRight } from "lucide-react";
import { Container, Reveal, SectionDivider } from "../ui/Section";

const FinalCTA = ({ onOpenChat }) => (
  <>
    <SectionDivider />
    <section className="py-24 sm:py-32">
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-neutral-50 text-balance sm:text-4xl">
            Ready to see it in action?
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400 sm:text-base">
            Mait is already running on this page — ask it about Adarsh&apos;s work
            and it&apos;ll answer from his actual resume and notes.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenChat}
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-50 px-6 py-3 text-sm font-medium text-neutral-950 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:scale-[0.98]"
          >
            Try the Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="https://linkedin.com/in/adarsh-081533287"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-neutral-300 transition-colors hover:border-white/20 hover:text-neutral-100"
          >
            Get in Touch
          </a>
        </Reveal>
      </Container>
    </section>
  </>
);

export default FinalCTA;
