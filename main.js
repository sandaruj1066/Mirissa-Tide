/* Mirissa Tides — shared behaviour: mobile nav, gallery lightbox, form validation */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile navigation toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---------- Highlight current page in nav ---------- */
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var target = link.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryButtons = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid button'));
  var lightbox = document.getElementById('lightbox');
  if (galleryButtons.length && lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCaption = lightbox.querySelector('figcaption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      var btn = galleryButtons[index];
      var img = btn.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = btn.getAttribute('data-caption') || img.alt;
      lightbox.classList.add('open');
      closeBtn.focus();
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
    }
    function showRelative(delta) {
      currentIndex = (currentIndex + delta + galleryButtons.length) % galleryButtons.length;
      openLightbox(currentIndex);
    }

    galleryButtons.forEach(function (btn, index) {
      btn.addEventListener('click', function () { openLightbox(index); });
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { showRelative(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showRelative(1); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showRelative(1);
      if (e.key === 'ArrowLeft') showRelative(-1);
    });
  }

  /* ---------- Contact / booking form validation ---------- */
  var form = document.getElementById('inquiry-form');
  if (form) {
    var successBox = document.getElementById('form-success');

    function setError(field, message) {
      var wrapper = field.closest('.field');
      wrapper.classList.add('error');
      var msg = wrapper.querySelector('.error-msg');
      if (msg) msg.textContent = message;
    }
    function clearError(field) {
      var wrapper = field.closest('.field');
      wrapper.classList.remove('error');
    }
    function validateField(field) {
      if (field.hasAttribute('required') && !field.value.trim()) {
        setError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && field.value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
          setError(field, 'Enter a valid email address.');
          return false;
        }
      }
      if (field.type === 'tel' && field.value) {
        var phonePattern = /^[0-9+\-\s()]{7,}$/;
        if (!phonePattern.test(field.value)) {
          setError(field, 'Enter a valid phone number.');
          return false;
        }
      }
      if (field.id === 'travel-date' && field.value) {
        var chosen = new Date(field.value);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen < today) {
          setError(field, 'Please choose a date in the future.');
          return false;
        }
      }
      clearError(field);
      return true;
    }

    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () { clearError(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });
      if (allValid) {
        form.reset();
        if (successBox) {
          successBox.classList.add('show');
          successBox.setAttribute('tabindex', '-1');
          successBox.focus();
        }
      } else {
        var firstError = form.querySelector('.field.error input, .field.error select, .field.error textarea');
        if (firstError) firstError.focus();
      }
    });
  }

  /* ---------- Newsletter mini-form on footer (progressive enhancement) ---------- */
  var newsletter = document.getElementById('newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('newsletter-note');
      var input = newsletter.querySelector('input[type=email]');
      if (input && input.value) {
        note.textContent = 'Thanks — keep an eye on your inbox for Mirissa updates.';
      } else {
        note.textContent = 'Please enter an email address first.';
      }
    });
  }

});
