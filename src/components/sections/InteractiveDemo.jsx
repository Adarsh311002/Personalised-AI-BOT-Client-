import { ArrowRight } from "lucide-react";
import { Container, Reveal, SectionDivider, SectionHeading } from "../ui/Section";

// The same questions the retrieval evaluation script uses - real, tested
// prompts, not invented marketing examples.
const PROMPTS = [
  "What projects has Adarsh built?",
  "What did he work on at DigitalSherpa.AI?",
  "Tell me about his technical projects.",
  "What is his GitHub?",
];

const InteractiveDemo = ({ onAskPrompt }) => (
  <>
    <SectionDivider />
    <section id="demo" className="py-20 sm:py-28">
      <Container>
        <SectionHeading align="center" eyebrow="Try it now" title="Ask it anything" />

        <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5">
          {PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onAskPrompt(prompt)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06] hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {prompt}
              <ArrowRight className="h-3.5 w-3.5 text-neutral-600 transition-colors group-hover:text-indigo-300" />
            </button>
          ))}
        </Reveal>

        <p className="mt-6 text-center text-xs text-neutral-600">
          Opens the assistant with the question ready to send.
        </p>
      </Container>
    </section>
  </>
);

export default InteractiveDemo;
