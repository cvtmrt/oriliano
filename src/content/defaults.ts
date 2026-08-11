/**
 * VARSAYILAN İÇERİK — koddaki tek metin kaynağı burasıdır.
 *
 * Sitedeki hiçbir bileşen metni doğrudan yazmaz; hepsi veritabanından okunur.
 * Veritabanında bir anahtar yoksa (henüz seed edilmediyse) buradaki varsayılan
 * kullanılır, böylece boş kurulumda bile sayfa çökmez.
 *
 * Buradaki metinler YER TUTUCUDUR. Gerçek dava, müvekkil, ödül ya da istatistik
 * içermez; panelden değiştirilmek üzere yazılmıştır.
 */

export const SEED_VERSION = '1'

export type TextKindName = 'SHORT' | 'LONG' | 'RICH'

export interface TextDefault {
  key: string
  group: string
  label: string
  kind: TextKindName
  order: number
  tr: string
  en: string
}

export interface MediaSlotDefault {
  key: string
  group: string
  label: string
  order: number
  altTr: string
  altEn: string
  /** Panelden görsel yüklenene kadar gösterilen paket tasarım görseli
      (public/defaults/). Yoksa yuva boş kalır — ör. anasayfa hero'su
      müşteri isteğiyle düz lacivert. */
  bundled?: { src: string; width: number; height: number }
}

let textOrder = 0
const t = (
  key: string,
  group: string,
  label: string,
  kind: TextKindName,
  tr: string,
  en: string,
): TextDefault => ({ key, group, label, kind, order: textOrder++, tr, en })

