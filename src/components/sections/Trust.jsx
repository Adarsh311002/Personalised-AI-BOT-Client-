import { Container, Reveal, SectionDivider, SectionHeading } from "../ui/Section";

// Each line is an enforced constraint, not a marketing claim - every one maps
// directly to a real mechanism in the backend (redaction, prompt structure,
// memory caps, fallback routing).
const CONSTRAINTS = [
  "Knowledge is retrieved, not assumed.",
  "Conversation history is bounded.",
  "Sensitive patterns are redacted before persistence.",
  "Retrieved and historical text is treated as data, not instructions.",
  "Provider failures degrade rather than taking down the chat.",
];

const SPEC = [
  { label: "RAG", rows: ["20 candidate chunks", "5 final chunks"] },
  { label: "Memory", rows: ["3 recent turns", "350-token budget"] },
  { label: "LLM", rows: ["gpt-oss-120b", "-> gpt-oss-20b fallback"] },
  { label: "Requests", rows: ["100 / 15 min / IP"] },
  { label: "Retention", rows: ["30-day conversation TTL"] },
];

const Trust = () => (
  <>
    <SectionDivider />
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Engineering"
          title="Built with boundaries, not promises."
          description="Rather than claiming perfect answers or perfect security, the system limits what it can see, remember, and return."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ul className="flex flex-col gap-6">
              {CONSTRAINTS.map((line, i) => (
                <li key={line} className="flex gap-4 border-t border-white/[0.06] pt-6 first:border-t-0 first:pt-0">
                  <span className="font-mono text-xs text-neutral-600">0{i + 1}</span>
                  <p className="text-[15px] leading-relaxed text-neutral-200">{line}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                system profile
              </span>
              <dl className="mt-5 flex flex-col">
                {SPEC.map((entry, i) => (
                  <div
                    key={entry.label}
                    className={`flex items-baseline justify-between gap-6 py-3 ${
                      i > 0 ? "border-t border-white/[0.06]" : ""
                    }`}
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-indigo-300/70">
                      {entry.label}
                    </dt>
                    <dd className="text-right font-mono text-[13px] leading-relaxed text-neutral-300">
                      {entry.rows.map((row) => (
                        <div key={row}>{row}</div>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  </>
);

export default Trust;
