import { ArrowRight } from "lucide-react";
import { Container, Reveal, SectionDivider, SectionHeading } from "../ui/Section";

// Each flow step names a real stage of the actual request lifecycle - not a
// generic marketing arrow diagram. The answer previews are grounded in
// verified portfolio content (data/portfolio.md) and, for the second example,
// an actual response the live system returned to this exact question pair.
const INTERACTIONS = [
  {
    label: "Experience",
    question: "What did Adarsh work on at DigitalSherpa.AI?",
    flow: ["Experience context", "retrieval", "grounded answer"],
    answer:
      "As an employee, he led the frontend for Heels n Toes, architected Unlisted from scratch, and took ownership of stabilising NADT and DirectSelling.",
    reverse: false,
  },
  {
    label: "Follow-up",
    question: "Which one uses React Native?",
    flow: ["follow-up question", "conversation context", "retrieval augmentation", "relevant project"],
    answer: "FinanceCore is the cross-platform mobile app built with React Native.",
    reverse: true,
    note: "Resolved using the previous turn - no project name was repeated in this question.",
  },
  {
    label: "Technical projects",
    question: "Tell me about his technical projects.",
    flow: ["Technical Projects section", "section-aware retrieval", "reranking", "concise answer"],
    answer:
      "His technical, independent projects are PayCore (a digital wallet), TubeScale (a scalable backend), and FinanceCore (a cross-platform mobile app).",
    reverse: false,
  },
];

const FlowStep = ({ children, isLast }) => (
  <span className="flex items-center gap-2">
    <span className="whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-neutral-400">
      {children}
    </span>
    {!isLast && <ArrowRight className="h-3 w-3 shrink-0 text-neutral-700" />}
  </span>
);

const Interaction = ({ item, index }) => (
  <Reveal delay={index * 0.06}>
    <div className="grid gap-6 border-t border-white/[0.06] py-10 first:border-t-0 first:pt-0 lg:grid-cols-2 lg:gap-12">
      <div className={item.reverse ? "lg:order-2" : ""}>
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-600">
          {item.label}
        </span>
        <p className="mt-2 text-xl font-medium leading-snug text-neutral-100 sm:text-2xl">
          &ldquo;{item.question}&rdquo;
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {item.flow.map((step, i) => (
            <FlowStep key={step} isLast={i === item.flow.length - 1}>
              {step}
            </FlowStep>
          ))}
        </div>
      </div>

      <div className={`flex ${item.reverse ? "lg:order-1" : ""}`}>
        <div className="w-full rounded-xl border border-indigo-400/10 bg-indigo-500/[0.04] p-5 sm:p-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-indigo-300/70">
            answer
          </span>
          <p className="mt-2 text-[15px] leading-relaxed text-neutral-300">{item.answer}</p>
          {item.note && (
            <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-neutral-500">
              {item.note}
            </p>
          )}
        </div>
      </div>
    </div>
  </Reveal>
);

const UseCases = () => (
  <>
    <SectionDivider />
    <section id="use-cases" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What it can handle"
          title="Ask it like you would ask a recruiter."
          description="Three real interaction patterns the system is actually built to handle - not a list of hypothetical features."
        />

        <div className="mt-12">
          {INTERACTIONS.map((item, i) => (
            <Interaction key={item.question} item={item} index={i} />
          ))}
        </div>

        <p className="mt-10 border-t border-white/[0.06] pt-6 text-sm text-neutral-500">
          The same retrieval-and-memory pattern can be adapted to documentation, product
          knowledge, and internal knowledge bases.
        </p>
      </Container>
    </section>
  </>
);

export default UseCases;