// ---------------------------------------------------------------------------
// Metinler
// ---------------------------------------------------------------------------
export const textDefaults: TextDefault[] = [
  // --- Ortak ---
  t('common.cta.contact', 'common', 'Buton: İletişime geç', 'SHORT', 'İletişime Geçin', 'Get in Touch'),
  t('common.cta.services', 'common', 'Buton: Hizmetleri gör', 'SHORT', 'Hizmetlerimizi İnceleyin', 'Explore Our Services'),
  t('common.cta.detail', 'common', 'Buton: Detay', 'SHORT', 'Ayrıntılı Bilgi', 'Read More'),
  t('common.cta.allServices', 'common', 'Buton: Tüm hizmetler', 'SHORT', 'Tüm Hizmet Alanları', 'All Practice Areas'),
  t('common.cta.allTeam', 'common', 'Buton: Tüm ekip', 'SHORT', 'Ekibin Tamamı', 'Meet the Team'),
  t('common.back', 'common', 'Buton: Geri', 'SHORT', 'Geri Dön', 'Back'),
  t('common.notFound.title', 'common', '404 başlık', 'SHORT', 'Sayfa bulunamadı', 'Page not found'),
  t(
    'common.notFound.body',
    'common',
    '404 açıklama',
    'LONG',
    'Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Anasayfadan devam edebilir ya da bizimle iletişime geçebilirsiniz.',
    'The page you are looking for may have been moved or removed. You can return to the homepage or contact us.',
  ),
  t('common.notFound.cta', 'common', '404 buton', 'SHORT', 'Anasayfaya dön', 'Back to homepage'),

  // --- Anasayfa ---
  t('home.hero.eyebrow', 'home', 'Hero üst etiket', 'SHORT', 'Hukuki Danışmanlık ve Temsil', 'Legal Advisory and Representation'),
  t(
    'home.hero.title',
    'home',
    'Hero başlık',
    'LONG',
    'Hukuki meselelerinizde sabırlı, öngörülü ve sonuç odaklı bir yaklaşım',
    'A patient, forward-looking and result-oriented approach to your legal matters',
  ),
  t(
    'home.hero.subtitle',
    'home',
    'Hero alt metin',
    'LONG',
    'Bireysel ve kurumsal müvekkillere; uyuşmazlık çözümü, sözleşme yönetimi ve önleyici hukuk alanlarında danışmanlık ve dava takibi hizmeti sunuyoruz.',
    'We provide advisory services and litigation support to individual and corporate clients in dispute resolution, contract management and preventive law.',
  ),
  t('home.intro.eyebrow', 'home', 'Tanıtım üst etiket', 'SHORT', 'Büromuz', 'Our Practice'),
  t(
    'home.intro.title',
    'home',
    'Tanıtım başlık',
    'LONG',
    'Her dosyanın kendine özgü olduğunu bilerek çalışıyoruz',
    'We work knowing that every file is unique',
  ),
  t(
    'home.intro.body',
    'home',
    'Tanıtım metni',
    'RICH',
    '<p>Çetiner Hukuk ve Danışmanlık; müvekkillerinin hukuki ihtiyaçlarını yalnızca uyuşmazlık ortaya çıktığında değil, ortaya çıkmadan önce de ele almayı esas alır. Amacımız, hukuki süreci müvekkil için öngörülebilir kılmaktır.</p><p>Dosyanın başında olası sonuçları, süreleri ve maliyetleri açıkça paylaşır; sürecin her aşamasında müvekkili bilgilendiririz. Bu yaklaşım, hem beklentilerin gerçekçi kalmasını hem de kararların doğru zamanda alınmasını sağlar.</p>',
    '<p>Çetiner Hukuk ve Danışmanlık addresses its clients’ legal needs not only once a dispute has arisen, but before it arises. Our aim is to make the legal process predictable for the client.</p><p>At the outset of each file we clearly set out the possible outcomes, timelines and costs, and we keep the client informed at every stage. This approach keeps expectations realistic and ensures that decisions are taken at the right time.</p>',
  ),
  t('home.services.eyebrow', 'home', 'Hizmetler üst etiket', 'SHORT', 'Çalışma Alanlarımız', 'Practice Areas'),
  t(
    'home.services.title',
    'home',
    'Hizmetler başlık',
    'LONG',
    'Başlıca hizmet alanlarımız',
    'Our principal practice areas',
  ),
  t(
    'home.services.body',
    'home',
    'Hizmetler açıklama',
    'LONG',
    'Aşağıdaki alanlarda danışmanlık ve dava takibi yürütüyoruz. Her alanın kapsamı için ilgili sayfayı inceleyebilirsiniz.',
    'We provide advisory services and litigation support in the areas below. Visit the relevant page for the scope of each area.',
  ),
  t('home.approach.eyebrow', 'home', 'Yaklaşım üst etiket', 'SHORT', 'Çalışma Biçimimiz', 'How We Work'),
  t('home.approach.title', 'home', 'Yaklaşım başlık', 'LONG', 'Süreç boyunca aynı ilkeler', 'The same principles throughout the process'),
  t('home.approach.1.title', 'home', 'İlke 1 başlık', 'SHORT', 'Önce durum tespiti', 'Assessment first'),
  t(
    'home.approach.1.body',
    'home',
    'İlke 1 metin',
    'LONG',
    'Dosyayı devralmadan önce hukuki ve fiilî durumu birlikte değerlendirir, gerçekçi bir yol haritası çıkarırız.',
    'Before taking on a file we assess the legal and factual position together and set out a realistic roadmap.',
  ),
  t('home.approach.2.title', 'home', 'İlke 2 başlık', 'SHORT', 'Açık iletişim', 'Clear communication'),
  t(
    'home.approach.2.body',
    'home',
    'İlke 2 metin',
    'LONG',
    'Sürecin her aşamasında bilgilendirme yaparız; müvekkil dosyanın nerede olduğunu her zaman bilir.',
    'We provide updates at every stage; the client always knows where the file stands.',
  ),
  t('home.approach.3.title', 'home', 'İlke 3 başlık', 'SHORT', 'Önleyici hukuk', 'Preventive law'),
  t(
    'home.approach.3.body',
    'home',
    'İlke 3 metin',
    'LONG',
    'Uyuşmazlığı sonradan çözmek yerine, sözleşme ve süreç tasarımıyla baştan engellemeyi tercih ederiz.',
    'Rather than resolving disputes after the fact, we prefer to prevent them through contract and process design.',
  ),
  t('home.approach.4.title', 'home', 'İlke 4 başlık', 'SHORT', 'Gizlilik', 'Confidentiality'),
  t(
    'home.approach.4.body',
    'home',
    'İlke 4 metin',
    'LONG',
    'Müvekkil sırrı, mesleki yükümlülüğümüzün merkezindedir; paylaşılan her bilgi bu çerçevede korunur.',
    'Client confidentiality is central to our professional obligations; all information shared is protected on that basis.',
  ),
  t('home.cta.title', 'home', 'Alt CTA başlık', 'LONG', 'Dosyanızı birlikte değerlendirelim', 'Let us review your file together'),
  t(
    'home.cta.body',
    'home',
    'Alt CTA metin',
    'LONG',
    'Ön görüşme talebiniz için iletişim formunu doldurabilir veya doğrudan arayabilirsiniz.',
    'You can fill in the contact form to request an initial meeting, or call us directly.',
  ),

  // --- Hakkımızda ---
  t('about.hero.eyebrow', 'about', 'Üst etiket', 'SHORT', 'Hakkımızda', 'About Us'),
  t('about.hero.title', 'about', 'Sayfa başlığı', 'LONG', 'Çetiner Hukuk ve Danışmanlık', 'Çetiner Hukuk ve Danışmanlık'),
  t(
    'about.hero.subtitle',
    'about',
    'Sayfa alt başlığı',
    'LONG',
    'Bireysel ve kurumsal müvekkillere hukuki danışmanlık ve temsil hizmeti veren bir hukuk bürosu.',
    'A law office providing legal advisory and representation services to individual and corporate clients.',
  ),
  t(
    'about.body',
    'about',
    'Ana metin',
    'RICH',
    '<p>Büromuz, hukuki sorunlara yalnızca dava aşamasında değil, henüz sorun doğmadan yaklaşan bir anlayışla kurulmuştur. Sözleşmelerin doğru kurgulanması, süreçlerin mevzuata uygun yürütülmesi ve risklerin önceden görülmesi, sonradan yürütülecek her uyuşmazlıktan daha etkilidir.</p><h3>Yaklaşımımız</h3><p>Her dosyada önce hukuki durumu, ardından fiilî durumu değerlendiririz. Müvekkile sunulan yol haritası; olası sonuçları, tahmini süreleri ve maliyet kalemlerini içerir. Böylece karar müvekkilin kendisinde kalır.</p><h3>Çalışma disiplinimiz</h3><p>Dosyalar tek bir avukatın insiyatifine bırakılmaz; hazırlık, takip ve raporlama aşamaları belirli bir düzen içinde yürütülür. Duruşma ve süre takibi, dosyanın büyüklüğünden bağımsız olarak aynı özenle yapılır.</p>',
    '<p>Our office was founded on an approach that addresses legal problems not only at the litigation stage, but before they arise. Drafting contracts correctly, conducting processes in line with legislation and identifying risks in advance are more effective than any dispute resolved afterwards.</p><h3>Our approach</h3><p>In every file we first assess the legal position, then the factual position. The roadmap presented to the client sets out the possible outcomes, estimated timelines and cost items, so that the decision remains with the client.</p><h3>Our working discipline</h3><p>Files are not left to the initiative of a single lawyer; preparation, follow-up and reporting are carried out within a defined structure. Hearing and deadline tracking is handled with the same care regardless of the size of the file.</p>',
  ),
  t('about.values.title', 'about', 'Değerler başlık', 'SHORT', 'İlkelerimiz', 'Our Principles'),
  t('about.values.1.title', 'about', 'Değer 1 başlık', 'SHORT', 'Dürüstlük', 'Candour'),
  t(
    'about.values.1.body',
    'about',
    'Değer 1 metin',
    'LONG',
    'Beklentiyi yükseltmek yerine gerçekçi olanı söyleriz; zayıf gördüğümüz bir iddiayı zayıf olarak aktarırız.',
    'Rather than raising expectations, we say what is realistic; where we consider a claim weak, we say so.',
  ),
  t('about.values.2.title', 'about', 'Değer 2 başlık', 'SHORT', 'Özen', 'Diligence'),
  t(
    'about.values.2.body',
    'about',
    'Değer 2 metin',
    'LONG',
    'Süre ve usul kuralları, esasa ilişkin argümanlar kadar ciddiye alınır.',
    'Deadlines and procedural rules are taken as seriously as arguments on the merits.',
  ),
  t('about.values.3.title', 'about', 'Değer 3 başlık', 'SHORT', 'Erişilebilirlik', 'Accessibility'),
  t(
    'about.values.3.body',
    'about',
    'Değer 3 metin',
    'LONG',
    'Müvekkil, dosyasıyla ilgilenen avukata makul sürede ulaşabilir.',
    'Clients can reach the lawyer handling their file within a reasonable time.',
  ),

  // --- Hizmetler (liste sayfası) ---
  t('services.hero.eyebrow', 'services', 'Üst etiket', 'SHORT', 'Hizmetlerimiz', 'Our Services'),
  t('services.hero.title', 'services', 'Sayfa başlığı', 'LONG', 'Çalışma alanlarımız', 'Our practice areas'),
  t(
    'services.hero.subtitle',
    'services',
    'Sayfa alt başlığı',
    'LONG',
    'Aşağıdaki alanlarda danışmanlık verir ve dava takibi yaparız. Kapsamı görmek için ilgili alana tıklayın.',
    'We advise and conduct litigation in the areas below. Click an area to see its scope.',
  ),
  t('services.detail.scopeTitle', 'services', 'Detay: kapsam başlığı', 'SHORT', 'Bu alanda neler yapıyoruz?', 'What we do in this area'),
  t('services.detail.otherTitle', 'services', 'Detay: diğer alanlar', 'SHORT', 'Diğer çalışma alanları', 'Other practice areas'),

  // --- Avukatlık ve Danışmanlık ---
  t('legalServices.hero.eyebrow', 'legalServices', 'Üst etiket', 'SHORT', 'Avukatlık ve Danışmanlık', 'Legal Representation and Advisory'),
  t(
    'legalServices.hero.title',
    'legalServices',
    'Sayfa başlığı',
    'LONG',
    'Temsil ve danışmanlık hizmetlerimiz',
    'Our representation and advisory services',
  ),
  t(
    'legalServices.hero.subtitle',
    'legalServices',
    'Sayfa alt başlığı',
    'LONG',
    'Dava ve icra takibi ile sürekli hukuki danışmanlık, birbirini tamamlayan iki hizmet olarak yürütülür.',
    'Litigation and enforcement proceedings and ongoing legal advisory are conducted as two complementary services.',
  ),
  t(
    'legalServices.body',
    'legalServices',
    'Ana metin',
    'RICH',
    '<h3>Dava ve icra takibi</h3><p>Uyuşmazlığın niteliğine göre dava, icra takibi veya alternatif çözüm yollarından hangisinin uygun olduğunu birlikte belirleriz. Dosya açıldıktan sonra duruşma, bilirkişi ve süre takibi bürodan yürütülür; her aşamada müvekkile yazılı bilgilendirme yapılır.</p><h3>Sürekli danışmanlık</h3><p>Şirketler için aylık danışmanlık kapsamında sözleşmelerin gözden geçirilmesi, ihtarname ve yazışmaların hazırlanması, insan kaynakları süreçlerinin mevzuata uygunluğu ve kurumsal karar süreçlerine hukuki katkı sağlanır.</p><h3>Sözleşme yönetimi</h3><p>Sözleşmelerin hazırlanması kadar, imzadan sonraki takibi de önemlidir. Yenileme tarihleri, fesih bildirim süreleri ve cezai şart hükümleri düzenli olarak gözden geçirilir.</p><h3>Görüş ve raporlama</h3><p>Belirli bir işlem veya yatırım öncesinde hukuki risk analizi ve yazılı görüş hazırlanır.</p>',
    '<h3>Litigation and enforcement</h3><p>Depending on the nature of the dispute, we determine together whether litigation, enforcement proceedings or an alternative resolution route is appropriate. Once a file is opened, hearings, expert reports and deadlines are tracked by the office, and the client receives written updates at every stage.</p><h3>Ongoing advisory</h3><p>Monthly advisory services for companies cover the review of contracts, the preparation of formal notices and correspondence, compliance of human-resources processes with legislation, and legal input into corporate decision-making.</p><h3>Contract management</h3><p>Following up a contract after signature matters as much as drafting it. Renewal dates, termination notice periods and liquidated damages clauses are reviewed regularly.</p><h3>Opinions and reporting</h3><p>We prepare legal risk analyses and written opinions ahead of a specific transaction or investment.</p>',
  ),

  // --- Arabuluculuk ---
  t('mediation.hero.eyebrow', 'mediation', 'Üst etiket', 'SHORT', 'Arabuluculuk', 'Mediation'),
  t('mediation.hero.title', 'mediation', 'Sayfa başlığı', 'LONG', 'Uyuşmazlığın mahkeme dışında çözümü', 'Resolving disputes outside the courtroom'),
  t(
    'mediation.hero.subtitle',
    'mediation',
    'Sayfa alt başlığı',
    'LONG',
    'Arabuluculuk, tarafların bir araya gelerek çözümü kendilerinin ürettiği; hızlı, gizli ve daha düşük maliyetli bir yoldur.',
    'Mediation is a fast, confidential and lower-cost route in which the parties come together and produce the solution themselves.',
  ),
  t(
    'mediation.body',
    'mediation',
    'Ana metin',
    'RICH',
    '<h3>Zorunlu arabuluculuk</h3><p>İş hukuku, ticari uyuşmazlıklar ve tüketici uyuşmazlıklarının önemli bir kısmında dava açılmadan önce arabulucuya başvurmak dava şartıdır. Bu aşamanın usulüne uygun yürütülmesi, sonraki dava için de belirleyicidir.</p><h3>İhtiyari arabuluculuk</h3><p>Zorunlu olmayan uyuşmazlıklarda da taraflar arabuluculuğu seçebilir. Ticari ilişkinin devam etmesi istendiğinde bu yol çoğu zaman davadan daha uygundur.</p><h3>Süreç nasıl işler?</h3><p>Başvurunun ardından taraflar arabulucu eşliğinde bir araya gelir. Görüşmeler gizlidir; burada söylenenler sonraki davada delil olarak kullanılamaz. Anlaşma sağlanırsa düzenlenen tutanak ilam niteliğinde belge hâline gelir.</p><h3>Bizim rolümüz</h3><p>Sürecin tamamında müvekkile vekâleten katılır, anlaşma metnini müvekkilin lehine ve uygulanabilir biçimde kurgularız.</p>',
    '<h3>Mandatory mediation</h3><p>For a significant portion of labour, commercial and consumer disputes, applying to a mediator before filing suit is a procedural precondition. Conducting this stage properly is also decisive for any subsequent litigation.</p><h3>Voluntary mediation</h3><p>Parties may also choose mediation in disputes where it is not mandatory. Where the commercial relationship is to continue, this route is often more suitable than litigation.</p><h3>How the process works</h3><p>Following the application, the parties come together with a mediator. The meetings are confidential; what is said there cannot be used as evidence in subsequent litigation. If a settlement is reached, the resulting record becomes a document with the force of a court judgment.</p><h3>Our role</h3><p>We attend throughout the process on the client’s behalf and draft the settlement text so that it is favourable to the client and capable of being enforced.</p>',
  ),

  // --- Ekip ---
  t('team.hero.eyebrow', 'team', 'Üst etiket', 'SHORT', 'Ekibimiz', 'Our Team'),
  t('team.hero.title', 'team', 'Sayfa başlığı', 'LONG', 'Dosyanızla ilgilenecek ekip', 'The team that will handle your file'),
  t(
    'team.hero.subtitle',
    'team',
    'Sayfa alt başlığı',
    'LONG',
    'Her dosya, konusunda çalışan bir avukata atanır ve süreç boyunca aynı kişi tarafından takip edilir.',
    'Each file is assigned to a lawyer working in the relevant area and is followed by the same person throughout.',
  ),
  t('team.detail.expertiseTitle', 'team', 'Detay: uzmanlık başlığı', 'SHORT', 'Çalışma alanları', 'Practice areas'),
  t('team.detail.contactTitle', 'team', 'Detay: iletişim başlığı', 'SHORT', 'İletişim', 'Contact'),

  // --- İletişim ---
  t('contact.hero.eyebrow', 'contact', 'Üst etiket', 'SHORT', 'İletişim', 'Contact'),
  t('contact.hero.title', 'contact', 'Sayfa başlığı', 'LONG', 'Bize ulaşın', 'Get in touch'),
  t(
    'contact.hero.subtitle',
    'contact',
    'Sayfa alt başlığı',
    'LONG',
    'Ön görüşme talepleriniz ve sorularınız için aşağıdaki formu doldurabilir veya doğrudan arayabilirsiniz.',
    'For initial meeting requests and questions, you can complete the form below or call us directly.',
  ),
  t('contact.info.address', 'contact', 'Etiket: Adres', 'SHORT', 'Adres', 'Address'),
  t('contact.info.phone', 'contact', 'Etiket: Telefon', 'SHORT', 'Telefon', 'Phone'),
  t('contact.info.email', 'contact', 'Etiket: E-posta', 'SHORT', 'E-mail', 'E-mail'),
  t('contact.info.hours', 'contact', 'Etiket: Çalışma saatleri', 'SHORT', 'Çalışma Saatleri', 'Working Hours'),
  t('contact.form.title', 'contact', 'Form başlığı', 'SHORT', 'İletişim formu', 'Contact form'),
  t('contact.form.name', 'contact', 'Form: Ad Soyad', 'SHORT', 'Ad Soyad', 'Full name'),
  t('contact.form.email', 'contact', 'Form: E-posta', 'SHORT', 'E-posta', 'E-mail'),
  t('contact.form.phone', 'contact', 'Form: Telefon', 'SHORT', 'Telefon', 'Phone'),
  t('contact.form.subject', 'contact', 'Form: Konu', 'SHORT', 'Konu', 'Subject'),
  t('contact.form.message', 'contact', 'Form: Mesaj', 'SHORT', 'Mesajınız', 'Your message'),
  t('contact.form.submit', 'contact', 'Form: Gönder', 'SHORT', 'Gönder', 'Send'),
  t('contact.form.sending', 'contact', 'Form: Gönderiliyor', 'SHORT', 'Gönderiliyor…', 'Sending…'),
  t(
    'contact.form.success',
    'contact',
    'Form: Başarı mesajı',
    'LONG',
    'Mesajınız iletildi. En kısa sürede size dönüş yapacağız.',
    'Your message has been sent. We will get back to you shortly.',
  ),
  t(
    'contact.form.error',
    'contact',
    'Form: Hata mesajı',
    'LONG',
    'Mesaj gönderilemedi. Lütfen tekrar deneyin veya telefonla ulaşın.',
    'The message could not be sent. Please try again or contact us by phone.',
  ),
  t(
    'contact.form.consent',
    'contact',
    'Form: KVKK notu',
    'LONG',
    'Form aracılığıyla ilettiğiniz bilgiler yalnızca talebinizin değerlendirilmesi amacıyla işlenir. Formun gönderilmesi avukat–müvekkil ilişkisi kurmaz.',
    'The information you submit through this form is processed solely to assess your request. Submitting the form does not create an attorney–client relationship.',
  ),

  // --- Yayınlar ---
  t('publications.hero.eyebrow', 'publications', 'Üst etiket', 'SHORT', 'Yayınlar', 'Publications'),
  t('publications.hero.title', 'publications', 'Sayfa başlığı', 'LONG', 'Yazılar ve değerlendirmeler', 'Articles and commentary'),
  t(
    'publications.hero.subtitle',
    'publications',
    'Sayfa alt başlığı',
    'LONG',
    'Mevzuat değişiklikleri ve uygulamadaki gelişmelere ilişkin kısa değerlendirmeler.',
    'Short commentary on legislative changes and developments in practice.',
  ),
  t(
    'publications.empty',
    'publications',
    'Boş liste metni',
    'LONG',
    'Bu bölüm hazırlanıyor. Yakında burada yayınlarımızı bulabileceksiniz.',
    'This section is being prepared. Our publications will appear here soon.',
  ),

  // --- Alt bilgi ---
  t('footer.about.title', 'footer', 'Alt bilgi: kısa tanıtım başlığı', 'SHORT', 'Çetiner Hukuk ve Danışmanlık', 'Çetiner Hukuk ve Danışmanlık'),
  t(
    'footer.about.body',
    'footer',
    'Alt bilgi: kısa tanıtım',
    'LONG',
    'Bireysel ve kurumsal müvekkillere hukuki danışmanlık ve temsil hizmeti sunuyoruz.',
    'We provide legal advisory and representation services to individual and corporate clients.',
  ),
  t('footer.nav.title', 'footer', 'Alt bilgi: menü başlığı', 'SHORT', 'Sayfalar', 'Pages'),
  t('footer.contact.title', 'footer', 'Alt bilgi: iletişim başlığı', 'SHORT', 'İletişim', 'Contact'),
  t(
    'footer.disclaimer',
    'footer',
    'Alt bilgi: yasal uyarı',
    'LONG',
    'Bu internet sitesindeki bilgiler genel bilgilendirme amaçlıdır, hukuki görüş niteliği taşımaz. Türkiye Barolar Birliği Reklam Yasağı Yönetmeliği uyarınca hazırlanmıştır.',
    'The information on this website is for general information purposes only and does not constitute legal advice. It has been prepared in accordance with the Advertising Ban Regulation of the Union of Turkish Bar Associations.',
  ),
  t('footer.copyright', 'footer', 'Alt bilgi: telif', 'SHORT', 'Tüm hakları saklıdır.', 'All rights reserved.'),
]

