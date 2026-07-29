/* ==========================================================================
   1. LENIS - PÜRÜZSÜZ KAYDIRMA
   ========================================================================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* GSAP ScrollTrigger'ı Lenis ile senkronize ediyoruz */
gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   2. ÖZEL MANYETİK İMLEÇ (Sadece PC'de aktif)
   ========================================================================== */
const cursor = document.querySelector('.custom-cursor');
const cursorText = document.querySelector('.cursor-text');

// Eğer cihaz dokunmatik değilse (fare kullanılıyorsa) imleci oynat
if (window.matchMedia("(pointer: fine)").matches) {
    
    // Farenin ekrandaki konumunu gsap ile anlık takip et
    let mouseX = 0; let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // İmleci gecikmesiz olarak farenin merkezine yerleştir
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: "power2.out" });
    });

    // Yazı çıkması gereken "İncele" / "Git" gibi kutulara gelindiğinde
    const hoverItems = document.querySelectorAll('[data-cursor]');
    
    hoverItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('active'); // İmleci büyüt
            cursorText.textContent = item.getAttribute('data-cursor'); // İçine yazıyı yaz
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('active'); // Eski haline dön
            cursorText.textContent = '';
        });
    });
}

/* ==========================================================================
   3. MENÜ TIKLAMALARI İLE YUMUŞAK KAYMA
   ========================================================================== */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        lenis.scrollTo(targetId, { offset: -90, duration: 1.5 });
    });
});

/* ==========================================================================
   4. MARQUEE (KAYAN ŞERİT) SCROLL İLE HIZLANMASI
   ========================================================================== */
// Sayfadaki marquee şeritlerini yavaşça sürekli kaydır, sayfa aşağı kaydırıldıkça hızı artır
const marqueeTracks = document.querySelectorAll('.marquee-track');

marqueeTracks.forEach((track) => {
    let direction = track.getAttribute('dir') === 'rtl' ? 1 : -1;
    
    gsap.to(track, {
        xPercent: 50 * direction,
        ease: "none",
        scrollTrigger: {
            trigger: track,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 // Sayfa kaydırmasına (scroll) tepki verir
        }
    });
});

/* ==========================================================================
   5. İÇSEL PARALLAX (VİDEO İÇİN)
   ========================================================================== */
// Video veya resim kabının içinde kayarken hafifçe aşağı doğru hareket eder
gsap.to(".parallax-inner", {
    yPercent: 20, // Aşağı doğru %20 hareket
    ease: "none",
    scrollTrigger: {
        trigger: ".parallax-container",
        start: "top bottom", // Konteyner ekranın altına değdiğinde başlar
        end: "bottom top",   // Ekranda kaybolana kadar sürer
        scrub: true          // Scroll hızına bağlanır
    }
});

/* ==========================================================================
   6. YAZILARIN AŞAĞIDAN BELİRMESİ
   ========================================================================== */
gsap.from(".hero-title", { y: 100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.2 });
gsap.from(".hero-subtitle", { y: 50, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.5 });

const sections = gsap.utils.toArray('section:not(.hero-section)');
sections.forEach(section => {
    gsap.from(section, {
        y: 60, opacity: 0, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none reverse" }
    });
});

