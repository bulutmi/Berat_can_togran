/* ==========================================================================
   1. LENIS KURULUMU (Üst Düzey Pürüzsüz Kaydırma / Smooth Scroll)
   ========================================================================== */
// Lenis'i başlatıyoruz. Bu ayarlar, kaydırma hissini en lüks seviyeye çeker.
const lenis = new Lenis({
    duration: 1.2, // Kaydırma süresi (yağ gibi akması için ideal)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Özel ivmeleme formülü
    smooth: true,
});

// Lenis'in sürekli çalışması için tarayıcının kendi animasyon döngüsüne entegre ediyoruz
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


/* ==========================================================================
   2. MENÜ YÖNLENDİRMELERİ (Tıklayınca o bölüme akarak gitme)
   ========================================================================== */
// Navigasyondaki tüm linkleri buluyoruz
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Tarayıcının varsayılan "anında atlama" huyunu engelliyoruz
        
        const targetId = this.getAttribute('href'); // Tıklanan linkin hedefini alıyoruz (örn: #services)
        
        // Lenis'in kendi motoruyla o bölüme kayıyoruz
        lenis.scrollTo(targetId, {
            offset: -90, // Yukarıdan navbar'ın yüksekliği kadar boşluk bırakıyoruz ki başlık kapanmasın
            duration: 1.5 // Tıklayarak giderken hızımız biraz daha ağır ve estetik olsun
        });
    });
});


/* ==========================================================================
   3. GSAP İLE ANİMASYONLAR (Scroll yaptıkça içeriklerin belirmesi)
   ========================================================================== */
// ScrollTrigger eklentisini GSAP'ye tanıtıyoruz
gsap.registerPlugin(ScrollTrigger);

// 3.1 ANA GİRİŞ (HERO) ANİMASYONU
// Sayfa ilk açıldığında büyük başlık aşağıdan yukarıya pürüzsüzce gelir
gsap.from(".hero-title", {
    y: 100, // 100 piksel aşağıdan başla
    opacity: 0, // Görünmez olarak başla
    duration: 1.5, // 1.5 saniyede tamamlansın
    ease: "power4.out", // Yavaşlayarak şık bir şekilde dursun
    delay: 0.2 // Sayfa yüklendikten çok kısa bir süre sonra başlasın
});

gsap.from(".hero-subtitle", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
    delay: 0.5 // Başlıktan hemen sonra bu gelsin
});

// 3.2 DİĞER BÖLÜMLERİN KAYDIRDIKÇA (SCROLL) BELİRMESİ
// Hero (Ana sayfa) hariç tüm section'ları buluyoruz
const sections = gsap.utils.toArray('section:not(.hero-section)');

sections.forEach(section => {
    gsap.from(section, {
        y: 60, // Aşağıdan yukarı hareket
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section, // Hangi bölüm ekrana girerse o tetiklensin
            start: "top 85%", // Bölümün en üstü, ekranın %85'ine geldiğinde animasyon başlar
            toggleActions: "play none none reverse" // Aşağı inerken oynat, yukarı çıkarken geri sar
        }
    });
});
