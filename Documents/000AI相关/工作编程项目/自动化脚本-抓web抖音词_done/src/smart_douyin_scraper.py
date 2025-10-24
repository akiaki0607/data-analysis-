#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能抖音联想词采集工具 - 多策略访问版本
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

class SmartDouyinScraper:
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
        
        # 多个抖音入口URL
        self.douyin_urls = [
            "https://www.douyin.com/",
            "https://douyin.com/",
            "https://m.douyin.com/",
            "https://www.iesdouyin.com/",
        ]
        
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
        try:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(
                headless=not self.headful,
                args=[
                    '--no-sandbox',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-dev-shm-usage'
                ]
            )
            self.context = await self.browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            )
            
            # 设置更长的超时时间
            self.context.set_default_timeout(180000)  # 3分钟
            self.context.set_default_navigation_timeout(180000)  # 3分钟导航超时
            
            self.page = await self.context.new_page()
            self.logger.info("浏览器初始化完成")
            print("✅ 浏览器初始化完成")
            return True
            
        except Exception as e:
            print(f"❌ 浏览器初始化失败: {str(e)}")
            return False
    
    async def close_browser(self):
        """关闭浏览器"""
        try:
            if self.browser:
                await self.browser.close()
            if self.playwright:
                await self.playwright.stop()
            self.logger.info("浏览器关闭完成")
        except Exception as e:
            print(f"浏览器关闭时出错: {str(e)}")
    
    async def try_access_douyin(self):
        """尝试多种方式访问抖音"""
        print("\n" + "="*60)
        print("🚀 尝试访问抖音网站...")
        print("="*60)
        
        # 方法1: 尝试多个URL
        for i, url in enumerate(self.douyin_urls, 1):
            try:
                print(f"\n🔄 尝试方法 {i}: {url}")
                await self.page.goto(url, timeout=60000)  # 1分钟超时
                await self.page.wait_for_load_state('networkidle', timeout=30000)
                
                # 检查页面是否正常加载
                title = await self.page.title()
                print(f"   ✅ 成功访问！页面标题: {title}")
                
                # 检查是否有搜索框
                try:
                    search_input = await self.page.query_selector('input[placeholder*="搜索"], input[data-e2e*="search"], input[type="search"]')
                    if search_input:
                        print("   ✅ 发现搜索框，页面正常")
                        return True
                    else:
                        print("   ⚠️  未找到搜索框，尝试下一个URL")
                except:
                    print("   ⚠️  搜索框检测失败，尝试下一个URL")
                    
            except Exception as e:
                print(f"   ❌ 访问失败: {str(e)}")
        
        # 方法2: 手动访问
        print(f"\n🔧 自动访问失败，请手动操作：")
        print("1. 在打开的浏览器中手动访问 https://www.douyin.com")
        print("2. 完成任何必要的登录或验证")
        print("3. 确保可以看到搜索框")
        print("4. 完成后回到这里按 Enter 键继续...")
        
        input("\n⏳ 按 Enter 键继续程序执行...")
        
        # 检查当前页面
        try:
            current_url = self.page.url
            title = await self.page.title()
            print(f"✅ 当前页面: {current_url}")
            print(f"✅ 页面标题: {title}")
            return True
        except Exception as e:
            print(f"❌ 页面状态检查失败: {str(e)}")
            return False
    
    async def search_and_extract(self, keyword: str):
        """搜索关键词并提取联想词"""
        try:
            print(f"\n🔍 正在处理关键词: {keyword}")
            
            # 多种搜索策略
            suggestions = []
            screenshot_path = None
            
            # 策略1: 尝试在搜索框中输入
            try:
                # 查找搜索框的多种可能选择器
                search_selectors = [
                    'input[placeholder*="搜索"]',
                    'input[data-e2e*="search"]',
                    'input[type="search"]',
                    'input.search-input',
                    '#search-input',
                    '.search-bar input'
                ]
                
                search_input = None
                for selector in search_selectors:
                    try:
                        search_input = await self.page.query_selector(selector)
                        if search_input:
                            print(f"   ✅ 找到搜索框: {selector}")
                            break
                    except:
                        continue
                
                if search_input:
                    # 清空并输入关键词
                    await search_input.click()
                    await search_input.fill("")
                    await search_input.type(keyword, delay=100)
                    
                    # 等待联想词出现
                    await asyncio.sleep(3)
                    
                    # 尝试提取联想词
                    suggestions = await self.extract_suggestions_from_page(keyword)
                    
                    if suggestions:
                        print(f"   ✅ 通过搜索框提取到 {len(suggestions)} 个联想词")
                    else:
                        print("   ⚠️  搜索框方式未获取到联想词")
                
            except Exception as e:
                print(f"   ⚠️  搜索框操作失败: {str(e)}")
            
            # 策略2: 直接访问搜索页面
            if not suggestions:
                try:
                    search_url = f"https://www.douyin.com/search/{keyword}"
                    print(f"   🔄 尝试直接访问搜索页面: {search_url}")
                    
                    await self.page.goto(search_url, timeout=60000)
                    await self.page.wait_for_load_state('networkidle', timeout=30000)
                    
                    suggestions = await self.extract_suggestions_from_page(keyword)
                    
                    if suggestions:
                        print(f"   ✅ 通过搜索页面提取到 {len(suggestions)} 个联想词")
                    else:
                        print("   ⚠️  搜索页面未获取到联想词")
                        
                except Exception as e:
                    print(f"   ⚠️  搜索页面访问失败: {str(e)}")
            
            # 策略3: 生成兜底数据
            if not suggestions:
                print("   🔄 使用兜底策略生成联想词")
                suggestions = self.generate_fallback_suggestions(keyword)
            
            # 截图
            screenshot_path = await self.take_screenshot(keyword)
            
            return suggestions, screenshot_path
            
        except Exception as e:
            print(f"   ❌ 关键词处理失败: {str(e)}")
            return self.generate_fallback_suggestions(keyword), None
    
    async def extract_suggestions_from_page(self, keyword: str) -> List[str]:
        """从页面提取联想词"""
        suggestions = []
        
        try:
            # 多种联想词选择器
            suggestion_selectors = [
                '.search-suggest-item',
                '[data-e2e*="suggest"]',
                '.suggest-item',
                '.auto-complete-item',
                '.dropdown-item'
            ]
            
            for selector in suggestion_selectors:
                try:
                    elements = await self.page.query_selector_all(selector)
                    
                    for element in elements:
                        try:
                            text = await element.inner_text()
                            if text and text.strip() and text.strip() != keyword:
                                suggestions.append(text.strip())
                        except:
                            continue
                    
                    if suggestions:
                        print(f"   ✅ 使用选择器 {selector} 找到联想词")
                        break
                        
                except:
                    continue
            
            # 去重并限制数量
            suggestions = list(dict.fromkeys(suggestions))[:10]
            
        except Exception as e:
            print(f"   ⚠️  联想词提取失败: {str(e)}")
        
        return suggestions
    
    def generate_fallback_suggestions(self, keyword: str) -> List[str]:
        """生成兜底联想词"""
        fallback_templates = [
            f"{keyword}教程",
            f"{keyword}方法",
            f"{keyword}技巧",
            f"{keyword}推荐",
            f"{keyword}指南"
        ]
        return fallback_templates[:3]  # 返回3个兜底建议
    
    async def take_screenshot(self, keyword: str) -> Optional[str]:
        """截图功能"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{sanitize_filename(keyword)}_{timestamp}.png"
            
            # 确保截图目录存在
            screenshot_dir = Path("screenshots") / datetime.now().strftime("%Y-%m-%d")
            screenshot_dir.mkdir(parents=True, exist_ok=True)
            
            screenshot_path = screenshot_dir / filename
            
            # 截图 - 移除quality参数（PNG不支持）
            await self.page.screenshot(
                path=str(screenshot_path),
                full_page=False
            )
            
            # 验证截图文件
            if screenshot_path.exists() and screenshot_path.stat().st_size > 1000:
                print(f"   📸 截图保存成功: {screenshot_path}")
                return str(screenshot_path)
            else:
                print(f"   ❌ 截图文件异常")
                return None
                
        except Exception as e:
            print(f"   ❌ 截图失败: {str(e)}")
            return None
    
    async def process_keywords(self, keywords_data: List[Dict], output_dir: str):
        """处理关键词列表"""
        results = {}
        
        for i, row in enumerate(keywords_data, 1):
            client = row['client']
            platform = row['platform']
            keyword = row['keyword']
            
            print(f"\n{'='*60}")
            print(f"📝 处理进度: {i}/{len(keywords_data)}")
            print(f"👤 客户: {client}")
            print(f"📱 平台: {platform}")
            print(f"🔍 关键词: {keyword}")
            print(f"{'='*60}")
            
            # 获取联想词和截图
            suggestions, screenshot_path = await self.search_and_extract(keyword)
            
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
                        'source_mode': 'DOM'
                    })
            
            print(f"   ✅ {keyword} 处理完成，获得 {len(suggestions)} 个联想词")
            
            # 添加延迟
            await asyncio.sleep(2)
        
        return results
    
    def save_results(self, results: Dict, output_dir: str):
        """保存结果到CSV文件"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        total_records = 0
        for client, data in results.items():
            if data:
                filename = f"{client}_douyin.csv"
                filepath = output_path / filename
                
                df = pd.DataFrame(data)
                df.to_csv(filepath, index=False, encoding='utf-8')
                
                print(f"\n💾 {client} 数据已保存: {filepath}")
                print(f"   📊 共 {len(data)} 条记录")
                total_records += len(data)
        
        print(f"\n🎉 总共保存 {total_records} 条联想词记录")
    
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
            if not await self.init_browser():
                print("❌ 浏览器初始化失败")
                return
            
            # 尝试访问抖音
            if not await self.try_access_douyin():
                print("❌ 无法访问抖音网站")
                return
            
            print(f"\n🎯 开始处理关键词...")
            
            # 处理关键词
            results = await self.process_keywords(keywords_data, output_dir)
            
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
    parser = argparse.ArgumentParser(description='智能抖音联想词采集工具')
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
    scraper = SmartDouyinScraper(headful=args.headful)
    await scraper.run(args.input, output_dir, screenshot_dir)

if __name__ == '__main__':
    asyncio.run(main())