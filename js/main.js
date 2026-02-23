const EMAILJS_PUBLIC_KEY = "Mo7pvwHrMWOJMhSdn"; 
const EMAILJS_SERVICE_ID = "service_v07yg6y";
const EMAILJS_TEMPLATE_ID = "template_c7rl7ss";

if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('✓ EmailJS initialized successfully');
    } catch (error) {
        console.error('✗ EmailJS initialization error:', error);
    }
} else {
    console.warn('⚠️ EmailJS not configured. Update Service ID and Template ID in js/main.js to activate the contact form.');
}

// Navbar scroll effect

function handleScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', throttle(handleScroll, 10));

// Theme toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(theme);
}

function setTheme(theme) {
    const body = document.body;
    const toggle = document.querySelector('.theme-toggle');
    const icon = toggle ? toggle.querySelector('.toggle-icon') : null;

    if (theme === 'light') {
        body.classList.add('light-mode');
        if (icon) icon.src = "assets/images/moon.png";
    } else {
        body.classList.remove('light-mode');
        if (icon) icon.src = "assets/images/sun.png";
    }

    localStorage.setItem('theme', theme);
}

function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    initTheme();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeToggle);
} else {
    initializeThemeToggle();
}

// Smooth scroll to section
function scrollToSection(sectionId = 'benefits') {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    const ctaLink = document.querySelector('.cta-section a[href="#contactForm"]');
    if (ctaLink) {
        ctaLink.addEventListener('click', function(e) {
            e.preventDefault();
            const formElement = document.getElementById('contactForm');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                formElement.focus();
                setTimeout(() => {
                    formElement.querySelector('input, textarea, select').focus();
                }, 100);
            }
        });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm() {
    const form = document.getElementById('contactForm');
    if (!form) return false;
    
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();
    const terms = form.querySelector('#terms').checked;
    
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    if (name.length < 2) {
        document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    if (!subject) {
        document.getElementById('subject-error').textContent = 'Please select a subject';
        isValid = false;
    }
    
    if (message.length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
        isValid = false;
    }
    
    if (!terms) {
        document.getElementById('terms-error').textContent = 'You must agree to the terms';
        isValid = false;
    }
    
    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formMessage.textContent = '';
    const formData = {
        from_name: form.querySelector('#name').value.trim(),
        from_email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#phone').value.trim() || 'Not provided',
        subject: form.querySelector('#subject').value.trim(),
        budget: form.querySelector('#budget').value.trim() || 'Not specified',
        message: form.querySelector('#message').value.trim(),
        to_email: 'royce0simbillo@gmail.com'
    };
    if (EMAILJS_SERVICE_ID === "SERVICE_ID" || EMAILJS_TEMPLATE_ID === "TEMPLATE_ID") {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        formMessage.textContent = '✗ Contact form is not configured. Please email royce0simbillo@gmail.com directly.';
        formMessage.classList.add('error');
        formMessage.classList.remove('success');
        console.error('EmailJS credentials not configured. Update Service ID and Template ID in js/main.js.');
        return;
    }
    
    try {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
        .then(function(response) {
            formMessage.textContent = '✓ Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
            formMessage.classList.add('success');
            formMessage.classList.remove('error');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.classList.remove('success');
            }, 6000);
        }, function(error) {
            console.error('EmailJS Error:', error);
            const errorMsg = error.text || 'Error sending message';
            formMessage.textContent = '✗ ' + errorMsg + '. Please email royce0simbillo@gmail.com directly.';
            formMessage.classList.add('error');
            formMessage.classList.remove('success');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.classList.remove('error');
            }, 6000);
        });
    } catch (error) {
        console.error('EmailJS Error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        formMessage.textContent = '✗ Error: ' + error.message + '. Please email royce0simbillo@gmail.com directly.';
        formMessage.classList.add('error');
    }
}

