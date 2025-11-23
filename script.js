// ===== GSAP Registration =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== Preloader - Simple 2 Second Timer =====
let preloaderHidden = false;

function hidePreloader() {
    if (preloaderHidden) return;
    preloaderHidden = true;
    
    const preloader = document.getElementById('preloader');
    const scrollProgress = document.getElementById('scroll-progress');
    
    if (!preloader) return;
    
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('loading'); // Remove loading class to enable scroll
        // Show scroll progress bar ONLY on desktop
        if (scrollProgress && window.innerWidth > 1024) {
            scrollProgress.style.removeProperty('display');
            scrollProgress.classList.add('visible');
            scrollProgressActive = true;
        }
        // Initialize animations after preloader
        if (typeof initAnimations === 'function') {
            initAnimations();
        }
    }, 800);
}

// Simple 2 second timer
setTimeout(hidePreloader, 2000);

// Custom cursor removed per user request

// ===== Scroll Progress Bar =====
const scrollProgress = document.getElementById('scroll-progress');
let scrollProgressActive = false; // Don't activate until preloader is done

window.addEventListener('scroll', () => {
    if (!scrollProgressActive) return; // Don't run during preloader
    
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(scrollProgress, {
            scaleX: scrolled,
            duration: 0.1,
            ease: 'none'
        });
    } else {
        scrollProgress.style.transform = `scaleX(${scrolled})`;
    }
});

// ===== Particle System =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const particlesArray = [];
const numberOfParticles = 80;

class Particle {
    constructor() {
        const w = canvas ? canvas.width : window.innerWidth;
        const h = canvas ? canvas.height : window.innerHeight;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 107, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    if (!ctx) return;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = `rgba(255, 107, 0, ${0.15 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

if (canvas && ctx) {
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== Initialize All Animations =====
function initAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        // Make everything visible if no GSAP
        document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .social-links, .scroll-down').forEach(el => {
            el.style.opacity = '1';
        });
        return;
    }
    
    // Hero Section Animations - Just fade in, no movement
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    heroTimeline
        .to('.hero-title', {
            opacity: 1,
            duration: 0.8,
            delay: 0.1
        })
        .to('.hero-subtitle', {
            opacity: 1,
            duration: 0.6
        }, '-=0.4')
        .to('.hero-description', {
            opacity: 0.7,
            duration: 0.6,
            onComplete: () => {
                document.querySelector('.hero-description')?.classList.add('animated');
            }
        }, '-=0.3')
        .to('.hero-buttons', {
            opacity: 1,
            duration: 0.5
        }, '-=0.2')
        .to('.social-links', {
            opacity: 1,
            duration: 0.5
        }, '-=0.3')
        .to('.scroll-down', {
            opacity: 1,
            duration: 0.5
        }, '-=0.2');
    
    // Section Title Reveals - Simplified
    gsap.utils.toArray('.reveal-text').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
    
    // About Section Animations - Simplified
    gsap.from('.reveal-left', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    gsap.from('.reveal-right', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    // About text stagger - Simplified
    gsap.from('.about-text h3', {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%'
        },
        y: 20,
        opacity: 0,
        duration: 0.6
    });
    
    gsap.from('.about-text p', {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15
    });
    
    gsap.from('.info-item', {
        scrollTrigger: {
            trigger: '.about-info',
            start: 'top 85%'
        },
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08
    });
    
    // Skills Section - Simple fade in
    gsap.utils.toArray('.skill-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.05,
            ease: 'power2.out'
        });
    });
    
    // Skill Progress Bars Animation - Simplified
    gsap.utils.toArray('.skill-progress').forEach(bar => {
        const width = bar.style.width;
        gsap.from(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            width: '0%',
            duration: 1.2,
            ease: 'power2.out'
        });
    });
    
    // Projects Section - Subtle animation that doesn't hide cards
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    // Contact Section - Simplified
    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%'
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    gsap.from('.contact-form .form-group', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out'
    });
    
    gsap.from('.contact-form .btn', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%'
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });
    
    // Subtle parallax on hero text
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        opacity: 0.5
    });
}

// ===== Magnetic Button Effect ===== (DISABLED - removed per user request)

// ===== 3D Tilt Effect for Project Cards =====
if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Mobile Menu Toggle - Works on all pages =====
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');


    if (hamburger && navLinksContainer) {
        // Remove any existing event listeners by cloning
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        // Add click event to hamburger
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            newHamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                newHamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active') && 
                !navLinksContainer.contains(e.target) && 
                !newHamburger.contains(e.target)) {
                newHamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }
}

// Call on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

// ===== Navigation - Only handle hash links on same page =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Instant scroll with offset for navbar
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'auto' // Instant jump
            });
        }
    });
});

// Set active nav link based on current page
window.addEventListener('load', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active'); // Remove all active classes first
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
        if (typeof gsap !== 'undefined') {
            // Success animation
            gsap.to(contactForm, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
    alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon!`);
    contactForm.reset();
    
                    // Reset animation
                    gsap.from(contactForm, {
                        opacity: 0,
                        duration: 0.5
                    });
                }
            });
        } else {
            alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon!`);
            contactForm.reset();
        }
    });
}

// ===== Floating Shapes Animation =====
if (typeof gsap !== 'undefined') {
    const shape1 = document.querySelector('.shape-1');
    const shape2 = document.querySelector('.shape-2');
    const shape3 = document.querySelector('.shape-3');

    if (shape1) {
        gsap.to('.shape-1', {
            y: '+=100',
            x: '+=50',
            rotation: 360,
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    if (shape2) {
        gsap.to('.shape-2', {
            y: '-=80',
            x: '+=30',
            rotation: -360,
            duration: 15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    if (shape3) {
        gsap.to('.shape-3', {
            y: '+=60',
            x: '-=40',
            scale: 1.2,
            duration: 25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// ===== Glitch Effect Trigger =====
const glitchElement = document.querySelector('.glitch');
if (glitchElement) {
    setInterval(() => {
        glitchElement.style.animation = 'none';
        setTimeout(() => {
            glitchElement.style.animation = 'glitch-skew 3s infinite';
        }, 10);
    }, 8000);
}

// Enhanced scroll animations removed for better performance

// ===== Skill Icon Appears One by One =====
if (typeof gsap !== 'undefined' && gsap.utils) {
    gsap.utils.toArray('.skill-icon').forEach((icon, index) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            scale: 0,
            rotation: 360,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1, // Stagger each icon
            ease: 'back.out(2)'
        });
    });
}

// ===== Dynamic Year in Footer =====
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText) {
    footerText.textContent = footerText.textContent.replace('2025', currentYear);
}

// Custom cursor completely removed

