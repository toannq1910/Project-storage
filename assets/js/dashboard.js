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

// 🔥 LOADING SKELETON NGAY KHI LOAD
document.getElementById("contentArea").innerHTML = `
  <div class="skeleton"></div>
  <div class="skeleton"></div>
`;

// Load JSON
fetch("./assets/data/dashboard.json")
  .then(res => res.json())
  .then(data => {
    dashboardData = data;

    // delay nhẹ cho hiệu ứng mượt
    setTimeout(() => {
      init();
    }, 500);
  })
  .catch(err => {
    console.error("Lỗi load JSON:", err);
  });

// INIT
function init() {
  setupMenu();
  loadPageFromHash();
}

// MENU CLICK
function setupMenu() {
  document.querySelectorAll("#menu li").forEach(item => {
    item.addEventListener("click", () => {
      const page = item.getAttribute("data-page");
      window.location.hash = page;
    });
  });
}

// ROUTING
window.addEventListener("hashchange", loadPageFromHash);

function loadPageFromHash() {
  const page = window.location.hash.replace("#", "") || "home";
  renderPage(page);
}

// RENDER PAGE
function renderPage(page) {
  const content = document.getElementById("contentArea");
  const title = document.getElementById("pageTitle");

  const pageData = dashboardData[page];

  if (!pageData) {
    content.innerHTML = "<p>Không có dữ liệu</p>";
    return;
  }

  title.innerText = pageData.title;

  // 🔥 SIDEBAR ACTIVE
  document.querySelectorAll("#menu li").forEach(li => {
    li.classList.remove("active");
    if (li.getAttribute("data-page") === page) {
      li.classList.add("active");
    }
  });

  // RENDER CARD
  let html = `<div class="card-container">`;

  pageData.cards.forEach(card => {
    html += `
      <div class="card">
        <h3>${card.value}</h3>
        <p><strong>${card.title}</strong></p>
        <small>${card.description}</small>
      </div>
    `;
  });

  html += `</div>`;

  // 🔥 CHART
  if (pageData.chart) {
    html += `
      <div class="chart-box">
        <canvas id="chart"></canvas>
      </div>
    `;
  }

  content.innerHTML = html;

  // 🔥 VẼ CHART PRO
  if (pageData.chart) {
    setTimeout(() => {
      const ctx = document.getElementById("chart");

      const gradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "rgba(96,165,250,0.4)");
      gradient.addColorStop(1, "rgba(96,165,250,0)");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: pageData.chart.labels,
          datasets: [{
            label: "Market Size (M$)",
            data: pageData.chart.data,
            borderColor: "#60a5fa",
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#60a5fa"
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "#cbd5f5"
              }
            }
          },
          scales: {
            x: {
              ticks: { color: "#94a3b8" },
              grid: { color: "rgba(255,255,255,0.05)" }
            },
            y: {
              ticks: { color: "#94a3b8" },
              grid: { color: "rgba(255,255,255,0.05)" }
            }
          }
        }
      });
    }, 50);
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
