/**
 * AI平台数据分析报告 - 核心逻辑 V3.1
 * 纯前端实现，支持Excel解析、数据分析、可视化展示和URL分享
 */

// ============================================
// 1. 全局数据结构和配置
// ============================================

const AppData = {
    // 上传的原始数据
    uploadedData: null,
    isRealData: false,
    
    // 解析后的数据
    parsedData: {
        dataCover: null,          // 数据封面信息
        brandMetrics: null,        // 品牌核心指标（整体）
        platformMetrics: {},       // AI平台的核心指标（按平台）
        keywordAnalysis: {},       // 关键词数据分析（按平台）
    },
    
    // 数据字典：字段同义词映射
    fieldMapping: {
        // 品牌字段
        brand: ['品牌', 'Brand', 'brand', '品牌名称'],
        // AI平台字段
        aiPlatform: ['AI平台', '平台', 'Platform', 'Engine', 'AI_Platform'],
        // 关键词字段
        keyword: ['关键词', 'Keyword', 'keyword', '问题'],
        // 指标字段
        visibility: ['可见概率', '可见度', 'visibility', '可见率'],
        recommendation: ['推荐概率', '推荐度', 'recommendation', '推荐率'],
        top1: ['Top1占比', 'Top1', 'top1'],
        top3: ['Top3占比', 'Top3', 'top3'],
        top5: ['Top5占比', 'Top5', 'top5'],
        top10: ['Top10占比', 'Top10', 'top10'],
        sourcePlatform: ['信源平台占比', '信源平台', 'source_platform'],
        sourceArticle: ['信源文章占比', '信源文章', 'source_article'],
        articleCount: ['信源文章数', '文章数', 'article_count'],
        positive: ['正向情感占比', '正向情感', 'positive'],
        negative: ['负向情感占比', '负向情感', 'negative'],
        top1Keywords: ['Top1关键词数', 'Top1_keywords'],
        top3Keywords: ['Top3关键词数', 'Top3_keywords'],
        top5Keywords: ['Top5关键词数', 'Top5_keywords'],
        top10Keywords: ['Top10关键词数', 'Top10_keywords'],
    },
    
    // 指标定义（包含帮助文案）
    metrics: {
        visibility: {
            name: '可见概率',
            unit: '%',
            help: {
                explain: '像"出镜率"，指品牌在 AI 回答中出现的频率。',
                example: 'AI 回答 100 个问题，其中 30 次提到你的品牌 ⇒ 可见概率 30%。',
                value: '反映品牌在 AI 回答中的曝光程度，越高越容易被"看到"。'
            }
        },
        recommendation: {
            name: '推荐概率',
            unit: '%',
            help: {
                explain: 'AI 主动"重点推荐你"的频率。',
                example: '100 次回答中有 20 次明确推荐你的品牌 ⇒ 推荐概率 20%。',
                value: '体现 AI 对品牌的认可度与"首选度"。'
            }
        },
        top1: {
            name: 'Top1占比',
            unit: '%',
            help: {
                explain: '相当于"第一名上榜率"，衡量品牌排在第1名的次数比例。',
                example: '100 条回答里有 25 次排第一 ⇒ Top1 占比 25%。',
                value: '体现品牌的绝对竞争力与头部优势。'
            }
        },
        top3: {
            name: 'Top3占比',
            unit: '%',
            help: {
                explain: '相当于"前三名上榜率"，衡量品牌排在前 3 名的次数比例。',
                example: '100 条回答里有 40 次进前三 ⇒ Top3 占比 40%。',
                value: '体现品牌的竞争力与排名优势。'
            }
        },
        top5: {
            name: 'Top5占比',
            unit: '%',
            help: {
                explain: '相当于"前五名上榜率"，衡量品牌排在前 5 名的次数比例。',
                example: '100 条回答里有 55 次进前五 ⇒ Top5 占比 55%。',
                value: '体现品牌的市场影响力。'
            }
        },
        top10: {
            name: 'Top10占比',
            unit: '%',
            help: {
                explain: '相当于"前十名上榜率"，衡量品牌排在前 10 名的次数比例。',
                example: '100 条回答里有 70 次进前十 ⇒ Top10 占比 70%。',
                value: '体现品牌的广泛认知度。'
            }
        },
        sourcePlatform: {
            name: '信源平台占比',
            unit: '%',
            help: {
                explain: 'AI 引用的信息来源中，与你品牌相关的平台所占比例。',
                example: 'AI 查了 100 个网站，其中 5 个与你品牌相关 ⇒ 占比 5%。',
                value: '体现内容覆盖面与外部影响力。'
            }
        },
        sourceArticle: {
            name: '信源文章占比',
            unit: '%',
            help: {
                explain: 'AI 回答时引用与你品牌相关"文章"的占比。',
                example: '参考 100 篇文章，其中 10 篇与你品牌相关 ⇒ 占比 10%。',
                value: '说明品牌内容被 AI 采纳的频率，越高代表内容更被信任。'
            }
        },
        positive: {
            name: '正向情感占比',
            unit: '%',
            help: {
                explain: 'AI 回答中对品牌持正面态度的比例。',
                example: '100 次提及中有 80 次是正面的 ⇒ 正向情感占比 80%。',
                value: '反映品牌的口碑和用户评价倾向。'
            }
        },
        negative: {
            name: '负向情感占比',
            unit: '%',
            help: {
                explain: 'AI 回答中对品牌持负面态度的比例。',
                example: '100 次提及中有 15 次是负面的 ⇒ 负向情感占比 15%。',
                value: '识别潜在的品牌风险和改进方向。'
            }
        },
        top1Keywords: {
            name: 'Top1关键词数',
            unit: '个',
            help: {
                explain: '能让品牌在 AI 回答里排第一的关键词数量。',
                example: '100 个关键词中有 20 个让品牌排第一 ⇒ Top1 关键词数 20。',
                value: '识别品牌的绝对优势领域。'
            }
        },
        top3Keywords: {
            name: 'Top3关键词数',
            unit: '个',
            help: {
                explain: '能让品牌在 AI 回答里进入前三的关键词数量。',
                example: '100 个关键词中有 40 个让品牌进前三 ⇒ Top3 关键词数 40。',
                value: '识别品牌的强势话题领域，指导内容与投放策略。'
            }
        },
        top5Keywords: {
            name: 'Top5关键词数',
            unit: '个',
            help: {
                explain: '能让品牌在 AI 回答里进入前五的关键词数量。',
                example: '100 个关键词中有 60 个让品牌进前五 ⇒ Top5 关键词数 60。',
                value: '衡量品牌的广泛覆盖能力。'
            }
        },
        top10Keywords: {
            name: 'Top10关键词数',
            unit: '个',
            help: {
                explain: '能让品牌在 AI 回答里进入前十的关键词数量。',
                example: '100 个关键词中有 80 个让品牌进前十 ⇒ Top10 关键词数 80。',
                value: '反映品牌的整体话题覆盖度。'
            }
        },
    },
    
    // 当前UI状态
    uiState: {
        currentTab: 'brand',
        brandPlatform: 'all',           // 品牌Tab的AI平台选择
        keywordPlatform: '',            // 关键词Tab的AI平台选择
        selectedMetric: 'visibility',
        selectedDimension: 'visibility',
        topN: 5,
    },
    
    // 图表实例
    chartInstance: null,
};

