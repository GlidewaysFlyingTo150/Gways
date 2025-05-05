// Redirect back to login if no user is stored
const storedUser = localStorage.getItem('glidewaysUsername');
if (!storedUser && window.location.pathname.includes("booking.html")) {
  window.location.href = "index.html";
}

// Tabs switching logic
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabName).classList.remove('hidden');

  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  const activeTab = Array.from(document.querySelectorAll('.tab')).find(btn =>
    btn.textContent.toLowerCase().includes(tabName)
  );
  if (activeTab) activeTab.classList.add('active');
}
