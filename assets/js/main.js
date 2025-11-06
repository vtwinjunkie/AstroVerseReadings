/**
 * AstroVerse Main JavaScript
 * Interactive functionality for the premium astrology platform
 */

// =================================================================
// Initialization
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrolling();
    initLoadingStates();
    initFormValidation();
    initTooltips();
});

// =================================================================
// Mobile Menu Toggle
// =================================================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');

            // Toggle icon
            const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
            }

            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('hidden') ? 'auto' : 'hidden';
        });

        // Close menu when clicking on a link
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = 'auto';
                const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'menu';
            });
        });
    }
}

// =================================================================
// Scroll Animations with Intersection Observer
// =================================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
}

// =================================================================
// Smooth Scrolling for Anchor Links
// =================================================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just '#' or empty
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerOffset = 80; // Account for sticky header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =================================================================
// Loading States for Buttons
// =================================================================
function initLoadingStates() {
    const buttons = document.querySelectorAll('button[data-loading]');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                showButtonLoading(this);

                // Simulate async operation
                setTimeout(() => {
                    hideButtonLoading(this);
                }, 2000);
            }
        });
    });
}

function showButtonLoading(button) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `
        <span class="loading-spinner inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        <span class="ml-2">Loading...</span>
    `;
}

function hideButtonLoading(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || button.innerHTML;
}

// =================================================================
// Form Validation
// =================================================================
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Form is valid, proceed with submission
                console.log('Form is valid, submitting...');
                // Add your form submission logic here
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Check if required
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Update UI
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error', 'border-red-500');

    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error', 'border-red-500');

    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// =================================================================
// Tooltips
// =================================================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.dataset.tooltip;
    if (!text) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip fixed bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 pointer-events-none';
    tooltip.textContent = text;
    tooltip.id = 'active-tooltip';

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// =================================================================
// Zodiac Sign Data
// =================================================================
const zodiacData = {
    aries: {
        name: 'Aries',
        dates: 'March 21 - April 19',
        element: 'Fire',
        symbol: '♈',
        ruling: 'Mars'
    },
    taurus: {
        name: 'Taurus',
        dates: 'April 20 - May 20',
        element: 'Earth',
        symbol: '♉',
        ruling: 'Venus'
    },
    gemini: {
        name: 'Gemini',
        dates: 'May 21 - June 20',
        element: 'Air',
        symbol: '♊',
        ruling: 'Mercury'
    },
    cancer: {
        name: 'Cancer',
        dates: 'June 21 - July 22',
        element: 'Water',
        symbol: '♋',
        ruling: 'Moon'
    },
    leo: {
        name: 'Leo',
        dates: 'July 23 - August 22',
        element: 'Fire',
        symbol: '♌',
        ruling: 'Sun'
    },
    virgo: {
        name: 'Virgo',
        dates: 'August 23 - September 22',
        element: 'Earth',
        symbol: '♍',
        ruling: 'Mercury'
    },
    libra: {
        name: 'Libra',
        dates: 'September 23 - October 22',
        element: 'Air',
        symbol: '♎',
        ruling: 'Venus'
    },
    scorpio: {
        name: 'Scorpio',
        dates: 'October 23 - November 21',
        element: 'Water',
        symbol: '♏',
        ruling: 'Pluto'
    },
    sagittarius: {
        name: 'Sagittarius',
        dates: 'November 22 - December 21',
        element: 'Fire',
        symbol: '♐',
        ruling: 'Jupiter'
    },
    capricorn: {
        name: 'Capricorn',
        dates: 'December 22 - January 19',
        element: 'Earth',
        symbol: '♑',
        ruling: 'Saturn'
    },
    aquarius: {
        name: 'Aquarius',
        dates: 'January 20 - February 18',
        element: 'Air',
        symbol: '♒',
        ruling: 'Uranus'
    },
    pisces: {
        name: 'Pisces',
        dates: 'February 19 - March 20',
        element: 'Water',
        symbol: '♓',
        ruling: 'Neptune'
    }
};

// =================================================================
// Get Zodiac Sign from URL
// =================================================================
function getZodiacFromURL() {
    const params = new URLSearchParams(window.location.search);
    const sign = params.get('sign');
    return sign ? zodiacData[sign.toLowerCase()] : null;
}

// =================================================================
// Reader Data
// =================================================================
const readerData = {
    elara: {
        name: 'Elara Vance',
        specialty: 'Natal Charts & Tarot',
        rating: 4.8,
        reviews: 124,
        bio: 'With over 15 years of experience, Elara specializes in natal chart readings and tarot guidance.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop'
    },
    kael: {
        name: 'Kael Sterling',
        specialty: 'Synastry & Relationships',
        rating: 5.0,
        reviews: 98,
        bio: 'Kael is an expert in relationship astrology and synastry charts, helping couples understand their cosmic connection.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'
    },
    lyra: {
        name: 'Lyra Meadowes',
        specialty: 'Career & Life Path',
        rating: 4.9,
        reviews: 156,
        bio: 'Lyra guides clients through career transitions and life purpose discovery using astrology.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=400&fit=crop'
    }
};

// =================================================================
// Get Reader from URL
// =================================================================
function getReaderFromURL() {
    const params = new URLSearchParams(window.location.search);
    const reader = params.get('reader');
    return reader ? readerData[reader.toLowerCase()] : null;
}

// =================================================================
// Utility Functions
// =================================================================

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =================================================================
// Export functions for use in other scripts
// =================================================================
window.AstroVerse = {
    zodiacData,
    readerData,
    getZodiacFromURL,
    getReaderFromURL,
    formatDate,
    debounce,
    isInViewport,
    showButtonLoading,
    hideButtonLoading
};