// ============================================
// 2. 工具函数
// ============================================

/**
 * 查找字段名（同义词映射）
 */
function findField(headers, fieldKey) {
    const synonyms = AppData.fieldMapping[fieldKey] || [];
    for (const header of headers) {
        if (synonyms.some(syn => header && header.toString().includes(syn))) {
            return header;
        }
    }
    return null;
}

/**
 * 格式化数字
 */
function formatNumber(num, isPercentage = true) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    if (isPercentage) {
        return num.toFixed(1) + '%';
    } else {
        return Math.round(num).toLocaleString('zh-CN');
    }
}

/**
 * 获取排名徽章HTML
 */
function getRankBadge(rank) {
    const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
    return `<span class="rank-badge ${rankClass}">${rank}</span>`;
}

/**
 * 创建帮助图标
 */
function createHelpIcon(metricKey) {
    const metric = AppData.metrics[metricKey];
    if (!metric || !metric.help) return '';
    
    const { explain, example, value } = metric.help;
    return `
        <span class="help-icon">
            ⓘ
            <span class="tooltip">
                <div class="tooltip-section">
                    <span class="tooltip-label">解释：</span>${explain}
                </div>
                <div class="tooltip-section">
                    <span class="tooltip-label">举例：</span>${example}
                </div>
                <div class="tooltip-section">
                    <span class="tooltip-label">价值：</span>${value}
                </div>
            </span>
        </span>
    `;
}

/**
 * 生成随机数据（演示用）
 */
function generateRandomData(min, max, decimals = 1) {
    const value = Math.random() * (max - min) + min;
    return decimals === 0 ? Math.round(value) : parseFloat(value.toFixed(decimals));
}

// ============================================
// 3. Excel数据解析
// ============================================

/**
 * 解析Excel工作簿
 */
function parseWorkbook(workbook) {
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        // 处理合并单元格
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '',
            raw: false
        });
        result[sheetName] = jsonData;
    });
    return result;
}

/**
 * 转置品牌核心指标表格（从宽表格转为长表格）
 * 转置前：第一列是分析维度，后面各列是不同品牌的数据
 * 转置后：每行包含 "品牌、分析维度、对应值"
 */
function transposeBrandMetricsSheet(sheet) {
    if (!sheet || sheet.length < 2) return sheet;
    
    const firstRow = sheet[0];
    
    // 判断1：如果第一列包含"品牌名称"，说明已经是转置后的格式，无需转置
    if (firstRow[0] && (firstRow[0].toString().includes('品牌名称') || firstRow[0].toString().includes('品牌'))) {
        console.log('数据已是转置后格式，无需转置');
        return sheet;
    }
    
    // 判断2：检查是否有"转置前"标记
    const hasTransposeBefore = firstRow.some(cell => 
        cell && cell.toString().includes('转置前')
    );
    
    if (!hasTransposeBefore) {
        // 如果没有"转置前"标记，可能已经是标准格式
        return sheet;
    }
    
    // 需要转置：提取品牌名称（从第二列开始）
    const brands = [];
    for (let colIdx = 1; colIdx < firstRow.length; colIdx++) {
        const brandName = firstRow[colIdx];
        if (brandName && brandName.toString().trim() && !brandName.toString().includes('转置')) {
            brands.push(brandName.toString().trim());
        }
    }
    
    if (brands.length === 0) return sheet;
    
    // 构建转置后的表格
    const transposedSheet = [];
    
    // 新表头：品牌名称、各个指标列
    const newHeaders = ['品牌名称'];
    const metricNames = [];
    for (let rowIdx = 1; rowIdx < sheet.length; rowIdx++) {
        const metricName = sheet[rowIdx][0];
        if (metricName && metricName.toString().trim() && !metricName.toString().includes('转置')) {
            metricNames.push(metricName.toString().trim());
            newHeaders.push(metricName.toString().trim());
        }
    }
    
    if (metricNames.length === 0) return sheet;
    
    transposedSheet.push(newHeaders);
    
    // 为每个品牌创建一行数据
    brands.forEach((brand, brandIdx) => {
        const newRow = [brand];
        metricNames.forEach((metricName, metricIdx) => {
            const originalRowIdx = metricIdx + 1;
            const originalColIdx = brandIdx + 1;
            const value = sheet[originalRowIdx][originalColIdx];
            newRow.push(value || '');
        });
        transposedSheet.push(newRow);
    });
    
    console.log('转置完成，品牌数:', brands.length, '指标数:', metricNames.length);
    return transposedSheet;
}

/**
 * 转置AI平台核心指标表格
 * 转置前：第一行品牌名称横向展开，第二行是表头，每个品牌有多个指标列
 * 转置后：每行包含 "AI平台、品牌、各项指标值"
 */
