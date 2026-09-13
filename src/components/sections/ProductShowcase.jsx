import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, Reveal } from "../ui/Section";

const BADGES = ["RAG", "Knowledge-grounded", "Context-aware", "Real-time"];

// A faithful preview, not a fake demo: this text mirrors the assistant's real,
// curated knowledge (see data/portfolio.md) so the panel represents what the
// live widget actually says rather than inventing a nicer answer.
const PREVIEW = [
  {
    role: "user",
    text: "What projects has Adarsh built?",
  },
  {
    role: "assistant",
    text:
      "Independently, he's built PayCore (a digital wallet), TubeScale (a scalable backend), and FinanceCore (a cross-platform app). As an employee at DigitalSherpa.AI, he led the frontend for Heels n Toes and took ownership of stabilising NADT and DirectSelling.",
  },
];

const ProductShowcase = ({ onOpenChat }) => (
  <section className="relative py-20 sm:py-28">
    <Container>
      <Reveal>
        <Eyebrow>Live on this page</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
          Not a mockup — this is the actual assistant.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900/40 shadow-2xl shadow-black/40">
          {/* Browser-style chrome */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="ml-3 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-neutral-500">
              mait — portfolio assistant — preview
            </span>
          </div>

          <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
            <div className="space-y-4 p-6 sm:p-8">
              {PREVIEW.map((turn, i) => (
                <div key={i} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      turn.role === "user"
                        ? "rounded-br-sm bg-white/[0.06] text-neutral-100"
                        : "rounded-bl-sm border border-indigo-400/10 bg-indigo-500/[0.06] text-neutral-300"
                    }`}
                  >
                    {turn.text}
                  </div>
                </div>
              ))}

              <button
                onClick={onOpenChat}
                className="group inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
              >
                Try it yourself
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="flex shrink-0 flex-wrap items-start gap-2 border-t border-white/[0.06] p-6 sm:w-40 sm:flex-col sm:border-l sm:border-t-0 sm:p-6">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-neutral-400"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  </section>
);

export default ProductShowcase;