// ---------------------------------------------------------------------------
// Görsel yuvaları — her biri panelden ayrı ayrı değiştirilebilir
// ---------------------------------------------------------------------------
let slotOrder = 0
const m = (
  key: string,
  group: string,
  label: string,
  altTr: string,
  altEn: string,
  bundled?: { width: number; height: number },
): MediaSlotDefault => ({
  key,
  group,
  label,
  order: slotOrder++,
  altTr,
  altEn,
  ...(bundled ? { bundled: { src: `/defaults/${key}.webp`, ...bundled } } : {}),
})

const HERO = { width: 2400, height: 1350 }
const BODY = { width: 1600, height: 1280 }

export const mediaSlotDefaults: MediaSlotDefault[] = [
  // Anasayfa hero'suna bilerek paket görsel verilmedi — müşteri isteği:
  // fotoğraf yüklenene kadar düz lacivert kalsın.
  m('home.hero.image', 'home', 'Anasayfa hero görseli', 'Büro çalışma alanı', 'Office working area'),
  m('home.intro.image', 'home', 'Anasayfa tanıtım görseli', 'Belge imzalayan el', 'A hand signing a document', BODY),
  m('home.cta.background', 'home', 'Anasayfa alt CTA arka planı', 'Arka plan dokusu', 'Background texture', { width: 1920, height: 800 }),
  m('about.hero.image', 'about', 'Hakkımızda hero görseli', 'Kütüphanede mermer büstler ve eski kitaplar', 'Marble busts and old books in a library', HERO),
  m('about.body.image', 'about', 'Hakkımızda bölüm görseli', 'Kitaplık rafları', 'Bookshelves', BODY),
  m('services.hero.image', 'services', 'Hizmetler hero görseli', 'Ahşap tokmak yakın çekimi', 'Close-up of a wooden gavel', HERO),
  m('legalServices.hero.image', 'legalServices', 'Avukatlık ve Danışmanlık hero görseli', 'Adalet heykeli', 'Statue of Lady Justice', HERO),
  m('mediation.hero.image', 'mediation', 'Arabuluculuk hero görseli', 'Boş toplantı salonu', 'Empty boardroom', HERO),
  m('team.hero.image', 'team', 'Ekibimiz hero görseli', 'Cam bölmeli ofis koridoru', 'Office corridor with glass partitions', HERO),
  m('contact.hero.image', 'contact', 'İletişim hero görseli', 'Yüksek ofis binaları', 'High-rise office buildings', HERO),
  m('publications.hero.image', 'publications', 'Yayınlar hero görseli', 'Kitaplarla dolu kütüphane duvarı', 'Library wall full of books', HERO),
  m('seo.defaultOg', 'seo', 'Varsayılan paylaşım görseli (OG)', 'Çetiner Hukuk ve Danışmanlık', 'Çetiner Hukuk ve Danışmanlık', { width: 1200, height: 630 }),
]

