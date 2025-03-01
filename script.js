// Google Apps Script URL (replace with your actual deployment URL)
const googleSheetsURL = "https://script.google.com/macros/s/AKfycbwrpR9vZLqGiKBjXoSv8BT_a7AwPoGnHAFji3r-kN7MsSRIDisO6y0zCUVV9ElzZ2JP/exec";

// Handle username submission
document.addEventListener("DOMContentLoaded", function () {
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
});

// Handle seat selection
document.addEventListener("DOMContentLoaded", function () {
    const seatContainer = document.getElementById("seat-container");
    if (seatContainer) {
        generateSeats(); // Generate seat layout
        loadSeats(); // Fetch booked seats from Google Sheets
    }

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
});

// Function to generate seat layout (4 columns, 21 rows, with aisle space)
function generateSeats() {
    const seatContainer = document.getElementById("seat-container");
    seatContainer.innerHTML = ""; // Clear previous seats

    for (let row = 1; row <= 21; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        // First 2 seats (A, B)
        for (let col of ["A", "B"]) {
            const seat = document.createElement("button");
            seat.classList.add("seat");
            seat.textContent = `${row}${col}`;
            seat.dataset.seat = `${row}${col}`;
            seat.addEventListener("click", selectSeat);
            rowDiv.appendChild(seat);
        }

        // Add space between columns
        const space = document.createElement("div");
        space.classList.add("aisle-space");
        rowDiv.appendChild(space);

        // Last 2 seats (C, D)
        for (let col of ["C", "D"]) {
            const seat = document.createElement("button");
            seat.classList.add("seat");
            seat.textContent = `${row}${col}`;
            seat.dataset.seat = `${row}${col}`;
            seat.addEventListener("click", selectSeat);
            rowDiv.appendChild(seat);
        }

        seatContainer.appendChild(rowDiv);
    }
}

// Function to handle seat selection
function selectSeat(event) {
    const selectedSeat = event.target;
    const previouslySelected = document.querySelector(".selected");
    if (previouslySelected) {
        previouslySelected.classList.remove("selected");
        previouslySelected.style.backgroundColor = "white";
    }

    selectedSeat.classList.add("selected");
    selectedSeat.style.backgroundColor = "green";
    localStorage.setItem("selectedSeat", selectedSeat.dataset.seat);
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
                seatElement.style.backgroundColor = "red"; // Mark booked seats
            }
        });
    })
    .catch(error => console.error("Error loading seats: ", error));
}
