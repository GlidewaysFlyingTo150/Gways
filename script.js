const googleSheetsURL = "https://script.google.com/macros/s/AKfycbz1LzVB-h6-d26X2DXlibyG9IXTNvAOh12xTJUqdNqh4sc3c0u8EjRs61YwqcQkWKcDmw/exec"; // Replace with your deployed Apps Script URL

document.addEventListener("DOMContentLoaded", function () {
    // Check if username is stored, otherwise redirect to username page
    if (!localStorage.getItem("username")) {
        window.location.href = "index.html";
    }

    createSeats();
    loadSeats();
});

// Handle username submission
document.getElementById("usernameForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    if (username) {
        localStorage.setItem("username", username);
        window.location.href = "seats.html";
    }
});

// Handle seat selection
function createSeats() {
    const seatContainer = document.getElementById("seatContainer");
    seatContainer.innerHTML = ""; // Clear previous seats

    const rows = 21;
    const columns = ["A", "B", "", "C", "D"]; // Space for aisle

    for (let row = 1; row <= rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        columns.forEach((col, index) => {
            if (col === "") {
                const space = document.createElement("div");
                space.classList.add("seat-space"); // Aisle space
                rowDiv.appendChild(space);
            } else {
                const seat = document.createElement("button");
                seat.classList.add("seat");
                seat.dataset.seat = `${col}${row}`;
                seat.innerText = `${col}${row}`;
                seat.addEventListener("click", () => selectSeat(seat));
                rowDiv.appendChild(seat);
            }
        });

        seatContainer.appendChild(rowDiv);
    }
}

// Handle selecting a seat
function selectSeat(seat) {
    document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
    seat.classList.add("selected");
    localStorage.setItem("selectedSeat", seat.dataset.seat);
}

// Confirm seat booking
document.getElementById("confirm-seat")?.addEventListener("click", function () {
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
            loadSeats(); // Refresh seat bookings
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
        document.querySelectorAll(".seat").forEach(seat => {
            seat.classList.remove("booked");
            seat.style.backgroundColor = "white"; // Reset to default
        });

        data.forEach(booking => {
            const seatElement = document.querySelector(`[data-seat='${booking.seat}']`);
            if (seatElement) {
                seatElement.classList.add("booked");
                seatElement.style.backgroundColor = "red"; // Mark as booked
                seatElement.removeEventListener("click", selectSeat);
            }
        });
    })
    .catch(error => console.error("Error loading seats: ", error));
}
