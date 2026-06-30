document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Dark/Light Theme Switcher
  // ==========================================================================
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for saved theme in localStorage, fallback to system preferences
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    // If no preference is saved, default to 'light'
    htmlElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }

  // Toggle Theme Function
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add brief animation/transition effect
    themeToggleBtn.style.transform = 'scale(0.8) rotate(15deg)';
    setTimeout(() => {
      themeToggleBtn.style.transform = '';
    }, 200);
  });

  // ==========================================================================
  // 2. Mobile Drawer Menu Navigation
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function toggleMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileDrawer.classList.toggle('active');
    
    // Prevent background scrolling when drawer is open
    if (mobileDrawer.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  mobileMenuBtn.addEventListener('click', toggleMenu);

  // Close drawer when clicking a link
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close drawer if screen resizes above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileDrawer.classList.contains('active')) {
      mobileMenuBtn.classList.remove('active');
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ==========================================================================
  // 3. Header Scroll Styling
  // ==========================================================================
  const header = document.querySelector('.main-header');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  // Initial check on load
  handleScroll();

  // ==========================================================================
  // 4. Portfolio Projects Category Filter
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button styling
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const categoryFilter = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Add card scale transition on filter change
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (categoryFilter === 'all' || cardCategory === categoryFilter) {
            card.classList.remove('hide');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.classList.add('hide');
          }
        }, 250);
      });
    });
  });

  // ==========================================================================
  // 5. Contact Form Validation and Submission
  // ==========================================================================
  const contactForm = document.getElementById('project-contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form fields
      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const email = document.getElementById('form-email').value;
      const service = document.getElementById('form-service').options[document.getElementById('form-service').selectedIndex].text;
      
      // Show success modal/alert
      alert(`¡Muchas gracias, ${name}!\n\nHemos recibido correctamente tu solicitud de asesoría técnica para el servicio de:\n"${service}".\n\nUno de nuestros ingenieros se pondrá en contacto contigo en el teléfono ${phone} o al correo ${email} en las próximas 24 horas hábiles para coordinar los detalles.`);
      
      // Reset form
      contactForm.reset();
    });
  }

  // ==========================================================================
  // 6. IntersectionObserver for Scroll Animations (Reveal on Scroll)
  // ==========================================================================
  // Add 'reveal' class dynamically to elements we want to animate
  const animateTargets = [
    '.about-content', 
    '.about-visuals', 
    '.project-card', 
    '.client-logo-card', 
    '.contact-info-block', 
    '.contact-form-block'
  ];
  
  animateTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px' // offset from bottom
  });

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================================================
  // 6. Lightbox – Visor de imágenes a pantalla completa
  // ==========================================================================
  const overlay      = document.getElementById('lightbox-overlay');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const closeBtn     = document.getElementById('lightbox-close');

  /** Abre el lightbox con la imagen y título dados */
  function openLightbox(src, alt, title) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCap.textContent = title || alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // evitar scroll de fondo
  }

  /** Cierra el lightbox */
  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Limpia src con retardo para que la animación de salida no rompa
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  // Clic en cada imagen con clase lightbox-trigger
  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt, img.dataset.title);
    });
  });

  // Cerrar con el botón ×
  closeBtn.addEventListener('click', closeLightbox);

  // Cerrar haciendo clic en el fondo oscuro (fuera de la imagen)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
  });

});
