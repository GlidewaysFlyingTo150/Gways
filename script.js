const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const tabSlider = document.querySelector(".tab-slider");

tabButtons.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    // Update active button
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Slide the slider
    tabSlider.style.transform = `translateX(${i * 100}%)`;

    // Show the right tab
    tabContents.forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Temporary form logging
document.getElementById("booking-form").addEventListener("submit", e => {
  e.preventDefault();
  const flight = document.getElementById("flight").value;
  const flightClass = document.getElementById("class").value;
  alert(`Booked flight ${flight} in ${flightClass} class!`);
});

document.getElementById("status-form").addEventListener("submit", e => {
  e.preventDefault();
  const flight = document.getElementById("flight-status").value;
  alert(`Status for ${flight} will be fetched.`);
});

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

    if (data.success && data.ownsPass) {
      localStorage.setItem('robloxUsername', username);
      window.location.href = '/booking';
    } else {
      errorDisplay.textContent = 'You do not own the First Class Gamepass.';
    }
  } catch (err) {
    console.error(err);
    errorDisplay.textContent = 'An error occurred. Please try again later.';
  }
}
