import { useState } from "react";
import { GridBackdrop } from "../components/ui/Section";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import ProductShowcase from "../components/sections/ProductShowcase";
import ValueProps from "../components/sections/ValueProps";
import Capabilities from "../components/sections/Capabilities";
import HowItWorks from "../components/sections/HowItWorks";
import UseCases from "../components/sections/UseCases";
import Customization from "../components/sections/Customization";
import Trust from "../components/sections/Trust";
import InteractiveDemo from "../components/sections/InteractiveDemo";
import FinalCTA from "../components/sections/FinalCTA";
import ChatBot from "../components/ChatBot/index.jsx";

// This page only owns layout and chat-visibility state. Every section is a
// self-contained component; the chatbot's own logic (API calls, memory,
// markdown rendering) lives entirely inside ChatBot and is untouched here.
export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [presetMessage, setPresetMessage] = useState(null);

  const openChat = () => setShowChat(true);
  const toggleChat = () => setShowChat((v) => !v);

  // Seeds the chat input with a suggested prompt and opens the panel; the
  // visitor still presses send themselves, so nothing is sent on their behalf.
  const askPrompt = (text) => {
    setPresetMessage({ text, id: Date.now() });
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <GridBackdrop />
      <Navbar onOpenChat={openChat} />

      <main>
        <Hero onOpenChat={openChat} />
        <ProductShowcase onOpenChat={openChat} />
        <ValueProps />
        <Capabilities />
        <HowItWorks />
        <UseCases />
        <Customization />
        <Trust />
        <InteractiveDemo onAskPrompt={askPrompt} />
        <FinalCTA onOpenChat={openChat} />
      </main>

      <Footer />

      <ChatBot isOpen={showChat} onToggle={toggleChat} presetMessage={presetMessage} />
    </div>
  );
}
