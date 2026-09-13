import { Workflow, Github, Linkedin } from "lucide-react";
import { Container } from "../ui/Section";

const NAV = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Demo", href: "#demo" },
];

// Public, verified links only - the same ones the assistant itself is allowed
// to share (see the portfolio's own "Links" knowledge section).
const SOCIAL = [
  { label: "GitHub", href: "https://github.com/Adarsh311002", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/adarsh-081533287", icon: Linkedin },
];

const Footer = () => (
  <footer className="border-t border-white/[0.06]">
    <Container className="py-14">
      <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5 text-neutral-50">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
              <Workflow className="h-4 w-4 text-indigo-300" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">PersonaAI</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            A retrieval-grounded AI assistant, running on this page as Mait -
            answering questions from Adarsh&apos;s own resume and notes.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIAL.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition-colors hover:border-white/20 hover:text-neutral-100"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav className="flex flex-col gap-2.5" aria-label="Footer">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-12 flex flex-col-reverse gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">© 2025 PersonaAI. Built and maintained by Adarsh.</p>
        <div className="flex items-center gap-5 text-xs text-neutral-500">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </div>
    </Container>
  </footer>
);

export default Footer;
