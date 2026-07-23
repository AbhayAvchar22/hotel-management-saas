// Check if user is logged in and update navbar
function updateNavBar() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const authNav = document.getElementById('authNav');
  const userNav = document.getElementById('userNav');

  if (token && user) {
    if (authNav) authNav.style.display = 'none';
    if (userNav) userNav.style.display = 'block';
  } else {
    if (authNav) authNav.style.display = 'block';
    if (userNav) userNav.style.display = 'none';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('Logged out successfully');
  window.location.href = '/';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateNavBar);
