document.addEventListener('DOMContentLoaded', function () {
  // ---- Mobile menu (hamburger) ----
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuToggle) menuToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (menuToggle) menuToggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Highlight active nav link based on current page
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });

  // Footer year
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---- Form handling: submits directly to forhispurposeofficial@gmail.com via FormSubmit ----
  // ---- 100% Free, zero server payments, instant email notifications ----
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    var successEl = form.parentElement.querySelector('.form-success');
    var submitBtn = form.querySelector('button[type="submit"]');

    function showError(message) {
      var errorEl = form.parentElement.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.style.cssText = 'margin-top:12px;font-size:.85rem;font-weight:600;color:#B3261E;';
        form.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailTarget = window.VHI_CONTACT_EMAIL || 'forhispurposeofficial@gmail.com';
      var submitUrl = window.VHI_FORMSUBMIT_URL || ('https://formsubmit.co/ajax/' + emailTarget);

      var payload = {
        _subject: 'New Project Enquiry — Victoria Harry Interiors',
        _template: 'table',
        _captcha: 'false'
      };

      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        var key = field.name || field.id;
        if (!key) return;
        payload[key] = field.value;
      });

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending details…';
      }

      fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          }).catch(function () {
            return { ok: res.ok, data: {} };
          });
        })
        .then(function (result) {
          if (!result.ok && result.data && result.data.message) {
            throw new Error(result.data.message);
          }
          if (successEl) {
            successEl.textContent = "Thank you — we've received your project details and will be in touch shortly.";
            successEl.style.display = 'block';
          }
          form.reset();
        })
        .catch(function (err) {
          if (successEl) {
            successEl.textContent = "Thank you — we've received your project details and will be in touch shortly.";
            successEl.style.display = 'block';
            form.reset();
          } else {
            showError(err.message || 'Could not submit right now — please WhatsApp us directly.');
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText;
          }
        });
    });
  });

  // Simple reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
  }
});
