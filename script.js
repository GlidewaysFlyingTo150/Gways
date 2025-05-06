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

});

const flightStatuses = {
  GW101: "🟢 On Time - Departure at 2:00 PM",
  GW202: "🔴 Delayed - Estimated departure at 4:30 PM"
};

const flightStatusSelect = document.getElementById("flight-status");
const statusResult = document.getElementById("status-result");

flightStatusSelect.addEventListener("change", () => {
  const selectedFlight = flightStatusSelect.value;
  if (flightStatuses[selectedFlight]) {
    statusResult.textContent = `Status: ${flightStatuses[selectedFlight]}`;
  } else {
    statusResult.textContent = "Status information is currently unavailable.";
  }
});
