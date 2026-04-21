const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "index.html";
}

document.getElementById("sidebarUser").innerText =
  currentUser.name + " (" + currentUser.role + ")";

document.getElementById("headerUser").innerText =
  currentUser.email;

// Phân quyền Admin
if (currentUser.role === "Administrator") {
  document.getElementById("adminMenu").style.display = "block";
}

// Routing bằng hash
function loadPage(page) {
  const content = document.getElementById("contentArea");
  const title = document.getElementById("pageTitle");

  if (page === "home") {
    title.innerText = "Dashboard Tổng Quan";
    content.innerHTML = `
      <div class="card"><h3>36+</h3><p>API Platforms</p></div>
      <div class="card"><h3>12+</h3><p>CRM/ERP Providers</p></div>
      <div class="card"><h3>320M$</h3><p>CRM Market VN</p></div>
    `;
  }

  if (page === "market") {
    title.innerText = "Thị Trường VN";
    content.innerHTML = `
      <div class="card"><h3>CRM Growth</h3><p>Phân tích tăng trưởng 2025</p></div>
    `;
  }

  if (page === "stakeholder") {
    title.innerText = "Stakeholder × Ngành";
    content.innerHTML = `
      <div class="card"><h3>Enterprise</h3><p>Khách hàng lớn</p></div>
    `;
  }

  if (page === "competitor") {
    title.innerText = "Phân Tích Đối Thủ";
    content.innerHTML = `
      <div class="card"><h3>OnCallCX</h3><p>So sánh tính năng</p></div>
    `;
  }

  if (page === "admin") {
    title.innerText = "Quản Trị Hệ Thống";
    content.innerHTML = `
      <div class="card"><h3>Admin Panel</h3><p>Chỉ admin mới thấy</p></div>
    `;
  }
}

// Menu click
document.querySelectorAll("#menu li").forEach(item => {
  item.addEventListener("click", function () {
    const page = this.getAttribute("data-page");
    window.location.hash = page;
  });
});

// Hash routing
window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "home";
  loadPage(page);
});

// Load lần đầu
const initialPage = window.location.hash.replace("#", "") || "home";
loadPage(initialPage);

// Search filter
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    card.style.display =
      card.innerText.toLowerCase().includes(keyword) ? "block" : "none";
  });
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
