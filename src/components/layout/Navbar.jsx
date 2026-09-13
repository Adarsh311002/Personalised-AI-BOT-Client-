import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Workflow } from "lucide-react";
import { Container } from "../ui/Section";

const LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Demo", href: "#demo" },
];

const Navbar = ({ onOpenChat }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition-[padding,background-color,border-color] duration-300 ${
          scrolled
            ? "border-b border-white/[0.06] bg-neutral-950/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <Container className={`flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-14" : "h-20"}`}>
          <a href="#top" className="flex items-center gap-2.5 text-neutral-50">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
              <Workflow className="h-4 w-4 text-indigo-300" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">PersonaAI</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center md:flex">
            <button
              onClick={onOpenChat}
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-neutral-100 transition-colors hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Try the AI
            </button>
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-300 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-b border-white/[0.06] bg-neutral-950/95 backdrop-blur-xl md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="rounded-lg px-3 py-2.5 text-[15px] text-neutral-300 hover:bg-white/[0.05] hover:text-neutral-100"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  closeMobile();
                  onOpenChat();
                }}
                className="mt-2 rounded-lg bg-white/[0.08] px-3 py-3 text-center text-[15px] font-medium text-neutral-100"
              >
                Try the AI
              </button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
