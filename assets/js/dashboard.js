const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");

let services = [];

/* LOAD DATA */
async function loadData() {
  const res = await fetch("assets/data/dashboard.json");
  services = await res.json();
  render(services);
}

/* RENDER */
function render(data) {
  container.innerHTML = "";

  data.forEach(s => {
    const el = document.createElement("article");
    el.className = "card";

    el.innerHTML = `
      <div class="card__title">${s.productName}</div>
      <div class="card__desc">${s.description}</div>

      ${s.endpoints.slice(0,3).map(ep => `
        <div class="endpoint">
          <span class="method ${ep.method}">${ep.method}</span>
          <span>${ep.path}</span>
        </div>
      `).join("")}

      <div class="card__footer">
        <a href="${s.docsUrl}">Docs</a>
        <button>Chi tiết</button>
      </div>
    `;

    container.appendChild(el);
  });
}

/* SEARCH */
searchInput.addEventListener("input", e => {
  const key = e.target.value.toLowerCase();

  const filtered = services.filter(s =>
    s.productName.toLowerCase().includes(key) ||
    s.vendor.toLowerCase().includes(key)
  );

  render(filtered);
});

/* SIDEBAR TOGGLE */
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

loadData();
