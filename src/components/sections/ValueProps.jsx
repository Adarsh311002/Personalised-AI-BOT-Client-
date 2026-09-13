import { Container, Reveal, SectionDivider, SectionHeading } from "../ui/Section";

const ITEMS = [
  {
    n: "01",
    title: "Knowledge-aware",
    body: "Answers are retrieved from Adarsh's resume and curated notes, not generated from open-ended memory.",
  },
  {
    n: "02",
    title: "Context-aware",
    body: "Recent turns are remembered within a conversation, so a follow-up like “which one uses React Native?” resolves correctly.",
  },
  {
    n: "03",
    title: "Controlled",
    body: "Retrieved text and conversation history are always treated as data, never instructions, and personal contact details are withheld.",
  },
  {
    n: "04",
    title: "Embeddable",
    body: "Ships as a single floating widget that drops into a page without disturbing anything else on it.",
  },
];

const ValueProps = () => (
  <>
    <SectionDivider />
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Why it's built this way" title="Your knowledge. Your AI." />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.05} className="h-full">
              <div className="h-full bg-neutral-950/95 p-6">
                <span className="font-mono text-xs text-neutral-600">{item.n}</span>
                <h3 className="mt-3 text-base font-semibold text-neutral-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  </>
);

export default ValueProps;
