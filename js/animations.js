// Animations JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Delay initializing animations to ensure DOM is fully parsed in all browsers (Firefox compatibility)
    setTimeout(() => {
        initializeGSAPAnimations();
        initializeScrollRevealAnimations();
        initializeTextAnimations();
        initializeLetterEffects();
        initializeParallaxEffect();
        initializeGlitchEffect();
        
        // Firefox specific fix for work cards
        document.querySelectorAll('.work-card').forEach(card => {
            card.style.transform = 'translateZ(0)';
        });
    }, 100);
});

function initializeGSAPAnimations() {
    if (typeof gsap !== 'undefined') {
        // Register GSAP ScrollTrigger plugin
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Hero section animations
        const heroTl = gsap.timeline({ delay: 0.5 });
        
        heroTl.from('.hero-title-line', {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.2')
        .from('.hero-cta .btn', {
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.2')
        .from('.shape', {
            scale: 0,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'elastic.out(1, 0.6)'
        }, '-=0.8');
        
        // About section animations
        gsap.from('.about-text p', {
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
        
        gsap.from('.skills-container', {
            scrollTrigger: {
                trigger: '.skills-container',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Work section animations
        gsap.from('.work-filter .filter-btn', {
            scrollTrigger: {
                trigger: '.work-filter',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power3.out'
        });
        
        gsap.from('.work-item', {
            scrollTrigger: {
                trigger: '.work-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });
        
        // Contact section animations
        gsap.from('.contact-info', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }
}

function initializeScrollRevealAnimations() {
    // Animation for section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        const title = header.querySelector('.section-title');
        const divider = header.querySelector('.section-divider');
        
        if (title && divider) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        title.classList.add('animate-title');
                        divider.classList.add('animate-divider');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(header);
        }
    });
    
    // Add CSS classes for these animations
    const style = document.createElement('style');
    style.textContent = `
        .section-title {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .section-divider {
            opacity: 0;
            width: 0;
            transition: opacity 0.6s ease, width 0.8s ease;
        }
        
        .animate-title {
            opacity: 1;
            transform: translateY(0);
        }
        
        .animate-divider {
            opacity: 1;
            width: 60px;
        }
    `;
    document.head.appendChild(style);
}

function initializeTextAnimations() {
    // Text scramble effect for headers (used in hero and elsewhere)
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    
    // Add style for scramble effect
    const style = document.createElement('style');
    style.textContent = `
        .scramble-char {
            color: var(--primary);
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
    
    // Apply text scramble to the hero title when it's in view
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('.hero-title-line');
        
        titleLines.forEach(line => {
            const phrases = [
                line.textContent,
                line.getAttribute(document.documentElement.lang === 'ru' ? 'data-ru' : 'data-en')
            ];
            
            const fx = new TextScramble(line);
            let counter = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Start the animation once when the element is in view
                        fx.setText(phrases[counter]).then(() => {
                            // Animation complete
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(line);
        });
    }
}
