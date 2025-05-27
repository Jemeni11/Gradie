import { Toaster } from "@/components/ui/sonner";
import {
  Header,
  Hero,
  PalettePanel,
  GradientPanel,
  Footer,
} from "./components/views";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <div className="mx-auto w-full max-w-7xl px-8 lg:h-screen">
        <Header />
        <Hero />
        <div className="grid grid-rows-2 gap-4 lg:grid-cols-[5fr_5fr] lg:grid-rows-1">
          <PalettePanel />
          <GradientPanel />
        </div>
        <div className="mt-8">
          TODO
          <ul>
            <li>Download button</li>
            <li>Fix loader</li>
            <li>add wiki/faq</li>
            <li>analytics</li>
            <li>mobile responsiveness</li>
            <li>???</li>
            <li>profit (lol)</li>
          </ul>
        </div>
        <Footer />
      </div>
    </>
  );
}
