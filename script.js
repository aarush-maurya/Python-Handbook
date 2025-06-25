// script.js - (V3 - Compatible with Enhanced UI)


document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.preloader');
    if (loader) {
        loader.classList.add('fade-out');
    }    
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Target the <html> element

    // ** THIS IS THE MODIFIED FUNCTION **
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
    };

    // Check for saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // If no theme is saved, use the system preference
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Table of Contents Generation & Scrolling (No changes) ---
    const tocContainer = document.getElementById('toc-container');
    const mainContent = document.getElementById('main-content');
    const headings = mainContent.querySelectorAll('h2');
    
    if (headings.length > 0) {
        const tocList = document.createElement('ul');
        
        headings.forEach(heading => {
            if (heading.id) {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                
                link.textContent = heading.textContent;
                link.href = `#${heading.id}`;
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            }
        });
        
        tocContainer.appendChild(tocList);
    }
    
    tocContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const targetId = event.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    const tocLinks = tocContainer.querySelectorAll('a');
    const headingElements = Array.from(headings);

    const onScroll = () => {
        let currentActiveId = '';
        const scrollPosition = window.scrollY;

        for (const heading of headingElements) {
            if (heading.offsetTop <= scrollPosition + window.innerHeight / 2) {
                currentActiveId = heading.id;
            } else {
                break;
            }
        }

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActiveId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check on page load

    // --- Load Prism.js for syntax highlighting ---
    const prismAutoloader = document.createElement('script');
    prismAutoloader.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js';
    document.body.appendChild(prismAutoloader);
});