function transposePlatformMetricsSheet(sheet) {
    if (!sheet || sheet.length < 3) return sheet;
    
    const firstRow = sheet[0];
    const secondRow = sheet[1];
    
    // 判断1：如果第一列包含"AI平台"，说明已经是转置后的格式
    if (firstRow[0] && firstRow[0].toString().includes('AI平台')) {
        console.log('平台数据已是转置后格式，无需转置');
        return sheet;
    }
    
    // 判断2：检查是否有"转置前"标记
    const hasTransposeBefore = firstRow.some(cell => 
        cell && cell.toString().includes('转置前')
    );
    
    if (!hasTransposeBefore) {
        // 可能是实际需要转置的数据（没有明确标记）
        // 检查：如果行1有品牌名称（含"客户"或"竞品"），并且第二行是指标名
        const hasBrandInRow1 = firstRow.some(cell => 
            cell && (cell.toString().includes('客户') || cell.toString().includes('竞品'))
        );
        
        if (!hasBrandInRow1) {
            return sheet;
        }
    }
    
    // 需要转置：提取品牌名称和它们的起始列位置
    const brands = [];
    const brandStartCols = [];
    
    for (let colIdx = 0; colIdx < firstRow.length; colIdx++) {
        const cell = firstRow[colIdx];
        if (cell && cell.toString().trim()) {
            const cellStr = cell.toString().trim();
            if (cellStr.includes('客户') || cellStr.includes('竞品')) {
                brands.push(cellStr);
                brandStartCols.push(colIdx);
            }
        }
    }
    
    if (brands.length === 0) {
        console.log('平台数据：未找到品牌名称，跳过转置');
        return sheet;
    }
    
    console.log(`平台数据：找到 ${brands.length} 个品牌`);
    
    // 计算每个品牌有多少个指标列
    let brandMetricCount = 0;
    if (brands.length > 1) {
        brandMetricCount = brandStartCols[1] - brandStartCols[0];
    } else {
        brandMetricCount = secondRow.length - brandStartCols[0];
    }
    
    console.log(`每个品牌有 ${brandMetricCount} 个指标列`);
    
    // 提取第一个品牌的指标名称（作为模板）
    const metricNames = [];
    const startCol = brandStartCols[0];
    for (let i = 0; i < brandMetricCount; i++) {
        if (startCol + i < secondRow.length && secondRow[startCol + i]) {
            metricNames.push(secondRow[startCol + i].toString());
        }
    }
    
    // 收集平台名称（从第三行开始，第一列）
    const platforms = [];
    for (let rowIdx = 2; rowIdx < sheet.length; rowIdx++) {
        const platformName = sheet[rowIdx][0];
        if (platformName && platformName.toString().trim()) {
            platforms.push(platformName.toString().trim());
        }
    }
    
    if (platforms.length === 0) {
        console.log('平台数据：未找到平台，跳过转置');
        return sheet;
    }
    
    console.log(`找到 ${platforms.length} 个平台:`, platforms.join(', '));
    
    // 构建转置后的表格
    const transposedSheet = [];
    
    // 新表头：AI平台名称 + 品牌名称 + 公共字段 + 指标名称
    const commonHeaders = [];
    for (let i = 1; i < brandStartCols[0]; i++) {
        if (secondRow[i]) {
            commonHeaders.push(secondRow[i].toString());
        }
    }
    
    const newHeaders = ['AI平台', '品牌名称', ...commonHeaders, ...metricNames];
    transposedSheet.push(newHeaders);
    
    // 为每个平台+品牌组合生成一行
    platforms.forEach((platform, platformIdx) => {
        const originalRowIdx = platformIdx + 2;
        const originalRow = sheet[originalRowIdx];
        
        // 提取公共字段（平台级别的数据）
        const commonValues = [];
        for (let i = 1; i < brandStartCols[0]; i++) {
            commonValues.push(originalRow[i] || '');
        }
        
        brands.forEach((brand, brandIdx) => {
            const newRow = [platform, brand, ...commonValues];
            
            // 提取该品牌的指标数据
            const startCol = brandStartCols[brandIdx];
            for (let i = 0; i < brandMetricCount; i++) {
                const colIdx = startCol + i;
                const value = colIdx < originalRow.length ? originalRow[colIdx] : '';
                newRow.push(value || '');
            }
            
            transposedSheet.push(newRow);
        });
    });
    
    console.log(`平台数据转置完成！生成 ${transposedSheet.length - 1} 行数据（${platforms.length}个平台 × ${brands.length}个品牌）`);
    return transposedSheet;
}

/**
 * 转置关键词数据分析表格
 * 转置前：第一行品牌名称横向展开，第二行是表头，每个品牌有多个指标列
 * 转置后：每行包含 "关键词、AI平台、品牌、各项指标值"
 */
