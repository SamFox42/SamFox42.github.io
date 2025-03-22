document.addEventListener('DOMContentLoaded', () => {
    initializeThemeToggle();
});

function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to dark mode
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
    
    // Add click event to theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const body = document.body;
    const header = document.querySelector('.site-header');
    
    // Toggle between dark and light mode
    if (body.classList.contains('dark-mode')) {
        // Switch to light mode
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        
        // Update header background for light mode
        if (header && window.pageYOffset > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 254, 0.9)';
        } else if (header) {
            header.style.backgroundColor = 'rgba(255, 255, 254, 0.8)';
        }
    } else {
        // Switch to dark mode
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        
        // Update header background for dark mode
        if (header && window.pageYOffset > 50) {
            header.style.backgroundColor = 'rgba(15, 15, 19, 0.9)';
        } else if (header) {
            header.style.backgroundColor = 'rgba(15, 15, 19, 0.8)';
        }
    }
    
    // Animate theme change
    animateThemeChange();
}

function animateThemeChange() {
    // Create a theme change animation
    const overlay = document.createElement('div');
    overlay.classList.add('theme-transition-overlay');
    
    // Add styles for the overlay
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: var(--primary);
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .theme-transition-overlay.active {
            opacity: 0.1;
        }
    `;
    document.head.appendChild(style);
    
    // Add overlay to the DOM
    document.body.appendChild(overlay);
    
    // Trigger the animation
    setTimeout(() => {
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
            
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 300);
    }, 50);
}
