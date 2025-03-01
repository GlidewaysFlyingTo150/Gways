const googleSheetsURL = "https://script.google.com/macros/s/AKfycbzB5UpFL8cmhXkhB_0Rnbmw5zAScIBYV6YuCGb4Q9Su8R4yfvPxYmSW7HMr43TZtoBlCw/exec";

document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "index.html"; // Redirect back if no username
    } else {
        generateSeats();
        loadSeats();
    }
});

// Generate seats
function generateSeats() {
    const seating = document.getElementById("seating");
    for (let i = 1; i <= 30; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.textContent = i;
        seat.dataset.seat = i;
        seat.addEventListener("click", function () {
            selectSeat(i);
        });
        seating.appendChild(seat);
    }
}

// Handle seat selection
function selectSeat(seatNumber) {
    const seats = document.querySelectorAll(".seat");
    seats.forEach(seat => seat.classList.remove("selected"));

    const selectedSeat = document.querySelector(`[data-seat='${seatNumber}']`);
    if (!selectedSeat.classList.contains("booked")) {
        selectedSeat.classList.add("selected");
        localStorage.setItem("selectedSeat", seatNumber);
    }
}

// Handle seat confirmation
document.getElementById("confirm-seat").addEventListener("click", function () {
    const username = localStorage.getItem("username");
    const selectedSeat = localStorage.getItem("selectedSeat");

    if (!selectedSeat) {
        alert("Please select a seat first.");
        return;
    }

    fetch(googleSheetsURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, seat: selectedSeat }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(`Seat ${selectedSeat} booked successfully!`);
            loadSeats(); // Refresh booked seats
        } else {
            alert(data.message);
        }
    })
    .catch(error => alert("Error booking seat: " + error));
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
                seatElement.style.backgroundColor = "red"; // Mark booked seats
            }
        });
    })
    .catch(error => console.error("Error loading seats: ", error));
}
