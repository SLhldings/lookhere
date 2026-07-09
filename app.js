// app.js

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.chart-line').forEach(el => {
    el.style.animationDelay = `${Math.random() * 1.5}s`;
  });
});