// ---------------------------------------------------------------------------
// Hizmet alanları
// ---------------------------------------------------------------------------
export interface ServiceDefault {
  slugTr: string
  slugEn: string
  icon: string
  titleTr: string
  titleEn: string
  excerptTr: string
  excerptEn: string
  bodyTr: string
  bodyEn: string
  featured: boolean
}

export const serviceDefaults: ServiceDefault[] = [
  {
    slugTr: 'is-hukuku',
    slugEn: 'labour-law',
    icon: 'briefcase',
    titleTr: 'İş Hukuku',
    titleEn: 'Labour Law',
    excerptTr:
      'İşçi ve işveren tarafında fesih, kıdem–ihbar alacakları, iş kazası ve hizmet tespiti uyuşmazlıkları.',
    excerptEn:
      'Termination, severance and notice claims, occupational accidents and service determination disputes, on both the employee and employer side.',
    bodyTr:
      '<p>İş ilişkisinin kurulmasından sona ermesine kadar geçen sürecin tamamında danışmanlık veriyor, uyuşmazlık hâlinde her iki tarafı da temsil ediyoruz.</p><h3>Kapsam</h3><ul><li>İş sözleşmelerinin hazırlanması ve gözden geçirilmesi</li><li>Fesih süreçlerinin yürütülmesi, ihtarname ve savunma istem yazıları</li><li>İşe iade davaları</li><li>Kıdem tazminatı, ihbar tazminatı, fazla mesai ve yıllık izin alacakları</li><li>İş kazası ve meslek hastalığından doğan tazminat talepleri</li><li>Hizmet tespiti davaları</li><li>Rekabet yasağı ve gizlilik taahhütleri</li><li>İşyeri yönetmelikleri ve disiplin süreçlerinin mevzuata uyumu</li></ul><h3>Not</h3><p>İş hukuku uyuşmazlıklarının önemli bir kısmında dava açılmadan önce arabulucuya başvurmak dava şartıdır; bu aşama da büromuz tarafından yürütülür.</p>',
    bodyEn:
      '<p>We advise throughout the employment relationship, from formation to termination, and represent both sides in the event of a dispute.</p><h3>Scope</h3><ul><li>Drafting and reviewing employment contracts</li><li>Conducting termination processes, formal notices and requests for written defence</li><li>Reinstatement actions</li><li>Severance pay, notice pay, overtime and annual leave claims</li><li>Compensation claims arising from occupational accidents and diseases</li><li>Service determination actions</li><li>Non-compete and confidentiality undertakings</li><li>Compliance of workplace regulations and disciplinary processes with legislation</li></ul><h3>Note</h3><p>For a significant portion of labour disputes, applying to a mediator before filing suit is a procedural precondition; this stage is also handled by our office.</p>',
    featured: true,
  },
  {
    slugTr: 'ticaret-hukuku',
    slugEn: 'commercial-law',
    icon: 'building',
    titleTr: 'Ticaret Hukuku',
    titleEn: 'Commercial Law',
    excerptTr:
      'Şirketler hukuku, ticari sözleşmeler, ortaklık ilişkileri ve ticari uyuşmazlıkların çözümü.',
    excerptEn:
      'Company law, commercial contracts, shareholder relations and the resolution of commercial disputes.',
    bodyTr:
      '<p>Şirketin kuruluşundan pay devrine, günlük ticari sözleşmelerden ortaklar arası uyuşmazlıklara kadar geniş bir alanda hizmet veriyoruz.</p><h3>Kapsam</h3><ul><li>Şirket kuruluşu, tür değiştirme, birleşme ve bölünme işlemleri</li><li>Esas sözleşme ve pay sahipleri sözleşmesi hazırlanması</li><li>Genel kurul ve yönetim kurulu süreçlerinin yürütülmesi</li><li>Pay devri ve ortaklıktan çıkma–çıkarılma</li><li>Ticari sözleşmelerin hazırlanması ve müzakeresi</li><li>Cari hesap ve alacak uyuşmazlıkları</li><li>Haksız rekabet</li><li>Kıymetli evraktan doğan uyuşmazlıklar</li></ul>',
    bodyEn:
      '<p>We provide services across a broad field, from company formation to share transfers, and from day-to-day commercial contracts to disputes between shareholders.</p><h3>Scope</h3><ul><li>Company formation, conversion, merger and division transactions</li><li>Drafting articles of association and shareholders’ agreements</li><li>Conducting general assembly and board of directors processes</li><li>Share transfers and withdrawal or exclusion from a company</li><li>Drafting and negotiating commercial contracts</li><li>Current account and receivable disputes</li><li>Unfair competition</li><li>Disputes arising from negotiable instruments</li></ul>',
    featured: true,
  },
  {
    slugTr: 'aile-hukuku',
    slugEn: 'family-law',
    icon: 'heart',
    titleTr: 'Aile Hukuku',
    titleEn: 'Family Law',
    excerptTr:
      'Boşanma, velayet, nafaka, mal rejimi tasfiyesi ve aile içi hukuki koruma tedbirleri.',
    excerptEn:
      'Divorce, custody, alimony, liquidation of the matrimonial property regime and protective measures.',
    bodyTr:
      '<p>Aile hukuku dosyaları hukuki olduğu kadar kişisel süreçlerdir. Bu dosyalarda gizlilik ve ölçülü iletişim ayrıca önem taşır.</p><h3>Kapsam</h3><ul><li>Anlaşmalı ve çekişmeli boşanma davaları</li><li>Velayet, kişisel ilişki kurulması ve değişiklik talepleri</li><li>Tedbir, iştirak ve yoksulluk nafakası</li><li>Maddi ve manevi tazminat talepleri</li><li>Mal rejiminin tasfiyesi ve katılma alacağı</li><li>Aile konutu şerhi</li><li>6284 sayılı Kanun kapsamında koruyucu ve önleyici tedbirler</li><li>Soybağı ve babalık davaları</li></ul>',
    bodyEn:
      '<p>Family law files are personal as much as legal. Confidentiality and measured communication are of particular importance in these matters.</p><h3>Scope</h3><ul><li>Uncontested and contested divorce actions</li><li>Custody, contact arrangements and applications to vary them</li><li>Interim, child and spousal maintenance</li><li>Pecuniary and non-pecuniary damages claims</li><li>Liquidation of the matrimonial property regime and participation claims</li><li>Family residence annotation</li><li>Protective and preventive measures under Law No. 6284</li><li>Parentage and paternity actions</li></ul>',
    featured: true,
  },
  {
    slugTr: 'ceza-hukuku',
    slugEn: 'criminal-law',
    icon: 'gavel',
    titleTr: 'Ceza Hukuku',
    titleEn: 'Criminal Law',
    excerptTr:
      'Soruşturma ve kovuşturma aşamalarında şüpheli, sanık ve mağdur vekilliği.',
    excerptEn:
      'Representation of suspects, defendants and complainants at the investigation and prosecution stages.',
    bodyTr:
      '<p>Ceza dosyalarında ilk saatlerde alınan kararlar sürecin tamamını etkiler. Bu nedenle soruşturma aşamasından itibaren dosyada bulunmayı esas alıyoruz.</p><h3>Kapsam</h3><ul><li>Kolluk ve savcılık ifadelerinde müdafilik</li><li>Tutuklama, adli kontrol ve itiraz süreçleri</li><li>İddianameye karşı savunma ve delil toplama talepleri</li><li>Kovuşturma aşamasında duruşma takibi</li><li>Mağdur ve katılan vekilliği</li><li>İstinaf ve temyiz başvuruları</li><li>Ekonomik suçlar ve bilişim suçları</li></ul>',
    bodyEn:
      '<p>In criminal files, decisions taken in the first hours affect the entire process. For this reason we consider it essential to be involved from the investigation stage onwards.</p><h3>Scope</h3><ul><li>Defence counsel at police and prosecutor interviews</li><li>Detention, judicial control and objection procedures</li><li>Defence against the indictment and applications for evidence gathering</li><li>Hearing attendance at the prosecution stage</li><li>Representation of complainants and intervening parties</li><li>Appeals to the regional court and the Court of Cassation</li><li>Economic offences and cybercrime</li></ul>',
    featured: true,
  },
  {
    slugTr: 'gayrimenkul-hukuku',
    slugEn: 'real-estate-law',
    icon: 'home',
    titleTr: 'Gayrimenkul Hukuku',
    titleEn: 'Real Estate Law',
    excerptTr:
      'Tapu işlemleri, kat karşılığı inşaat sözleşmeleri, kira uyuşmazlıkları ve ortaklığın giderilmesi.',
    excerptEn:
      'Title deed transactions, construction-for-flat agreements, lease disputes and dissolution of co-ownership.',
    bodyTr:
      '<p>Gayrimenkul işlemlerinde sözleşmenin imzalanmasından önce yapılan inceleme, sonradan yürütülecek her davadan daha belirleyicidir.</p><h3>Kapsam</h3><ul><li>Tapu kaydı ve imar durumu incelemesi</li><li>Satış vaadi ve kat karşılığı inşaat sözleşmeleri</li><li>Tapu iptali ve tescil davaları</li><li>Kira sözleşmeleri, tahliye ve kira tespiti davaları</li><li>Ortaklığın giderilmesi (izale-i şuyu)</li><li>Kamulaştırma ve kamulaştırmasız el atma</li><li>Kat mülkiyeti ve yönetim planı uyuşmazlıkları</li><li>Ayıplı ifa ve gecikme tazminatı talepleri</li></ul>',
    bodyEn:
      '<p>In real estate transactions, the due diligence carried out before signature is more decisive than any action pursued afterwards.</p><h3>Scope</h3><ul><li>Review of title records and zoning status</li><li>Promises to sell and construction-for-flat agreements</li><li>Actions for cancellation of title and registration</li><li>Lease agreements, eviction actions and rent determination</li><li>Dissolution of co-ownership</li><li>Expropriation and de facto expropriation</li><li>Condominium ownership and management plan disputes</li><li>Defective performance and delay compensation claims</li></ul>',
    featured: true,
  },
  {
    slugTr: 'icra-ve-iflas-hukuku',
    slugEn: 'enforcement-and-bankruptcy-law',
    icon: 'file',
    titleTr: 'İcra ve İflas Hukuku',
    titleEn: 'Enforcement and Bankruptcy Law',
    excerptTr:
      'Alacak takibi, haciz işlemleri, itirazın iptali ve konkordato süreçleri.',
    excerptEn:
      'Debt collection, attachment proceedings, annulment of objections and composition proceedings.',
    bodyTr:
      '<p>Alacağın tahsili, kâğıt üzerindeki haktan farklıdır. Takibin doğru türde başlatılması ve borçlunun mal varlığının zamanında araştırılması sonucu belirler.</p><h3>Kapsam</h3><ul><li>İlamlı ve ilamsız icra takipleri</li><li>Kambiyo senetlerine özgü takip</li><li>İtirazın iptali ve itirazın kaldırılması davaları</li><li>Haciz, satış ve paraya çevirme işlemleri</li><li>İstihkak davaları</li><li>Borca ve imzaya itiraz</li><li>İflas ve iflasın ertelenmesi</li><li>Konkordato süreçlerinde alacaklı ve borçlu temsili</li></ul>',
    bodyEn:
      '<p>Collecting a debt is different from holding a right on paper. Starting the correct type of proceedings and investigating the debtor’s assets in good time determines the outcome.</p><h3>Scope</h3><ul><li>Enforcement proceedings with and without a judgment</li><li>Proceedings specific to negotiable instruments</li><li>Actions for annulment and removal of objections</li><li>Attachment, sale and realisation procedures</li><li>Claims of ownership over attached assets</li><li>Objections to the debt and to the signature</li><li>Bankruptcy and postponement of bankruptcy</li><li>Representation of creditors and debtors in composition proceedings</li></ul>',
    featured: false,
  },
  {
    slugTr: 'miras-hukuku',
    slugEn: 'inheritance-law',
    icon: 'scroll',
    titleTr: 'Miras Hukuku',
    titleEn: 'Inheritance Law',
    excerptTr:
      'Veraset işlemleri, tenkis ve muris muvazaası davaları, mirasın paylaşımı ve vasiyetname.',
    excerptEn:
      'Succession procedures, abatement and simulated transfer actions, division of the estate and wills.',
    bodyTr:
      '<p>Miras uyuşmazlıkları çoğu zaman aile ilişkileriyle iç içe geçer. Mümkün olduğunda anlaşma yoluyla çözümü tercih ederiz.</p><h3>Kapsam</h3><ul><li>Mirasçılık belgesi (veraset ilamı) alınması</li><li>Mirasın reddi ve reddin iptali</li><li>Tereke tespiti ve tereke davaları</li><li>Mirasın taksimi ve ortaklığın giderilmesi</li><li>Tenkis davaları</li><li>Muris muvazaası (mirastan mal kaçırma) davaları</li><li>Vasiyetname düzenlenmesi, iptali ve tenfizi</li><li>Miras sözleşmesi ve ölüme bağlı tasarruflar</li></ul>',
    bodyEn:
      '<p>Inheritance disputes are often intertwined with family relationships. Where possible we prefer resolution by agreement.</p><h3>Scope</h3><ul><li>Obtaining a certificate of inheritance</li><li>Renunciation of inheritance and annulment of renunciation</li><li>Determination of the estate and estate actions</li><li>Division of the estate and dissolution of co-ownership</li><li>Actions for abatement</li><li>Actions concerning simulated transfers by the deceased</li><li>Drafting, annulment and execution of wills</li><li>Inheritance agreements and dispositions upon death</li></ul>',
    featured: false,
  },
  {
    slugTr: 'idare-hukuku',
    slugEn: 'administrative-law',
    icon: 'landmark',
    titleTr: 'İdare Hukuku',
    titleEn: 'Administrative Law',
    excerptTr:
      'İptal ve tam yargı davaları, idari para cezalarına itiraz, memur disiplin süreçleri.',
    excerptEn:
      'Annulment and full remedy actions, objections to administrative fines and civil servant disciplinary proceedings.',
    bodyTr:
      '<p>İdari davalarda süreler kısadır ve çoğu zaman hak düşürücüdür. Tebligatın alındığı tarih, dosyanın en kritik bilgisidir.</p><h3>Kapsam</h3><ul><li>İdari işlemin iptali davaları</li><li>Tam yargı (tazminat) davaları</li><li>İdari para cezalarına itiraz</li><li>Memur ve kamu görevlisi disiplin soruşturmaları</li><li>Kamu ihale uyuşmazlıkları ve itirazen şikâyet başvuruları</li><li>İmar planı ve yapı ruhsatı uyuşmazlıkları</li><li>Vergi uyuşmazlıklarında dava ve uzlaşma süreçleri</li><li>Yürütmenin durdurulması talepleri</li></ul>',
    bodyEn:
      '<p>Deadlines in administrative litigation are short and are usually mandatory. The date of service of notification is the most critical piece of information in the file.</p><h3>Scope</h3><ul><li>Actions for annulment of administrative acts</li><li>Full remedy (compensation) actions</li><li>Objections to administrative fines</li><li>Disciplinary investigations concerning civil servants and public officials</li><li>Public procurement disputes and complaint applications</li><li>Zoning plan and building permit disputes</li><li>Litigation and settlement procedures in tax disputes</li><li>Applications for a stay of execution</li></ul>',
    featured: false,
  },
  {
    slugTr: 'sigorta-hukuku',
    slugEn: 'insurance-law',
    icon: 'shield',
    titleTr: 'Sigorta Hukuku',
    titleEn: 'Insurance Law',
    excerptTr:
      'Trafik kazası tazminatları, hasar ödemeleri, rücu davaları ve Tahkim Komisyonu başvuruları.',
    excerptEn:
      'Traffic accident compensation, claim payments, recourse actions and Arbitration Commission applications.',
    bodyTr:
      '<p>Sigorta uyuşmazlıklarında ödenen tutar ile hak edilen tutar çoğu zaman aynı değildir. Aktüeryal hesap ve kusur oranı belirleyicidir.</p><h3>Kapsam</h3><ul><li>Trafik kazasından kaynaklanan maddi ve manevi tazminat talepleri</li><li>Destekten yoksun kalma tazminatı</li><li>Sürekli iş göremezlik tazminatı</li><li>Kasko ve zorunlu trafik sigortası uyuşmazlıkları</li><li>Sigorta Tahkim Komisyonu başvuruları</li><li>Rücu davaları</li><li>Hayat, sağlık ve ferdi kaza sigortası uyuşmazlıkları</li><li>Poliçe kapsamının ve istisnaların değerlendirilmesi</li></ul>',
    bodyEn:
      '<p>In insurance disputes, the amount paid and the amount due are often not the same. Actuarial calculation and the apportionment of fault are decisive.</p><h3>Scope</h3><ul><li>Pecuniary and non-pecuniary damages claims arising from traffic accidents</li><li>Loss of financial support compensation</li><li>Permanent incapacity compensation</li><li>Comprehensive and compulsory motor insurance disputes</li><li>Applications to the Insurance Arbitration Commission</li><li>Recourse actions</li><li>Life, health and personal accident insurance disputes</li><li>Assessment of policy coverage and exclusions</li></ul>',
    featured: false,
  },
  {
    slugTr: 'fikri-mulkiyet-hukuku',
    slugEn: 'intellectual-property-law',
    icon: 'sparkle',
    titleTr: 'Fikri Mülkiyet Hukuku',
    titleEn: 'Intellectual Property Law',
    excerptTr:
      'Marka ve patent başvuruları, tecavüzün önlenmesi, telif hakları ve lisans sözleşmeleri.',
    excerptEn:
      'Trademark and patent applications, prevention of infringement, copyright and licence agreements.',
    bodyTr:
      '<p>Marka, çoğu işletmenin en değerli varlığıdır ve korunması tescille başlar. Tescilsiz kullanım, hak kaybına açıktır.</p><h3>Kapsam</h3><ul><li>Marka, tasarım ve patent başvurularının yürütülmesi</li><li>Yayına itiraz ve karara itiraz süreçleri</li><li>Marka hükümsüzlüğü ve iptal davaları</li><li>Tecavüzün tespiti, önlenmesi ve tazminat davaları</li><li>Lisans ve devir sözleşmeleri</li><li>Telif hakları ve eser sahipliği uyuşmazlıkları</li><li>Alan adı uyuşmazlıkları</li><li>Ticari sır ve know-how korunması</li></ul>',
    bodyEn:
      '<p>A trademark is the most valuable asset of most businesses, and its protection begins with registration. Unregistered use is exposed to loss of rights.</p><h3>Scope</h3><ul><li>Conducting trademark, design and patent applications</li><li>Opposition to publication and appeals against decisions</li><li>Trademark invalidity and revocation actions</li><li>Actions for determination and prevention of infringement and for damages</li><li>Licence and assignment agreements</li><li>Copyright and authorship disputes</li><li>Domain name disputes</li><li>Protection of trade secrets and know-how</li></ul>',
    featured: false,
  },
]

