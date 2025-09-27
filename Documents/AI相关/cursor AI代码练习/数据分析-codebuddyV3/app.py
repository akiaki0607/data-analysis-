from flask import Flask, render_template, request, jsonify, redirect, url_for, send_file
import pandas as pd
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename
import io

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# 确保上传文件夹存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 全局变量存储分析结果
analysis_results = {}

class GEOAnalyzer:
    def __init__(self):
        self.data = {}
        self.client_name = ""
        self.competitors = []
        self.analysis_results = {}
    
    def load_excel_data(self, file_path):
        """加载Excel数据"""
        try:
            # 首先获取所有工作表名称
            xl_file = pd.ExcelFile(file_path)
            sheet_names = xl_file.sheet_names
            
            # 读取数据封面
            cover_df = pd.read_excel(file_path, sheet_name='数据封面')
            self.client_name = cover_df[cover_df['字段名称'] == '客户名称']['字段值'].iloc[0]
            
            # 读取汇总报表获取竞品信息
            summary_df = pd.read_excel(file_path, sheet_name='汇总报表')
            
            # 从汇总报表中获取实际存在的竞品
            core_competitors = summary_df[summary_df['品牌类型'] == '核心竞品']['品牌名称'].tolist()
            other_competitors = summary_df[summary_df['品牌类型'] == '其他竞品']['品牌名称'].tolist()
            
            # 合并所有竞品，过滤掉空值，确保转换为Python列表
            all_competitors = list(core_competitors) + list(other_competitors)
            self.competitors = [str(comp).strip() for comp in all_competitors if pd.notna(comp) and str(comp).strip() != '']
            
            # 从数据封面获取竞品信息作为补充验证
            try:
                core_from_cover = cover_df[cover_df['字段名称'] == '核心竞品名称']['字段值'].iloc[0]
                other_from_cover = cover_df[cover_df['字段名称'] == '其他竞品名称']['字段值'].iloc[0]
                
                # 解析数据封面中的竞品名称（用空格分隔）
                if pd.notna(core_from_cover) and str(core_from_cover).strip() != '无':
                    cover_core = [comp.strip() for comp in str(core_from_cover).split() if comp.strip()]
                else:
                    cover_core = []
                    
                if pd.notna(other_from_cover) and str(other_from_cover).strip() != '无':
                    cover_other = [comp.strip() for comp in str(other_from_cover).split() if comp.strip()]
                else:
                    cover_other = []
                
                # 使用汇总报表的数据为准，数据封面作为验证
                print(f"汇总报表竞品: {self.competitors}")
                print(f"数据封面核心竞品: {cover_core}")
                print(f"数据封面其他竞品: {cover_other}")
                
            except Exception as e:
                print(f"读取数据封面竞品信息时出错: {e}")
            
            # 自动检测关键词数据分析工作表名称
            keyword_sheet_name = None
            for name in ['关键词数据分析_清洗后', '关键词数据分析']:
                if name in sheet_names:
                    keyword_sheet_name = name
                    break
            
            if not keyword_sheet_name:
                raise Exception("找不到关键词数据分析工作表")
            
            # 自动检测信源数据分析工作表名称
            source_sheet_name = None
            for name in ['信源数据分析_清洗后', '信源数据分析']:
                if name in sheet_names:
                    source_sheet_name = name
                    break
            
            if not source_sheet_name:
                raise Exception("找不到信源数据分析工作表")
            
            # 读取关键词数据分析
            keyword_df = pd.read_excel(file_path, sheet_name=keyword_sheet_name)
            
            # 读取信源数据分析
            source_df = pd.read_excel(file_path, sheet_name=source_sheet_name)
            
            print(f"使用工作表: 关键词数据 - {keyword_sheet_name}, 信源数据 - {source_sheet_name}")
            
            self.data = {
                'cover': cover_df,
                'summary': summary_df,
                'keywords': keyword_df,
                'sources': source_df
            }
            
            return True, "数据加载成功"
        except Exception as e:
            return False, f"数据加载失败: {str(e)}"
    
    def identify_weak_combinations(self):
        """识别薄弱的关键词-AI平台组合"""
        keyword_df = self.data['keywords']
        
        # 筛选客户品牌可见概率低于35%的组合
        client_weak = keyword_df[
            (keyword_df['品牌'] == self.client_name) & 
            (keyword_df['可见概率'] < 35)
        ][['关键词名称', 'AI平台名称', '可见概率']].copy()
        
        weak_combinations = []
        
        for _, row in client_weak.iterrows():
            keyword = row['关键词名称']
            platform = row['AI平台名称']
            client_visibility = row['可见概率']
            
            # 检查竞品在同一关键词-平台组合的表现
            competitor_data = keyword_df[
                (keyword_df['关键词名称'] == keyword) & 
                (keyword_df['AI平台名称'] == platform) & 
                (keyword_df['品牌'].isin(self.competitors))
            ]
            
            if len(competitor_data) > 0:
                max_competitor_visibility = competitor_data['可见概率'].max()
                max_competitor_name = competitor_data.loc[
                    competitor_data['可见概率'].idxmax(), '品牌'
                ]
                
                # 如果竞品最高可见概率也低于35%，则为蓝海关键词
                is_blue_ocean = max_competitor_visibility < 35
                
                weak_combinations.append({
                    '关键词': keyword,
                    'AI平台': platform,
                    '客户可见概率': client_visibility,
                    '竞品最高可见概率': max_competitor_visibility,
                    '最高竞品名称': max_competitor_name,
                    '是否蓝海': is_blue_ocean
                })
        
        return weak_combinations
    
    def prioritize_blue_ocean_keywords(self, weak_combinations):
        """优先级排序蓝海关键词"""
        # 筛选蓝海关键词
        blue_ocean_combinations = [combo for combo in weak_combinations if combo['是否蓝海']]
        
        # 统计每个关键词涉及的薄弱AI平台数量
        keyword_platform_count = {}
        keyword_stats = {}
        
        for combo in blue_ocean_combinations:
            keyword = combo['关键词']
            if keyword not in keyword_platform_count:
                keyword_platform_count[keyword] = 0
                keyword_stats[keyword] = {
                    'platform_count': 0,
                    'total_client_visibility': 0,
                    'total_competitor_visibility': 0,
                    'platforms': []
                }
            
            keyword_platform_count[keyword] += 1
            keyword_stats[keyword]['platform_count'] += 1
            keyword_stats[keyword]['total_client_visibility'] += combo['客户可见概率']
            keyword_stats[keyword]['total_competitor_visibility'] += combo['竞品最高可见概率']
            keyword_stats[keyword]['platforms'].append(combo['AI平台'])
        
        # 计算平均值（仅用于展示）
        for keyword in keyword_stats:
            stats = keyword_stats[keyword]
            stats['avg_client_visibility'] = stats['total_client_visibility'] / stats['platform_count']
            stats['avg_competitor_visibility'] = stats['total_competitor_visibility'] / stats['platform_count']
        
        # 严格按照PRD要求：仅按薄弱AI平台数量降序排序
        sorted_keywords = sorted(keyword_platform_count.items(), key=lambda x: x[1], reverse=True)
        
        return sorted_keywords, blue_ocean_combinations, keyword_stats
    
    def identify_excellent_source_platforms(self, blue_ocean_combinations, sorted_keywords):
        """识别优秀信源平台 - 按PRD 5.1.5和5.1.6要求实现，返回两张表的数据"""
        if 'sources' not in self.data:
            return [], []
            
        source_df = self.data['sources']
        excellent_sources = []  # 表1：优秀信源平台表
        weakness_analysis = []  # 表2：优秀信源平台与薄弱分析表
        
        # 获取所有蓝海关键词（只处理真正的蓝海关键词）
        blue_ocean_keywords = set(combo['关键词'] for combo in blue_ocean_combinations)
        
        # 按关键词优先级顺序处理（只处理蓝海关键词）
        for keyword, _ in sorted_keywords:
            # 只处理蓝海关键词
            if keyword not in blue_ocean_keywords:
                continue
                
            keyword_platforms = [combo['AI平台'] for combo in blue_ocean_combinations if combo['关键词'] == keyword]
            
            for platform in keyword_platforms:
                # 5.1.5: 对每个"关键词-AI平台"组合，选取前10个优秀信源平台
                platform_sources = source_df[
                    (source_df['关键词名称'] == keyword) & 
                    (source_df['AI平台'] == platform)
                ].copy()
                
                if len(platform_sources) > 0:
                    # 按"选用信源文章总数"倒序排列，选取前10个
                    platform_sources_sorted = platform_sources.sort_values('选用信源文章总数', ascending=False)
                    top_10_sources = platform_sources_sorted.head(10)
                    
                    # 生成两张表的数据
                    for _, source_row in top_10_sources.iterrows():
                        source_name = source_row['信源平台名称']
                        total_articles = source_row['选用信源文章总数']
                        
                        # 检查是否为蓝海组合
                        is_blue_ocean = any(
                            combo['关键词'] == keyword and combo['AI平台'] == platform 
                            for combo in blue_ocean_combinations
                        )
                        
                        # 表1：优秀信源平台表（显示所有优秀信源平台）
                        excellent_sources.append({
                            '关键词': keyword,
                            'AI平台': platform,
                            '信源平台名称': source_name,
                            '选用信源文章总数': total_articles,
                            '是否蓝海': is_blue_ocean
                        })
                        
                        # 表2：检查客户在该信源平台的表现，只有薄弱的才加入薄弱分析表
                        client_source_data = platform_sources[
                            (platform_sources['信源平台名称'] == source_name) & 
                            (platform_sources['品牌'] == self.client_name)
                        ]
                        
                        client_article_ratio = 0
                        is_weak_source = True
                        
                        if len(client_source_data) > 0:
                            client_article_ratio = client_source_data['选用信源文章占比'].iloc[0]
                            is_weak_source = client_article_ratio < 50
                        
                        # 只有薄弱的信源平台才添加到薄弱分析表
                        if is_weak_source:
                            weakness_analysis.append({
                                '关键词': keyword,
                                'AI平台': platform,
                                '信源平台名称': source_name,
                                '选用信源文章总数': total_articles,
                                '客户信源文章占比': client_article_ratio,
                                '是否薄弱信源平台': is_weak_source,
                                '是否蓝海': is_blue_ocean
                            })
        
        # 在返回前对两个列表进行去重
        # 去重优秀信源平台表
        seen_excellent = set()
        unique_excellent_sources = []
        for item in excellent_sources:
            key = (item['关键词'], item['AI平台'], item['信源平台名称'])
            if key not in seen_excellent:
                seen_excellent.add(key)
                unique_excellent_sources.append(item)
        
        # 去重薄弱分析表
        seen_weakness = set()
        unique_weakness_analysis = []
        for item in weakness_analysis:
            key = (item['关键词'], item['AI平台'], item['信源平台名称'])
            if key not in seen_weakness:
                seen_weakness.add(key)
                unique_weakness_analysis.append(item)
        
        return unique_excellent_sources, unique_weakness_analysis
    
    def run_full_analysis(self):
        """运行完整分析"""
        # 1. 识别薄弱组合
        weak_combinations = self.identify_weak_combinations()
        
        # 2. 优先级排序蓝海关键词
        sorted_keywords, blue_ocean_combinations, keyword_stats = self.prioritize_blue_ocean_keywords(weak_combinations)
        
        # 3. 识别优秀信源平台
        excellent_sources, weakness_analysis = self.identify_excellent_source_platforms(blue_ocean_combinations, sorted_keywords)
        
        self.analysis_results = {
            'client_name': self.client_name,
            'competitors': self.competitors,
            'weak_combinations_count': len(weak_combinations),
            'blue_ocean_count': len(blue_ocean_combinations),
            'weak_combinations': weak_combinations,
            'blue_ocean_combinations': blue_ocean_combinations,
            'sorted_keywords': sorted_keywords,
            'keyword_stats': keyword_stats,
            'excellent_sources': excellent_sources,  # 表1：优秀信源平台表
            'source_analysis': weakness_analysis,    # 表2：优秀信源平台与薄弱分析表
            'analysis_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return self.analysis_results

# 全局分析器实例
analyzer = GEOAnalyzer()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': '没有选择文件'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': '没有选择文件'})
    
    if file and file.filename.lower().endswith(('.xlsx', '.csv')):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # 加载数据
        success, message = analyzer.load_excel_data(file_path)
        
        if success:
            # 运行分析
            global analysis_results
            analysis_results = analyzer.run_full_analysis()
            
            return jsonify({
                'success': True, 
                'message': '文件上传并分析成功',
                'redirect': '/analysis'
            })
        else:
            return jsonify({'success': False, 'message': message})
    
    return jsonify({'success': False, 'message': '不支持的文件格式'})

