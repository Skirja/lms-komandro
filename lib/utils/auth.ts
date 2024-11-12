export function handleLogout() {
  // Clear localStorage
  localStorage.clear()
  // Redirect to login page
  window.location.href = '/login'
} 