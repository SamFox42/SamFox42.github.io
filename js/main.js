document.addEventListener('DOMContentLoaded', () => {
    initializeWorkFilter();
    initializeFormSubmission();
    initializeSmoothScrolling();
    initializeScrollAnimations();
});

function initializeWorkFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Show/hide work items based on filter
            workItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    
                    // Add a small delay for smooth animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    // Hide after fade out
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initializeFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Add styles for the notification and loading state
        const style = document.createElement('style');
        style.textContent = `
            .form-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: var(--radius-md);
                color: white;
                font-weight: 500;
                transform: translateX(150%);
                animation: slideIn 0.5s forwards, slideOut 0.5s 3s forwards;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                opacity: 0.95;
            }
            
            .form-notification.success {
                background: linear-gradient(45deg, var(--accent2), var(--secondary));
            }
            
            .form-notification.error {
                background: linear-gradient(45deg, var(--accent1), #ff8f70);
            }
            
            .submit-btn.loading {
                position: relative;
                background-image: linear-gradient(45deg, var(--primary) 25%, var(--primary-hover) 25%, var(--primary-hover) 50%, var(--primary) 50%, var(--primary) 75%, var(--primary-hover) 75%);
                background-size: 20px 20px;
                animation: moveStripes 1s linear infinite;
            }
            
            @keyframes moveStripes {
                0% { background-position: 0 0; }
                100% { background-position: 20px 0; }
            }
            
            @keyframes slideIn {
                to { transform: translateX(0); }
            }
            
            @keyframes slideOut {
                to { transform: translateX(150%); }
            }
        `;
        document.head.appendChild(style);

        // Show notification function
        function showNotification(message, isSuccess = true) {
            const notification = document.createElement('div');
            notification.className = `form-notification ${isSuccess ? 'success' : 'error'}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remove notification after animation completes
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 4000);
        }
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification(
                    getCurrentLanguage() === 'ru' 
                        ? 'Пожалуйста, заполните все поля' 
                        : 'Please fill in all fields',
                    false
                );
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = getCurrentLanguage() === 'ru' ? 'Отправка...' : 'Sending...';
            submitBtn.classList.add('loading');
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showNotification(
                    getCurrentLanguage() === 'ru' 
                        ? 'Спасибо за ваше сообщение! Я свяжусь с вами в ближайшее время.' 
                        : 'Thank you for your message! I will get back to you soon.'
                );
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
            }, 1500);
        });
    }
}

function initializeSmoothScrolling() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const target = document.querySelector(link.getAttribute('href'));
            
            if (target) {
                // Add a small offset to account for fixed header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeScrollAnimations() {
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        // Header animation (hide on scroll down, show on scroll up)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Add background to header when scrolling
        if (scrollTop > 50) {
            header.style.backgroundColor = document.body.classList.contains('light-mode')
                ? 'rgba(255, 255, 254, 0.9)'
                : 'rgba(15, 15, 19, 0.9)';
        } else {
            header.style.backgroundColor = document.body.classList.contains('light-mode')
                ? 'rgba(255, 255, 254, 0.8)'
                : 'rgba(15, 15, 19, 0.8)';
        }
    });
}

// Get current language (used in form validation)
function getCurrentLanguage() {
    return document.documentElement.lang === 'ru' ? 'ru' : 'en';
}
