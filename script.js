const googleSheetsURL = "https://script.google.com/macros/s/AKfycbw6rCNuHVjP2hKwGVqIpcGdFJut0QvJjBMX-u_8SYtfe8L4B3DE5VZ-_yssIUCzVZldvA/exec";

// Redirect to seat selection page after username entry
document.addEventListener("DOMContentLoaded", function() {
    const usernameForm = document.getElementById("usernameForm");

    if (usernameForm) {
        usernameForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const username = document.getElementById("username").value.trim();
            if (!username) {
                alert("Please enter a username.");
                return;
            }

            localStorage.setItem("username", username);
            window.location.href = "seats.html";
        });
    }

    // Load seats when on the seats page
    if (window.location.pathname.includes("seats.html")) {
        loadSeats();
    }
});

// Load booked seats from Google Sheets
function loadSeats() {
    fetch(googleSheetsURL)
    .then(response => response.json())
    .then(data => {
        const seatContainer = document.getElementById("seat-container");
        seatContainer.innerHTML = ""; // Clear previous seats

        for (let row = 1; row <= 5; row++) { // Example: 5 rows
            for (let col = 1; col <= 4; col++) { // Example: 4 seats per row
                const seatNumber = `${row}${String.fromCharCode(64 + col)}`; // "1A", "1B", etc.
                const seatButton = document.createElement("button");
                seatButton.textContent = seatNumber;
                seatButton.classList.add("seat");

                if (data.some(booking => booking.seat === seatNumber)) {
                    seatButton.classList.add("booked");
                    seatButton.disabled = true;
                }

                seatButton.addEventListener("click", function() {
                    document.querySelectorAll(".seat").forEach(seat => seat.classList.remove("selected"));
                    seatButton.classList.add("selected");
                    localStorage.setItem("selectedSeat", seatNumber);
                });

                seatContainer.appendChild(seatButton);
            }
            seatContainer.appendChild(document.createElement("br")); // New row
        }
    })
    .catch(error => console.error("Error loading seats: ", error));
}

// Handle seat booking
document.addEventListener("DOMContentLoaded", function() {
    const confirmSeatButton = document.getElementById("confirm-seat");

    if (confirmSeatButton) {
        confirmSeatButton.addEventListener("click", function() {
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
    }
});
