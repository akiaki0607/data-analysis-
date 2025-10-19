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
        """主处理流程"""
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
            
            # 4. 提取关键词分析数据
            self.data['keyword_analysis'] = self._extract_keyword_analysis()
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
            
            # 生成排名数据
            metrics = {}
            metric_names = ['可见概率', '推荐概率', 'Top1占比', 'Top3占比', 'Top5占比', 'Top10占比',
                          'Top1关键词数', 'Top3关键词数', 'Top5关键词数', 'Top10关键词数']
            
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
        """提取关键词分析数据"""
        for key, sheet_schema in self.schema.items():
            if key.startswith('sheet_') and sheet_schema.get('type') == 'multi_dimension_table':
                sheet_name = key.replace('sheet_', '')
                return self._extract_keyword_from_sheet(sheet_name, sheet_schema)
        return {}
    
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
            
            keyword_data = {}
            
            required_cols = ['AI平台', '分析维度', '关键词', '排名', '品牌', '数值']
            if not all(col in df.columns for col in required_cols):
                print(f"关键词表缺少必要字段，需要: {required_cols}")
                return {}
            
            # 按AI平台和分析维度分组
            for platform in df['AI平台'].unique():
                if pd.isna(platform):
                    continue
                
                platform_df = df[df['AI平台'] == platform]
                platform_data = {}
                
                for dimension in platform_df['分析维度'].unique():
                    if pd.isna(dimension):
                        continue
                    
                    dimension_df = platform_df[platform_df['分析维度'] == dimension]
                    matrix = {}
                    
                    for _, row in dimension_df.iterrows():
                        keyword = str(row['关键词']) if pd.notna(row['关键词']) else ''
                        ranking = int(row['排名']) if pd.notna(row['排名']) else 0
                        brand = str(row['品牌']) if pd.notna(row['品牌']) else ''
                        value = float(row['数值']) if pd.notna(row['数值']) else 0
                        
                        if keyword and ranking > 0:
                            if keyword not in matrix:
                                matrix[keyword] = {}
                            matrix[keyword][f'排名{ranking}'] = {
                                '品牌': brand,
                                '数值': value
                            }
                    
                    platform_data[str(dimension)] = matrix
                
                keyword_data[str(platform)] = platform_data
            
            return keyword_data
        except Exception as e:
            print(f"提取关键词数据失败: {e}")
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

