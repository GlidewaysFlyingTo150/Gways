const googleSheetsURL = "https://script.google.com/macros/s/AKfycbwrpR9vZLqGiKBjXoSv8BT_a7AwPoGnHAFji3r-kN7MsSRIDisO6y0zCUVV9ElzZ2JP/exec";

// Redirects user to seat selection page after entering username
document.addEventListener("DOMContentLoaded", function () {
    const usernameForm = document.getElementById("usernameForm");
    if (usernameForm) {
        usernameForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            localStorage.setItem("username", username);
            window.location.href = 'seats.html';
        });
    }

    loadSeats(); // Load booked seats when the page loads
});

// Seat selection function
function selectSeat(seatNumber) {
    const seats = document.querySelectorAll(".seat");
    
    // Remove 'selected' class from all seats
    seats.forEach(seat => seat.classList.remove("selected"));

    const selectedSeat = document.querySelector(`[data-seat='${seatNumber}']`);
    
    // Only highlight if it's not already booked
    if (!selectedSeat.classList.contains("booked")) {
        selectedSeat.classList.add("selected");
        localStorage.setItem("selectedSeat", seatNumber);
    }
}

// Confirm seat selection and send data to Google Sheets
document.getElementById("confirm-seat").addEventListener("click", function () {
    const username = localStorage.getItem("username");
    const selectedSeat = localStorage.getItem("selectedSeat");

    if (!selectedSeat) {
        alert("Please select a seat first.");
        return;
    }

    fetch(googleSheetsURL, {
        method: "POST",
        mode: "no-cors", // Prevents CORS errors
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, seat: selectedSeat }),
    })
    .then(response => console.log("Seat booking request sent"))
    .catch(error => console.error("Error booking seat:", error));
});

// Load booked seats from Google Sheets
function loadSeats() {
    fetch(googleSheetsURL)
    .then(response => response.json())
    .then(data => {
        data.forEach(booking => {
            const seatElement = document.querySelector(`[data-seat='${booking.seat}']`);
            if (seatElement) {
                seatElement.classList.add("booked");
            }
        });
    })
    .catch(error => console.error("Error loading seats:", error));
}
