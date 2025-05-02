async function login() {
  const username = document.getElementById('username').value.trim();
  const errorDisplay = document.getElementById('login-error');
  errorDisplay.textContent = '';

  if (!username) {
    errorDisplay.textContent = 'Please enter a Roblox username.';
    return;
  }

  try {
    const res = await fetch('/check-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('robloxUsername', username);
      localStorage.setItem('ownsPass', data.ownsPass);
      window.location.href = '/booking';
    } else {
      errorDisplay.textContent = 'You do not own the First Class Gamepass.';
    }
  } catch (err) {
    console.error(err);
    errorDisplay.textContent = 'An error occurred. Please try again later.';
  }
}

// Booking page logic
window.addEventListener('DOMContentLoaded', () => {
  const usernameDisplay = document.getElementById('welcome-username');
  const firstClassButton = document.getElementById('first-class');

  const username = localStorage.getItem('robloxUsername');
  const ownsPass = localStorage.getItem('ownsPass') === 'true';

  if (usernameDisplay && username) {
    usernameDisplay.textContent = `Welcome, ${username}!`;
  }

  if (firstClassButton && !ownsPass) {
    firstClassButton.style.display = 'none';
  }
});
