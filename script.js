/**
 * PORTFOLIO DAVIAN MBAYI — INTERACTIVE CLIENT SCRIPT
 * Handles navigation, project filtering, modal dialogs, copy toast,
 * live interactive grade calculator, and scroll animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. SCROLL PROGRESS BAR ---
  const progressBar = document.getElementById('scrollProgressBar');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      if (progressBar) progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // --- 2. NAVBAR SCROLLED STATE & SCROLLSPY ---
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const onScroll = () => {
    // Navbar glass effect increase on scroll
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // ScrollSpy: highlight active link
    const scrollPosition = window.scrollY + 140;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        mobileNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- 3. MOBILE HAMBURGER MENU ---
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = burgerBtn.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      burgerBtn.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close mobile nav when clicking a link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        burgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 4. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 5. PROJECTS FILTER SYSTEM ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 6. COPY EMAIL & TOAST NOTIFICATION ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message = 'Email copié dans le presse-papier !') {
    if (!toastNotice) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'davianmbayi20@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('✓ Email copié : ' + email);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('✓ Email copié : ' + email);
      }
    });
  }

  // --- 7. MODAL CONTROLS ---
  const calcModal = document.getElementById('calcModal');
  const openCalcBtns = document.querySelectorAll('.open-calc-btn');
  const closeCalcBtn = document.getElementById('closeCalcBtn');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openCalcBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(calcModal);
    });
  });

  if (closeCalcBtn && calcModal) {
    closeCalcBtn.addEventListener('click', () => closeModal(calcModal));
    calcModal.addEventListener('click', (e) => {
      if (e.target === calcModal) closeModal(calcModal);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && calcModal?.classList.contains('active')) {
      closeModal(calcModal);
    }
  });

  // --- 8. LIVE GRADE CALCULATOR (INSIDE MODAL) ---
  let calcNotes = [
    { id: 1, valeur: 16, coef: 2 },
    { id: 2, valeur: 18, coef: 3 },
    { id: 3, valeur: 14.5, coef: 1 }
  ];
  let noteCounter = 4;

  const inputNote = document.getElementById('calcInputNote');
  const inputCoef = document.getElementById('calcInputCoef');
  const addNoteBtn = document.getElementById('calcAddBtn');
  const notesListEl = document.getElementById('calcNotesList');
  const calcComputeBtn = document.getElementById('calcComputeBtn');
  const calcClearBtn = document.getElementById('calcClearBtn');
  const calcResultEl = document.getElementById('calcResult');

  function renderCalcNotes() {
    if (!notesListEl) return;
    notesListEl.innerHTML = '';

    if (calcNotes.length === 0) {
      notesListEl.innerHTML = '<li style="text-align:center; color:#94a3b8; font-size:0.85rem; padding:0.5rem;">Aucune note enregistrée.</li>';
      return;
    }

    calcNotes.forEach(item => {
      const li = document.createElement('li');
      li.className = 'calc-note-item';
      li.innerHTML = `
        <span>Note: <strong>${item.valeur}/20</strong> (Coefficient: ${item.coef})</span>
        <button class="calc-note-delete" title="Supprimer" data-id="${item.id}">✕</button>
      `;
      notesListEl.appendChild(li);
    });

    // Attach delete listeners
    document.querySelectorAll('.calc-note-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        calcNotes = calcNotes.filter(n => n.id !== id);
        renderCalcNotes();
        if (calcResultEl) {
          calcResultEl.textContent = 'Moyenne : --/20';
          calcResultEl.style.color = 'var(--accent-cyan)';
        }
      });
    });
  }

  function addNote() {
    if (!inputNote || !inputCoef) return;
    const val = parseFloat(inputNote.value);
    const coef = parseFloat(inputCoef.value);

    if (isNaN(val) || val < 0 || val > 20) {
      alert('Veuillez entrer une note valide entre 0 et 20.');
      inputNote.focus();
      return;
    }
    if (isNaN(coef) || coef <= 0) {
      alert('Veuillez entrer un coefficient supérieur à 0.');
      inputCoef.focus();
      return;
    }

    calcNotes.push({ id: noteCounter++, valeur: val, coef: coef });
    inputNote.value = '';
    inputCoef.value = '1';
    inputNote.focus();
    renderCalcNotes();
  }

  function computeMoyenne() {
    if (!calcResultEl) return;
    if (calcNotes.length === 0) {
      alert('Veuillez d\'abord ajouter des notes.');
      return;
    }

    let sum = 0;
    let totalCoef = 0;
    calcNotes.forEach(n => {
      sum += n.valeur * n.coef;
      totalCoef += n.coef;
    });

    const avg = (sum / totalCoef).toFixed(2);
    calcResultEl.textContent = `Moyenne : ${avg} / 20`;
    calcResultEl.style.color = (avg >= 10) ? '#34d399' : '#f87171';
  }

  function clearAllNotes() {
    calcNotes = [];
    renderCalcNotes();
    if (calcResultEl) {
      calcResultEl.textContent = 'Moyenne : --/20';
      calcResultEl.style.color = 'var(--accent-cyan)';
    }
  }

  if (addNoteBtn) addNoteBtn.addEventListener('click', addNote);
  if (inputNote) inputNote.addEventListener('keypress', (e) => { if (e.key === 'Enter') addNote(); });
  if (inputCoef) inputCoef.addEventListener('keypress', (e) => { if (e.key === 'Enter') addNote(); });
  if (calcComputeBtn) calcComputeBtn.addEventListener('click', computeMoyenne);
  if (calcClearBtn) calcClearBtn.addEventListener('click', clearAllNotes);

  // Initialize list inside modal
  renderCalcNotes();
  computeMoyenne();

  // --- 9. CONTACT FORM HANDLER ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      const subject = document.getElementById('formSubject')?.value.trim();
      const message = document.getElementById('formMessage')?.value.trim();

      if (!name || !email || !message) {
        alert('Veuillez renseigner tous les champs obligatoires.');
        return;
      }

      // Generate mailto link
      const mailtoUrl = `mailto:davianmbayi20@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + (subject || 'Prise de contact') + ' - ' + name)}&body=${encodeURIComponent('Nom: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
      window.location.href = mailtoUrl;

      showToast('Ouverture de votre client mail...');
      contactForm.reset();
    });
  }

  // --- 10. REVEAL ANIMATIONS ON SCROLL ---
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('visible'));
  }
});
