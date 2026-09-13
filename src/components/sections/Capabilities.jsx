import {
  Database,
  MessageSquareText,
  Layers,
  RefreshCw,
  ShieldOff,
  ShieldCheck,
  GitBranch,
  Gauge,
} from "lucide-react";
import { Container, Reveal, SectionDivider, SectionHeading } from "../ui/Section";

const CAPABILITIES = [
  {
    icon: Database,
    title: "RAG-powered knowledge",
    body: "Questions are matched against a vector index of Adarsh's resume and notes before a reply is generated.",
  },
  {
    icon: MessageSquareText,
    title: "Conversation memory",
    body: "The last few turns of a conversation are kept so follow-up questions stay coherent.",
  },
  {
    icon: Layers,
    title: "Section-aware retrieval",
    body: "Employment work and independent projects are kept distinct at retrieval time, not blended together.",
  },
  {
    icon: RefreshCw,
    title: "Follow-up augmentation",
    body: "Referential questions like “tell me more about that” are rewritten with context before retrieval runs.",
  },
  {
    icon: ShieldOff,
    title: "PII redaction",
    body: "Emails, phone numbers, and addresses are stripped before anything is written to storage.",
  },
  {
    icon: ShieldCheck,
    title: "Prompt-injection resistant",
    body: "Retrieved content and prior conversation are always framed as data the model reasons about, never as instructions.",
  },
  {
    icon: GitBranch,
    title: "Automatic model fallback",
    body: "If the primary model is unavailable, a secondary model takes over rather than the request failing.",
  },
  {
    icon: Gauge,
    title: "Rate limiting",
    body: "Requests are capped per visitor, so the assistant stays available under load or abuse.",
  },
];

const Capabilities = () => (
  <>
    <SectionDivider />
    <section id="capabilities" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Under the hood"
          title="What it actually does"
          description="Every item below is a real, implemented mechanism — not a roadmap."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 4) * 0.05}>
              <div className="group h-full rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]">
                <Icon className="h-5 w-5 text-indigo-300" strokeWidth={1.75} />
                <h3 className="mt-4 text-sm font-semibold text-neutral-100">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  </>
);

export default Capabilities;
