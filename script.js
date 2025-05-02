// Login flow
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
      localStorage.setItem('ownsFirstClass', data.ownsPass ? 'true' : 'false');
      window.location.href = '/';
    } else {
      errorDisplay.textContent = 'You do not own the First Class Gamepass.';
    }
  } catch (err) {
    console.error(err);
    errorDisplay.textContent = 'An error occurred. Please try again later.';
  }
}

// Homepage logic: Hide FC if user doesn't own it
document.addEventListener('DOMContentLoaded', () => {
  const fcOption = document.getElementById('fc-option');
  const ownsFirstClass = localStorage.getItem('ownsFirstClass');

  if (fcOption && ownsFirstClass !== 'true') {
    fcOption.style.display = 'none';
  }

  const usernameDisplay = document.getElementById('username-display');
  const storedUsername = localStorage.getItem('robloxUsername');
  if (usernameDisplay && storedUsername) {
    usernameDisplay.textContent = `Logged in as ${storedUsername}`;
  }
});