function transposeKeywordAnalysisSheet(sheet) {
    if (!sheet || sheet.length < 3) return sheet;
    
    const firstRow = sheet[0];
    const secondRow = sheet[1];
    
    // 判断1：如果第一列包含"关键词"，说明已经是转置后的格式
    if (secondRow[0] && secondRow[0].toString().includes('关键词')) {
        console.log('关键词数据已是转置后格式，无需转置');
        return sheet;
    }
    
    // 判断2：检查是否有"转置前"标记
    const hasTransposeBefore = firstRow.some(cell => 
        cell && cell.toString().includes('转置前')
    );
    
    if (!hasTransposeBefore) {
        // 检查：如果行1有品牌名称
        const hasBrandInRow1 = firstRow.some(cell => 
            cell && (cell.toString().includes('客户') || cell.toString().includes('竞品'))
        );
        
        if (!hasBrandInRow1) {
            return sheet;
        }
    }
    
    // 需要转置：提取品牌名称和它们的起始列位置
    const brands = [];
    const brandStartCols = [];
    
    for (let colIdx = 0; colIdx < firstRow.length; colIdx++) {
        const cell = firstRow[colIdx];
        if (cell && cell.toString().trim()) {
            const cellStr = cell.toString().trim();
            if (cellStr.includes('客户') || cellStr.includes('竞品')) {
                brands.push(cellStr);
                brandStartCols.push(colIdx);
            }
        }
    }
    
    if (brands.length === 0) {
        console.log('关键词数据：未找到品牌名称，跳过转置');
        return sheet;
    }
    
    console.log(`关键词数据：找到 ${brands.length} 个品牌`);
    
    // 计算每个品牌有多少个指标列
    let brandMetricCount = 0;
    if (brands.length > 1) {
        brandMetricCount = brandStartCols[1] - brandStartCols[0];
    } else {
        brandMetricCount = secondRow.length - brandStartCols[0];
    }
    
    console.log(`每个品牌有 ${brandMetricCount} 个指标列`);
    
    // 提取第一个品牌的指标名称
    const metricNames = [];
    const startCol = brandStartCols[0];
    for (let i = 0; i < brandMetricCount; i++) {
        if (startCol + i < secondRow.length && secondRow[startCol + i]) {
            metricNames.push(secondRow[startCol + i].toString());
        }
    }
    
    // 构建转置后的表格
    const transposedSheet = [];
    
    // 新表头：关键词名称 + AI平台名称 + 公共字段 + 品牌名称 + 指标名称
    const commonHeaders = [];
    for (let i = 2; i < brandStartCols[0]; i++) {
        if (secondRow[i]) {
            commonHeaders.push(secondRow[i].toString());
        }
    }
    
    const newHeaders = ['关键词', 'AI平台', ...commonHeaders, '品牌名称', ...metricNames];
    transposedSheet.push(newHeaders);
    
    // 遍历数据行（从第三行开始）
    for (let rowIdx = 2; rowIdx < sheet.length; rowIdx++) {
        const originalRow = sheet[rowIdx];
        const keyword = originalRow[0];
        const platform = originalRow[1];
        
        if (!keyword || !platform) continue;
        
        // 提取公共字段
        const commonValues = [];
        for (let i = 2; i < brandStartCols[0]; i++) {
            commonValues.push(originalRow[i] || '');
        }
        
        // 为每个品牌创建一条记录
        brands.forEach((brand, brandIdx) => {
            const newRow = [
                keyword.toString().trim(),
                platform.toString().trim(),
                ...commonValues,
                brand
            ];
            
            // 提取该品牌的指标数据
            const startCol = brandStartCols[brandIdx];
            for (let i = 0; i < brandMetricCount; i++) {
                const colIdx = startCol + i;
                const value = colIdx < originalRow.length ? originalRow[colIdx] : '';
                newRow.push(value || '');
            }
            
            transposedSheet.push(newRow);
        });
    }
    
    console.log(`关键词数据转置完成！生成 ${transposedSheet.length - 1} 行数据`);
    return transposedSheet;
}

/**
 * 解析数据封面（Sheet#1或名为"数据封面"的sheet）
 */
function parseDataCover(sheets) {
    // 尝试找到数据封面sheet
    const coverSheet = sheets['数据封面'] || sheets['Sheet1'] || sheets[Object.keys(sheets)[0]];
    if (!coverSheet || coverSheet.length < 2) return null;
    
    const cover = {
        客户名称: '',
        核心竞品名称: '',
        其他竞品名称: '',
        分析周期: '',
        AI平台: [],
        采集关键词数: 0,
        循环次数: 0,
        AI回答条数: 0,
    };
    
    // 简单的键值对解析
    for (let i = 0; i < coverSheet.length; i++) {
        const row = coverSheet[i];
        if (row.length >= 2) {
            const key = row[0] ? row[0].toString().trim() : '';
            const value = row[1] ? row[1].toString().trim() : '';
            
            if (key.includes('客户') || key.includes('品牌名')) {
                cover.客户名称 = value;
            } else if (key.includes('核心竞品')) {
                cover.核心竞品名称 = value;
            } else if (key.includes('其他竞品')) {
                cover.其他竞品名称 = value;
            } else if (key.includes('周期') || key.includes('时间')) {
                cover.分析周期 = value;
            } else if (key.includes('AI平台') || key.includes('平台名称')) {
                cover.AI平台 = value.split(/[,，、]/).map(p => p.trim()).filter(p => p);
            } else if (key.includes('关键词数')) {
                cover.采集关键词数 = parseInt(value) || 0;
            } else if (key.includes('循环')) {
                cover.循环次数 = parseInt(value) || 0;
            } else if (key.includes('回答') || key.includes('条数')) {
                cover.AI回答条数 = parseInt(value) || 0;
            }
        }
    }
    
    return cover;
}

/**
 * 解析品牌核心指标（整体数据）
 */
function parseBrandMetrics(sheet) {
    if (!sheet || sheet.length < 2) return null;
    
    const headers = sheet[0];
    const brandField = findField(headers, 'brand');
    
    if (!brandField) return null;
    
    const metrics = {};
    const brands = [];
    
    // 解析每一行
    for (let i = 1; i < sheet.length; i++) {
        const row = sheet[i];
        const brandIndex = headers.indexOf(brandField);
        const brand = row[brandIndex];
        
        if (!brand) continue;
        brands.push(brand);
        
        // 解析各个指标
        Object.keys(AppData.fieldMapping).forEach(metricKey => {
            if (metricKey === 'brand' || metricKey === 'aiPlatform' || metricKey === 'keyword') return;
            
            const field = findField(headers, metricKey);
            if (field) {
                const fieldIndex = headers.indexOf(field);
                const value = parseFloat(row[fieldIndex]) || 0;
                
                if (!metrics[metricKey]) metrics[metricKey] = [];
                metrics[metricKey].push({ brand, value });
            }
        });
    }
    
    // 排序每个指标
    Object.keys(metrics).forEach(metricKey => {
        metrics[metricKey].sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return a.brand.localeCompare(b.brand);
        });
    });
    
    return { metrics, brands: [...new Set(brands)] };
}

