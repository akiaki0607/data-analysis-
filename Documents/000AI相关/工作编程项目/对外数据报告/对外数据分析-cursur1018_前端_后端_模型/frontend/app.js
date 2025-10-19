/**
 * AI平台数据分析报告前端应用
 */

// API配置
const API_BASE_URL = 'http://localhost:5001/api';

// 应用状态
const appState = {
    currentTab: 'brand',
    uploadedFile: null,
    analysisData: null,
    brandMetrics: {
        selectedPlatform: 'all',
        selectedMetric: '可见概率'
    },
    keywordAnalysis: {
        selectedPlatform: null,
        selectedDimension: '可见概率'
    },
    chartInstance: null
};

// DOM元素
const elements = {
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    demoBtn: document.getElementById('demoBtn'),
    uploadStatus: document.getElementById('uploadStatus'),
    dataBadge: document.getElementById('dataBadge'),
    metadataSection: document.getElementById('metadataSection'),
    metadataGrid: document.getElementById('metadataGrid'),
    transformSection: document.getElementById('transformSection'),
    wideTableDim: document.getElementById('wideTableDim'),
    longTableDim: document.getElementById('longTableDim'),
    downloadLongTableBtn: document.getElementById('downloadLongTableBtn'),
    togglePreviewBtn: document.getElementById('togglePreviewBtn'),
    togglePreviewText: document.getElementById('togglePreviewText'),
    longTablePreview: document.getElementById('longTablePreview'),
    analysisSection: document.getElementById('analysisSection'),
    brandPlatformFilter: document.getElementById('brandPlatformFilter'),
    brandChartPlatformFilter: document.getElementById('brandChartPlatformFilter'),
    brandMetricSelect: document.getElementById('brandMetricSelect'),
    keywordPlatformFilter: document.getElementById('keywordPlatformFilter'),
    keywordDimensionFilter: document.getElementById('keywordDimensionFilter'),
    brandMatrixTable: document.getElementById('brandMatrixTable'),
    keywordMatrixTable: document.getElementById('keywordMatrixTable'),
    brandChart: document.getElementById('brandChart')
};

// 初始化
function init() {
    setupEventListeners();
    console.log('应用初始化完成');
}

// 设置事件监听器
function setupEventListeners() {
    // 文件上传
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea.addEventListener('drop', handleDrop);
    
    // 按钮
    elements.analyzeBtn.addEventListener('click', analyzeFile);
    elements.demoBtn.addEventListener('click', loadDemoData);
    
    // Tab切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // 筛选器
    elements.brandPlatformFilter.addEventListener('change', updateBrandView);
    elements.brandChartPlatformFilter.addEventListener('change', updateBrandChart);
    elements.brandMetricSelect.addEventListener('change', updateBrandChart);
    elements.keywordPlatformFilter.addEventListener('change', updateKeywordView);
    elements.keywordDimensionFilter.addEventListener('change', updateKeywordView);
    
    // 数据转换预览
    elements.downloadLongTableBtn.addEventListener('click', downloadLongTableData);
    elements.togglePreviewBtn.addEventListener('click', toggleLongTablePreview);
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        appState.uploadedFile = file;
        elements.analyzeBtn.disabled = false;
        showStatus(`已选择文件: ${file.name}`, 'success');
    }
}

// 处理拖拽相关事件
function handleDragOver(e) {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        appState.uploadedFile = file;
        elements.analyzeBtn.disabled = false;
        showStatus(`已选择文件: ${file.name}`, 'success');
    }
}

