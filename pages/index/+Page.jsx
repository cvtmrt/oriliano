import { Hero } from "../../components/studio/Hero.jsx";
import { SelectedWork } from "../../components/studio/SelectedWork.jsx";
import { Services } from "../../components/studio/Services.jsx";
import { Stack } from "../../components/studio/Stack.jsx";
import { Process } from "../../components/studio/Process.jsx";
import { Manifesto } from "../../components/studio/Manifesto.jsx";
import { Proof } from "../../components/studio/Proof.jsx";
import { Contact } from "../../components/studio/Contact.jsx";

// Anasayfa — içerik yoğun portfolyo akışı. Showcase denemesinin 3D sahnesi
// (HeroScene) Hero'ya entegre edildi; tam sayfa showcase sunumu
// components/showcase/ altında olası bir /sunum sayfası için duruyor.
export default function Page() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <Stack />
      <Process />
      <Manifesto />
      <Proof />
      <Contact />
    </>
  );
}
