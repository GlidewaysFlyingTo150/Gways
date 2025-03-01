document.addEventListener("DOMContentLoaded", function () {
    // Handle username input on index.html
    const usernameForm = document.getElementById("usernameForm");
    if (usernameForm) {
        usernameForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            if (username) {
                localStorage.setItem("username", username);
                window.location.href = "seats.html"; // Redirect to seat selection page
            } else {
                alert("Please enter a valid username.");
            }
        });
    }

    // Generate seats if on seats.html
    const seatContainer = document.getElementById("seat-container");
    if (seatContainer) {
        generateSeats();
        loadSeats();
    }

    // Handle seat confirmation
    const confirmSeatBtn = document.getElementById("confirm-seat");
    if (confirmSeatBtn) {
        confirmSeatBtn.addEventListener("click", function () {
            const username = localStorage.getItem("username");
            const selectedSeat = localStorage.getItem("selectedSeat");

            if (!selectedSeat) {
                alert("Please select a seat first.");
                return;
            }

            fetch("https://script.google.com/macros/s/AKfycbyEGxScjlyGHFX5yYGk8X7hYvzEj79yfueQHopAhL7txNzrxJM3A80E8Cq_UOl5ly5h/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, seat: selectedSeat }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert(`Seat ${selectedSeat} booked successfully!`);
                    loadSeats();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => alert("Error booking seat: " + error));
        });
    }
});

// Generate seats dynamically
function generateSeats() {
    const seatContainer = document.getElementById("seat-container");
    seatContainer.innerHTML = ""; // Clear previous seats

    const rows = 21;
    const columns = ["A", "B", " ", "C", "D"]; // " " for spacing

    for (let row = 1; row <= rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        columns.forEach((col) => {
            if (col === " ") {
                const spacer = document.createElement("div");
                spacer.className = "seat-spacer"; // Empty space
                rowDiv.appendChild(spacer);
            } else {
                const seat = document.createElement("button");
                seat.className = "seat";
                seat.textContent = `${col}${row}`;
                seat.dataset.seat = `${col}${row}`;
                seat.addEventListener("click", selectSeat);
                rowDiv.appendChild(seat);
            }
        });

        seatContainer.appendChild(rowDiv);
    }
}

// Handle seat selection
function selectSeat(event) {
    const selectedSeat = event.target.dataset.seat;
    localStorage.setItem("selectedSeat", selectedSeat);

    document.querySelectorAll(".seat").forEach(seat => seat.classList.remove("selected"));
    event.target.classList.add("selected");
}

// Load booked seats from Google Sheets
function loadSeats() {
    fetch("https://script.google.com/macros/s/AKfycbyEGxScjlyGHFX5yYGk8X7hYvzEj79yfueQHopAhL7txNzrxJM3A80E8Cq_UOl5ly5h/exec")
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
