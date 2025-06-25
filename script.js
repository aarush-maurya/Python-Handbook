document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Fade Out ---
    const loader = document.querySelector('.preloader');
    if (loader) {
        loader.classList.add('fade-out');
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Target the <html> element

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
    };

    // Check for saved theme in localStorage or system preference on load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // If no theme is saved, use the system preference
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Add click listener for theme toggle button
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save preference
    });

    // --- Table of Contents Generation & Scrolling ---
    const tocContainer = document.getElementById('toc-container');
    const mainContent = document.getElementById('main-content');
    // Select both h2 (chapters) and part-heading (parts) for TOC generation
    const headingsForToc = mainContent.querySelectorAll('h2, div.part-heading');

    if (headingsForToc.length > 0) {
        const tocList = document.createElement('ul');

        headingsForToc.forEach(heading => {
            if (heading.id) { // Only add if heading has an ID
                const listItem = document.createElement('li');
                const link = document.createElement('a');

                link.textContent = heading.textContent;
                link.href = `#${heading.id}`;

                // Add a class to indicate if it's a chapter or part for potential future styling
                if (heading.tagName === 'H2') {
                    listItem.classList.add('toc-chapter');
                } else if (heading.classList.contains('part-heading')) {
                    listItem.classList.add('toc-part');
                }

                listItem.appendChild(link);
                tocList.appendChild(listItem);
            }
        });

        tocContainer.appendChild(tocList);
    }

    // Smooth scrolling for TOC links
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

    // Active TOC link on scroll
    const tocLinks = tocContainer.querySelectorAll('a');
    // Collect all elements that could be scrolled to by TOC links (h2, h3, part-heading)
    const scrollSpyElements = Array.from(mainContent.querySelectorAll('h2, h3, div.part-heading'));

    const onScroll = () => {
        let currentActiveId = '';
        const scrollPosition = window.scrollY;

        // Iterate through elements to find which one is currently in view
        for (const el of scrollSpyElements) {
            // Check if element's top is within the middle half of the viewport
            // This threshold helps activate links a bit before they hit the absolute top
            if (el.offsetTop <= scrollPosition + window.innerHeight * 0.5) {
                currentActiveId = el.id;
            } else {
                // Assuming elements are ordered, once we pass one, we can break
                break;
            }
        }

        // Update active class on TOC links
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

    // --- BOOKMARK FUNCTIONALITY ---

    // Function to save bookmark using localStorage
    function saveBookmark(sectionId) {
        localStorage.setItem('myBookmark', sectionId);
        console.log(`Bookmark saved: ${sectionId}`);
        alert('Bookmark saved!');
    }

    // Function to load bookmark and highlight it dynamically
    function loadBookmark() {
        const sectionId = localStorage.getItem('myBookmark');
        console.log(`Attempting to load bookmark: ${sectionId}`);

        if (sectionId) {
            // Remove previous highlights from *all* elements, regardless of ID
            document.querySelectorAll('.highlighted-bookmark').forEach(el => el.classList.remove('highlighted-bookmark'));

            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Temporarily add highlight, then remove after a delay
                section.classList.add('highlighted-bookmark');
                setTimeout(() => {
                    section.classList.remove('highlighted-bookmark');
                }, 1500); // Highlight for 1.5 seconds

                console.log(`Scrolled to and highlighted section: ${sectionId}`);
            } else {
                console.error(`Section not found: ${sectionId}`);
                alert('Bookmark not found. The section ID might be incorrect or the section was removed.');
            }
        } else {
            console.log('No bookmark saved.');
            alert('No bookmark saved.');
        }
    }

    // Add "Bookmark" button with SVG icon to each heading/part-heading
    const bookmarkableHeadings = document.querySelectorAll('h2, h3, div.part-heading');
    bookmarkableHeadings.forEach(heading => {
        if (heading.id) {
            const bookmarkButton = document.createElement('button');
            bookmarkButton.classList.add('heading-bookmark-btn');
            bookmarkButton.setAttribute('aria-label', 'Bookmark this section'); // Accessibility for screen readers

            // Insert SVG bookmark icon as innerHTML
            bookmarkButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bookmark-icon">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
            `;

            bookmarkButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent clicks on button from triggering parent heading's events if any
                saveBookmark(heading.id);
            });
            heading.appendChild(bookmarkButton);
        }
    });

    // Create the floating "Go To Bookmark" button
    const goToBookmarkBtn = document.createElement('button');
    goToBookmarkBtn.textContent = 'Go To Bookmark';
    goToBookmarkBtn.id = 'go-to-bookmark-btn'; // Specific ID for unique styling (defined in CSS)
    goToBookmarkBtn.addEventListener('click', loadBookmark); // This button triggers load and highlight
    document.body.appendChild(goToBookmarkBtn);

    // Removed the separate "Load Bookmark" button as it's now redundant.
    // The 'goToBookmarkBtn' now handles both functions.
});