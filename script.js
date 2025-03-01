const googleSheetsURL = "https://script.google.com/macros/s/AKfycbwrpR9vZLqGiKBjXoSv8BT_a7AwPoGnHAFji3r-kN7MsSRIDisO6y0zCUVV9ElzZ2JP/exec"; 

document.addEventListener("DOMContentLoaded", function () {
    const usernameForm = document.getElementById("usernameForm");
    if (usernameForm) {
        usernameForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            localStorage.setItem("username", username);
            window.location.href = "seats.html"; // Redirect to seat selection page
        });
    }

    const seatContainer = document.getElementById("seat-container");
    if (seatContainer) {
        createSeatLayout(); // Create seat layout on page load
        loadSeats(); // Load booked seats from Google Sheets
    }

    const confirmButton = document.getElementById("confirm-seat");
    if (confirmButton) {
        confirmButton.addEventListener("click", function () {
            confirmSeatSelection();
        });
    }
});

// Create seat layout with 2 columns, 2 seats per row, 21 rows
function createSeatLayout() {
    const seatContainer = document.getElementById("seat-container");
    if (!seatContainer) return;

    for (let row = 1; row <= 21; row++) { // 21 rows
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        for (let col = 1; col <= 2; col++) { // 2 seats per row
            const seatNumber = `${row}${String.fromCharCode(64 + col)}`; // Ex: 1A, 1B
            const seat = document.createElement("button");
            seat.classList.add("seat");
            seat.textContent = seatNumber;
            seat.dataset.seat = seatNumber;

            seat.addEventListener("click", function () {
                selectSeat(seatNumber);
            });

            rowDiv.appendChild(seat);
        }
        seatContainer.appendChild(rowDiv);
    }
}

// Handle seat selection
function selectSeat(seatNumber) {
    const allSeats = document.querySelectorAll(".seat");
    allSeats.forEach(seat => seat.classList.remove("selected"));

    const selectedSeat = document.querySelector(`[data-seat='${seatNumber}']`);
    if (selectedSeat) {
        if (selectedSeat.classList.contains("booked")) {
            alert(`Sorry, Seat ${seatNumber} is already booked.`);
            return;
        }
        selectedSeat.classList.add("selected");
    }

    localStorage.setItem("selectedSeat", seatNumber);
}

// Load booked seats from Google Sheets
function loadSeats() {
    fetch(googleSheetsURL)
    .then(response => response.json())
    .then(data => {
        data.forEach(booking => {
            const seatElement = document.querySelector(`[data-seat='${booking.seat}']`);
            if (seatElement) {
                seatElement.classList.add("booked");
                seatElement.disabled = true; // Disable booked seats
            }
        });
    })
    .catch(error => console.error("Error loading seats: ", error));
}

// Confirm and store seat booking in Google Sheets
function confirmSeatSelection() {
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
            alert("Booking failed: " + data.message);
        }
    })
    .catch(error => alert("Error booking seat: " + error));
}
