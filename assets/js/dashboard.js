const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "index.html";
}

// Hiển thị user
document.getElementById("sidebarUser").innerText =
  currentUser.name + " (" + currentUser.role + ")";
document.getElementById("headerUser").innerText =
  currentUser.email;

let dashboardData = {};

// Load JSON
fetch("./assets/data/dashboard.json")
  .then(res => res.json())
  .then(data => {
    dashboardData = data;
    init();
  })
  .catch(err => {
    console.error("Lỗi load JSON:", err);
  });

// Khởi tạo
function init() {
  setupMenu();
  loadPageFromHash();
}

// Click menu
function setupMenu() {
  document.querySelectorAll("#menu li").forEach(item => {
    item.addEventListener("click", () => {
      const page = item.getAttribute("data-page");
      window.location.hash = page;
    });
  });
}

// Routing
window.addEventListener("hashchange", loadPageFromHash);

function loadPageFromHash() {
  const page = window.location.hash.replace("#", "") || "home";
  renderPage(page);
}

// Render nội dung
function renderPage(page) {
  const content = document.getElementById("contentArea");
  const title = document.getElementById("pageTitle");

  const pageData = dashboardData[page];
  if (page === "admin") {
  renderUserTable();
  return;
  }
  if (!pageData) {
    content.innerHTML = "<p>Không có dữ liệu</p>";
    return;
  }
// Highlight menu active
document.querySelectorAll("#menu li").forEach(li => {
  li.classList.remove("active");
  if (li.getAttribute("data-page") === page) {
    li.classList.add("active");
  }
});
  title.innerText = pageData.title;

  // Render cards
  let html = "";
  pageData.cards.forEach(card => {
    html += `
      <div class="card">
        <h3>${card.value}</h3>
        <p><strong>${card.title}</strong></p>
        <small>${card.description}</small>
      </div>
    `;
  });

  // Nếu có chart → thêm canvas
  if (pageData.chart) {
    html += `
      <div style="width:600px;margin-top:40px;">
        <canvas id="chart"></canvas>
      </div>
    `;
  }

  content.innerHTML = html;

  // Vẽ chart SAU khi render xong
  if (pageData.chart) {
    setTimeout(() => {
      const ctx = document.getElementById("chart");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: pageData.chart.labels,
          datasets: [{
            label: "Market Size (M$)",
            data: pageData.chart.data,
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96,165,250,0.2)",
            tension: 0.4
          }]
        }
      });
    }, 50);
  }
  function renderUserTable() {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  let html = `
    <h3>Danh sách User</h3>
    <button onclick="addUser()">+ Thêm User</button>
    <table border="1" cellpadding="8">
      <tr>
        <th>Email</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
  `;

  users.forEach((u, index) => {
    html += `
      <tr>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button onclick="deleteUser(${index})">Xóa</button>
        </td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("contentArea").innerHTML = html;
}
}

//Add / Delete function
function addUser() {
  const email = prompt("Nhập email:");
  const role = prompt("Nhập role:");

  if (!email || !role) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ email, role });
  localStorage.setItem("users", JSON.stringify(users));
  renderUserTable();
}

function deleteUser(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  renderUserTable();
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("collapsed");
}
