const container = document.getElementById("cardContainer");
const drawer = document.getElementById("drawer");
const drawerContent = document.getElementById("drawerContent");

let services = [];

async function loadData() {
  const res = await fetch("assets/data/dashboard.json");
  services = await res.json();
  render(services);
  showKey();
}

function render(data) {
  container.innerHTML = "";

  data.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${s.productName}</h3>
      <p>${s.description}</p>

      ${s.endpoints.map(ep => `
        <div>${ep.method} ${ep.path}</div>
      `).join("")}

      <button onclick="openDrawer(${s.id})">Chi tiết</button>
    `;

    container.appendChild(card);
  });
}

// Drawer Swagger-like
window.openDrawer = function(id) {
  const s = services.find(x => x.id === id);

  drawerContent.innerHTML = `
    <h2>${s.productName}</h2>
    <p>${s.description}</p>

    ${s.endpoints.map(ep => `
      <div class="endpoint-block">
        <b>${ep.method}</b> ${ep.path}
        <button onclick="tryApi('${ep.path}')">Try</button>
        <pre id="res-${ep.path}"></pre>
      </div>
    `).join("")}
  `;

  drawer.classList.add("open");
};

// Try API
window.tryApi = async function(path) {
  const res = await callApi(path);
  document.getElementById("res-" + path).innerText =
    JSON.stringify(res, null, 2);
};

// Sidebar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

loadData();
