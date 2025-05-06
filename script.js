const gamepassId = 12345678; // Replace with actual First Class gamepass ID
const username = localStorage.getItem('glidewaysUsername');

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabs = document.querySelectorAll('.tab-content');
  const tabSlider = document.querySelector('.tab-slider');

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      document.querySelector('.tab-btn.active').classList.remove('active');
      document.querySelector('.tab-content.active').classList.remove('active');

      btn.classList.add('active');
      tabs[index].classList.add('active');
      tabSlider.style.transform = `translateX(${index * 100}%)`;
    });
  });

  // Add First Class if user owns gamepass
  if (username) {
    fetch(`https://inventory.roblox.com/v1/users/${username}/items/GamePass/${gamepassId}`)
      .then(res => res.json())
      .then(data => {
        const ownsGamepass = data?.data?.length > 0;
        if (ownsGamepass) {
          const classSelect = document.getElementById('class');
          const option = document.createElement('option');
          option.value = 'first';
          option.textContent = 'First Class';
          classSelect.appendChild(option);
        }
      })
      .catch(err => console.error('Error checking gamepass:', err));
  }
});
