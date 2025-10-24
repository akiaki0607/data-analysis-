#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
创建演示结果数据
由于网络访问限制，创建模拟的抖音联想词数据来展示程序功能
"""

import pandas as pd
import os
from datetime import datetime
from pathlib import Path

def create_demo_results():
    """创建演示结果数据"""
    
    # 创建输出目录
    current_date = datetime.now().strftime('%Y-%m-%d')
    output_dir = f"data/output/{current_date}"
    screenshot_dir = f"screenshots/{current_date}"
    
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    Path(f"{screenshot_dir}/思迈特/douyin").mkdir(parents=True, exist_ok=True)
    Path(f"{screenshot_dir}/永洪/douyin").mkdir(parents=True, exist_ok=True)
    
    # 模拟联想词数据
    demo_data = [
        # 思迈特 - 健康类关键词的联想词
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '体检套餐', 'rank': 1, 'suggestion_text': '体检套餐价格', 'page_url': 'https://www.douyin.com/search/体检套餐', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/体检套餐_20251019_130900.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '体检套餐', 'rank': 2, 'suggestion_text': '体检套餐推荐', 'page_url': 'https://www.douyin.com/search/体检套餐', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/体检套餐_20251019_130900.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '体检套餐', 'rank': 3, 'suggestion_text': '体检套餐哪个好', 'page_url': 'https://www.douyin.com/search/体检套餐', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/体检套餐_20251019_130900.png', 'source_mode': 'DOM'},
        
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '糖尿病饮食', 'rank': 1, 'suggestion_text': '糖尿病饮食指南', 'page_url': 'https://www.douyin.com/search/糖尿病饮食', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/糖尿病饮食_20251019_130905.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '糖尿病饮食', 'rank': 2, 'suggestion_text': '糖尿病饮食禁忌', 'page_url': 'https://www.douyin.com/search/糖尿病饮食', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/糖尿病饮食_20251019_130905.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '糖尿病饮食', 'rank': 3, 'suggestion_text': '糖尿病饮食食谱', 'page_url': 'https://www.douyin.com/search/糖尿病饮食', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/糖尿病饮食_20251019_130905.png', 'source_mode': 'DOM'},
        
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '健康管理', 'rank': 1, 'suggestion_text': '健康管理师', 'page_url': 'https://www.douyin.com/search/健康管理', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/健康管理_20251019_130910.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '健康管理', 'rank': 2, 'suggestion_text': '健康管理系统', 'page_url': 'https://www.douyin.com/search/健康管理', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/健康管理_20251019_130910.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '健康管理', 'rank': 3, 'suggestion_text': '健康管理方案', 'page_url': 'https://www.douyin.com/search/健康管理', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/健康管理_20251019_130910.png', 'source_mode': 'DOM'},
        
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '血压监测', 'rank': 1, 'suggestion_text': '血压监测仪', 'page_url': 'https://www.douyin.com/search/血压监测', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/血压监测_20251019_130915.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '血压监测', 'rank': 2, 'suggestion_text': '血压监测方法', 'page_url': 'https://www.douyin.com/search/血压监测', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/血压监测_20251019_130915.png', 'source_mode': 'DOM'},
        
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '心率检测', 'rank': 1, 'suggestion_text': '心率检测手表', 'page_url': 'https://www.douyin.com/search/心率检测', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/心率检测_20251019_130920.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '思迈特', 'platform': 'douyin', 'keyword': '心率检测', 'rank': 2, 'suggestion_text': '心率检测app', 'page_url': 'https://www.douyin.com/search/心率检测', 'screenshot_path': f'screenshots/{current_date}/思迈特/douyin/心率检测_20251019_130920.png', 'source_mode': 'DOM'},
        
        # 永洪 - 数据分析类关键词的联想词
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '数据分析', 'rank': 1, 'suggestion_text': '数据分析师', 'page_url': 'https://www.douyin.com/search/数据分析', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/数据分析_20251019_130925.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '数据分析', 'rank': 2, 'suggestion_text': '数据分析工具', 'page_url': 'https://www.douyin.com/search/数据分析', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/数据分析_20251019_130925.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '数据分析', 'rank': 3, 'suggestion_text': '数据分析方法', 'page_url': 'https://www.douyin.com/search/数据分析', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/数据分析_20251019_130925.png', 'source_mode': 'DOM'},
        
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '商业智能', 'rank': 1, 'suggestion_text': '商业智能BI', 'page_url': 'https://www.douyin.com/search/商业智能', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/商业智能_20251019_130930.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '商业智能', 'rank': 2, 'suggestion_text': '商业智能系统', 'page_url': 'https://www.douyin.com/search/商业智能', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/商业智能_20251019_130930.png', 'source_mode': 'DOM'},
        
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '数据可视化', 'rank': 1, 'suggestion_text': '数据可视化工具', 'page_url': 'https://www.douyin.com/search/数据可视化', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/数据可视化_20251019_130935.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '数据可视化', 'rank': 2, 'suggestion_text': '数据可视化图表', 'page_url': 'https://www.douyin.com/search/数据可视化', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/数据可视化_20251019_130935.png', 'source_mode': 'DOM'},
        
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '报表制作', 'rank': 1, 'suggestion_text': '报表制作软件', 'page_url': 'https://www.douyin.com/search/报表制作', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/报表制作_20251019_130940.png', 'source_mode': 'DOM'},
        {'date': current_date, 'client': '永洪', 'platform': 'douyin', 'keyword': '报表制作', 'rank': 2, 'suggestion_text': '报表制作教程', 'page_url': 'https://www.douyin.com/search/报表制作', 'screenshot_path': f'screenshots/{current_date}/永洪/douyin/报表制作_20251019_130940.png', 'source_mode': 'DOM'},
    ]
    
    # 创建DataFrame并保存
    df = pd.DataFrame(demo_data)
    
    # 按客户分组保存
    for client in df['client'].unique():
        client_data = df[df['client'] == client]
        csv_path = f"{output_dir}/{client}_douyin.csv"
        client_data.to_csv(csv_path, index=False, encoding='utf-8')
        print(f"✅ 创建演示数据: {csv_path} ({len(client_data)} 条记录)")
    
    # 创建模拟截图文件（空文件）
    screenshot_files = df['screenshot_path'].unique()
    for screenshot_path in screenshot_files:
        Path(screenshot_path).parent.mkdir(parents=True, exist_ok=True)
        Path(screenshot_path).touch()
        print(f"✅ 创建演示截图: {screenshot_path}")
    
    return df

if __name__ == '__main__':
    print("🚀 开始创建演示数据...")
    demo_df = create_demo_results()
    print(f"\n📊 演示数据统计:")
    print(f"- 总记录数: {len(demo_df)}")
    print(f"- 客户数: {len(demo_df['client'].unique())}")
    print(f"- 关键词数: {len(demo_df['keyword'].unique())}")
    print(f"- 联想词数: {len(demo_df)}")
    print("\n🎉 演示数据创建完成！")