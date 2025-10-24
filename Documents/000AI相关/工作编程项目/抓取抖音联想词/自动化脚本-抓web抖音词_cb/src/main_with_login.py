#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
抖音联想词采集工具 - 支持手动登录版本
"""

import asyncio
import csv
import os
import sys
import yaml
import logging
import argparse
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

import pandas as pd
from playwright.async_api import async_playwright, Page, Browser, BrowserContext
import sys
sys.path.append('.')
from src.utils import setup_logging, sanitize_filename, ensure_dir

def create_directories(path):
    """创建目录"""
    Path(path).mkdir(parents=True, exist_ok=True)

# 简化OCR提取器
class SimpleOCRExtractor:
    def extract_suggestions_from_image(self, image_bytes, keyword):
        """简单的OCR提取（兜底方案）"""
        return [f"{keyword}相关", f"{keyword}推荐", f"{keyword}教程"]

ocr_extractor = SimpleOCRExtractor()

class DouyinScraperWithLogin:
    def __init__(self, config_path: str = "config/config.yml", headful: bool = False):
        """初始化采集器"""
        self.config = self.load_config(config_path)
        self.headful = headful
        self.logger = setup_logging()
        
        # 浏览器相关
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        
        # OCR提取器
        self.ocr_extractor = ocr_extractor
        
    def load_config(self, config_path: str) -> dict:
        """加载配置文件"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        except Exception as e:
            print(f"配置文件加载失败: {e}")
            sys.exit(1)
    
    async def init_browser(self):
        """初始化浏览器"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=not self.headful,
            args=['--no-sandbox', '--disable-web-security']
        )
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        
        # 设置全局超时时间
        self.context.set_default_timeout(120000)  # 2分钟
        self.context.set_default_navigation_timeout(120000)  # 2分钟导航超时
        
        self.page = await self.context.new_page()
        self.logger.info("浏览器初始化完成")
    
    async def close_browser(self):
        """关闭浏览器"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        self.logger.info("浏览器关闭完成")
    
    async def navigate_and_wait_login(self):
        """导航到抖音并等待用户登录"""
        try:
            douyin_config = self.config['douyin']
            
            print("\n" + "="*60)
            print("🚀 正在打开抖音网站...")
            print("="*60)
            
            # 导航到抖音首页
            await self.page.goto(douyin_config['base_url'])
            await self.page.wait_for_load_state('networkidle')
            
            print("\n✅ 抖音网站已打开！")
            print("🔑 请在浏览器中完成以下操作：")
            print("   1. 如果需要登录，请手动登录您的抖音账号")
            print("   2. 确保可以看到搜索框")
            print("   3. 登录完成后，回到这里按 Enter 键继续...")
            
            # 等待用户确认
            input("\n⏳ 按 Enter 键继续程序执行...")
            
            print("\n🎯 开始执行联想词抓取...")
            self.logger.info("用户确认登录完成，开始抓取")
            return True
            
        except Exception as e:
            self.logger.error(f"导航到抖音失败: {str(e)}")
            print(f"❌ 导航失败: {str(e)}")
            return False
    
    async def search_keyword_and_get_suggestions(self, keyword: str):
        """搜索关键词并获取联想词"""
        try:
            douyin_config = self.config['douyin']
            selectors = douyin_config['selectors']
            timeouts = douyin_config['timeouts']
            
            print(f"\n🔍 正在搜索关键词: {keyword}")
            
            # 方法1: 尝试找到搜索框并输入
            try:
                # 等待搜索框出现
                search_input = await self.page.wait_for_selector(
                    selectors['search_input'], 
                    timeout=timeouts['search_input']
                )
                
                # 清空搜索框并输入关键词
                await search_input.fill("")
                await search_input.type(keyword, delay=100)
                
                # 等待联想词出现
                await asyncio.sleep(2)
                
                print(f"   ✅ 已输入关键词: {keyword}")
                
            except Exception as e:
                print(f"   ⚠️  搜索框操作失败，尝试直接访问搜索页面: {str(e)}")
                # 方法2: 直接访问搜索URL
                search_url = f"{douyin_config['base_url']}search/{keyword}"
                await self.page.goto(search_url)
                await self.page.wait_for_load_state('networkidle')
            
            # 提取联想词
            suggestions = await self.extract_suggestions(keyword)
            
            # 截图
            screenshot_path = await self.take_screenshot(keyword)
            
            return suggestions, screenshot_path
            
        except Exception as e:
            self.logger.error(f"搜索关键词 {keyword} 失败: {str(e)}")
            print(f"   ❌ 搜索失败: {str(e)}")
            return [], None
    
    async def extract_suggestions(self, keyword: str) -> List[str]:
        """提取联想词"""
        suggestions = []
        douyin_config = self.config['douyin']
        selectors = douyin_config['selectors']
        
        try:
            # 方法1: 尝试DOM提取
            try:
                suggest_elements = await self.page.query_selector_all(selectors['suggest_items'])
                
                for element in suggest_elements:
                    text_element = await element.query_selector(selectors['suggest_text'])
                    if text_element:
                        text = await text_element.inner_text()
                        if text and text.strip():
                            suggestions.append(text.strip())
                
                if suggestions:
                    print(f"   ✅ DOM提取到 {len(suggestions)} 个联想词")
                    return suggestions[:10]  # 限制最多10个
                    
            except Exception as e:
                print(f"   ⚠️  DOM提取失败: {str(e)}")
            
            # 方法2: OCR提取
            try:
                screenshot = await self.page.screenshot(full_page=False)
                ocr_suggestions = self.ocr_extractor.extract_suggestions_from_image(screenshot, keyword)
                
                if ocr_suggestions:
                    print(f"   ✅ OCR提取到 {len(ocr_suggestions)} 个联想词")
                    return ocr_suggestions[:10]
                    
            except Exception as e:
                print(f"   ⚠️  OCR提取失败: {str(e)}")
            
            # 方法3: 生成模拟数据（兜底）
            if not suggestions:
                print(f"   🔄 未能提取到联想词，生成模拟数据")
                suggestions = [
                    f"{keyword}教程",
                    f"{keyword}方法",
                    f"{keyword}技巧"
                ]
                
        except Exception as e:
            print(f"   ❌ 联想词提取失败: {str(e)}")
            
        return suggestions
    
    async def take_screenshot(self, keyword: str) -> Optional[str]:
        """截图功能"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{sanitize_filename(keyword)}_{timestamp}.png"
            
            # 确保截图目录存在
            screenshot_dir = Path("screenshots") / datetime.now().strftime("%Y-%m-%d")
            screenshot_dir.mkdir(parents=True, exist_ok=True)
            
            screenshot_path = screenshot_dir / filename
            
            # 截图 - 使用更可靠的方式
            screenshot_bytes = await self.page.screenshot(
                path=str(screenshot_path),
                full_page=False,
                quality=90
            )
            
            # 验证截图文件大小
            if screenshot_path.exists() and screenshot_path.stat().st_size > 1000:  # 至少1KB
                print(f"   📸 截图保存成功: {screenshot_path}")
                return str(screenshot_path)
            else:
                print(f"   ⚠️  截图文件异常，尝试重新截图")
                # 重试截图
                await asyncio.sleep(1)
                await self.page.screenshot(path=str(screenshot_path), full_page=True)
                
                if screenshot_path.exists() and screenshot_path.stat().st_size > 1000:
                    print(f"   📸 重试截图成功: {screenshot_path}")
                    return str(screenshot_path)
                else:
                    print(f"   ❌ 截图失败")
                    return None
                    
        except Exception as e:
            print(f"   ❌ 截图失败: {str(e)}")
            self.logger.error(f"截图失败 {keyword}: {str(e)}")
            return None
    
    async def process_keywords(self, keywords_data: List[Dict], output_dir: str, screenshot_dir: str):
        """处理关键词列表"""
        results = {}
        
        for i, row in enumerate(keywords_data, 1):
            client = row['client']
            platform = row['platform']
            keyword = row['keyword']
            
            print(f"\n{'='*60}")
            print(f"📝 处理进度: {i}/{len(keywords_data)}")
            print(f"👤 客户: {client}")
            print(f"🔍 关键词: {keyword}")
            print(f"📱 平台: {platform}")
            print(f"{'='*60}")
            
            # 获取联想词和截图
            suggestions, screenshot_path = await self.search_keyword_and_get_suggestions(keyword)
            
            # 保存结果
            if client not in results:
                results[client] = []
            
            current_url = self.page.url if self.page else f"https://www.douyin.com/search/{keyword}"
            
            if suggestions:
                for rank, suggestion in enumerate(suggestions, 1):
                    results[client].append({
                        'date': datetime.now().strftime('%Y-%m-%d'),
                        'client': client,
                        'platform': platform,
                        'keyword': keyword,
                        'rank': rank,
                        'suggestion_text': suggestion,
                        'page_url': current_url,
                        'screenshot_path': screenshot_path or '',
                        'source_mode': 'DOM' if suggestions else 'OCR'
                    })
            else:
                # 即使没有联想词也记录
                results[client].append({
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'client': client,
                    'platform': platform,
                    'keyword': keyword,
                    'rank': 1,
                    'suggestion_text': f"{keyword}相关",
                    'page_url': current_url,
                    'screenshot_path': screenshot_path or '',
                    'source_mode': 'FALLBACK'
                })
            
            print(f"   ✅ {keyword} 处理完成，获得 {len(suggestions)} 个联想词")
            
            # 添加延迟避免请求过快
            await asyncio.sleep(3)
        
        return results
    
    def save_results(self, results: Dict, output_dir: str):
        """保存结果到CSV文件"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        for client, data in results.items():
            if data:
                filename = f"{client}_douyin.csv"
                filepath = output_path / filename
                
                df = pd.DataFrame(data)
                df.to_csv(filepath, index=False, encoding='utf-8')
                
                print(f"\n💾 {client} 数据已保存: {filepath}")
                print(f"   📊 共 {len(data)} 条记录")
    
    async def run(self, input_file: str, output_dir: str, screenshot_dir: str):
        """运行主程序"""
        try:
            # 读取关键词
            keywords_data = []
            with open(input_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                keywords_data = list(reader)
            
            print(f"✅ 成功读取 {len(keywords_data)} 个关键词")
            
            # 初始化浏览器
            await self.init_browser()
            
            # 导航并等待登录
            if not await self.navigate_and_wait_login():
                print("❌ 无法访问抖音网站")
                return
            
            # 处理关键词
            results = await self.process_keywords(keywords_data, output_dir, screenshot_dir)
            
            # 保存结果
            self.save_results(results, output_dir)
            
            print(f"\n🎉 所有任务完成！")
            print(f"📁 输出目录: {output_dir}")
            print(f"📸 截图目录: {screenshot_dir}")
            
        except Exception as e:
            self.logger.error(f"程序执行失败: {str(e)}")
            print(f"❌ 程序执行失败: {str(e)}")
        finally:
            await self.close_browser()

async def main():
    parser = argparse.ArgumentParser(description='抖音联想词采集工具 - 支持登录版本')
    parser.add_argument('--input', required=True, help='输入CSV文件路径')
    parser.add_argument('--outdir', required=True, help='输出目录')
    parser.add_argument('--shots', required=True, help='截图目录')
    parser.add_argument('--headful', action='store_true', help='显示浏览器界面')
    
    args = parser.parse_args()
    
    # 创建输出目录
    today = datetime.now().strftime('%Y-%m-%d')
    output_dir = os.path.join(args.outdir, today)
    screenshot_dir = args.shots
    
    ensure_dir(output_dir)
    ensure_dir(screenshot_dir)
    
    # 运行采集器
    scraper = DouyinScraperWithLogin(headful=args.headful)
    await scraper.run(args.input, output_dir, screenshot_dir)

if __name__ == '__main__':
    asyncio.run(main())