const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

let services = [];

async function loadData() {
  const res = await fetch("assets/data/dashboard.json");
  services = await res.json();
  render(services);
}

function render(data) {
  container.innerHTML = "";

  data.forEach(s => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card__header">
        <div>
          <div class="card__title">${s.productName}</div>
          <div class="badge badge--cyan">${s.category}</div>
        </div>
        <div class="badge badge--green">${s.status}</div>
      </div>

      <div class="card__desc">${s.description}</div>

      <div>
        ${s.endpoints.slice(0,4).map(ep => `
          <div class="endpoint">
            <span class="method">${ep.method}</span>
            ${ep.path}
          </div>
        `).join("")}
      </div>

      <div class="card__footer">
        <a href="${s.docsUrl}" target="_blank">Docs</a>
        <button class="btn">Chi tiết</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function applyFilter() {
  const keyword = searchInput.value.toLowerCase();
  const status = filterStatus.value;

  const filtered = services.filter(s => {
    return (
      (s.productName.toLowerCase().includes(keyword) ||
       s.vendor.toLowerCase().includes(keyword)) &&
      (!status || s.status === status)
    );
  });

  render(filtered);
}

searchInput.addEventListener("input", applyFilter);
filterStatus.addEventListener("change", applyFilter);

loadData();