/**
 * 解析AI平台的核心指标
 */
function parsePlatformMetrics(sheet) {
    if (!sheet || sheet.length < 2) return {};
    
    const headers = sheet[0];
    const brandField = findField(headers, 'brand');
    const platformField = findField(headers, 'aiPlatform');
    
    if (!brandField || !platformField) return {};
    
    const platformMetrics = {};
    
    // 解析每一行
    for (let i = 1; i < sheet.length; i++) {
        const row = sheet[i];
        const brandIndex = headers.indexOf(brandField);
        const platformIndex = headers.indexOf(platformField);
        const brand = row[brandIndex];
        const platform = row[platformIndex];
        
        if (!brand || !platform) continue;
        
        if (!platformMetrics[platform]) {
            platformMetrics[platform] = {};
        }
        
        // 解析各个指标
        Object.keys(AppData.fieldMapping).forEach(metricKey => {
            if (metricKey === 'brand' || metricKey === 'aiPlatform' || metricKey === 'keyword') return;
            
            const field = findField(headers, metricKey);
            if (field) {
                const fieldIndex = headers.indexOf(field);
                const value = parseFloat(row[fieldIndex]) || 0;
                
                if (!platformMetrics[platform][metricKey]) platformMetrics[platform][metricKey] = [];
                platformMetrics[platform][metricKey].push({ brand, value });
            }
        });
    }
    
    // 排序每个平台的每个指标
    Object.keys(platformMetrics).forEach(platform => {
        Object.keys(platformMetrics[platform]).forEach(metricKey => {
            platformMetrics[platform][metricKey].sort((a, b) => {
                if (b.value !== a.value) return b.value - a.value;
                return a.brand.localeCompare(b.brand);
            });
        });
    });
    
    return platformMetrics;
}

/**
 * 解析关键词数据分析
 */
function parseKeywordAnalysis(sheet) {
    if (!sheet || sheet.length < 2) return {};
    
    const headers = sheet[0];
    const keywordField = findField(headers, 'keyword');
    const platformField = findField(headers, 'aiPlatform');
    const brandField = findField(headers, 'brand');
    
    if (!keywordField || !platformField || !brandField) return {};
    
    const keywordData = {};
    
    // 解析每一行
    for (let i = 1; i < sheet.length; i++) {
        const row = sheet[i];
        const keywordIndex = headers.indexOf(keywordField);
        const platformIndex = headers.indexOf(platformField);
        const brandIndex = headers.indexOf(brandField);
        
        const keyword = row[keywordIndex];
        const platform = row[platformIndex];
        const brand = row[brandIndex];
        
        if (!keyword || !platform || !brand) continue;
        
        if (!keywordData[platform]) {
            keywordData[platform] = {};
        }
        
        if (!keywordData[platform][keyword]) {
            keywordData[platform][keyword] = {};
        }
        
        // 解析各个指标
        Object.keys(AppData.fieldMapping).forEach(metricKey => {
            if (metricKey === 'brand' || metricKey === 'aiPlatform' || metricKey === 'keyword') return;
            if (metricKey.includes('Keywords')) return; // 跳过关键词数指标
            
            const field = findField(headers, metricKey);
            if (field) {
                const fieldIndex = headers.indexOf(field);
                const value = parseFloat(row[fieldIndex]) || 0;
                
                if (!keywordData[platform][keyword][metricKey]) {
                    keywordData[platform][keyword][metricKey] = [];
                }
                keywordData[platform][keyword][metricKey].push({ brand, value });
            }
        });
    }
    
    // 排序
    Object.keys(keywordData).forEach(platform => {
        Object.keys(keywordData[platform]).forEach(keyword => {
            Object.keys(keywordData[platform][keyword]).forEach(metricKey => {
                keywordData[platform][keyword][metricKey].sort((a, b) => {
                    if (b.value !== a.value) return b.value - a.value;
                    return a.brand.localeCompare(b.brand);
                });
            });
        });
    });
    
    return keywordData;
}

/**
 * 主解析函数
 */
function analyzeUploadedData() {
    if (!AppData.uploadedData) return;
    
    try {
        const sheets = AppData.uploadedData;
        
        // 解析数据封面
        AppData.parsedData.dataCover = parseDataCover(sheets);
        
        // 【Step 1】转置品牌核心指标表格（如果需要）
        let brandSheet = sheets['品牌核心指标'] || sheets['品牌指标'];
        if (brandSheet) {
            console.log('转置前 - 品牌核心指标:', brandSheet.slice(0, 3));
            brandSheet = transposeBrandMetricsSheet(brandSheet);
            console.log('转置后 - 品牌核心指标:', brandSheet.slice(0, 3));
            AppData.parsedData.brandMetrics = parseBrandMetrics(brandSheet);
        }
        
        // 【Step 2】转置AI平台的核心指标表格（如果需要）
        let platformSheet = sheets['AI平台的核心指标'] || sheets['平台指标'];
        if (platformSheet) {
            console.log('转置前 - AI平台核心指标:', platformSheet.slice(0, 3));
            platformSheet = transposePlatformMetricsSheet(platformSheet);
            console.log('转置后 - AI平台核心指标:', platformSheet.slice(0, 3));
            AppData.parsedData.platformMetrics = parsePlatformMetrics(platformSheet);
        }
        
        // 【Step 3】转置关键词数据表格（如果需要）
        let keywordSheet = sheets['关键词数据分析'] || sheets['关键词分析'];
        if (keywordSheet) {
            console.log('转置前 - 关键词数据:', keywordSheet.slice(0, 3));
            keywordSheet = transposeKeywordAnalysisSheet(keywordSheet);
            console.log('转置后 - 关键词数据:', keywordSheet.slice(0, 3));
            AppData.parsedData.keywordAnalysis = parseKeywordAnalysis(keywordSheet);
        }
        
        // 更新UI
        AppData.isRealData = true;
        updateDataStatus();
        updateBrandAIPlatformSelector();
        updateKeywordAIPlatformSelector();
        renderDataCover();
        updateData();
        
        showAlert('数据分析完成！', 'success');
        
    } catch (error) {
        console.error('数据分析错误:', error);
        showAlert('数据分析失败，请检查数据格式是否正确', 'error');
    }
}

