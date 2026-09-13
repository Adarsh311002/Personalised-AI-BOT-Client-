import { Container, Reveal, SectionDivider, SectionHeading } from "../ui/Section";

const LAYERS = [
  { title: "Knowledge source", body: "A swappable document plus a hand-curated notes file define what the assistant knows." },
  { title: "Persona rules", body: "A priority-ordered set of explicit instructions the model follows for every reply." },
  { title: "Retrieval limits", body: "How much context and how many turns of memory are used are both configuration values." },
  { title: "Boundaries", body: "Topics and personal details the assistant will not disclose, enforced before a reply is returned." },
];

const INDENT = ["sm:ml-0", "sm:ml-4", "sm:ml-8", "sm:ml-12"];

const Customization = () => (
  <>
    <SectionDivider />
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading eyebrow="Customization" title="Built around real knowledge" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
            None of this is hardcoded into the model. Each layer below is a distinct,
            independently configurable part of the system.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {LAYERS.map((layer, i) => (
            <Reveal key={layer.title} delay={i * 0.05}>
              <div
                className={`rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 ${INDENT[i]}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm font-semibold text-neutral-100">{layer.title}</h3>
                  <span className="font-mono text-[11px] text-neutral-600">0{i + 1}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{layer.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  </>
);

export default Customization;