// 分析文件
async function analyzeFile() {
    if (!appState.uploadedFile) {
        showStatus('请先选择文件', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', appState.uploadedFile);
    
    elements.analyzeBtn.disabled = true;
    showStatus('正在分析中，请稍候...', 'loading');
    
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            appState.analysisData = result.data;
            showStatus(`分析完成！耗时: ${result.processing_time}秒`, 'success');
            updateDataBadge(true);
            renderAnalysisResult();
        } else {
            showStatus(`分析失败: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('分析失败:', error);
        showStatus(`分析失败: ${error.message}`, 'error');
    } finally {
        elements.analyzeBtn.disabled = false;
    }
}

// 加载演示数据
async function loadDemoData() {
    showStatus('正在加载演示数据...', 'loading');
    
    try {
        const response = await fetch(`${API_BASE_URL}/demo-data`);
        const result = await response.json();
        
        if (result.status === 'success' || result.data) {
            appState.analysisData = result.data;
            showStatus('演示数据加载成功', 'success');
            updateDataBadge(false);
            renderAnalysisResult();
        } else {
            showStatus('加载演示数据失败', 'error');
        }
    } catch (error) {
        console.error('加载演示数据失败:', error);
        showStatus(`加载失败: ${error.message}`, 'error');
    }
}

// 显示状态消息
function showStatus(message, type) {
    elements.uploadStatus.textContent = message;
    elements.uploadStatus.className = `upload-status status-${type}`;
    
    if (type === 'loading') {
        elements.uploadStatus.innerHTML = `<span class="loading"></span> ${message}`;
    }
}

// 更新数据徽章
function updateDataBadge(isReal) {
    const badge = elements.dataBadge.querySelector('.badge');
    if (isReal) {
        badge.textContent = '真实数据';
        badge.className = 'badge real';
    } else {
        badge.textContent = '演示数据';
        badge.className = 'badge demo';
    }
}

// 渲染分析结果
function renderAnalysisResult() {
    if (!appState.analysisData) return;
    
    // 显示各个区域
    elements.metadataSection.style.display = 'block';
    elements.analysisSection.style.display = 'block';
    
    // 渲染数据封面
    renderMetadata();
    
    // 渲染数据转换预览（如果有宽表转换数据）
    renderDataTransformPreview();
    
    // 初始化筛选器
    initializeFilters();
    
    // 渲染品牌核心指标
    updateBrandView();
    
    // 渲染关键词分析（如果有数据）
    if (appState.keywordAnalysis.selectedPlatform) {
        updateKeywordView();
    }
}

// 渲染数据封面
function renderMetadata() {
    const metadata = appState.analysisData.metadata || {};
    const grid = elements.metadataGrid;
    grid.innerHTML = '';
    
    // 定义字段映射（兼容后端不同的字段名）
    const fieldMapping = {
        '客户名称': ['客户名称', 'client_name'],
        '核心竞品': ['核心竞品名称', '核心竞品', 'core_competitors'],
        '其他竞品': ['其他竞品名称', '其他竞品', 'other_competitors'],
        '分析周期': ['分析周期', 'analysis_period', '数据采集开始时间', '数据采集完成时间'],
        'AI平台': ['AI平台', 'ai_platforms', 'platforms'],
        '采集关键词数': ['采集关键词数', 'keyword_count', '关键词数'],
        '循环次数': ['循环次数', 'cycle_count', 'cycles'],
        '采集回答条数': ['采集AI回答条数', '采集回答条数', 'answer_count']
    };
    
    const metadataItems = [
        { label: '客户名称' },
        { label: '核心竞品' },
        { label: '其他竞品' },
        { label: '分析周期' },
        { label: 'AI平台' },
        { label: '采集关键词数' },
        { label: '循环次数' },
        { label: '采集回答条数' }
    ];
    
    metadataItems.forEach(item => {
        let value = null;
        
        // 尝试所有可能的字段名
        const possibleKeys = fieldMapping[item.label] || [item.label];
        for (const key of possibleKeys) {
            if (metadata[key] !== undefined && metadata[key] !== null) {
                value = metadata[key];
                break;
            }
        }
        
        // 特殊处理：如果是分析周期且有开始和结束时间
        if (item.label === '分析周期' && !value) {
            const startTime = metadata['数据采集开始时间'];
            const endTime = metadata['数据采集完成时间'];
            if (startTime && endTime) {
                value = `${startTime} 至 ${endTime}`;
            } else if (startTime) {
                value = `开始: ${startTime}`;
            } else if (endTime) {
                value = `结束: ${endTime}`;
            }
        }
        
        // 格式化值
        if (Array.isArray(value)) {
            value = value.join(', ');
        } else if (value === undefined || value === null) {
            value = '-';
        }
        
        const card = document.createElement('div');
        card.className = 'metadata-card';
        card.innerHTML = `
            <div class="metadata-label">${item.label}</div>
            <div class="metadata-value">${value}</div>
        `;
        grid.appendChild(card);
    });
}

// 初始化筛选器
function initializeFilters() {
    const data = appState.analysisData;
    
    // 品牌模块：添加AI平台选项（包含"所有AI平台"）
    const brandPlatformOptions = ['<option value="all">所有AI平台</option>'];
    if (data.platform_metrics) {
        Object.keys(data.platform_metrics).forEach(platform => {
            brandPlatformOptions.push(`<option value="${platform}">${platform}</option>`);
        });
    }
    elements.brandPlatformFilter.innerHTML = brandPlatformOptions.join('');
    
    // 品牌对比图：添加AI平台选项（包含"所有AI平台"）
    elements.brandChartPlatformFilter.innerHTML = brandPlatformOptions.join('');
    
    // 关键词模块：添加AI平台选项（不包含"所有AI平台"）
    if (data.keyword_analysis && Object.keys(data.keyword_analysis).length > 0) {
        const keywordPlatforms = Object.keys(data.keyword_analysis);
        const keywordPlatformOptions = keywordPlatforms.map(platform => 
            `<option value="${platform}">${platform}</option>`
        );
        elements.keywordPlatformFilter.innerHTML = keywordPlatformOptions.join('');
        
        // 设置默认选中第一个平台
        appState.keywordAnalysis.selectedPlatform = keywordPlatforms[0];
    }
}

// 切换Tab
function switchTab(tabName) {
    appState.currentTab = tabName;
    
    // 更新Tab按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // 更新Tab内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}Tab`);
    });
}

