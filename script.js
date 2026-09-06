const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const pageLoader = document.querySelector('[data-page-loader]');

document.body.classList.add('is-loading');

const finishPageLoader = () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  window.setTimeout(() => {
    pageLoader?.classList.add('is-done');
    pageLoader?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-loading');
  }, prefersReducedMotion ? 80 : 1120);
};

if (document.readyState === 'complete') {
  finishPageLoader();
} else {
  window.addEventListener('load', finishPageLoader, { once: true });
}

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 14);
};

setHeaderState();

window.addEventListener('scroll', setHeaderState, {
  passive: true
});

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';

  menuToggle.setAttribute('aria-expanded', String(!open));
  mainNav?.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mainNav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

const form = document.querySelector('[data-contact-form]');
const status = document.querySelector('[data-form-status]');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending…';
  }

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(
      'https://formsubmit.co/ajax/kimhaba19@gmail.com',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    console.log('FormSubmit response:', result);

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    if (submitButton) {
      submitButton.innerHTML =
        'Brief received <span aria-hidden="true">→</span>';
      submitButton.disabled = true;
    }

    if (status) {
      status.textContent =
        'Thanks — the next step starts with a clear brief.';
    }

    form.reset();
  } catch (error) {
    console.error('Contact form error:', error);

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML =
        'Send project brief <span aria-hidden="true">→</span>';
    }

    if (status) {
      status.textContent =
        'Something went wrong. Please try again.';
    }
  }
});
