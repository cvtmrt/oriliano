import { Hero } from "../../components/studio/Hero.jsx";
import { SelectedWork } from "../../components/studio/SelectedWork.jsx";
import { Services } from "../../components/studio/Services.jsx";
import { Stack } from "../../components/studio/Stack.jsx";
import { Process } from "../../components/studio/Process.jsx";
import { Manifesto } from "../../components/studio/Manifesto.jsx";
import { Proof } from "../../components/studio/Proof.jsx";
import { Contact } from "../../components/studio/Contact.jsx";

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
