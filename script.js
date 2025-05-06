const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const tabSlider = document.querySelector(".tab-slider");

tabButtons.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tabSlider.style.transform = `translateX(${i * 100}%)`;

    tabContents.forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

document.getElementById("booking-form").addEventListener("submit", e => {
  e.preventDefault();
  const username = localStorage.getItem("robloxUsername") || "Guest";
  const flight = document.getElementById("flight").value;
  const flightClass = document.getElementById("class").value;
  alert(`${username} booked flight ${flight} in ${flightClass} class!`);

  // You can store bookings in localStorage for now or add backend later
});

document.getElementById("status-form").addEventListener("submit", e => {
  e.preventDefault();
  const flight = document.getElementById("flight-status").value;
  alert(`Status for ${flight} will be fetched.`);
});