// ============================================
// 4. UI渲染函数
// ============================================

/**
 * 渲染数据封面
 */
function renderDataCover() {
    const coverEl = document.getElementById('dataCover');
    const cover = AppData.parsedData.dataCover;
    
    if (!cover || !AppData.isRealData) {
        coverEl.classList.remove('show');
        return;
    }
    
    const gridHTML = `
        <div class="data-cover-item">
            <div class="data-cover-label">客户名称</div>
            <div class="data-cover-value">${cover.客户名称 || '-'}</div>
        </div>
        <div class="data-cover-item">
            <div class="data-cover-label">核心竞品名称</div>
            <div class="data-cover-value">${cover.核心竞品名称 || '-'}</div>
        </div>
        <div class="data-cover-item">
            <div class="data-cover-label">其他竞品名称</div>
            <div class="data-cover-value">${cover.其他竞品名称 || '-'}</div>
        </div>
        <div class="data-cover-item">
            <div class="data-cover-label">分析周期</div>
            <div class="data-cover-value">${cover.分析周期 || '-'}</div>
        </div>
        <div class="data-cover-item">
            <div class="data-cover-label">
                采集关键词数
                ${createHelpIcon('top1Keywords').replace('Top1关键词数', '采集关键词数')}
            </div>
            <div class="data-cover-value">${cover.采集关键词数 || 0}</div>
        </div>
        <div class="data-cover-item">
            <div class="data-cover-label">循环次数</div>
            <div class="data-cover-value">${cover.循环次数 || 0}</div>
        </div>
        <div class="data-cover-item">
            <div class="data-cover-label">AI回答条数</div>
            <div class="data-cover-value">${cover.AI回答条数 || 0}</div>
        </div>
        <div class="data-cover-item" style="grid-column: 1/-1;">
            <div class="data-cover-label">AI平台</div>
            <div class="data-cover-value">${cover.AI平台.join('、') || '-'}</div>
        </div>
    `;
    
    document.getElementById('dataCoverGrid').innerHTML = gridHTML;
    coverEl.classList.add('show');
}

/**
 * 更新数据状态显示
 */
function updateDataStatus() {
    const statusEl = document.getElementById('dataStatus');
    if (AppData.isRealData) {
        statusEl.textContent = '真实数据';
        statusEl.className = 'data-status real';
            } else {
        statusEl.textContent = '演示数据';
        statusEl.className = 'data-status mock';
    }
}

/**
 * 更新品牌Tab的AI平台选择器
 */
function updateBrandAIPlatformSelector() {
    const select = document.getElementById('brandAiPlatform');
    select.innerHTML = '<option value="all">所有AI平台</option>';
    
    // 只有真实数据才显示平台列表
    if (AppData.isRealData && AppData.parsedData.dataCover && AppData.parsedData.dataCover.AI平台) {
        const platforms = AppData.parsedData.dataCover.AI平台;
        
        platforms.forEach(platform => {
            const option = document.createElement('option');
            option.value = platform;
            option.textContent = platform;
            select.appendChild(option);
        });
        
        // 恢复之前的选择
        select.value = AppData.uiState.brandPlatform;
    }
}

/**
 * 更新关键词Tab的AI平台选择器
 */
function updateKeywordAIPlatformSelector() {
    const select = document.getElementById('keywordAiPlatform');
    select.innerHTML = '<option value="">请选择AI平台</option>';
    
    // 只有真实数据才显示平台列表
    if (AppData.isRealData && AppData.parsedData.dataCover && AppData.parsedData.dataCover.AI平台) {
        const platforms = AppData.parsedData.dataCover.AI平台;
        
        platforms.forEach(platform => {
            const option = document.createElement('option');
            option.value = platform;
            option.textContent = platform;
            select.appendChild(option);
        });
        
        // 恢复之前的选择
        if (AppData.uiState.keywordPlatform) {
            select.value = AppData.uiState.keywordPlatform;
        }
    }
}

/**
 * 更新品牌排名表
 */
function updateBrandRankingTable() {
    const tbody = document.getElementById('brandRankingBody');
    tbody.innerHTML = '';
    
    // 必须有真实数据才显示
    if (!AppData.isRealData) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">请上传Excel文件查看数据分析</td></tr>';
        return;
    }
    
    let metricsData = null;
    
    // 根据品牌Tab选择的平台获取数据
    if (AppData.uiState.brandPlatform === 'all') {
        if (AppData.parsedData.brandMetrics) {
            metricsData = AppData.parsedData.brandMetrics.metrics;
        }
    } else {
        if (AppData.parsedData.platformMetrics[AppData.uiState.brandPlatform]) {
            metricsData = AppData.parsedData.platformMetrics[AppData.uiState.brandPlatform];
        }
    }
    
    if (!metricsData) {
        tbody.innerHTML = '<tr><td colspan="6">暂无数据</td></tr>';
        return;
    }
    
    // 渲染每个指标的排名
    Object.keys(AppData.metrics).forEach(metricKey => {
        const metric = AppData.metrics[metricKey];
        const rankings = metricsData[metricKey];
        
        if (!rankings || rankings.length === 0) return;
        
        const row = document.createElement('tr');
        const isPercentage = metric.unit === '%';
        
        let html = `<td><strong class="has-tooltip">${metric.name}${createHelpIcon(metricKey)}</strong></td>`;
        
        for (let i = 0; i < 5 && i < rankings.length; i++) {
            const item = rankings[i];
            html += `<td><span class="brand-name">${item.brand}</span> <span class="metric-value">${formatNumber(item.value, isPercentage)}</span></td>`;
        }
        
        // 填充空单元格
        for (let i = rankings.length; i < 5; i++) {
            html += '<td>-</td>';
        }
        
        row.innerHTML = html;
        tbody.appendChild(row);
    });
}

