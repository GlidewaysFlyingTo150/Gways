const googleSheetsURL = "https://script.google.com/macros/s/AKfycbwfs2i9Mp9MiffpPYTbvI_vXZw1fdwfnP40x-kZ20bJpANitmSds7ydX0iPEyNXVcAU3A/exec"; // Replace with your deployed Apps Script URL

document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");

    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        if (username && username.trim() !== "") {
            window.location.href = "seats.html";
        } else {
            localStorage.removeItem("username");
        }
    } else if (window.location.pathname.includes("seats.html")) {
        if (!username) {
            window.location.href = "index.html";
        } else {
            createSeats();
        }
    }

    document.getElementById("usernameForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        if (username) {
            localStorage.setItem("username", username);
            window.location.href = "seats.html";
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
    seatContainer.innerHTML = "";

    const rows = 21;
    const columns = ["A", "B", "", "C", "D"];

    for (let row = 1; row <= rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        columns.forEach(col => {
            if (col === "") {
                const space = document.createElement("div");
                space.classList.add("seat-space");
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
    loadSeats();
}

// Handle selecting a seat
function selectSeat(seat) {
    document.querySelectorAll(".seat").forEach(seat => {
        if (!seat.classList.contains("booked")) {
            seat.classList.remove("selected");
            seat.style.backgroundColor = "white";
        }
    });

    seat.classList.add("selected");
    seat.style.backgroundColor = "green";
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
        mode: "cors",
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

// Load booked seats from Google Sheets
function loadSeats() {
    fetch(googleSheetsURL, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        console.log("Response received:", response);
        if (!response.ok) {
            throw new Error("Network response was not ok: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched seat bookings: ", data);

        document.querySelectorAll(".seat").forEach(seat => {
            seat.classList.remove("booked");
            seat.style.backgroundColor = "white";
        });

        data.forEach(booking => {
            const seatElement = document.querySelector(`[data-seat='${booking.seat}']`);
            if (seatElement) {
                seatElement.classList.add("booked");
                seatElement.style.backgroundColor = "red";
                seatElement.removeEventListener("click", selectSeat);
            }
        });
    })
    .catch(error => console.error("Error loading seats:", error));
}

// Run seat generation when seats.html loads
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("seats.html")) {
        createSeats();
    }
});
