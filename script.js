// This script is for handling the username form submission and seat selection.

let selectedSeat = null;

// Handle the username form submission
document.getElementById("usernameForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from reloading the page
  const username = document.getElementById("username").value; // Get the entered username
  localStorage.setItem('username', username); // Store the username in local storage
  window.location.href = 'seats.html'; // Redirect to the seat selection page
});

// Handle seat selection
document.querySelectorAll('.seat').forEach(seat => {
  seat.addEventListener('click', function() {
    if (selectedSeat) {
      selectedSeat.classList.remove('selected'); // Remove highlight from the previous seat
    }
    selectedSeat = this; // Set the new selected seat
    selectedSeat.classList.add('selected'); // Add highlight to the selected seat
  });
});

// Handle booking seat
document.getElementById("bookSeat").addEventListener("click", function() {
  if (selectedSeat) {
    const username = localStorage.getItem('username'); // Get the stored username
    alert(`${username}, you've selected ${selectedSeat.id}`);
    // You can add further functionality like sending booking data here
  } else {
    alert('Please select a seat first.');
  }
});