// ---------------------------------------------------------------------------
// Ekip (jenerik yer tutucu — gerçek kişi bilgisi değildir)
// ---------------------------------------------------------------------------
export interface TeamDefault {
  slug: string
  name: string
  titleTr: string
  titleEn: string
  bioTr: string
  bioEn: string
  expertiseTr: string
  expertiseEn: string
  email: string
}

export const teamDefaults: TeamDefault[] = [
  {
    slug: 'av-ad-soyad-1',
    name: 'Av. Ad Soyad',
    titleTr: 'Kurucu Avukat',
    titleEn: 'Founding Lawyer',
    bioTr:
      '<p>Bu alan bir yer tutucudur; panelden gerçek özgeçmişle değiştirilecektir. Kurucu avukatın eğitim geçmişi, baro kaydı ve çalışma alanları burada yer alacaktır.</p>',
    bioEn:
      '<p>This section is a placeholder and will be replaced with the actual biography from the admin panel. The founding lawyer’s education, bar registration and practice areas will appear here.</p>',
    expertiseTr: 'Ticaret Hukuku\nİş Hukuku\nSözleşmeler Hukuku',
    expertiseEn: 'Commercial Law\nLabour Law\nContract Law',
    email: '',
  },
  {
    slug: 'av-ad-soyad-2',
    name: 'Av. Ad Soyad',
    titleTr: 'Avukat',
    titleEn: 'Lawyer',
    bioTr:
      '<p>Bu alan bir yer tutucudur; panelden gerçek özgeçmişle değiştirilecektir.</p>',
    bioEn: '<p>This section is a placeholder and will be replaced from the admin panel.</p>',
    expertiseTr: 'Aile Hukuku\nMiras Hukuku\nGayrimenkul Hukuku',
    expertiseEn: 'Family Law\nInheritance Law\nReal Estate Law',
    email: '',
  },
  {
    slug: 'av-ad-soyad-3',
    name: 'Av. Ad Soyad',
    titleTr: 'Avukat, Arabulucu',
    titleEn: 'Lawyer, Mediator',
    bioTr:
      '<p>Bu alan bir yer tutucudur; panelden gerçek özgeçmişle değiştirilecektir.</p>',
    bioEn: '<p>This section is a placeholder and will be replaced from the admin panel.</p>',
    expertiseTr: 'Arabuluculuk\nİş Hukuku\nTicari Uyuşmazlıklar',
    expertiseEn: 'Mediation\nLabour Law\nCommercial Disputes',
    email: '',
  },
  {
    slug: 'ad-soyad-4',
    name: 'Ad Soyad',
    titleTr: 'Ofis Yöneticisi',
    titleEn: 'Office Manager',
    bioTr:
      '<p>Bu alan bir yer tutucudur; panelden gerçek bilgiyle değiştirilecektir.</p>',
    bioEn: '<p>This section is a placeholder and will be replaced from the admin panel.</p>',
    expertiseTr: 'Dosya takibi\nMüvekkil iletişimi',
    expertiseEn: 'File management\nClient communication',
    email: '',
  },
]

