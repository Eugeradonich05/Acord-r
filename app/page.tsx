import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { LazyContactForm } from "@/components/LazyContactForm";
import { Marquee } from "@/components/Marquee";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { StructuredData } from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Services />
      <Marquee />
      <About />
      <Process />
      <Contact form={<LazyContactForm />} />
    </>
  );
}
