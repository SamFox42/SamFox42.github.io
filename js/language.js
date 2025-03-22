document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageHandling();
});

function initializeLanguageHandling() {
    // Check URL for language parameter
    const urlParams = new URLSearchParams(window.location.search);
    const languageParam = urlParams.get('l');
    
    // If language parameter exists, set cookie and redirect
    if (languageParam === 'r' || languageParam === 'e') {
        setLanguageCookie(languageParam === 'r' ? 'ru' : 'en');
        
        // Redirect to the same page without query parameters
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.split('?')[0];
        window.history.replaceState({}, document.title, baseUrl);
    }
    
    // Apply language based on cookie
    applyLanguage();
}

function setLanguageCookie(language) {
    // Set cookie that expires in 30 days
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    document.cookie = `language=${language}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
}

function getLanguageCookie() {
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        
        if (cookie.startsWith('language=')) {
            return cookie.substring('language='.length);
        }
    }
    
    // Default to English if no cookie is found
    return 'en';
}

function applyLanguage() {
    const language = getLanguageCookie();
    
    // Set the language attribute on html tag
    document.documentElement.lang = language;
    
    // Find all elements with data-en and data-ru attributes
    const elements = document.querySelectorAll('[data-en], [data-ru]');
    
    elements.forEach(element => {
        // Get the text for the current language
        const text = element.getAttribute(`data-${language === 'ru' ? 'ru' : 'en'}`);
        
        // If there's a text value, apply it to the element
        if (text) {
            // If element has children that are not just whitespace, it might have complex content
            // In that case, we don't want to override the HTML content
            if (element.children.length > 0) {
                // For elements with child nodes (like buttons with icons)
                // We need to be careful not to override important HTML
                
                // Check if it's a simple element like a button with text content
                if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                    // For buttons and links, try to update only the text node
                    let updated = false;
                    for (let i = 0; i < element.childNodes.length; i++) {
                        if (element.childNodes[i].nodeType === Node.TEXT_NODE) {
                            element.childNodes[i].nodeValue = text;
                            updated = true;
                            break;
                        }
                    }
                    
                    // If no text node was found, append one
                    if (!updated) {
                        element.appendChild(document.createTextNode(text));
                    }
                }
            } else {
                // For simple elements with no important child nodes
                element.textContent = text;
            }
        }
    });
}
