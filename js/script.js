/* ===================== CUSTOM CURSOR ===================== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.28;
  ringY += (mouseY - ringY) * 0.28;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .gallery-item, .blog-card, .stat-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot?.classList.add('hovered');
    cursorRing?.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot?.classList.remove('hovered');
    cursorRing?.classList.remove('hovered');
  });
});

// ===================== PAGE TRANSITION =====================
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.25s ease';
    document.body.style.opacity = '1';
  });
});

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.style.transition = 'opacity 0.18s ease';
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 180);
  });
});

// ===================== NAVBAR =====================
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks?.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 4px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -4px)' : '';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks?.classList.remove('open'));
});

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href')?.split('/').pop();
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===================== SCROLL REVEAL =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));

// ===================== COUNTER ANIMATION =====================
function animateCounter(el) {
  const target = el.textContent.trim();
  if (target === '∞' || target === '1') return;

  const isPlus = target.endsWith('+');
  const num = parseFloat(target.replace('+', ''));
  let start = 0;
  const duration = 1200;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * num) + (isPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-number');
      if (numEl) animateCounter(numEl);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => counterObserver.observe(card));

// ===================== GALLERY =====================
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-src');
    if (src && lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeLightbox() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// Gallery filter with smooth transition
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      const match = filter === 'all' || item.getAttribute('data-cat') === filter;
      if (match) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, i * 40);
      } else {
        item.style.transition = 'opacity 0.25s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => { item.style.display = 'none'; }, 250);
      }
    });
  });
});

// ===================== CONTACT FORM =====================
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  btn.textContent = 'Mengirim...';
  btn.disabled = true;
  setTimeout(() => {
    contactForm.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1200);
});

// ===================== FLOATING PARTICLES =====================
const particlesContainer = document.getElementById('hero-particles');
if (particlesContainer) {
  const types = ['petal', 'dot'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const type = types[Math.floor(Math.random() * types.length)];
    const size = Math.random() * 16 + 8;
    p.className = `particle ${type}`;
    p.style.cssText = `
      left: ${Math.random() * 90}%;
      width: ${size}px; height: ${size}px;
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: -${Math.random() * 12}s;
    `;
    particlesContainer.appendChild(p);
  }
}

// ===================== TYPEWRITER =====================
const typewriterEl = document.getElementById('hero-typewriter');
if (typewriterEl) {
  const texts = ["Informatika '24 · Unsrat", "Visual Storyteller", "Canva Designer", "Informatika '24 · Unsrat"];
  let tIdx = 0, cIdx = 0, deleting = false;
  function type() {
    const current = texts[tIdx];
    if (!deleting) {
      typewriterEl.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        if (tIdx === texts.length - 1) { typewriterEl.classList.add('typewriter-done'); return; }
        deleting = true;
        setTimeout(type, 1800); return;
      }
    } else {
      typewriterEl.textContent = current.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % texts.length; }
    }
    setTimeout(type, deleting ? 35 : 65);
  }
  setTimeout(type, 1400);
}

// ===================== HERO IMAGE TILT =====================
const heroImgWrap = document.getElementById('hero-image-wrap');
if (heroImgWrap) {
  heroImgWrap.addEventListener('mousemove', (e) => {
    const rect = heroImgWrap.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width/2)  / (rect.width/2);
    const dy = (e.clientY - rect.top  - rect.height/2) / (rect.height/2);
    heroImgWrap.style.transition = 'none';
    heroImgWrap.style.transform = `translateY(-50%) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) scale(1.02)`;
  });
  heroImgWrap.addEventListener('mouseleave', () => {
    heroImgWrap.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    heroImgWrap.style.transform = 'translateY(-50%) rotateY(0) rotateX(0) scale(1)';
  });
}

// ===================== MAGNETIC BUTTONS =====================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width/2)  * 0.28;
    const dy = (e.clientY - rect.top  - rect.height/2) * 0.28;
    btn.style.transition = 'none';
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    btn.style.transform = '';
  });
});

// ===================== PARALLAX =====================
const heroBgText = document.querySelector('.hero-bg-text');
const pageBgText = document.querySelector('.page-bg-text');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav?.classList.toggle('scrolled', y > 20);

  // hero bg text: vertical parallax only
  if (heroBgText) {
    heroBgText.style.transform = `translateY(calc(-50% + ${y * 0.15}px))`;
  }

  // page bg text: MUST preserve translateX(-50%) — only add vertical offset
  if (pageBgText) {
    pageBgText.style.transform = `translateX(-50%) translateY(${y * 0.06}px)`;
  }
});