// 更新品牌视图
function updateBrandView() {
    const selectedPlatform = elements.brandPlatformFilter.value;
    appState.brandMetrics.selectedPlatform = selectedPlatform;
    
    // 获取数据
    let data;
    if (selectedPlatform === 'all') {
        data = appState.analysisData.brand_metrics;
    } else {
        data = appState.analysisData.platform_metrics?.[selectedPlatform];
    }
    
    if (!data) {
        elements.brandMatrixTable.innerHTML = '<p>暂无数据</p>';
        return;
    }
    
    // 渲染品牌排名矩阵表
    renderBrandMatrix(data);
    
    // 更新图表
    updateBrandChart();
}

// 渲染品牌排名矩阵表
function renderBrandMatrix(data) {
    // 定义指标显示顺序（按用户要求）
    const metricOrder = [
        '可见概率',
        '推荐概率',
        '选用信源平台占比',
        '选用信源文章占比',
        'AI回答总数',
        'Top1占比',
        'Top3占比',
        'Top5占比',
        'Top10占比',
        'Top1关键词数',
        'Top3关键词数',
        'Top5关键词数',
        'Top10关键词数'
    ];
    
    // 过滤出实际存在的指标，按定义顺序排列
    const availableMetrics = metricOrder.filter(metric => data[metric] && data[metric].length > 0);
    
    if (availableMetrics.length === 0) {
        elements.brandMatrixTable.innerHTML = '<p>暂无数据</p>';
        return;
    }
    
    // 确定最大排名数
    const maxRank = Math.max(...availableMetrics.map(m => data[m]?.length || 0));
    
    let html = '<table><thead><tr><th>指标</th>';
    for (let i = 1; i <= Math.min(maxRank, 10); i++) {
        html += `<th>排名${i}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    // 按照定义的顺序渲染指标
    availableMetrics.forEach(metric => {
        html += `<tr><td><strong>${metric}</strong></td>`;
        const metricData = data[metric] || [];
        
        for (let i = 0; i < Math.min(maxRank, 10); i++) {
            const item = metricData[i];
            if (item) {
                const value = formatValue(item[metric], metric);
                const rankClass = i < 3 ? `rank-${i + 1}` : '';
                html += `<td><span class="rank-badge ${rankClass}">${item['品牌']}</span> ${value}</td>`;
            } else {
                html += '<td>-</td>';
            }
        }
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    elements.brandMatrixTable.innerHTML = html;
}

// 更新品牌对比图
function updateBrandChart() {
    const selectedMetric = elements.brandMetricSelect.value;
    const selectedPlatform = elements.brandChartPlatformFilter.value;
    
    appState.brandMetrics.selectedMetric = selectedMetric;
    
    // 获取数据（使用品牌对比图独立的筛选器）
    let data;
    if (selectedPlatform === 'all') {
        data = appState.analysisData.brand_metrics;
    } else {
        data = appState.analysisData.platform_metrics?.[selectedPlatform];
    }
    
    if (!data || !data[selectedMetric]) {
        console.log(`未找到指标 ${selectedMetric} 的数据`);
        return;
    }
    
    const metricData = data[selectedMetric].slice(0, 10); // 取前10名
    const labels = metricData.map(item => item['品牌']);
    const values = metricData.map(item => item[selectedMetric]);
    
    // 销毁旧图表
    if (appState.chartInstance) {
        appState.chartInstance.destroy();
    }
    
    // 创建新图表
    const ctx = elements.brandChart.getContext('2d');
    appState.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: selectedMetric,
                data: values,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${selectedMetric}: ${formatValue(context.parsed.y, selectedMetric)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 更新关键词视图
function updateKeywordView() {
    const selectedPlatform = elements.keywordPlatformFilter.value;
    const selectedDimension = elements.keywordDimensionFilter.value;
    
    appState.keywordAnalysis.selectedPlatform = selectedPlatform;
    appState.keywordAnalysis.selectedDimension = selectedDimension;
    
    const data = appState.analysisData.keyword_analysis?.[selectedPlatform]?.[selectedDimension];
    
    if (!data || Object.keys(data).length === 0) {
        elements.keywordMatrixTable.innerHTML = '<p>暂无数据</p>';
        return;
    }
    
    renderKeywordMatrix(data);
}

// 渲染关键词排名矩阵表
function renderKeywordMatrix(data) {
    const keywords = Object.keys(data);
    if (keywords.length === 0) {
        elements.keywordMatrixTable.innerHTML = '<p>暂无数据</p>';
        return;
    }
    
    // 确定最大排名数
    let maxRank = 0;
    keywords.forEach(keyword => {
        const rankings = Object.keys(data[keyword]);
        rankings.forEach(rank => {
            const num = parseInt(rank.replace('排名', ''));
            if (num > maxRank) maxRank = num;
        });
    });
    
    let html = '<table><thead><tr><th>关键词/排名</th>';
    for (let i = 1; i <= Math.min(maxRank, 10); i++) {
        html += `<th>排名${i}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    keywords.slice(0, 20).forEach(keyword => {  // 限制显示前20个关键词
        html += `<tr><td><strong>${keyword}</strong></td>`;
        
        for (let i = 1; i <= Math.min(maxRank, 10); i++) {
            const rankKey = `排名${i}`;
            const item = data[keyword][rankKey];
            
            if (item) {
                const rankClass = i <= 3 ? `rank-${i}` : '';
                html += `<td><span class="rank-badge ${rankClass}">${item['品牌']}</span> ${formatValue(item['数值'], '数值')}</td>`;
            } else {
                html += '<td>-</td>';
            }
        }
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    elements.keywordMatrixTable.innerHTML = html;
}

// 格式化数值
function formatValue(value, metric) {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    
    // 判断是否是百分比类型
    const percentageMetrics = [
        '可见概率', '推荐概率', 
        'Top1占比', 'Top3占比', 'Top5占比', 'Top10占比',
        '选用信源平台占比', '选用信源文章占比'
    ];
    
    if (percentageMetrics.includes(metric)) {
        return `${value.toFixed(1)}%`;
    } else {
        // 整数类型，使用千分位
        return Math.round(value).toLocaleString();
    }
}

// ========== 数据转换预览功能 ==========

/**
 * 渲染数据转换预览
 */
function renderDataTransformPreview() {
    const preview = appState.analysisData?.long_table_preview;
    
    if (!preview || !preview.data || preview.data.length === 0) {
        // 没有转换数据，隐藏预览区域
        elements.transformSection.style.display = 'none';
        return;
    }
    
    console.log('渲染数据转换预览...', preview);
    
    // 显示转换预览区域
    elements.transformSection.style.display = 'block';
    
    // 更新维度统计
    const [longRows, longCols] = preview.shape;
    const brands = [...new Set(preview.data.map(row => row['品牌']))];
    const brandCount = brands.length;
    
    // 计算原始宽表维度（推测）
    const wideRows = Math.floor(longRows / brandCount);
    const wideCols = longCols + (brandCount - 1) * (longCols - 4); // 基础列4列 + 品牌指标列
    
    elements.wideTableDim.textContent = `${wideRows} 行 × ${wideCols} 列`;
    elements.longTableDim.textContent = `${longRows} 行 × ${longCols} 列`;
    
    // 渲染长表数据
    renderLongTableData(preview);
}

/**
 * 渲染长表数据到预览容器
 */
function renderLongTableData(preview) {
    let html = '<table><thead><tr>';
    
    // 表头
    preview.columns.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // 数据行（前100行）
    preview.data.forEach(row => {
        html += '<tr>';
        preview.columns.forEach(col => {
            let value = row[col];
            
            // 格式化数值
            if (typeof value === 'number') {
                const percentCols = [
                    '可见占比', '推荐占比', 
                    '信源平台占比', '信源文章占比',
                    'Top1占比', 'Top3占比', 'Top5占比', 'Top10占比'
                ];
                if (percentCols.includes(col)) {
                    value = `${value.toFixed(1)}%`;
                } else {
                    value = value.toLocaleString();
                }
            } else if (value === null || value === undefined) {
                value = '-';
            }
            
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    elements.longTablePreview.innerHTML = html;
}

/**
 * 切换长表预览显示/隐藏
 */
function toggleLongTablePreview() {
    const preview = elements.longTablePreview;
    const text = elements.togglePreviewText;
    const btn = elements.togglePreviewBtn;
    
    if (preview.style.display === 'none') {
        preview.style.display = 'block';
        text.textContent = '隐藏详细数据';
        btn.classList.add('expanded');
    } else {
        preview.style.display = 'none';
        text.textContent = '显示详细数据';
        btn.classList.remove('expanded');
    }
}

/**
 * 下载长表数据为CSV
 */
function downloadLongTableData() {
    const preview = appState.analysisData?.long_table_preview;
    
    if (!preview || !preview.data || preview.data.length === 0) {
        alert('没有可下载的数据');
        return;
    }
    
    console.log('下载长表数据...');
    
    try {
        // 转换为CSV
        const csv = convertToCSV(preview);
        
        // 创建下载链接
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // 添加BOM for Excel
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', '关键词数据_长表格式.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('下载完成');
    } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败: ' + error.message);
    }
}

/**
 * 将预览数据转换为CSV格式
 */
function convertToCSV(preview) {
    // 表头
    let csv = preview.columns.join(',') + '\n';
    
    // 数据行
    preview.data.forEach(row => {
        const values = preview.columns.map(col => {
            let value = row[col];
            
            // 处理空值
            if (value === null || value === undefined) {
                return '';
            }
            
            // 转换为字符串
            value = String(value);
            
            // 转义逗号和引号
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = '"' + value.replace(/"/g, '""') + '"';
            }
            
            return value;
        });
        
        csv += values.join(',') + '\n';
    });
    
    return csv;
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);