/**
 * 更新品牌对比图表
 */
function updateBrandComparisonChart() {
    const metricKey = AppData.uiState.selectedMetric;
    const metric = AppData.metrics[metricKey];
    
    // 必须有真实数据才显示图表
    if (!AppData.isRealData) {
        const ctx = document.getElementById('brandChart').getContext('2d');
        if (AppData.chartInstance) {
            AppData.chartInstance.destroy();
            AppData.chartInstance = null;
        }
        return;
    }
    
    let metricsData = null;
    
    // 根据品牌Tab选择的平台获取数据
    if (AppData.uiState.brandPlatform === 'all') {
        if (AppData.parsedData.brandMetrics) {
            metricsData = AppData.parsedData.brandMetrics.metrics;
        }
    } else {
        if (AppData.parsedData.platformMetrics[AppData.uiState.brandPlatform]) {
            metricsData = AppData.parsedData.platformMetrics[AppData.uiState.brandPlatform];
        }
    }
    
    const rankings = metricsData && metricsData[metricKey] ? metricsData[metricKey] : [];
    
    const ctx = document.getElementById('brandChart').getContext('2d');
    
    if (AppData.chartInstance) {
        AppData.chartInstance.destroy();
    }
    
    AppData.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: rankings.map(item => item.brand),
        datasets: [{
                label: metric.name,
                data: rankings.map(item => item.value),
            backgroundColor: [
                'rgba(26, 115, 232, 0.8)',
                'rgba(52, 168, 83, 0.8)',
                    'rgba(251, 188, 5, 0.8)',
                'rgba(234, 67, 53, 0.8)',
                    'rgba(103, 58, 183, 0.8)',
                    'rgba(0, 172, 193, 0.8)',
                    'rgba(255, 109, 0, 0.8)',
                    'rgba(158, 158, 158, 0.8)',
                ],
                borderRadius: 4,
                borderSkipped: false,
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
                            const isPercentage = metric.unit === '%';
                            return metric.name + ': ' + formatNumber(context.parsed.y, isPercentage);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return metric.unit === '%' ? value + '%' : value;
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * 更新关键词分析表
 */
function updateKeywordAnalysisTable() {
    const tbody = document.getElementById('keywordAnalysisBody');
    const platform = AppData.uiState.keywordPlatform;
    const dimension = AppData.uiState.selectedDimension;
    
    // 必须有真实数据
    if (!AppData.isRealData) {
        document.getElementById('keywordPlatformHint').innerHTML = '⚠️ 请先上传Excel文件';
        document.getElementById('keywordPlatformHint').style.display = 'block';
        document.getElementById('keywordAnalysisCard').style.display = 'none';
        return;
    }
    
    // 如果没有选择平台，显示提示
    if (!platform) {
        document.getElementById('keywordPlatformHint').innerHTML = '⚠️ 请在上方选择具体的AI平台查看关键词分析数据';
        document.getElementById('keywordPlatformHint').style.display = 'block';
        document.getElementById('keywordAnalysisCard').style.display = 'none';
        return;
    }
    
    // 隐藏提示，显示表格
    document.getElementById('keywordPlatformHint').style.display = 'none';
    document.getElementById('keywordAnalysisCard').style.display = 'block';
    
    let keywordData = null;
    
    if (AppData.parsedData.keywordAnalysis[platform]) {
        keywordData = AppData.parsedData.keywordAnalysis[platform];
    }
    
    if (!keywordData || Object.keys(keywordData).length === 0) {
        tbody.innerHTML = '<tr><td colspan="100%">暂无关键词数据</td></tr>';
        return;
    }
    
    // 构建表格：行=关键词，列=排名
    const keywords = Object.keys(keywordData); // 展示所有关键词
    const maxRank = 5; // 显示前5名
    
    // 更新表头：第一列是"关键词"，后面是排名1-5
    const thead = document.getElementById('keywordAnalysisHeader');
    let headerHTML = '<th style="min-width: 200px;">关键词</th>';
    for (let rank = 1; rank <= maxRank; rank++) {
        headerHTML += `<th>排名${rank}</th>`;
    }
    thead.innerHTML = headerHTML;
    
    // 构建表体：每行是一个关键词
    tbody.innerHTML = '';
    keywords.forEach(keyword => {
        const row = document.createElement('tr');
        let html = `<td><strong>${keyword}</strong></td>`;
        
        const metricData = keywordData[keyword][dimension];
        
        for (let rank = 1; rank <= maxRank; rank++) {
            if (metricData && metricData[rank - 1]) {
                const item = metricData[rank - 1];
                const isPercentage = AppData.metrics[dimension].unit === '%';
                html += `<td><span class="brand-name">${item.brand}</span> <span class="metric-value">${formatNumber(item.value, isPercentage)}</span></td>`;
            } else {
                html += '<td>-</td>';
            }
        }
        
        row.innerHTML = html;
        tbody.appendChild(row);
    });
}

/**
 * 显示提示信息
 */
function showAlert(message, type = 'info') {
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type}`;
    alertEl.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertEl, container.firstChild);
    
    setTimeout(() => {
        alertEl.remove();
    }, 3000);
}

// ============================================
// 5. 生成模拟数据（演示用）
// ============================================

function generateMockBrandMetrics() {
    const brands = ['思迈特', '帆软', 'Tableau', 'PowerBI', 'QlikView', '永洪BI'];
    const metrics = {};
    
    Object.keys(AppData.metrics).forEach(metricKey => {
        metrics[metricKey] = brands.map(brand => ({
            brand,
            value: generateRandomData(
                metricKey.includes('Keywords') ? 10 : 10,
                metricKey.includes('Keywords') ? 200 : 95,
                metricKey.includes('Keywords') ? 0 : 1
            )
        })).sort((a, b) => b.value - a.value);
    });
    
    return metrics;
}

function generateMockKeywordData() {
    const brands = ['思迈特', '帆软', 'Tableau', 'PowerBI', 'QlikView'];
    const keywords = ['BI工具推荐', '数据可视化', '企业级BI', '自助分析', '数据大屏', '移动BI'];
    const data = {};
    
    keywords.forEach(keyword => {
        data[keyword] = {};
        Object.keys(AppData.metrics).forEach(metricKey => {
            if (metricKey.includes('Keywords')) return;
            data[keyword][metricKey] = brands.map(brand => ({
                brand,
                value: generateRandomData(10, 95, 1)
            })).sort((a, b) => b.value - a.value);
        });
    });
    
    return data;
}

// ============================================
// 6. 事件处理函数
// ============================================

/**
 * 切换Tab
 */
function switchTab(tabName) {
    AppData.uiState.currentTab = tabName;
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabName + '-section').classList.add('active');
    
    // 切换到关键词分析Tab时，更新关键词表
    if (tabName === 'keyword') {
        updateKeywordAnalysisTable();
    }
    
    // 更新URL状态
    updateURLState();
}

/**
 * 更新所有数据
 */
function updateData() {
    const currentTab = AppData.uiState.currentTab;
    
    if (currentTab === 'brand') {
        updateBrandRankingTable();
        updateBrandComparisonChart();
    } else if (currentTab === 'keyword') {
        updateKeywordAnalysisTable();
    }
    
    // 更新URL状态
    updateURLState();
}

/**
 * 品牌Tab的AI平台选择变化
 */
function onBrandPlatformChange() {
    const select = document.getElementById('brandAiPlatform');
    AppData.uiState.brandPlatform = select.value;
    updateBrandRankingTable();
    updateBrandComparisonChart();
    updateURLState();
}

/**
 * 关键词Tab的AI平台选择变化
 */
function onKeywordPlatformChange() {
    const select = document.getElementById('keywordAiPlatform');
    AppData.uiState.keywordPlatform = select.value;
    updateKeywordAnalysisTable();
    updateURLState();
}

/**
 * 图表指标选择变化
 */
function onChartMetricChange() {
    const select = document.getElementById('chartMetric');
    AppData.uiState.selectedMetric = select.value;
    updateBrandComparisonChart();
}

/**
 * 分析维度选择变化
 */
function onDimensionChange() {
    const select = document.getElementById('dimensionSelect');
    AppData.uiState.selectedDimension = select.value;
    updateKeywordAnalysisTable();
}

// ============================================
// 7. URL状态管理（分享功能）
// ============================================

/**
 * 更新URL状态
 */
function updateURLState() {
    const state = {
        tab: AppData.uiState.currentTab,
        brandPlatform: AppData.uiState.brandPlatform,
        keywordPlatform: AppData.uiState.keywordPlatform,
        metric: AppData.uiState.selectedMetric,
        dimension: AppData.uiState.selectedDimension,
    };
    
    const stateStr = btoa(encodeURIComponent(JSON.stringify(state)));
    window.location.hash = `state=${stateStr}`;
}

/**
 * 从URL恢复状态
 */
function restoreURLState() {
    const hash = window.location.hash;
    if (!hash || !hash.includes('state=')) return;
    
    try {
        const stateStr = hash.split('state=')[1];
        const state = JSON.parse(decodeURIComponent(atob(stateStr)));
        
        AppData.uiState.currentTab = state.tab || 'brand';
        AppData.uiState.brandPlatform = state.brandPlatform || 'all';
        AppData.uiState.keywordPlatform = state.keywordPlatform || '';
        AppData.uiState.selectedMetric = state.metric || 'visibility';
        AppData.uiState.selectedDimension = state.dimension || 'visibility';
        
        // 更新UI
        document.getElementById('brandAiPlatform').value = AppData.uiState.brandPlatform;
        if (AppData.uiState.keywordPlatform) {
            document.getElementById('keywordAiPlatform').value = AppData.uiState.keywordPlatform;
        }
        document.getElementById('chartMetric').value = AppData.uiState.selectedMetric;
        document.getElementById('dimensionSelect').value = AppData.uiState.selectedDimension;
        
        // 切换到对应的tab
        const tabButton = document.querySelector(`.tab[onclick*="${AppData.uiState.currentTab}"]`);
        if (tabButton) {
            tabButton.click();
        }
        
    } catch (error) {
        console.error('恢复URL状态失败:', error);
    }
}

/**
 * 复制报告链接
 */
function copyReportLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showAlert('报告链接已复制到剪贴板！', 'success');
    }).catch(() => {
        showAlert('复制失败，请手动复制地址栏中的链接', 'error');
    });
}

// ============================================
// 8. 文件上传处理
// ============================================

function handleFile(file) {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                       'application/vnd.ms-excel',
                       'text/csv'];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        showAlert('请上传 Excel 或 CSV 格式的文件', 'error');
        return;
    }
    
    document.getElementById('fileName').textContent = `📄 ${file.name}`;
    document.getElementById('fileInfo').classList.add('show');
    document.getElementById('analyzeBtn').disabled = false;
    
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            AppData.uploadedData = parseWorkbook(workbook);
            console.log('文件解析成功，Sheet列表:', Object.keys(AppData.uploadedData));
                } catch (error) {
            console.error('文件解析错误:', error);
            showAlert('文件解析失败，请检查文件格式', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
}

// ============================================
// 9. 初始化
// ============================================

function initializePage() {
    console.log('初始化页面...');
    
    // 更新AI平台选择器
    updateBrandAIPlatformSelector();
    updateKeywordAIPlatformSelector();
    
    // 恢复URL状态
    restoreURLState();
    
    // 显示空状态
    updateBrandRankingTable();
    updateBrandComparisonChart();
    updateKeywordAnalysisTable();
    
    // 绑定事件
    setupEventListeners();
}

function setupEventListeners() {
    // 文件上传
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    // 分析按钮
    document.getElementById('analyzeBtn').addEventListener('click', analyzeUploadedData);
    
    // 图表指标选择
    document.getElementById('chartMetric').addEventListener('change', onChartMetricChange);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage);
