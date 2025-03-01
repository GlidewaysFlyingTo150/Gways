// Google Apps Script URL (replace this with your actual URL)
const googleSheetsURL = "https://script.google.com/macros/s/AKfycbwrpR9vZLqGiKBjXoSv8BT_a7AwPoGnHAFji3r-kN7MsSRIDisO6y0zCUVV9ElzZ2JP/exec";

// Handle seat selection and booking
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
