"""
手动测试脚本 - 测试宽表转换功能
"""

import os
import sys
import time
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.llm_analyzer import LLMStructureAnalyzer
from backend.data_processor import ExcelDataProcessor


def load_api_key():
    """加载API密钥"""
    key_file = os.path.join(os.path.dirname(__file__), '..', 'model_key.md')
    try:
        with open(key_file, 'r') as f:
            content = f.read()
            for line in content.split('\n'):
                if 'sk-' in line:
                    return line.strip()
    except:
        return "test-key"


def test_wide_table_detection():
    """测试宽表检测"""
    print("=" * 80)
    print("测试1: 宽表格式检测")
    print("=" * 80)
    
    test_file = os.path.join(
        os.path.dirname(__file__), 
        '../待处理数据_副本/取3sheet参考样例.xlsx'
    )
    
    if not os.path.exists(test_file):
        test_file = os.path.join(
            os.path.dirname(__file__), 
            '../待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx'
        )
    
    print(f"测试文件: {test_file}")
    print()
    
    try:
        api_key = load_api_key()
        analyzer = LLMStructureAnalyzer(api_key, "https://api.deepseek.com")
        
        # 提取样本
        print("Step 1: 提取Excel样本数据...")
        samples = analyzer._extract_samples(test_file)
        print(f"✓ 成功提取 {len(samples)} 个Sheet的样本")
        print(f"  Sheet列表: {list(samples.keys())}")
        print()
        
        # 使用基础Schema（包含宽表检测）
        print("Step 2: 检测宽表格式...")
        schema = analyzer._create_basic_schema(samples)
        
        # 检查是否检测到宽表
        wide_table_found = False
        for key, sheet_schema in schema.items():
            if key.startswith('sheet_'):
                sheet_name = key.replace('sheet_', '')
                sheet_type = sheet_schema.get('type')
                
                print(f"  - Sheet '{sheet_name}': type = {sheet_type}")
                
                if sheet_type == 'wide_table':
                    wide_table_found = True
                    brand_blocks = sheet_schema.get('brand_blocks', [])
                    print(f"    ✓ 检测到宽表！包含 {len(brand_blocks)} 个品牌块")
                    
                    for block in brand_blocks[:3]:  # 只显示前3个
                        print(f"      - 品牌: {block['brand']} ({block['brand_type']}), "
                              f"{len(block['columns'])} 个指标列")
        
        print()
        if wide_table_found:
            print("✅ 测试通过: 成功检测到宽表格式")
            return True, schema
        else:
            print("⚠️ 测试结果: 未检测到宽表格式（可能是标准表）")
            return False, schema
            
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False, None


def test_wide_to_long_transform(schema):
    """测试宽表转长表"""
    print()
    print("=" * 80)
    print("测试2: 宽表转长表转换")
    print("=" * 80)
    
    test_file = os.path.join(
        os.path.dirname(__file__), 
        '../待处理数据_副本/取3sheet参考样例.xlsx'
    )
    
    if not os.path.exists(test_file):
        test_file = os.path.join(
            os.path.dirname(__file__), 
            '../待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx'
        )
    
    try:
        processor = ExcelDataProcessor(schema, test_file)
        
        # 查找宽表Sheet
        for key, sheet_schema in schema.items():
            if key.startswith('sheet_') and sheet_schema.get('type') == 'wide_table':
                sheet_name = key.replace('sheet_', '')
                
                print(f"Step 1: 转换宽表 '{sheet_name}'...")
                start = time.time()
                
                df_long = processor._transform_wide_to_long(sheet_name, sheet_schema)
                
                duration = time.time() - start
                
                if df_long is not None and not df_long.empty:
                    print(f"✓ 转换成功! 耗时: {duration:.2f}秒")
                    print(f"  - 原始宽表维度: (推测)")
                    print(f"  - 转换后长表维度: {df_long.shape[0]} 行 × {df_long.shape[1]} 列")
                    print(f"  - 列名: {list(df_long.columns)}")
                    print()
                    
                    # 显示数据样本
                    print("数据样本（前5行）:")
                    print(df_long.head().to_string())
                    print()
                    
                    # 统计信息
                    if '品牌' in df_long.columns:
                        brands = df_long['品牌'].unique()
                        print(f"✓ 包含品牌: {list(brands)}")
                    
                    if 'AI平台' in df_long.columns:
                        platforms = df_long['AI平台'].unique()
                        print(f"✓ 包含AI平台: {list(platforms)}")
                    
                    print()
                    print("✅ 测试通过: 宽表转换成功")
                    return True, df_long
                else:
                    print("❌ 测试失败: 转换结果为空")
                    return False, None
        
        print("⚠️ 未找到宽表数据")
        return False, None
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False, None


