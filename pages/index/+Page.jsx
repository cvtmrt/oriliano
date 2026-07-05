import { Hero } from "../../components/studio/Hero.jsx";
import { SelectedWork } from "../../components/studio/SelectedWork.jsx";
import { Services } from "../../components/studio/Services.jsx";
import { Contact } from "../../components/studio/Contact.jsx";

// Anasayfa — sade akış: Hero → Seçilmiş İşler → Hizmetler → İletişim.
// (Yetkinlikler / Süreç / Manifesto / Rakamlar bölümleri kullanıcı isteğiyle
// kaldırıldı — 2026-07-05 sadeleştirme turu.)
export default function Page() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <Contact />
    </>
  );
}
