import { Footer }     from "@/components/layout/footer";
import { Header }     from "@/components/layout/header";
import { About }      from "@/components/sections/about";
import { ContactCta } from "@/components/sections/contact-cta";
import { Hero }       from "@/components/sections/hero";
import { Metrics }    from "@/components/sections/metrics";
import { Projects }   from "@/components/sections/projects";
import { Toolkit }    from "@/components/sections/toolkit";
import { ScrollRestoration } from "react-router-dom";
import { useVisitTracking } from "@/hooks/use-visit-tracking";

export default function App() {
  useVisitTracking();

  return (
    <div id="top">
      <ScrollRestoration />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-button focus:bg-accent focus:px-4 focus:py-2 focus:text-caption focus:font-bold focus:text-accent-fg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Metrics />
        <Projects />
        <About />
        <Toolkit />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}

