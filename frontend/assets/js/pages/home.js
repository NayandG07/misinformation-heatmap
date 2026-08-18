export async function initHome() {
  // 1. Initialize Typewriter
  initTypewriter();

  // 2. Initialize FAQ Accordions
  initFaq();
}

function initTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  if (!textElement) return;

  const words = [
    'before it spreads.',
    'across 20+ Indian languages.',
    'in real-time.',
    'before it goes viral.'
  ];

  let wordIndex = 0;
  let text = '';
  let isDeleting = false;
  let typeSpeed = 100;

  textElement.textContent = words[0];
  text = words[0];
  isDeleting = true;

  function type() {
    const current = wordIndex % words.length;
    const fullText = words[current];

    if (isDeleting) {
      text = fullText.substring(0, text.length - 1);
      typeSpeed = 40;
    } else {
      text = fullText.substring(0, text.length + 1);
      typeSpeed = 80;
    }

    if (text === '') {
      textElement.innerHTML = '&nbsp;';
    } else {
      textElement.textContent = text;
    }

    if (!isDeleting && text === fullText) {
      typeSpeed = 2800;
      isDeleting = true;
    } else if (isDeleting && text === '') {
      isDeleting = false;
      wordIndex++;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 2500);
}

function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;

    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
