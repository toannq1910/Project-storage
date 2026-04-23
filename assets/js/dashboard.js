// ====== DỮ LIỆU DỰ PHÒNG (Nếu không load được file JSON) ======
const fallbackData = {
    "home": {
        "title": "Dashboard Tổng Quan",
        "cards": [
            {"title": "API Platforms", "value": "36+", "desc": "Tăng 12% tháng này"},
            {"title": "CRM Providers", "value": "12+", "desc": "Đang hoạt động"},
            {"title": "Market Scale", "value": "$320M", "desc": "Quy mô VN"}
        ]
    },
    "market": {
        "title": "Phân Tích Thị Trường",
        "cards": [
            {"title": "Tăng trưởng", "value": "18%", "desc": "Năm 2025"}
        ],
        "chart": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [12, 19, 15, 25, 22, 30]
        }
    }
};

let dashboardData = {};

// ====== LOAD DATA ======
async function loadData() {
    try {
        const response = await fetch('dashboard.json');
        if (!response.ok) throw new Error("CORS or 404");
        dashboardData = await response.json();
    } catch (err) {
        console.warn("Sử dụng dữ liệu dự phòng vì không thể load file JSON trực tiếp.");
        dashboardData = fallbackData;
    }
    init();
}

function init() {
    setupMenu();
    renderPage("home");
}

function setupMenu() {
    document.querySelectorAll("#menu li").forEach(li => {
        li.onclick = () => {
            document.querySelectorAll("#menu li").forEach(i => i.classList.remove("active"));
            li.classList.add("active");
            renderPage(li.dataset.page);
        };
    });
}

function renderPage(pageId) {
    const data = dashboardData[pageId] || fallbackData.home;
    const contentArea = document.getElementById("contentArea");
    document.getElementById("pageTitle").innerText = data.title;

    let html = `<div class="card-container">`;
    data.cards.forEach(card => {
        html += `
            <div class="card">
                <h3>${card.value}</h3>
                <p>${card.title}</p>
                <small style="color: #64748b">${card.desc || card.description || ''}</small>
            </div>`;
    });
    html += `</div>`;

    if (data.chart) {
        html += `<div class="chart-box"><canvas id="myChart"></canvas></div>`;
    }

    contentArea.innerHTML = html;

    if (data.chart) {
        createChart(data.chart);
    }
}

function createChart(chartData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Chỉ số tăng trưởng',
                data: chartData.data,
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
            }
        }
    });
}

// Khởi chạy
loadData();
