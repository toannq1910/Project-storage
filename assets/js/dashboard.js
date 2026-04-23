// ====== AUTH CHECK ======
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "index.html";

// ====== HIỂN THỊ USER ======
document.getElementById("sidebarUser").innerText =
  currentUser.name + " (" + currentUser.role + ")";
document.getElementById("headerUser").innerText =
  currentUser.email;

// ====== GLOBAL ======
let dashboardData = {};
let currentPage = "home";

// ====== LOAD JSON + LOADING ======
fetch("./assets/data/dashboard.json")
  .then(res => res.json())
  .then(data => {
    dashboardData = data;
    init();
  });

// ====== INIT ======
function init() {
  setupMenu();
  loadPage();
}

// ====== MENU CLICK ======
function setupMenu() {
  document.querySelectorAll("#menu li").forEach(li => {
    li.onclick = () => {
      window.location.hash = li.dataset.page;
    };
  });
}

// ====== ROUTING ======
window.addEventListener("hashchange", loadPage);

function loadPage() {
  const page = location.hash.replace("#", "") || "home";
  currentPage = page;
  renderPage(page);
}

// ====== RENDER PAGE ======
function renderPage(page) {
  const content = document.getElementById("contentArea");
  const title = document.getElementById("pageTitle");

  const pageData = dashboardData[page];
  if (!pageData) return;

  title.innerText = pageData.title;

  // highlight sidebar
  document.querySelectorAll("#menu li").forEach(li => {
    li.classList.remove("active");
    if (li.dataset.page === page) li.classList.add("active");
  });

  // ADMIN PAGE
  if (page === "admin") {
    renderUserTable();
    return;
  }

  // render cards
  let html = `<div class="card-container">`;
  pageData.cards.forEach(c => {
    html += `
      <div class="card">
        <h3>${c.value}</h3>
        <p>${c.title}</p>
        <small>${c.description}</small>
      </div>
    `;
  });
  html += `</div>`;

  // render chart
  if (pageData.chart) {
    html += `<div class="chart-box"><canvas id="chart"></canvas></div>`;
  }

  content.innerHTML = html;

  // ====== CHART ======
  if (pageData.chart) {
    const ctx = document.getElementById("chart");

    const gradient = ctx.getContext("2d").createLinearGradient(0,0,0,300);
    gradient.addColorStop(0,"rgba(96,165,250,0.4)");
    gradient.addColorStop(1,"rgba(96,165,250,0)");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: pageData.chart.labels,
        datasets: [{
          data: pageData.chart.data,
          borderColor: "#60a5fa",
          backgroundColor: gradient,
          fill: true
        }]
      }
    });
  }
}

// ====== SEARCH ======
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const pageData = dashboardData[currentPage];
  const content = document.getElementById("contentArea");

  let html = `<div class="card-container">`;
  pageData.cards
    .filter(c => c.title.toLowerCase().includes(keyword))
    .forEach(c => {
      html += `<div class="card"><h3>${c.value}</h3><p>${c.title}</p></div>`;
    });
  html += `</div>`;

  content.innerHTML = html;
});

// ====== MODAL ======
function openModal() {
  document.getElementById("userModal").style.display = "block";
}
function closeModal() {
  document.getElementById("userModal").style.display = "none";
}

// ====== CRUD USER ======
function saveUser() {
  const email = document.getElementById("newEmail").value;
  const role = document.getElementById("newRole").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ email, role });

  localStorage.setItem("users", JSON.stringify(users));

  closeModal();
  renderUserTable();
}

function renderUserTable() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const content = document.getElementById("contentArea");

  let html = `<button onclick="openModal()">+ Add</button><table>`;
  users.forEach(u => {
    html += `<tr><td>${u.email}</td><td>${u.role}</td></tr>`;
  });
  html += `</table>`;

  content.innerHTML = html;
}

// ====== LOGOUT ======
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
