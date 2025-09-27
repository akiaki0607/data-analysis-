#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查竞品数据脚本
"""

from app import GEOAnalyzer
import os

def check_competitors():
    analyzer = GEOAnalyzer()
    
    # 查找测试数据文件
    test_file = None
    if os.path.exists('uploads'):
        for file in os.listdir('uploads'):
            if file.endswith('.xlsx'):
                test_file = os.path.join('uploads', file)
                break
    
    if not test_file:
        print("未找到测试数据文件")
        return
    
    print(f"使用测试文件: {test_file}")
    
    # 加载数据
    success, message = analyzer.load_excel_data(test_file)
    
    if success:
        print(f"数据加载成功: {message}")
        print(f"客户名称: {analyzer.client_name}")
        print(f"竞品数量: {len(analyzer.competitors)}")
        print("竞品列表:")
        for i, comp in enumerate(analyzer.competitors, 1):
            print(f"  {i}. {comp} (类型: {type(comp)})")
        
        # 运行完整分析
        results = analyzer.run_full_analysis()
        print(f"\n分析结果中的竞品数量: {len(results['competitors'])}")
        print("分析结果中的竞品列表:")
        for i, comp in enumerate(results['competitors'], 1):
            print(f"  {i}. {comp} (类型: {type(comp)})")
            
    else:
        print(f"数据加载失败: {message}")

if __name__ == "__main__":
    check_competitors()