/**
 * Enterprise Platform - Core Javascript
 * Handles mobile navigation, scroll animations, masonry portfolio filtering, job accordions, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initPortfolioFiltering();
    initLightbox();
    initJobAccordions();
    initContactForm();
});

/**
 * 1. Mobile Navigation & Header Scroll State
 */
function initNavigation() {
    const header = document.getElementById('main-header');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled', 'py-2');
        } else {
            header.classList.remove('scrolled', 'py-2');
        }
    }, { passive: true });

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });
}

/**
 * 2. Intersection Observer for Scroll Animations
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    
    // Fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
        fadeElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    // Trigger hero animations immediately on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#home .fade-up');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    fadeElements.forEach(el => {
        if (!el.closest('#home')) {
            observer.observe(el);
        }
    });
}

/**
 * 3. Portfolio Masonry Filtering
 */
function initPortfolioFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-cobalt-500', 'text-white');
                b.classList.add('bg-white', 'text-silver-600');
            });
            e.target.classList.add('active', 'bg-cobalt-500', 'text-white');
            e.target.classList.remove('bg-white', 'text-silver-600');

            const filterValue = e.target.getAttribute('data-filter');

            // Apply filtering with layout recalculation delay
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Small timeout allows display block to render before opacity transitions
                    setTimeout(() => {
                        item.classList.remove('hidden-item');
                    }, 10);
                } else {
                    item.classList.add('hidden-item');
                    // Remove from document flow after animation
                    setTimeout(() => {
                        if (item.classList.contains('hidden-item')) {
                            item.classList.add('hidden');
                        }
                    }, 500);
                }
            });
        });
    });
}

/**
 * 4. Portfolio Lightbox Modal
 */
function initLightbox() {
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxBody = document.getElementById('lightbox-body');
    const closeBtn = document.getElementById('lightbox-close');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('h4').innerText;
            const category = item.querySelector('span').innerText;
            
            // Build Lightbox Payload
            lightboxBody.innerHTML = `
                <div class="w-full md:w-3/5 h-64 md:h-full relative bg-silver-100">
                    <img src="${imgSrc}" class="w-full h-full object-cover" alt="${title}">
                </div>
                <div class="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
                    <span class="text-cobalt-500 font-bold text-xs uppercase tracking-widest mb-2">${category}</span>
                    <h3 class="text-3xl font-bold text-silver-900 mb-6">${title}</h3>
                    <p class="text-silver-700 mb-6 leading-relaxed">This case study demonstrates our capacity to architect highly scalable, robust enterprise solutions. We successfully migrated legacy systems to modern cloud infrastructures resulting in a 40% performance increase.</p>
                    <div class="mb-8">
                        <h5 class="text-sm font-bold text-silver-900 mb-2">Technologies Used</h5>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 bg-silver-100 text-silver-700 text-xs rounded-sm">React</span>
                            <span class="px-3 py-1 bg-silver-100 text-silver-700 text-xs rounded-sm">Node.js</span>
                            <span class="px-3 py-1 bg-silver-100 text-silver-700 text-xs rounded-sm">PostgreSQL</span>
                            <span class="px-3 py-1 bg-silver-100 text-silver-700 text-xs rounded-sm">AWS</span>
                        </div>
                    </div>
                    <a href="#contact" class="inline-flex justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-sm text-white bg-cobalt-500 hover:bg-cobalt-600 transition-colors w-full text-center" onclick="document.getElementById('lightbox-close').click()">Request Similar Architecture</a>
                </div>
            `;
            
            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');
            lightbox.setAttribute('aria-hidden', 'false');
            closeBtn.focus();
        });
        
        // Keyboard accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') item.click();
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        lightbox.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            lightboxBody.innerHTML = '';
        }, 300);
    }
}

/**
 * 5. Careers Job Accordions
 */
function initJobAccordions() {
    const accordions = document.querySelectorAll('.job-accordion button');
    
    accordions.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const contentId = button.getAttribute('aria-controls');
            const content = document.getElementById(contentId);
            
            // Close all other accordions
            accordions.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                const targetContent = document.getElementById(btn.getAttribute('aria-controls'));
                targetContent.style.maxHeight = '0px';
            });
            
            // Toggle current accordion
            if (!isExpanded) {
                button.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

/**
 * 6. Contact Form Validation & Async Simulation
 */
function initContactForm() {
    const form = document.getElementById('enterprise-contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset custom error messages visually
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                const btnText = document.getElementById('submit-text');
                const spinner = document.getElementById('submit-spinner');
                
                // Simulate Async Payload (PHP/MySQL integration point)
                btnText.textContent = 'Transmitting...';
                spinner.classList.remove('hidden');
                btn.disabled = true;
                
                setTimeout(() => {
                    spinner.classList.add('hidden');
                    btnText.textContent = 'Request Submitted';
                    btn.classList.remove('bg-cobalt-500', 'hover:bg-cobalt-600');
                    btn.classList.add('bg-green-600', 'hover:bg-green-700');
                    
                    setTimeout(() => {
                        form.reset();
                        btnText.textContent = 'Submit Request';
                        btn.disabled = false;
                        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                        btn.classList.add('bg-cobalt-500', 'hover:bg-cobalt-600');
                    }, 4000);
                }, 1500);
            }
        });

        // Real-time validation feedback clearing
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('border-red-500');
                }
            });
        });
    }
}
