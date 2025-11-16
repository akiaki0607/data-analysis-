// 加载数据
let data = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderIndustries();
    renderHotRankings();
    setupNavigation();
});

// 加载JSON数据
async function loadData() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// 渲染行业榜单
function renderIndustries() {
    const grid = document.getElementById('industryGrid');
    if (!data || !data.industries) return;

    grid.innerHTML = data.industries.map(industry => `
        <div class="industry-card" onclick="goToIndustry('${industry.id}')">
            <div class="industry-icon">${industry.icon}</div>
            <h3>${industry.name}</h3>
            <p>${industry.description}</p>
            <div class="industry-meta">
                <span class="update-time">更新时间: ${industry.updateTime}</span>
                <a href="industry.html?id=${industry.id}" class="view-btn">查看详情 →</a>
            </div>
        </div>
    `).join('');
}

// 渲染热门榜单
function renderHotRankings() {
    const list = document.getElementById('hotRankingList');
    if (!data || !data.industries) return;

    // 收集所有榜单
    const allRankings = [];
    data.industries.forEach(industry => {
        industry.rankings.forEach(ranking => {
            allRankings.push({
                ...ranking,
                industryName: industry.name,
                industryId: industry.id
            });
        });
    });

    // 按热度排序（这里简化处理，实际可以根据heat数值排序）
    list.innerHTML = allRankings.map((ranking, index) => `
        <div class="ranking-card" onclick="goToRanking('${ranking.industryId}', '${ranking.id}')">
            <div class="ranking-badge">${index + 1}</div>
            <div class="ranking-content">
                <h3>${ranking.title}</h3>
                <p>${ranking.description}</p>
                <div class="ranking-stats">
                    <span class="stat-badge">
                        <span>🔥</span>
                        <span class="heat-value">${ranking.heat}</span>
                    </span>
                    <span class="stat-badge">
                        <span>📂</span>
                        <span>${ranking.category}</span>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// 导航到行业页面
function goToIndustry(industryId) {
    window.location.href = `industry.html?id=${industryId}`;
}

// 导航到榜单详情页面
function goToRanking(industryId, rankingId) {
    window.location.href = `ranking.html?industry=${industryId}&id=${rankingId}`;
}

// 设置平滑滚动导航
function setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
