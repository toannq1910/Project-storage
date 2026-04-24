const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const drawer = document.getElementById("drawer");
const drawerContent = document.getElementById("drawerContent");
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const tagFilters = document.getElementById("tagFilters");

let services = [];
let selectedTags = [];

// Load data + skeleton
async function loadData() {
  showSkeleton();

  const res = await fetch("assets/data/dashboard.json");
  services = await res.json();

  setTimeout(() => {
    render(services);
    renderFilters();
  }, 800);
}

function showSkeleton() {
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton";
    container.appendChild(sk);
  }
}

// Render cards
function render(data) {
  container.innerHTML = "";

  data.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card__title">${highlight(s.productName)}</div>
      <div class="card__desc">${highlight(s.description)}</div>

      ${s.endpoints.map(ep => `
        <div class="endpoint">
          <b>${ep.method}</b> ${ep.path}
        </div>
      `).join("")}

      <button onclick="openDrawer(${s.id})">Chi tiết</button>
    `;

    container.appendChild(card);
  });
}

// Drawer
window.openDrawer = function(id) {
  const s = services.find(x => x.id === id);

  drawerContent.innerHTML = `
    <h2>${s.productName}</h2>
    <p>${s.description}</p>

    ${s.endpoints.map(ep => `
      <div>${ep.method} ${ep.path}</div>
    `).join("")}
  `;

  drawer.classList.add("open");
};

// Sidebar toggle
toggleSidebar.onclick = () => {
  sidebar.classList.toggle("collapsed");
};

// Filters
function renderFilters() {
  const tags = [...new Set(services.map(s => s.category))];

  tagFilters.innerHTML = tags.map(tag => `
    <button onclick="toggleTag('${tag}')">${tag}</button>
  `).join("");
}

window.toggleTag = function(tag) {
  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
  } else {
    selectedTags.push(tag);
  }
  applyFilter();
};

// Search + Filter
function applyFilter() {
  const keyword = searchInput.value.toLowerCase();

  const filtered = services.filter(s => {
    const matchText =
      s.productName.toLowerCase().includes(keyword) ||
      s.description.toLowerCase().includes(keyword);

    const matchTag =
      selectedTags.length === 0 ||
      selectedTags.includes(s.category);

    return matchText && matchTag;
  });

  render(filtered);
}

// Highlight
function highlight(text) {
  const keyword = searchInput.value;
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

searchInput.addEventListener("input", applyFilter);

loadData();
