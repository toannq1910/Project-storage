const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "index.html";
}

document.getElementById("sidebarUser").innerText =
  currentUser.name + " (" + currentUser.role + ")";

document.getElementById("headerUser").innerText =
  currentUser.email;

let dashboardData = {};

// Load JSON
fetch("assets/data/dashboard.json")
  .then(res => res.json())
  .then(data => {
    dashboardData = data;
    initRouting();
  });

function renderPage(page) {
  const content = document.getElementById("contentArea");
  const title = document.getElementById("pageTitle");

  const pageData = dashboardData[page];
  if (!pageData) return;

  // Check role nếu có giới hạn
  if (pageData.roles && !pageData.roles.includes(currentUser.role)) {
    content.innerHTML = "<p>Bạn không có quyền truy cập</p>";
    return;
  }

  title.innerText = pageData.title;
  content.innerHTML = "";

  pageData.cards.forEach(card => {
    content.innerHTML += `
      <div class="card">
        <h3>${card.value}</h3>
        <p><strong>${card.title}</strong></p>
        <small>${card.description}</small>
      </div>
    `;
  });
  // Nếu có chart thì vẽ
if (pageData.chart) {
  content.innerHTML += `
    <div style="width:600px;margin-top:40px;">
      <canvas id="myChart"></canvas>
    </div>
  `;

  setTimeout(() => {
    const ctx = document.getElementById("myChart");
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
  }, 100);
}

function initRouting() {
  document.querySelectorAll("#menu li").forEach(item => {
    item.addEventListener("click", function () {
      const page = this.getAttribute("data-page");
      window.location.hash = page;
    });
  });

  window.addEventListener("hashchange", () => {
    const page = window.location.hash.replace("#", "") || "home";
    renderPage(page);
  });

  const initial = window.location.hash.replace("#", "") || "home";
  renderPage(initial);
}

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
