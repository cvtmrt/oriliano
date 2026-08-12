import { Hero } from "../../components/studio/Hero.jsx";
import { SelectedWork } from "../../components/studio/SelectedWork.jsx";
import { Services } from "../../components/studio/Services.jsx";
import { Studio } from "../../components/studio/Studio.jsx";
import { FromStudio } from "../../components/studio/FromStudio.jsx";
import { Contact } from "../../components/studio/Contact.jsx";

// Anasayfa akışı — editoryal numaralandırma:
//   01 Seçilmiş İşler · 02 Yetkinlikler · 03 Studio · 04 İletişim
// "Stüdyodan" (Instagram notları) numarasız ara bölüm olarak Studio ile
// İletişim arasında durur; okuyucuyu kapanış CTA'sına ısıtır.
export default function Page() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <Studio />
      <FromStudio />
      <Contact />
    </>
  );
}