// ---------------------------------------------------------------------------
// Örnek iletişim bilgileri
//
// Site boş görünmesin diye seed bunları doldurur, ama hepsi AÇIKÇA yer
// tutucudur — gerçek bir adres, telefon veya hesap değildir. "Örnek verileri
// sil" düğmesi yalnızca değeri hâlâ buradakiyle aynı olan alanları boşaltır;
// siz gerçek bilgiyi girdiyseniz ona dokunmaz.
// ---------------------------------------------------------------------------
export const settingsExample = {
  taglineTr: 'Hukuki danışmanlık ve temsil',
  taglineEn: 'Legal advisory and representation',
  phone: '+90 (312) 000 00 00',
  phoneSecondary: '',
  email: 'info@cetinerlegal.com',
  addressTr: 'Örnek Mahallesi, Örnek Caddesi No: 1 Kat: 3\nÇankaya / Ankara',
  addressEn: 'Örnek Mahallesi, Örnek Caddesi No: 1 Kat: 3\nÇankaya / Ankara',
  workingHoursTr: 'Pazartesi – Cuma, 09:00 – 18:00',
  workingHoursEn: 'Monday – Friday, 09:00 – 18:00',
  linkedin: '',
  instagram: '',
  x: '',
  facebook: '',
  youtube: '',
  // Harita bilerek boş: sahte bir adresi haritada göstermek yanıltıcı olur.
  mapEmbedUrl: '',
  // Abone kısmı tamamen sıfır: hiçbir operatörde tahsis edilmeyen, bakar bakmaz
  // "örnek" olduğu anlaşılan bir numara. Rastgele bir numara yazsaydık gerçek
  // birine düşebilirdi. Böylece WhatsApp baloncuğu örnek veride de görünüyor.
  whatsappNumber: '+90 (500) 000 00 00',
  whatsappTextTr: 'Merhaba, web siteniz üzerinden yazıyorum. Bir konuda danışmak istiyorum.',
  whatsappTextEn: 'Hello, I am writing via your website. I would like to consult you on a matter.',
  autoReplyTr:
    'Merhaba,\n\nMesajınız tarafımıza ulaştı. En kısa sürede size dönüş yapacağız.\n\nBu ileti otomatik olarak gönderilmiştir; lütfen yanıtlamayınız.\n\nÇetiner Hukuk ve Danışmanlık',
  autoReplyEn:
    'Hello,\n\nWe have received your message and will get back to you shortly.\n\nThis is an automated message; please do not reply.\n\nÇetiner Hukuk ve Danışmanlık',
} as const

