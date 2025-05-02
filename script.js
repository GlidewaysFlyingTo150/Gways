// Booking page logic
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');
  const classSelect = document.getElementById('class-options');
  const username = localStorage.getItem('robloxUsername');
  const ownsPass = localStorage.getItem('ownsFirstClass') === 'true';

  // Greet the user
  if (username) {
    const welcome = document.getElementById('welcome');
    welcome.textContent = `Welcome, ${username}!`;
  }

  // Hide First Class if they don't own it
  if (!ownsPass && classSelect) {
    const fcOption = classSelect.querySelector('option[value="first"]');
    if (fcOption) fcOption.remove();
  }

  // Tab switching
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
});
