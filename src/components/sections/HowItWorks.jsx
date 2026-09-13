import { FileText, Scissors, Boxes, Search, History, Sparkles } from "lucide-react";
import { Container, Reveal, SectionDivider, SectionHeading } from "../ui/Section";

const STEPS = [
  {
    icon: FileText,
    title: "Your knowledge",
    body: "Adarsh's resume and a curated notes file — the only sources of truth the assistant is allowed to draw from.",
  },
  {
    icon: Scissors,
    title: "Section-aware chunking",
    body: "The document is split along its own headings, so employment work and independent projects never blend into one chunk.",
  },
  {
    icon: Boxes,
    title: "Embeddings",
    body: "Each chunk is indexed as a vector, so meaning — not just keywords — can be searched later.",
  },
  {
    icon: Search,
    title: "Retrieval & reranking",
    body: "A question pulls the closest-matching chunks, then reorders them by section and named-entity relevance.",
  },
  {
    icon: History,
    title: "Conversation memory",
    body: "Recent turns are folded in, so a short follow-up question still resolves against what was just discussed.",
  },
  {
    icon: Sparkles,
    title: "Grounded response",
    body: "The model answers from what was retrieved and remembered — not from open-ended generation alone.",
  },
];

const HowItWorks = () => (
  <>
    <SectionDivider />
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Architecture"
          title="How it works"
          description="This is what separates a knowledge-grounded assistant from a generic chat wrapper."
        />

        <div className="relative mt-14">
          <div
            className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-400/40 via-white/10 to-transparent sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden="true"
          />
          <ol className="flex flex-col gap-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const fromLeft = i % 2 === 0;
              return (
                <Reveal key={step.title} delay={i * 0.06}>
                  <li
                    className={`relative flex items-start gap-5 sm:w-1/2 ${
                      fromLeft ? "sm:pr-10" : "sm:ml-auto sm:pl-10 sm:text-right sm:flex-row-reverse"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-neutral-950 text-indigo-300">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div>
                      <span className="font-mono text-xs text-neutral-600">0{i + 1}</span>
                      <h3 className="mt-1 text-base font-semibold text-neutral-100">{step.title}</h3>
                      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500">{step.body}</p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  </>
);

export default HowItWorks;
