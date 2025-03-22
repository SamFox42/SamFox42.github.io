function initializeLetterEffects() {
    const elements = document.querySelectorAll('.section-title, .work-title');
    
    elements.forEach(element => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = element.textContent;
                    let newHtml = '';
                    
                    for (let i = 0; i < text.length; i++) {
                        if (text[i] === ' ') {
                            newHtml += ' ';
                        } else {
                            newHtml += `<span class="letter" style="animation-delay: ${i * 0.05}s">${text[i]}</span>`;
                        }
                    }
                    
                    element.innerHTML = newHtml;
                    element.classList.add('animate-letters');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .animate-letters .letter {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            animation: letterFadeIn 0.5s forwards;
        }
        
        @keyframes letterFadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function initializeParallaxEffect() {
    // Add Firefox specific fixes for work cards
    const style = document.createElement('style');
    style.textContent = `
        /* Firefox specific fixes */
        @-moz-document url-prefix() {
            .work-card {
                transform-style: preserve-3d;
                will-change: transform;
            }
            .work-card-front, 
            .work-card-back {
                backface-visibility: hidden;
            }
            .work-card-front {
                transform: rotateY(0deg);
            }
            .work-card-back {
                transform: rotateY(180deg);
            }
            .work-item:hover .work-card {
                transform: rotateY(180deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Force hardware acceleration
    document.querySelectorAll('.work-card').forEach(card => {
        // This triggers hardware acceleration in most browsers
        card.style.transform = 'translateZ(0)';
        
        // Extra fix for Firefox
        if (navigator.userAgent.indexOf('Firefox') !== -1) {
            card.style.perspective = '1000px';
            card.style.transformStyle = 'preserve-3d';
            
            const front = card.querySelector('.work-card-front');
            const back = card.querySelector('.work-card-back');
            
            if (front) front.style.backfaceVisibility = 'hidden';
            if (back) {
                back.style.backfaceVisibility = 'hidden';
                back.style.transform = 'rotateY(180deg)';
            }
        }
    });
    
    // Original parallax effect
    const elements = document.querySelectorAll('.skills-container');
    
    window.addEventListener('scroll', () => {
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                const scrollPosition = window.scrollY;
                const scrollFactor = 0.05;
                const translateY = scrollPosition * scrollFactor;
                
                element.style.transform = `translateY(${-translateY}px)`;
            }
        });
    });
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
}

function initializeGlitchEffect() {
    const titles = document.querySelectorAll('.hero-title-line');
    
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.classList.add('glitch');
            setTimeout(() => {
                title.classList.remove('glitch');
            }, 1000);
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .glitch {
            position: relative;
            animation: glitch-skew 1s infinite linear alternate-reverse;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
        }
        
        .glitch::before {
            color: var(--accent1);
            animation: glitch-anim-1 0.5s infinite linear alternate-reverse;
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }
        
        .glitch::after {
            color: var(--accent2);
            animation: glitch-anim-2 0.5s infinite linear alternate-reverse;
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }
        
        @keyframes glitch-anim-1 {
            0% { transform: translate(-2px, -2px); }
            100% { transform: translate(2px, 2px); }
        }
        
        @keyframes glitch-anim-2 {
            0% { transform: translate(2px, 2px); }
            100% { transform: translate(-2px, -2px); }
        }
        
        @keyframes glitch-skew {
            0% { transform: skew(0deg); }
            10% { transform: skew(1deg); }
            20% { transform: skew(0deg); }
            30% { transform: skew(-1deg); }
            40% { transform: skew(0deg); }
            50% { transform: skew(1deg); }
            60% { transform: skew(0deg); }
            70% { transform: skew(-1deg); }
            80% { transform: skew(0deg); }
            90% { transform: skew(1deg); }
            100% { transform: skew(0deg); }
        }
    `;
    document.head.appendChild(style);
    
    titles.forEach(title => {
        title.setAttribute('data-text', title.textContent);
    });
}