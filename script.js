const googleSheetsURL = "https://script.google.com/macros/s/AKfycbxLa__jsovsZPm00VRSg_IWLY7i9YshaY4bE6AgLavJxgDsdSGFJ57qBH91gx8FJNHoLw/exec";

// ✅ Handle username submission on index.html
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("usernameForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            if (username.trim() === "") {
                alert("Please enter a valid username!");
                return;
            }
            localStorage.setItem("username", username);
            window.location.href = "seats.html"; // Redirect to seat selection
        });
    }
});

// ✅ Handle seat selection
document.addEventListener("DOMContentLoaded", function () {
    const seats = document.querySelectorAll(".seat"); // Assuming seats have class "seat"
    
    seats.forEach(seat => {
        seat.addEventListener("click", function () {
            if (seat.classList.contains("booked")) {
                alert("This seat is already booked.");
                return;
            }
            document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
            seat.classList.add("selected");
            localStorage.setItem("selectedSeat", seat.dataset.seat); // Store selected seat
        });
    });
});

// ✅ Handle seat booking
document.getElementById("confirm-seat")?.addEventListener("click", function () {
    const username = localStorage.getItem("username");
    const selectedSeat = localStorage.getItem("selectedSeat");

    if (!username) {
        alert("Username not found. Please go back and enter your username.");
        window.location.href = "index.html";
        return;
    }

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

// ✅ Load booked seats from Google Sheets
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

// ✅ Run loadSeats() when seats.html loads
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("seats-container")) {
        loadSeats();
    }
});
