document.addEventListener("DOMContentLoaded", function () {
    const seatMap = document.getElementById("seat-map");
    const rows = 21;
    const columns = ["A", "B", "C", "D"];

    // Create seat layout dynamically
    for (let row = 1; row <= rows; row++) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        columns.forEach((col, index) => {
            if (index === 2) {
                let space = document.createElement("div");
                space.classList.add("seat-space"); // Adds a space between columns B and C
                rowDiv.appendChild(space);
            }

            let seat = document.createElement("button");
            seat.classList.add("seat");
            seat.dataset.seat = `${col}${row}`;
            seat.textContent = `${col}${row}`;
            seat.addEventListener("click", () => selectSeat(seat));
            rowDiv.appendChild(seat);
        });

        seatMap.appendChild(rowDiv);
    }

    function selectSeat(seat) {
        // Remove previously selected seat
        document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
        
        // Select new seat
        seat.classList.add("selected");
        localStorage.setItem("selectedSeat", seat.dataset.seat);
    }

    document.getElementById("confirm-seat").addEventListener("click", function () {
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
            } else {
                alert(data.message);
            }
        })
        .catch(error => alert("Error booking seat: " + error));
    });
});
