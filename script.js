document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// Simulated Roblox Login (for demo purposes only)
document.getElementById('roblox-login-btn').addEventListener('click', () => {
  const username = prompt("Enter your Roblox username:");
  if (username) {
    document.getElementById('username').value = username;
  }
});

document.getElementById('booking-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Flight booked successfully!');
});
