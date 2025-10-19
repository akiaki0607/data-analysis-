"""
调试脚本 - 查看Excel文件结构
"""

import os
import pandas as pd


def inspect_excel():
    """检查Excel文件结构"""
    test_file = os.path.join(
        os.path.dirname(__file__), 
        '../待处理数据_副本/取3sheet参考样例.xlsx'
    )
    
    if not os.path.exists(test_file):
        test_file = os.path.join(
            os.path.dirname(__file__), 
            '../待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx'
        )
    
    print(f"检查文件: {test_file}")
    print("=" * 80)
    print()
    
    xl_file = pd.ExcelFile(test_file)
    
    for sheet_name in xl_file.sheet_names:
        print(f"Sheet: {sheet_name}")
        print("-" * 80)
        
        # 读取前5行
        df = pd.read_excel(test_file, sheet_name=sheet_name, nrows=5, header=None)
        
        print(f"维度: {df.shape}")
        print()
        print("前5行数据:")
        print(df.to_string())
        print()
        
        # 如果是关键词Sheet，查看列名
        if '关键词' in sheet_name:
            print("尝试读取表头:")
            df_with_header = pd.read_excel(test_file, sheet_name=sheet_name, nrows=3)
            print(f"列名: {list(df_with_header.columns)}")
            print()
            print("前3行数据:")
            print(df_with_header.to_string())
        
        print()
        print("=" * 80)
        print()


if __name__ == '__main__':
    inspect_excel()

