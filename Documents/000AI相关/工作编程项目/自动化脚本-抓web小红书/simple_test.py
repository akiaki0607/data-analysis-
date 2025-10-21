#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书采集工具简单测试
"""

import asyncio
import sys
import os
sys.path.append('src')

from playwright.async_api import async_playwright

async def test_xiaohongshu_basic():
    """基础小红书访问测试"""
    print("🧪 开始基础小红书访问测试...")
    
    playwright = None
    browser = None
    
    try:
        # 初始化playwright
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=False)  # 显示浏览器
        
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        
        page = await context.new_page()
        
        print("✅ 浏览器启动成功")
        
        # 测试访问小红书
        print("🔄 尝试访问小红书...")
        await page.goto("https://www.xiaohongshu.com/explore", timeout=60000)
        
        # 等待页面加载
        await page.wait_for_load_state('networkidle', timeout=30000)
        
        title = await page.title()
        print(f"✅ 成功访问小红书！页面标题: {title}")
        
        # 查找搜索框
        search_selectors = [
            'input[placeholder*="搜索"]',
            'input[placeholder*="search"]',
            'input[class*="search"]',
            'input[data-testid*="search"]',
            '.search-input input',
            '.search-bar input',
            '#search-input',
            'input[type="search"]'
        ]
        
        search_input = None
        found_selector = None
        
        for selector in search_selectors:
            try:
                search_input = await page.query_selector(selector)
                if search_input:
                    found_selector = selector
                    break
            except:
                continue
        
        if search_input:
            print(f"✅ 找到搜索框: {found_selector}")
            
            # 测试输入
            await search_input.click()
            await search_input.fill("测试")
            print("✅ 成功在搜索框输入文字")
            
            # 等待一下看是否有联想词
            await asyncio.sleep(3)
            
            # 截图
            screenshot_path = "test_screenshot.png"
            await page.screenshot(path=screenshot_path)
            print(f"✅ 截图保存: {screenshot_path}")
            
        else:
            print("⚠️  未找到搜索框，但页面访问正常")
        
        print("\n🎉 基础测试完成！程序可以正常访问小红书")
        
        # 等待5秒让用户观察
        print("等待5秒后关闭浏览器...")
        await asyncio.sleep(5)
        
        return True
        
    except Exception as e:
        print(f"❌ 测试失败: {str(e)}")
        return False
        
    finally:
        if browser:
            await browser.close()
        if playwright:
            await playwright.stop()

async def main():
    print("🚀 小红书采集工具 - 简单测试")
    print("=" * 50)
    
    success = await test_xiaohongshu_basic()
    
    if success:
        print("\n✅ 测试成功！程序可以正常运行")
        print("📝 接下来可以:")
        print("   1. 准备关键词CSV文件放在 data/input/ 目录")
        print("   2. 运行: ./run_xiaohongshu_scraper.sh")
        print("   3. 或运行: python3 src/smart_xiaohongshu_scraper.py --input data/input/keywords_xiaohongshu_test.csv --outdir data/output --shots screenshots --headful")
    else:
        print("\n❌ 测试失败，请检查:")
        print("   1. 网络连接是否正常")
        print("   2. 是否能访问 https://www.xiaohongshu.com/explore")
        print("   3. playwright是否正确安装")

if __name__ == '__main__':
    asyncio.run(main())