@app.route('/analysis')
def analysis():
    if not analysis_results:
        return redirect(url_for('index'))
    return render_template('analysis.html', results=analysis_results)

@app.route('/api/analysis-data')
def get_analysis_data():
    return jsonify(analysis_results)

@app.route('/export/excel')
def export_excel():
    """导出分析结果为Excel文件"""
    if not analysis_results:
        return jsonify({'success': False, 'message': '没有可导出的分析结果'})
    
    try:
        # 创建Excel文件在内存中
        output = io.BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # 1. 薄弱组合分析表
            if 'weak_combinations' in analysis_results and analysis_results['weak_combinations']:
                weak_df = pd.DataFrame(analysis_results['weak_combinations'])
                weak_df.to_excel(writer, sheet_name='薄弱组合分析', index=False)
            
            # 2. 蓝海关键词优先级排序表
            if 'sorted_keywords' in analysis_results and analysis_results['sorted_keywords']:
                keywords_data = []
                for keyword, count in analysis_results['sorted_keywords']:
                    stats = analysis_results['keyword_stats'][keyword]
                    keywords_data.append({
                        '关键词': keyword,
                        '薄弱AI平台数量': count,
                        '优先级': '高' if count >= 4 else ('中' if count >= 2 else '低')
                    })
                keywords_df = pd.DataFrame(keywords_data)
                keywords_df.to_excel(writer, sheet_name='蓝海关键词优先级', index=False)
            
            # 3. 蓝海关键词组合详情表
            if 'blue_ocean_combinations' in analysis_results and analysis_results['blue_ocean_combinations']:
                blue_ocean_df = pd.DataFrame(analysis_results['blue_ocean_combinations'])
                blue_ocean_df.to_excel(writer, sheet_name='蓝海关键词组合', index=False)
            
            # 4. 优秀信源平台表（去重）
            if 'excellent_sources' in analysis_results and analysis_results['excellent_sources']:
                excellent_df = pd.DataFrame(analysis_results['excellent_sources'])
                # 按关键词、AI平台、信源平台名称去重，保留第一条记录
                excellent_df = excellent_df.drop_duplicates(subset=['关键词', 'AI平台', '信源平台名称'], keep='first')
                excellent_df.to_excel(writer, sheet_name='优秀信源平台', index=False)
            
            # 5. 信源平台薄弱分析表（去重）
            if 'source_analysis' in analysis_results and analysis_results['source_analysis']:
                source_df = pd.DataFrame(analysis_results['source_analysis'])
                # 按关键词、AI平台、信源平台名称去重，保留第一条记录
                source_df = source_df.drop_duplicates(subset=['关键词', 'AI平台', '信源平台名称'], keep='first')
                source_df.to_excel(writer, sheet_name='信源平台薄弱分析', index=False)
            
            # 6. 竞品分析表
            if 'competitors' in analysis_results and analysis_results['competitors']:
                competitors_data = []
                for i, competitor in enumerate(analysis_results['competitors'], 1):
                    competitors_data.append({
                        '序号': i,
                        '竞品名称': competitor,
                        '类型': '识别竞品'
                    })
                competitors_df = pd.DataFrame(competitors_data)
                competitors_df.to_excel(writer, sheet_name='竞品分析', index=False)
            
            # 7. 分析概览表
            summary_data = [{
                '分析项目': '客户名称',
                '结果': analysis_results.get('client_name', '未识别')
            }, {
                '分析项目': '竞品总数',
                '结果': len(analysis_results.get('competitors', []))
            }, {
                '分析项目': '薄弱组合数量',
                '结果': analysis_results.get('weak_combinations_count', 0)
            }, {
                '分析项目': '蓝海机会数量',
                '结果': analysis_results.get('blue_ocean_count', 0)
            }, {
                '分析项目': '分析时间',
                '结果': analysis_results.get('analysis_time', '')
            }]
            summary_df = pd.DataFrame(summary_data)
            summary_df.to_excel(writer, sheet_name='分析概览', index=False)
        
        output.seek(0)
        
        # 生成文件名
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        client_name = analysis_results.get('client_name', '客户')
        filename = f'GEO分析报告_{client_name}_{timestamp}.xlsx'
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'导出失败: {str(e)}'})

@app.route('/export/json')
def export_json():
    """导出分析结果为JSON文件"""
    if not analysis_results:
        return jsonify({'success': False, 'message': '没有可导出的分析结果'})
    
    try:
        # 创建JSON文件在内存中
        output = io.BytesIO()
        json_data = json.dumps(analysis_results, ensure_ascii=False, indent=2)
        output.write(json_data.encode('utf-8'))
        output.seek(0)
        
        # 生成文件名
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        client_name = analysis_results.get('client_name', '客户')
        filename = f'GEO分析数据_{client_name}_{timestamp}.json'
        
        return send_file(
            output,
            mimetype='application/json',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'导出失败: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)