// 1. LENIS KURULUMU
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// 2. MANYETİK İMLEÇ
const cursor = document.querySelector('.custom-cursor');
const cursorText = document.querySelector('.cursor-text');

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    });

    document.querySelectorAll('[data-cursor]').forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorText.textContent = item.getAttribute('data-cursor');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorText.textContent = '';
        });
    });
}

// 3. MENÜ YÖNLENDİRMELERİ
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        lenis.scrollTo(this.getAttribute('href'), { offset: -90, duration: 1.5 });
    });
});

// 4. OTOMATİK SLAYT (SLIDESHOW) MOTORU
// Her bento kutusu içindeki slaytları bul ve her 3 saniyede bir değiştir
const slideshows = document.querySelectorAll('.slideshow');

slideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll('.slide');
    if(slides.length > 1) { // Eğer 1'den fazla resim varsa döngüye sok
        let currentSlide = 0;
        
        setInterval(() => {
            // Önce mevcut resmin aktifliğini kaldır
            slides[currentSlide].classList.remove('active');
            
            // Sıradaki resme geç, sona geldiyse başa dön
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Yeni resmi aktif et
            slides[currentSlide].classList.add('active');
        }, 3500); // 3.5 saniyede bir değişir
    }
});

// 5. İÇSEL PARALLAX (VİDEO)
gsap.to(".parallax-inner", {
    yPercent: 20, ease: "none",
    scrollTrigger: { trigger: ".parallax-container", start: "top bottom", end: "bottom top", scrub: true }
});

// 6. GELİŞMİŞ SİNEMATİK KAYDIRMA ANİMASYONLARI
// Hero elementleri
gsap.from(".hero-bg", { scale: 1.2, opacity: 0, duration: 2, ease: "power3.out" });
gsap.from(".hero-title", { y: 60, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.3 });
gsap.from(".hero-logo", { y: 40, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.5 });

// Scroll edildikçe gelen bölümler (Daha etkileyici bir giriş)
const revealSections = gsap.utils.toArray('.gs-reveal');

revealSections.forEach(section => {
    const boxes = section.querySelectorAll('.gs-box');
    
    // Önce başlığı getir
    gsap.from(section.querySelector('.section-title'), {
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" }
    });
    
    // Sonra içindeki kutuları sırayla (stagger) ve hafif büyüyerek getir
    if(boxes.length > 0) {
        gsap.from(boxes, {
            y: 80,
            opacity: 0,
            scale: 0.95, // %95 boyuttan normal boyuta geçer
            duration: 1.2,
            stagger: 0.2, // Kutular arası 0.2 saniye gecikme
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%" }
        });
    }
});
