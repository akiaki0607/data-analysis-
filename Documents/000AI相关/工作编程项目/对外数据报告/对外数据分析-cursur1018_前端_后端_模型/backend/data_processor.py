"""
Python计算引擎层
负责所有数值计算、聚合、排序、TopN计算
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any


class ExcelDataProcessor:
    def __init__(self, schema: Dict, excel_file_path: str):
        self.schema = schema
        self.excel_file_path = excel_file_path
        self.data = {}
    
    def process(self) -> Dict[str, Any]:
        """主处理流程（支持宽表转换）"""
        print("开始处理Excel数据...")
        
        try:
            # 1. 提取元数据
            self.data['metadata'] = self._extract_metadata()
            print("✓ 元数据提取完成")
            
            # 2. 提取品牌核心指标（整体）
            self.data['brand_metrics'] = self._extract_brand_metrics()
            print("✓ 品牌核心指标提取完成")
            
            # 3. 提取各AI平台指标
            self.data['platform_metrics'] = self._extract_platform_metrics()
            print("✓ AI平台指标提取完成")
            
            # 4. 提取关键词分析数据（支持宽表转换）
            keyword_result = self._extract_keyword_analysis()
            self.data['keyword_analysis'] = keyword_result.get('keyword_analysis', {})
            self.data['long_table_preview'] = keyword_result.get('long_table_preview', None)
            print("✓ 关键词分析数据提取完成")
            
            # 5. 数据校验
            self._validate_data()
            print("✓ 数据校验完成")
            
            return self.data
        except Exception as e:
            print(f"数据处理失败: {e}")
            raise
    
    def _extract_metadata(self) -> Dict:
        """提取数据封面元数据"""
        for key, sheet_schema in self.schema.items():
            if key.startswith('sheet_') and sheet_schema.get('type') == 'metadata':
                sheet_name = key.replace('sheet_', '')
                return self._extract_metadata_from_sheet(sheet_name, sheet_schema)
        return {}
    
    def _extract_metadata_from_sheet(self, sheet_name: str, sheet_schema: Dict) -> Dict:
        """从Sheet提取元数据"""
        try:
            df = pd.read_excel(self.excel_file_path, sheet_name=sheet_name, header=None)
            metadata = {}
            key_value_pairs = sheet_schema.get('key_value_pairs', {})
            
            for key, location in key_value_pairs.items():
                try:
                    row = location['row'] - 1
                    col = self._col_letter_to_index(location['col'])
                    value = df.iloc[row, col]
                    
                    # 处理AI平台列表
                    if 'AI平台' in key or 'Platform' in key.lower():
                        if isinstance(value, str):
                            value = [p.strip() for p in value.split(',') if p.strip()]
                    
                    # 处理竞品名称列表
                    if '竞品' in key:
                        if isinstance(value, str):
                            value = [p.strip() for p in value.split(',') if p.strip()]
                    
                    metadata[key] = value
                except Exception as e:
                    print(f"提取元数据字段 {key} 失败: {e}")
                    continue
            
            return metadata
        except Exception as e:
            print(f"提取元数据失败: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def _extract_brand_metrics(self) -> Dict:
        """提取品牌核心指标（整体聚合）"""
        for key, sheet_schema in self.schema.items():
            if key.startswith('sheet_') and sheet_schema.get('type') == 'table':
                # 检查是否包含AI平台列
                columns = sheet_schema.get('columns', [])
                has_platform = any('AI平台' in col.get('standard_name', '') for col in columns)
                
                if not has_platform:  # 这是整体品牌指标表
                    sheet_name = key.replace('sheet_', '')
                    return self._extract_metrics_from_sheet(sheet_name, sheet_schema)
        return {}
    
    def _extract_metrics_from_sheet(self, sheet_name: str, sheet_schema: Dict) -> Dict:
        """从Sheet提取指标数据"""
        try:
            header_row = sheet_schema.get('header_row', 1) - 1
            df = pd.read_excel(self.excel_file_path, sheet_name=sheet_name, header=header_row)
            
            # 字段映射
            column_mapping = self._build_column_mapping(sheet_schema.get('columns', []))
            df.rename(columns=column_mapping, inplace=True)
            
            # 数据清洗
            df = self._clean_dataframe(df)
            
            # 生成排名数据（按用户要求的顺序）
            metrics = {}
            metric_names = [
                '可见概率', '推荐概率',
                '选用信源平台占比', '选用信源文章占比', 
                'AI回答总数',
                'Top1占比', 'Top3占比', 'Top5占比', 'Top10占比',
                'Top1关键词数', 'Top3关键词数', 'Top5关键词数', 'Top10关键词数'
            ]
            
            for metric in metric_names:
                if metric in df.columns and '品牌' in df.columns:
                    sorted_df = df.sort_values(by=metric, ascending=False, na_position='last')
                    result = []
                    for idx, (_, row) in enumerate(sorted_df.iterrows(), 1):
                        result.append({
                            '品牌': row['品牌'],
                            metric: float(row[metric]) if pd.notna(row[metric]) else 0,
                            '排名': idx
                        })
                    metrics[metric] = result
            
            return metrics
        except Exception as e:
            print(f"提取指标数据失败: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def _extract_platform_metrics(self) -> Dict:
        """提取各AI平台的核心指标"""
        for key, sheet_schema in self.schema.items():
            if key.startswith('sheet_') and sheet_schema.get('type') == 'table':
                columns = sheet_schema.get('columns', [])
                has_platform = any('AI平台' in col.get('standard_name', '') for col in columns)
                
                if has_platform:  # 这是按平台拆分的表
                    sheet_name = key.replace('sheet_', '')
                    return self._extract_platform_metrics_from_sheet(sheet_name, sheet_schema)
        return {}
    
    def _extract_platform_metrics_from_sheet(self, sheet_name: str, sheet_schema: Dict) -> Dict:
        """从Sheet提取平台指标"""
        try:
            header_row = sheet_schema.get('header_row', 1) - 1
            df = pd.read_excel(self.excel_file_path, sheet_name=sheet_name, header=header_row)
            
            # 字段映射
            column_mapping = self._build_column_mapping(sheet_schema.get('columns', []))
            df.rename(columns=column_mapping, inplace=True)
            
            # 数据清洗
            df = self._clean_dataframe(df)
            
            if 'AI平台' not in df.columns:
                return {}
            
            # 按AI平台分组
            platforms = df['AI平台'].unique()
            platform_data = {}
            
            metric_names = ['可见概率', '推荐概率', 'Top1占比', 'Top3占比', 'Top5占比', 'Top10占比',
                          'Top1关键词数', 'Top3关键词数', 'Top5关键词数', 'Top10关键词数']
            
            for platform in platforms:
                if pd.isna(platform):
                    continue
                
                platform_df = df[df['AI平台'] == platform].copy()
                platform_metrics = {}
                
                for metric in metric_names:
                    if metric in platform_df.columns and '品牌' in platform_df.columns:
                        sorted_df = platform_df.sort_values(by=metric, ascending=False, na_position='last')
                        result = []
                        for idx, (_, row) in enumerate(sorted_df.iterrows(), 1):
                            result.append({
                                '品牌': row['品牌'],
                                metric: float(row[metric]) if pd.notna(row[metric]) else 0,
                                '排名': idx
                            })
                        platform_metrics[metric] = result
                
                platform_data[str(platform)] = platform_metrics
            
            return platform_data
        except Exception as e:
            print(f"提取平台指标失败: {e}")
            return {}
    
    def _extract_keyword_analysis(self) -> Dict:
        """提取关键词分析数据（支持宽表转换）"""
        # 尝试找到关键词Sheet
        for key, sheet_schema in self.schema.items():
            if key.startswith('sheet_'):
                sheet_name = key.replace('sheet_', '')
                # 检查是否是关键词相关的Sheet
                if '关键词' in sheet_name or 'keyword' in sheet_name.lower():
                    sheet_type = sheet_schema.get('type')
                    print(f"找到关键词Sheet: {sheet_name}, 类型: {sheet_type}")
                    
                    # 检查是否为宽表格式
                    if sheet_type == 'wide_table':
                        print("检测到宽表格式，开始转换...")
                        # 执行宽表→长表转换
                        df_long = self._transform_wide_to_long(sheet_name, sheet_schema)
                        
                        if df_long is not None and not df_long.empty:
                            # 生成长表预览
                            long_table_preview = {
                                'shape': list(df_long.shape),
                                'columns': list(df_long.columns),
                                'data': df_long.head(100).to_dict('records')
                            }
                            
                            # 基于长表生成关键词排名
                            keyword_analysis = self._extract_keyword_ranking_from_long_table(df_long)
                            
                            return {
                                'keyword_analysis': keyword_analysis,
                                'long_table_preview': long_table_preview
                            }
                    
                    # 标准表格处理
                    elif sheet_type in ['multi_dimension_table', 'table']:
                        keyword_data = self._extract_keyword_from_sheet(sheet_name, sheet_schema)
                        return {
                            'keyword_analysis': keyword_data,
                            'long_table_preview': None
                        }
        
        print("未找到关键词Sheet")
        return {
            'keyword_analysis': {},
            'long_table_preview': None
        }
    
    def _extract_keyword_from_sheet(self, sheet_name: str, sheet_schema: Dict) -> Dict:
        """从Sheet提取关键词数据"""
        try:
            header_row = sheet_schema.get('header_row', 1) - 1
            df = pd.read_excel(self.excel_file_path, sheet_name=sheet_name, header=header_row)
            
            # 字段映射
            column_mapping = self._build_column_mapping(sheet_schema.get('columns', []))
            df.rename(columns=column_mapping, inplace=True)
            
            # 数据清洗
            df = self._clean_dataframe(df)
            
            print(f"关键词Sheet列名: {list(df.columns)}")
            
            keyword_data = {}
            
            # 检查必要字段（使用更灵活的匹配）
            required_fields = {
                'platform': ['AI平台', '平台', 'platform'],
                'dimension': ['分析维度', '维度', 'dimension', '指标'],
                'keyword': ['关键词', 'keyword'],
                'rank': ['排名', 'rank', 'ranking'],
                'brand': ['品牌', 'brand'],
                'value': ['数值', 'value', '值']
            }
            
            # 查找实际列名
            actual_cols = {}
            for field, possible_names in required_fields.items():
                for name in possible_names:
                    if name in df.columns:
                        actual_cols[field] = name
                        break
            
            missing_fields = set(required_fields.keys()) - set(actual_cols.keys())
            if missing_fields:
                print(f"关键词表缺少必要字段: {missing_fields}, 可用列: {list(df.columns)}")
                return {}
            
            # 按AI平台和分析维度分组
            for platform in df[actual_cols['platform']].unique():
                if pd.isna(platform):
                    continue
                
                platform_df = df[df[actual_cols['platform']] == platform]
                platform_data = {}
                
                for dimension in platform_df[actual_cols['dimension']].unique():
                    if pd.isna(dimension):
                        continue
                    
                    dimension_df = platform_df[platform_df[actual_cols['dimension']] == dimension]
                    matrix = {}
                    
                    for _, row in dimension_df.iterrows():
                        keyword = str(row[actual_cols['keyword']]) if pd.notna(row[actual_cols['keyword']]) else ''
                        ranking = int(row[actual_cols['rank']]) if pd.notna(row[actual_cols['rank']]) else 0
                        brand = str(row[actual_cols['brand']]) if pd.notna(row[actual_cols['brand']]) else ''
                        value = float(row[actual_cols['value']]) if pd.notna(row[actual_cols['value']]) else 0
                        
                        if keyword and ranking > 0:
                            if keyword not in matrix:
                                matrix[keyword] = {}
                            matrix[keyword][f'排名{ranking}'] = {
                                '品牌': brand,
                                '数值': value
                            }
                    
                    if matrix:  # 只添加非空的维度数据
                        platform_data[str(dimension)] = matrix
                
                if platform_data:  # 只添加非空的平台数据
                    keyword_data[str(platform)] = platform_data
            
            print(f"提取到关键词数据: {len(keyword_data)} 个平台")
            return keyword_data
        except Exception as e:
            print(f"提取关键词数据失败: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def _clean_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """数据清洗"""
        # 删除全空行
        df.dropna(how='all', inplace=True)
        
        # 处理字符串格式的百分比（如"9.76%"）
        for col in df.columns:
            if df[col].dtype == 'object':  # 字符串类型
                # 尝试转换带%的字符串
                def convert_percentage(val):
                    if pd.isna(val):
                        return val
                    if isinstance(val, str) and '%' in val:
                        try:
                            # 去掉%符号，转换为float
                            return float(val.replace('%', '').strip())
                        except:
                            return val
                    return val
                
                df[col] = df[col].apply(convert_percentage)
                
                # 尝试转换为数值类型
                try:
                    df[col] = pd.to_numeric(df[col], errors='ignore')
                except:
                    pass
        
        # 处理小数格式的百分比（如果是0-1范围，转换为0-100）
        for col in df.select_dtypes(include=[np.number]).columns:
            if df[col].notna().any():
                max_val = df[col].max()
                if 0 < max_val <= 1:
                    df[col] = df[col] * 100
        
        return df
    
    def _build_column_mapping(self, columns_schema: List[Dict]) -> Dict:
        """构建字段映射表"""
        mapping = {}
        for col_info in columns_schema:
            excel_name = col_info.get('excel_name', '')
            standard_name = col_info.get('standard_name', excel_name)
            if excel_name:
                mapping[excel_name] = standard_name
        return mapping
    
    def _col_letter_to_index(self, col_letter: str) -> int:
        """Excel列字母转索引（A=0, B=1, ...）"""
        index = 0
        for char in col_letter:
            index = index * 26 + (ord(char.upper()) - ord('A') + 1)
        return index - 1
    
    def _validate_data(self):
        """数据校验"""
        # TODO: 实现数据校验逻辑
        pass
    
    def _transform_wide_to_long(self, sheet_name: str, sheet_schema: Dict) -> pd.DataFrame:
        """
        宽表转长表核心算法
        
        将宽表格式（多品牌列重复）转换为长表格式（标准化列）
        
        示例:
            输入（宽表）:
            关键词 | AI平台 | 移山科技_可见占比 | 移山科技_推荐占比 | 思迈特_可见占比 | ...
            
            输出（长表）:
            关键词 | AI平台 | 品牌 | 品牌类型 | 可见占比 | 推荐占比 | ...
        
        参数:
            sheet_name: Sheet名称
            sheet_schema: 包含brand_blocks的Schema
        
        返回:
            pd.DataFrame: 长表格式的DataFrame
        """
        try:
            header_row = sheet_schema.get('header_row', 1) - 1
            df_wide = pd.read_excel(
                self.excel_file_path, 
                sheet_name=sheet_name, 
                header=header_row
            )
            
            print(f"原始宽表维度: {df_wide.shape}")
            print(f"宽表列名样例: {list(df_wide.columns[:10])}")
            
            # 提取基础列
            base_columns = sheet_schema.get('base_columns', [])
            base_col_names = []
            base_standard_names = []
            
            for col in base_columns:
                excel_name = col.get('excel_name')
                standard_name = col.get('standard_name')
                # 查找实际列名（支持模糊匹配）
                actual_col = self._find_matching_column(df_wide.columns, excel_name)
                if actual_col:
                    base_col_names.append(actual_col)
                    base_standard_names.append(standard_name)
            
            if not base_col_names:
                print("错误：无法找到基础列")
                return pd.DataFrame()
            
            print(f"找到基础列: {base_col_names}")
            
            # 准备长表记录列表
            long_records = []
            
            # 遍历每一行
            for idx, row in df_wide.iterrows():
                # 提取基础信息
                base_info = {}
                for i, col_name in enumerate(base_col_names):
                    base_info[base_standard_names[i]] = row[col_name]
                
                # 遍历每个品牌块
                brand_blocks = sheet_schema.get('brand_blocks', [])
                for brand_block in brand_blocks:
                    record = base_info.copy()
                    record['品牌'] = brand_block['brand']
                    record['品牌类型'] = brand_block.get('brand_type', '未知')
                    
                    # 提取该品牌的所有指标值
                    for col_info in brand_block['columns']:
                        excel_col_name = col_info['excel_name']
                        standard_name = col_info['standard_name']
                        
                        # 查找实际列名
                        actual_col = self._find_matching_column(df_wide.columns, excel_col_name)
                        if actual_col:
                            value = row[actual_col]
                            record[standard_name] = value
                        else:
                            record[standard_name] = None
                    
                    long_records.append(record)
            
            # 生成长表DataFrame
            df_long = pd.DataFrame(long_records)
            
            # 数据清洗
            df_long = self._clean_dataframe(df_long)
            
            print(f"转换后长表维度: {df_long.shape}")
            print(f"长表列名: {list(df_long.columns)}")
            print(f"长表前5行品牌分布: {df_long.head()['品牌'].tolist() if '品牌' in df_long.columns else []}")
            
            return df_long
            
        except Exception as e:
            print(f"宽表转长表失败: {e}")
            import traceback
            traceback.print_exc()
            return pd.DataFrame()
    
    def _find_matching_column(self, columns: List, target: str) -> str:
        """
        查找匹配的列名（支持模糊匹配）
        """
        if not target:
            return None
        
        target_lower = str(target).lower().strip()
        
        # 精确匹配
        for col in columns:
            if str(col).strip() == target:
                return col
        
        # 模糊匹配（包含关系）
        for col in columns:
            col_lower = str(col).lower().strip()
            if target_lower in col_lower or col_lower in target_lower:
                return col
        
        return None
    
    def _extract_keyword_ranking_from_long_table(self, df_long: pd.DataFrame) -> Dict:
        """
        从长表生成关键词排名矩阵（纯Python操作，不需要LLM）
        
        输出结构:
        {
            "DeepSeek": {
                "可见占比": {
                    "关键词A": {
                        "排名1": {"品牌": "思迈特", "数值": 70},
                        "排名2": {"品牌": "移山科技", "数值": 10}
                    }
                }
            }
        }
        
        参数:
            df_long: 长表格式的DataFrame
        
        返回:
            Dict: 关键词排名矩阵
        """
        try:
            print("开始基于长表生成关键词排名...")
            
            keyword_data = {}
            
            # 分析维度列表
            dimensions = [
                '可见占比', '推荐占比', 
                '信源平台占比', '信源文章占比',
                'Top1占比', 'Top3占比', 'Top5占比', 'Top10占比'
            ]
            
            # 检查必要列是否存在
            required_cols = ['AI平台', '关键词', '品牌']
            for col in required_cols:
                if col not in df_long.columns:
                    print(f"错误：长表缺少必要列 '{col}'")
                    return {}
            
            # 1. 按AI平台分组
            platforms = df_long['AI平台'].unique()
            print(f"找到 {len(platforms)} 个AI平台: {list(platforms)}")
            
            for platform in platforms:
                if pd.isna(platform):
                    continue
                
                platform_df = df_long[df_long['AI平台'] == platform].copy()
                platform_data = {}
                
                # 2. 按分析维度分组
                for dimension in dimensions:
                    if dimension not in df_long.columns:
                        continue
                    
                    dimension_data = {}
                    
                    # 3. 按关键词分组
                    keywords = platform_df['关键词'].unique()
                    
                    for keyword in keywords:
                        if pd.isna(keyword):
                            continue
                        
                        keyword_df = platform_df[platform_df['关键词'] == keyword].copy()
                        
                        # 4. 按当前维度值排序
                        keyword_df_sorted = keyword_df.sort_values(
                            by=dimension, 
                            ascending=False,
                            na_position='last'
                        )
                        
                        # 5. 生成排名字典
                        rankings = {}
                        for rank, (_, row) in enumerate(keyword_df_sorted.iterrows(), 1):
                            value = row[dimension]
                            brand = row['品牌']
                            
                            # 只添加有效数据
                            if pd.notna(value) and pd.notna(brand):
                                # 转换为标准数值类型
                                try:
                                    value_float = float(value)
                                    if value_float != 0:  # 跳过0值
                                        rankings[f'排名{rank}'] = {
                                            '品牌': str(brand),
                                            '数值': value_float
                                        }
                                except (ValueError, TypeError):
                                    pass
                        
                        if rankings:  # 只保存非空排名
                            dimension_data[str(keyword)] = rankings
                    
                    if dimension_data:
                        platform_data[dimension] = dimension_data
                        print(f"  - {platform} / {dimension}: {len(dimension_data)} 个关键词")
                
                if platform_data:
                    keyword_data[str(platform)] = platform_data
            
            print(f"✓ 关键词排名生成完成: {len(keyword_data)} 个平台")
            return keyword_data
            
        except Exception as e:
            print(f"生成关键词排名失败: {e}")
            import traceback
            traceback.print_exc()
            return {}