def test_keyword_ranking(df_long, processor):
    """测试关键词排名生成"""
    print()
    print("=" * 80)
    print("测试3: 关键词排名生成")
    print("=" * 80)
    
    try:
        print("Step 1: 基于长表生成关键词排名...")
        start = time.time()
        
        result = processor._extract_keyword_ranking_from_long_table(df_long)
        
        duration = time.time() - start
        
        if result and len(result) > 0:
            print(f"✓ 排名生成成功! 耗时: {duration:.2f}秒")
            print(f"  - AI平台数: {len(result)}")
            
            # 统计维度
            total_dimensions = 0
            total_keywords = 0
            
            for platform in list(result.keys())[:2]:  # 只显示前2个平台
                dimensions = result[platform]
                print(f"  - 平台 '{platform}': {len(dimensions)} 个分析维度")
                
                total_dimensions += len(dimensions)
                
                for dimension in list(dimensions.keys())[:2]:  # 只显示前2个维度
                    keywords = dimensions[dimension]
                    print(f"    * 维度 '{dimension}': {len(keywords)} 个关键词")
                    total_keywords += len(keywords)
                    
                    # 显示一个关键词的排名示例
                    if keywords:
                        sample_keyword = list(keywords.keys())[0]
                        rankings = keywords[sample_keyword]
                        print(f"      示例 '{sample_keyword}': {len(rankings)} 个品牌排名")
                        
                        for rank_key in list(rankings.keys())[:2]:
                            rank_info = rankings[rank_key]
                            print(f"        - {rank_key}: {rank_info['品牌']} = {rank_info['数值']}")
            
            print()
            print(f"✓ 总计: {len(result)} 个平台, {total_dimensions} 个维度")
            print()
            print("✅ 测试通过: 关键词排名生成成功")
            return True
        else:
            print("❌ 测试失败: 排名生成结果为空")
            return False
            
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """主函数"""
    print()
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 20 + "宽表转长表功能手动测试" + " " * 20 + "║")
    print("╚" + "=" * 78 + "╝")
    print()
    print(f"开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    results = []
    
    # 测试1: 宽表检测
    success, schema = test_wide_table_detection()
    results.append(("宽表格式检测", success))
    
    if not success or not schema:
        print()
        print("⚠️ 宽表检测未通过，后续测试跳过")
        return False
    
    # 测试2: 宽表转换
    success, df_long = test_wide_to_long_transform(schema)
    results.append(("宽表转长表转换", success))
    
    if not success or df_long is None:
        print()
        print("⚠️ 宽表转换未通过，后续测试跳过")
        return False
    
    # 测试3: 关键词排名
    test_file = os.path.join(
        os.path.dirname(__file__), 
        '../待处理数据_副本/取3sheet参考样例.xlsx'
    )
    if not os.path.exists(test_file):
        test_file = os.path.join(
            os.path.dirname(__file__), 
            '../待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx'
        )
    processor = ExcelDataProcessor(schema, test_file)
    success = test_keyword_ranking(df_long, processor)
    results.append(("关键词排名生成", success))
    
    # 打印总结
    print()
    print("=" * 80)
    print("测试总结")
    print("=" * 80)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    pass_rate = (passed / total * 100) if total > 0 else 0
    
    for test_name, success in results:
        status = "✅ 通过" if success else "❌ 失败"
        print(f"  {status}: {test_name}")
    
    print()
    print(f"通过率: {passed}/{total} ({pass_rate:.1f}%)")
    print("=" * 80)
    
    return pass_rate >= 80


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)

