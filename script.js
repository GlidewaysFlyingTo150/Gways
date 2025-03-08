const googleSheetsURL = "https://script.google.com/macros/s/AKfycbwXDdjbh5DZWaT_-oZE-sQy8q5aNZfPP4UsN1y8WrhxKPFv6DBBPlB8YlaV5M0Fzvreew/exec"; // Replace with your deployed Apps Script URL

document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");

    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        if (username && username.trim() !== "") {
            window.location.href = "seats.html"; // Redirect to seat selection if username exists
        } else {
            localStorage.removeItem("username"); // Ensure it's cleared if invalid
        }
    } else if (window.location.pathname.includes("seats.html")) {
        if (!username) {
            window.location.href = "index.html"; // Redirect back if no username
        } else {
            createSeats(); // Load seats if user is authenticated
        }
    }

    // Handle username form submission
    document.getElementById("usernameForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        if (username) {
            localStorage.setItem("username", username);
            window.location.href = "seats.html"; // Redirect after entering username
        } else {
            alert("Please enter a username.");
        }
    });
});

// Generate seat layout
function createSeats() {
    const seatContainer = document.getElementById("seat-map");
    if (!seatContainer) {
        console.error("Seat container not found!");
        return;
    }
    seatContainer.innerHTML = ""; // Clear previous seats

    const rows = 21;
    const columns = ["A", "B", "", "C", "D"]; // Space for aisle

    for (let row = 1; row <= rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        columns.forEach(col => {
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

    console.log("Seats created. Now loading booked seats...");
    loadSeats(); // Ensure this runs AFTER all seats are created
}

// Handle selecting a seat
function selectSeat(seat) {
    // Remove 'selected' class and reset background for all seats EXCEPT booked ones
    document.querySelectorAll(".seat").forEach(s => {
        if (!s.classList.contains("booked")) {
            s.classList.remove("selected");
            s.style.backgroundColor = "white"; // Reset unselected seats
        }
    });

    // Highlight the newly selected seat
    seat.classList.add("selected");
    seat.style.backgroundColor = "green"; // Show selection
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
    fetch(googleSheetsURL, {
        method: "GET",
        mode: "cors", // Allow cross-origin requests
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched seat bookings: ", data);
        
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

// Run seat generation when seats.html loads
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("seats.html")) {
        createSeats();
    }
});