/** Seed'in doldurduğu ayar alanları — temizlemede aynı liste kullanılır. */
export const settingsExampleFields = Object.keys(settingsExample) as (keyof typeof settingsExample)[]

// ---------------------------------------------------------------------------
// Terim sözlüğü — çeviri system prompt'una buradan basılır, panelden düzenlenir
// ---------------------------------------------------------------------------
export const glossaryDefaults: { tr: string; en: string }[] = [
  { tr: 'İş Hukuku', en: 'Labour Law' },
  { tr: 'Ticaret Hukuku', en: 'Commercial Law' },
  { tr: 'Aile Hukuku', en: 'Family Law' },
  { tr: 'Ceza Hukuku', en: 'Criminal Law' },
  { tr: 'Miras Hukuku', en: 'Inheritance Law' },
  { tr: 'Gayrimenkul Hukuku', en: 'Real Estate Law' },
  { tr: 'İcra ve İflas Hukuku', en: 'Enforcement and Bankruptcy Law' },
  { tr: 'İdare Hukuku', en: 'Administrative Law' },
  { tr: 'Sigorta Hukuku', en: 'Insurance Law' },
  { tr: 'Fikri Mülkiyet Hukuku', en: 'Intellectual Property Law' },
  { tr: 'Arabuluculuk', en: 'Mediation' },
  { tr: 'Avukatlık ve Danışmanlık', en: 'Legal Representation and Advisory' },
  { tr: 'Hizmetlerimiz', en: 'Our Services' },
  { tr: 'Hakkımızda', en: 'About Us' },
  { tr: 'Ekibimiz', en: 'Our Team' },
  { tr: 'İletişim', en: 'Contact' },
  { tr: 'Yayınlar', en: 'Publications' },
  { tr: 'müvekkil', en: 'client' },
  { tr: 'dava', en: 'action / lawsuit' },
  { tr: 'uyuşmazlık', en: 'dispute' },
  { tr: 'sözleşme', en: 'contract' },
  { tr: 'tazminat', en: 'compensation / damages' },
  { tr: 'icra takibi', en: 'enforcement proceedings' },
  { tr: 'tebligat', en: 'service of notification' },
  { tr: 'vekâletname', en: 'power of attorney' },
]

