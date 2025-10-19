#!/usr/bin/env python3
"""
测试LLM返回的Schema
"""
import sys
sys.path.insert(0, 'backend')

from llm_analyzer import LLMStructureAnalyzer
import json

# 初始化LLM分析器
API_KEY = 'sk-fUd1HtvOju1px6OYCfDJCrj9i6LrrIesWxeKW2ikg0CHSkXy'
API_URL = 'https://api.tu-zi.com'

analyzer = LLMStructureAnalyzer(API_KEY, API_URL)

# 分析Excel文件
excel_file = '待处理数据_副本/取3sheet2025105思迈特_测试少量样本.xlsx'
print(f"正在分析文件: {excel_file}")
print("=" * 60)

schema = analyzer.analyze_excel_structure(excel_file)

print("\n=== LLM返回的Schema ===")
print(json.dumps(schema, ensure_ascii=False, indent=2))

print("\n=== Schema键列表 ===")
for key in schema.keys():
    print(f"  - {key}")
    if key.startswith('sheet_'):
        sheet_schema = schema[key]
        print(f"    类型: {sheet_schema.get('type')}")
        if 'columns' in sheet_schema:
            print(f"    列数: {len(sheet_schema.get('columns', []))}")

