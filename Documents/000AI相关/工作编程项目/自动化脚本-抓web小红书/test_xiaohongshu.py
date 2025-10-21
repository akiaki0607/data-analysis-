#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书采集工具测试脚本
"""

import asyncio
import os
import sys
from pathlib import Path

# 添加src目录到路径
sys.path.append('src')

from smart_xiaohongshu_scraper import SmartXiaohongshuScraper

async def test_xiaohongshu_access():
    """测试小红书访问"""
    print("🧪 开始测试小红书访问...")
    
    scraper = SmartXiaohongshuScraper(headful=True)
    
    try:
        # 初始化浏览器
        success = await scraper.init_browser()
        if not success:
            print("❌ 浏览器初始化失败")
            return False
        
        # 尝试访问小红书
        success = await scraper.try_access_xiaohongshu()
        if success:
            print("✅ 小红书访问成功！")
            
            # 测试搜索功能
            print("\n🔍 测试搜索功能...")
            suggestions, screenshot = await scraper.search_and_extract("测试关键词")
            
            if suggestions:
                print(f"✅ 搜索测试成功，获得 {len(suggestions)} 个联想词:")
                for i, suggestion in enumerate(suggestions, 1):
                    print(f"   {i}. {suggestion}")
            else:
                print("⚠️  搜索测试未获得联想词，但程序运行正常")
            
            return True
        else:
            print("❌ 小红书访问失败")
            return False
            
    except Exception as e:
        print(f"❌ 测试过程出错: {str(e)}")
        return False
    finally:
        await scraper.close_browser()

async def test_config_loading():
    """测试配置加载"""
    print("\n📋 测试配置文件加载...")
    
    try:
        scraper = SmartXiaohongshuScraper()
        config = scraper.config
        
        if 'xiaohongshu' in config:
            print("✅ 配置文件加载成功")
            print(f"   - 基础URL: {config['xiaohongshu']['base_url']}")
            print(f"   - 页面加载超时: {config['xiaohongshu']['timeouts']['page_load']}ms")
            return True
        else:
            print("❌ 配置文件格式错误")
            return False
            
    except Exception as e:
        print(f"❌ 配置加载失败: {str(e)}")
        return False

def test_input_file():
    """测试输入文件"""
    print("\n📁 检查输入文件...")
    
    input_files = [
        "data/input/keywords.csv",
        "data/input/keywords_优贝.csv"
    ]
    
    found_files = []
    for file_path in input_files:
        if os.path.exists(file_path):
            found_files.append(file_path)
            print(f"✅ 找到输入文件: {file_path}")
    
    if found_files:
        # 读取第一个文件检查格式
        try:
            import pandas as pd
            df = pd.read_csv(found_files[0])
            
            required_columns = ['client', 'keyword']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                print(f"⚠️  输入文件缺少必要列: {missing_columns}")
                return False
            else:
                print(f"✅ 输入文件格式正确，包含 {len(df)} 行数据")
                return True
                
        except Exception as e:
            print(f"❌ 读取输入文件失败: {str(e)}")
            return False
    else:
        print("❌ 未找到任何输入文件")
        print("请在以下位置创建输入文件:")
        for file_path in input_files:
            print(f"   - {file_path}")
        return False

def test_directory_structure():
    """测试目录结构"""
    print("\n📂 检查目录结构...")
    
    required_dirs = [
        "config",
        "data/input", 
        "data/output",
        "screenshots",
        "src"
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"✅ {dir_path}")
        else:
            print(f"❌ {dir_path} (缺失)")
            all_exist = False
    
    return all_exist

async def main():
    """主测试函数"""
    print("🧪 小红书采集工具 - 系统测试")
    print("=" * 50)
    
    tests = [
        ("目录结构", test_directory_structure),
        ("配置文件", test_config_loading),
        ("输入文件", test_input_file),
    ]
    
    results = []
    
    # 运行同步测试
    for test_name, test_func in tests:
        print(f"\n🔍 {test_name}测试...")
        try:
            if asyncio.iscoroutinefunction(test_func):
                result = await test_func()
            else:
                result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name}测试异常: {str(e)}")
            results.append((test_name, False))
    
    # 询问是否进行浏览器测试
    print(f"\n{'='*50}")
    print("基础测试完成，结果:")
    for test_name, result in results:
        status = "✅ 通过" if result else "❌ 失败"
        print(f"   {test_name}: {status}")
    
    if all(result for _, result in results):
        print("\n🎉 所有基础测试通过！")
        
        # 询问是否进行浏览器测试
        response = input("\n是否进行浏览器访问测试? (y/N): ").strip().lower()
        if response in ['y', 'yes']:
            await test_xiaohongshu_access()
    else:
        print("\n⚠️  部分测试失败，请先解决基础问题再进行浏览器测试")
    
    print(f"\n{'='*50}")
    print("测试完成！")

if __name__ == '__main__':
    asyncio.run(main())