// Scroll animations
function initScrollAnimations() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, options);
    document.querySelectorAll('.card, .project-card, .testimonial-card, .cert-item, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Active navigation link
function setActiveNavLink() {
    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        
        if (!href.includes('http')) {
            if ((currentLocation === '' || currentLocation === 'portfolio/') && (href === 'index.html' || href === './')) {
                link.setAttribute('aria-current', 'page');
            } else if (href === currentLocation) {
                link.setAttribute('aria-current', 'page');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Accessibility focus management
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.blur) {
            activeElement.blur();
        }
    }
});

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Certification toggle - See All button
function initCertificationToggle() {
    const seeAllBtn = document.getElementById('see-all-certs');
    const hiddenCerts = document.querySelectorAll('.cert-hidden');
    
    if (!seeAllBtn || hiddenCerts.length === 0) return;
    let isExpanded = false;
    seeAllBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        hiddenCerts.forEach((cert, index) => {
            if (isExpanded) {
                cert.classList.add('visible');
                cert.style.animationDelay = (index * 100) + 'ms';
            } else {
                cert.classList.remove('visible');
            }
        });
        seeAllBtn.classList.toggle('expanded', isExpanded);
        seeAllBtn.classList.toggle('collapsed', !isExpanded);
        seeAllBtn.textContent = isExpanded ? 'See Less Certifications' : 'See All Certifications';
    });
    seeAllBtn.classList.add('collapsed');
}

// Hamburger menu
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav[aria-label="Main navigation"]')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const animationTargets = document.querySelectorAll('.card, .project-card, .testimonial-card, .stat-item, .about-section, .section-subtitle');
    animationTargets.forEach(target => {
        target.style.opacity = '0';
        observer.observe(target);
    });
}

// Animated counters
function animateCounter(element) {
    const target = parseInt(element.innerText);
    const increment = Math.ceil(target / 50);
    let current = 0;
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = target + (element.innerText.includes('+') ? '+' : '');
            clearInterval(counter);
        } else {
            element.innerText = current;
        }
    }, 30);
}

function initCounterAnimation() {
    const statValues = document.querySelectorAll('.stat-value');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
                entry.target.classList.add('animated');
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statValues.forEach(value => counterObserver.observe(value));
}

// Link hover effects
function initLinkInteractions() {
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        link.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
        });
    });
}

// Smooth page transitions
function addPageTransitionEffects() {
    const navLinks = document.querySelectorAll('nav a[href^="./"], nav a[href^="/"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.includes('#')) {
                document.body.style.animation = 'fadeOut 0.3s ease-out forwards';
            }
        });
    });
}

// Parallax effect
function initParallaxEffect() {
    const heroSections = document.querySelectorAll('.hero, .about-hero, .projects-hero, .contact-hero');
    if (heroSections.length === 0) return;
    heroSections.forEach(hero => {
        if (!hero.querySelector('.hero-content')) {
            const h1 = hero.querySelector('h1');
            const p = hero.querySelector('p');
            if (h1 && p) {
                const wrapper = document.createElement('div');
                wrapper.className = 'hero-wrapper';
                wrapper.style.display = 'inline-block';
                wrapper.style.position = 'relative';
                h1.parentElement.insertBefore(wrapper, h1);
                wrapper.appendChild(h1);
                wrapper.appendChild(p);
            }
        }
    });
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        heroSections.forEach(hero => {
            const yPos = scrolled * 0.4;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${yPos}px)`;
            } else {
                const wrapper = hero.querySelector('.hero-wrapper');
                if (wrapper) {
                    wrapper.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
    }, 10));
}

// Card click interactions
function initCardInteractions() {
    const cards = document.querySelectorAll('.card, .project-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });

        card.addEventListener('mouseover', function() {
            this.style.cursor = 'pointer';
        });
    });
}

// Ripple effect on buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-outline, .link-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple-expand 0.6s ease-out;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

function onReady(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

onReady(function() {
    initHamburgerMenu();
    initCertificationToggle();
    initScrollAnimations();
    initCounterAnimation();
    initLinkInteractions();
    addPageTransitionEffects();
    initParallaxEffect();
    initCardInteractions();
    initRippleEffect();
    console.log('Portfolio script loaded with full animations and interactivity');
});
