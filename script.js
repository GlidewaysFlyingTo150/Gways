document.addEventListener("DOMContentLoaded", function () {
    // Check if we are on the username entry page
    if (document.getElementById("usernameForm")) {
        const form = document.getElementById("usernameForm");

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            localStorage.setItem("username", username); // Store username

            window.location.href = "seats.html"; // Redirect to seat selection
        });
    }

    // Check if we are on the seat selection page
    if (document.getElementById("displayUsername")) {
        const username = localStorage.getItem("username");
        if (username) {
            document.getElementById("displayUsername").textContent = username;
        } else {
            window.location.href = "index.html"; // Redirect back if no username found
        }

        // Generate seat layout dynamically
        generateSeats();

        // Handle seat selection
        document.getElementById("seat-map").addEventListener("click", function (event) {
            if (event.target.classList.contains("seat")) {
                document.querySelectorAll(".seat").forEach(seat => seat.classList.remove("selected"));
                event.target.classList.add("selected");
                localStorage.setItem("selectedSeat", event.target.dataset.seat);
            }
        });

        // Confirm seat selection
        document.getElementById("confirm-seat").addEventListener("click", function () {
            const selectedSeat = localStorage.getItem("selectedSeat");
            if (selectedSeat) {
                alert(`Seat ${selectedSeat} booked!`);
                // You can add webhook logic here
            } else {
                alert("Please select a seat first.");
            }
        });
    }
});

// Function to generate seat layout dynamically
function generateSeats() {
    const seatMap = document.getElementById("seat-map");
    if (!seatMap) return;

    for (let i = 1; i <= 10; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.textContent = i;
        seat.dataset.seat = i;
        seatMap.appendChild(seat);
    }
}
