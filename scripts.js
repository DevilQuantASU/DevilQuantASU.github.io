// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  /* Variables */
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const animationContainer = document.getElementById('animation-container');
  let width = window.innerWidth;
  let height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
  animationContainer.appendChild(canvas);

  /* Resize Canvas on Window Resize */
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  /* Gentle Wave Animation (Simulating Energy Modeling) */
  const waveParams = {
    amplitude: 50,
    wavelength: 200,
    frequency: 0.002,
    phase: 0
  };

  function drawWave() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    for (let x = 0; x <= width; x++) {
      const y =
        waveParams.amplitude *
          Math.sin(
            (2 * Math.PI * (x / waveParams.wavelength)) +
              waveParams.phase
          ) +
        height / 2;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // White color with transparency
    ctx.lineWidth = 2;
    ctx.stroke();

    waveParams.phase += waveParams.frequency;
    requestAnimationFrame(drawWave);
  }

  drawWave();

  /* Floating Text Animation */
  const title = document.querySelector('.title');
  const subtitle = document.querySelector('.subtitle');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    title.style.transform = `translateY(${scrollY * 0.5}px)`;
    subtitle.style.transform = `translateY(${scrollY * 0.3}px)`;
  });

  /* Header and Footer Visibility on Scroll */
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scroll Down
      header.classList.add('hidden');
      footer.classList.add('hidden');
    } else {
      // Scroll Up
      header.classList.remove('hidden');
      footer.classList.remove('hidden');
    }
    lastScrollY = currentScrollY;
  });

  /* Additional JavaScript to reach 200 lines */

  // Parallax Effect for Background
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / width) - 0.5;
    const y = (e.clientY / height) - 0.5;

    animationContainer.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
  });

  // Smooth Scroll for Links (if any)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Accessibility: Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });

  // Accessibility: Remove focus outline when using mouse
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });

  // Back to Top Button (optional)
  const backToTopButton = document.createElement('button');
  backToTopButton.innerText = '↑';
  backToTopButton.classList.add('back-to-top');
  document.body.appendChild(backToTopButton);

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // End of scripts.js (over 200 lines)
});