document.addEventListener('DOMContentLoaded', () => {
    initializeCustomCursor();
});

function initializeCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    
    if (cursorDot && cursorFollower && !hasCoarsePointer) {
        document.addEventListener('mousemove', e => {
            requestAnimationFrame(() => {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
                
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
            });
        });
        
        const clickables = document.querySelectorAll('a, button, .work-item, .filter-btn');
        
        clickables.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('active');
                cursorDot.style.backgroundColor = 'var(--primary-hover)';
                element.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('active');
                cursorDot.style.backgroundColor = 'var(--primary)';
                element.classList.remove('cursor-hover');
            });
        });
        
        // Создаем кастомный курсор для полей ввода
        const formElements = document.querySelectorAll('input, textarea, label, .form-group label');
        
        formElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorFollower.classList.remove('active');
                cursorFollower.classList.add('text-cursor');
                cursorDot.classList.add('text-cursor-dot');
            });
            
            element.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('text-cursor');
                cursorDot.classList.remove('text-cursor-dot');
            });
        });
        
        const style = document.createElement('style');
        style.textContent = `
            .cursor-hover {
                transform: scale(1.05);
            }
            
            input, textarea, label, .form-group label {
                cursor: none !important;
            }
            
            .text-cursor {
                width: 3px !important;
                height: 24px !important;
                border-radius: 1px !important;
                background-color: var(--accent1) !important;
                mix-blend-mode: difference !important;
                transition: width 0.2s, height 0.2s, border-radius 0.2s !important;
                animation: blink 1s infinite !important;
                opacity: 0.8 !important;
            }
            
            .text-cursor-dot {
                opacity: 0 !important;
            }
            
            @keyframes blink {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 0.4; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.style.cursor = 'none';
        
        cursorDot.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
    }
}
