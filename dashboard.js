const currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.getElementById("sidebarUser").innerText =
  currentUser.name + " (" + currentUser.role + ")";

document.getElementById("headerUser").innerText =
  currentUser.email;

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}