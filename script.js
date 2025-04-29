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