// ---------------------------------------------------------------------------
// Menü etiketleri
// ---------------------------------------------------------------------------
export const menuDefaults: { routeKey: string; labelTr: string; labelEn: string; visible: boolean }[] = [
  { routeKey: 'home', labelTr: 'Anasayfa', labelEn: 'Home', visible: true },
  { routeKey: 'about', labelTr: 'Hakkımızda', labelEn: 'About Us', visible: true },
  { routeKey: 'services', labelTr: 'Hizmetlerimiz', labelEn: 'Our Services', visible: true },
  {
    routeKey: 'legalServices',
    labelTr: 'Avukatlık ve Danışmanlık',
    labelEn: 'Legal Representation and Advisory',
    visible: true,
  },
  { routeKey: 'mediation', labelTr: 'Arabuluculuk', labelEn: 'Mediation', visible: true },
  { routeKey: 'team', labelTr: 'Ekibimiz', labelEn: 'Our Team', visible: true },
  { routeKey: 'contact', labelTr: 'İletişim', labelEn: 'Contact', visible: true },
  // Brief gereği Yayınlar altyapısı kurulu ama KAPALI geliyor.
  { routeKey: 'publications', labelTr: 'Yayınlar', labelEn: 'Publications', visible: false },
]

// ---------------------------------------------------------------------------
// Sayfa bazlı SEO varsayılanları
// ---------------------------------------------------------------------------
export const seoDefaults: {
  routeKey: string
  titleTr: string
  titleEn: string
  descTr: string
  descEn: string
}[] = [
  {
    routeKey: 'home',
    titleTr: 'Çetiner Hukuk ve Danışmanlık',
    titleEn: 'Çetiner Hukuk ve Danışmanlık — Law Office',
    descTr:
      'Bireysel ve kurumsal müvekkillere iş, ticaret, aile, ceza, gayrimenkul ve miras hukuku alanlarında danışmanlık ve dava takibi hizmeti.',
    descEn:
      'Advisory services and litigation support for individual and corporate clients in labour, commercial, family, criminal, real estate and inheritance law.',
  },
  {
    routeKey: 'about',
    titleTr: 'Hakkımızda',
    titleEn: 'About Us',
    descTr:
      'Çetiner Hukuk ve Danışmanlık; önleyici hukuk anlayışı, açık iletişim ve özenli dosya takibi esasıyla çalışan bir hukuk bürosudur.',
    descEn:
      'Çetiner Hukuk ve Danışmanlık is a law office working on the basis of preventive law, clear communication and diligent file management.',
  },
  {
    routeKey: 'services',
    titleTr: 'Hizmetlerimiz',
    titleEn: 'Our Services',
    descTr:
      'İş, ticaret, aile, ceza, gayrimenkul, icra-iflas, miras, idare, sigorta ve fikri mülkiyet hukuku alanlarında hizmet veriyoruz.',
    descEn:
      'We provide services in labour, commercial, family, criminal, real estate, enforcement and bankruptcy, inheritance, administrative, insurance and intellectual property law.',
  },
  {
    routeKey: 'legalServices',
    titleTr: 'Avukatlık ve Danışmanlık',
    titleEn: 'Legal Representation and Advisory',
    descTr:
      'Dava ve icra takibi, sürekli hukuki danışmanlık, sözleşme yönetimi ve yazılı hukuki görüş hizmetlerimiz.',
    descEn:
      'Our litigation and enforcement, ongoing legal advisory, contract management and written legal opinion services.',
  },
  {
    routeKey: 'mediation',
    titleTr: 'Arabuluculuk',
    titleEn: 'Mediation',
    descTr:
      'Zorunlu ve ihtiyari arabuluculuk süreçlerinde temsil; uyuşmazlığın mahkeme dışında, hızlı ve gizli biçimde çözümü.',
    descEn:
      'Representation in mandatory and voluntary mediation; fast and confidential resolution of disputes outside the courtroom.',
  },
  {
    routeKey: 'team',
    titleTr: 'Ekibimiz',
    titleEn: 'Our Team',
    descTr: 'Dosyanızla ilgilenecek avukatlar ve çalışma alanları.',
    descEn: 'The lawyers who will handle your file and their practice areas.',
  },
  {
    routeKey: 'contact',
    titleTr: 'İletişim',
    titleEn: 'Contact',
    descTr: 'Adres, telefon, e-posta ve iletişim formu. Ön görüşme talepleriniz için bize ulaşın.',
    descEn: 'Address, phone, e-mail and contact form. Get in touch to request an initial meeting.',
  },
  {
    routeKey: 'publications',
    titleTr: 'Yayınlar',
    titleEn: 'Publications',
    descTr: 'Mevzuat değişiklikleri ve uygulamadaki gelişmelere ilişkin değerlendirmeler.',
    descEn: 'Commentary on legislative changes and developments in practice.',
  },
]

// Hızlı erişim için anahtar → varsayılan haritası
export const textDefaultMap: Record<string, TextDefault> = Object.fromEntries(
  textDefaults.map((d) => [d.key, d]),
)

export const mediaSlotDefaultMap: Record<string, MediaSlotDefault> = Object.fromEntries(
  mediaSlotDefaults.map((d) => [d.key, d]),
)
