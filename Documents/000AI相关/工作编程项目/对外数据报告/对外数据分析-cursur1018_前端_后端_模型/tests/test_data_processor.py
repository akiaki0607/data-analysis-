"""
数据处理器单元测试
测试Python计算引擎的各项功能
"""

import pytest
import pandas as pd
import sys
from pathlib import Path

# 添加backend目录到路径
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

from data_processor import ExcelDataProcessor


class TestDataProcessor:
    """数据处理器基础测试"""
    
    @pytest.fixture
    def sample_schema(self):
        """示例Schema"""
        return {
            "file_info": {
                "total_sheets": 4,
                "identified_sheets": ["数据封面", "品牌核心指标", "AI平台的核心指标", "关键词数据分析"]
            },
            "sheet_数据封面": {
                "type": "metadata",
                "key_value_pairs": {
                    "客户名称": {"row": 2, "col": "B"},
                    "分析周期": {"row": 3, "col": "B"}
                }
            }
        }
    
    def test_processor_initialization(self, sample_schema):
        """测试处理器初始化"""
        test_file = Path(__file__).parent.parent / "待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx"
        
        if not test_file.exists():
            pytest.skip("测试文件不存在")
        
        processor = ExcelDataProcessor(sample_schema, str(test_file))
        assert processor.schema == sample_schema
        assert processor.excel_file_path == str(test_file)
        print("✅ 数据处理器初始化测试通过")
    
    def test_col_letter_to_index(self, sample_schema):
        """测试列字母转索引"""
        test_file = "dummy.xlsx"
        processor = ExcelDataProcessor(sample_schema, test_file)
        
        # 测试常见列字母
        assert processor._col_letter_to_index('A') == 0
        assert processor._col_letter_to_index('B') == 1
        assert processor._col_letter_to_index('Z') == 25
        assert processor._col_letter_to_index('AA') == 26
        assert processor._col_letter_to_index('AB') == 27
        
        print("✅ 列字母转索引测试通过")


class TestMetadataExtraction:
    """测试元数据提取"""
    
    @pytest.mark.skipif(
        not (Path(__file__).parent.parent / "待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx").exists(),
        reason="测试文件不存在"
    )
    def test_extract_metadata_from_real_file(self):
        """测试从真实文件提取元数据"""
        test_file = Path(__file__).parent.parent / "待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx"
        
        # 读取第一个sheet
        df = pd.read_excel(test_file, sheet_name='数据封面', header=None)
        
        # 验证基本结构
        assert len(df) > 0, "数据封面sheet为空"
        assert len(df.columns) >= 2, "数据封面列数不足"
        
        # 验证包含必要字段
        field_names = df.iloc[:, 0].tolist()
        assert '客户名称' in field_names, "缺少客户名称字段"
        
        print("✅ 元数据提取测试通过")


class TestDataCalculation:
    """测试数据计算功能"""
    
    def test_percentage_calculation(self):
        """测试百分比计算"""
        # 模拟数据
        test_data = pd.DataFrame({
            '品牌': ['品牌A', '品牌B', '品牌C'],
            '可见次数': [45, 35, 20],
            '总次数': [100, 100, 100]
        })
        
        # 计算百分比
        test_data['可见概率'] = (test_data['可见次数'] / test_data['总次数'] * 100).round(2)
        
        assert test_data['可见概率'].iloc[0] == 45.0
        assert test_data['可见概率'].iloc[1] == 35.0
        assert test_data['可见概率'].iloc[2] == 20.0
        
        print("✅ 百分比计算测试通过")
    
    def test_ranking_calculation(self):
        """测试排名计算"""
        test_data = pd.DataFrame({
            '品牌': ['品牌A', '品牌B', '品牌C'],
            '分数': [85, 92, 78]
        })
        
        # 计算排名（分数高的排名靠前）
        test_data['排名'] = test_data['分数'].rank(ascending=False, method='min').astype(int)
        
        assert test_data.loc[test_data['品牌'] == '品牌B', '排名'].iloc[0] == 1
        assert test_data.loc[test_data['品牌'] == '品牌A', '排名'].iloc[0] == 2
        assert test_data.loc[test_data['品牌'] == '品牌C', '排名'].iloc[0] == 3
        
        print("✅ 排名计算测试通过")


class TestDataValidation:
    """测试数据验证规则（需求3.5）"""
    
    def test_percentage_range(self):
        """测试百分比范围验证"""
        valid_percentages = [0, 25.5, 50, 75.8, 100]
        invalid_percentages = [-1, 100.1, 150]
        
        def is_valid_percentage(value):
            return 0 <= value <= 100
        
        for p in valid_percentages:
            assert is_valid_percentage(p), f"{p} 应该是有效百分比"
        
        for p in invalid_percentages:
            assert not is_valid_percentage(p), f"{p} 应该是无效百分比"
        
        print("✅ 百分比范围验证测试通过")
    
    def test_ranking_continuity(self):
        """测试排名连续性"""
        # 正确的排名
        valid_rankings = [1, 2, 3, 4, 5]
        # 不连续的排名
        invalid_rankings = [1, 2, 4, 5]
        
        def is_continuous_ranking(rankings):
            return rankings == list(range(1, len(rankings) + 1))
        
        assert is_continuous_ranking(valid_rankings), "排名应该连续"
        assert not is_continuous_ranking(invalid_rankings), "排名不应该有跳跃"
        
        print("✅ 排名连续性验证测试通过")


def run_processor_tests():
    """运行数据处理器测试"""
    print("\n" + "="*60)
    print("🧪 运行数据处理器测试")
    print("="*60 + "\n")
    
    exit_code = pytest.main([
        __file__,
        '-v',
        '--tb=short',
        '--color=yes',
        '-s',
    ])
    
    print("\n" + "="*60)
    if exit_code == 0:
        print("✅ 数据处理器测试通过！")
    else:
        print("❌ 数据处理器测试失败")
    print("="*60 + "\n")
    
    return exit_code


if __name__ == '__main__':
    run_processor_tests()

