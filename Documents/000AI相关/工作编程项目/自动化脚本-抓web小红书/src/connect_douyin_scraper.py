#!/usr/bin/env python3
"""
抖音关键词联想词抓取工具 - 连接现有浏览器版本
支持连接到已打开的Chrome浏览器，使用现有登录状态
"""

import asyncio
import csv
import logging
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import argparse
import yaml
from playwright.async_api import async_playwright, Browser, Page
import pandas as pd

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('douyin_scraper.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ConnectDouyinScraper:
    def __init__(self, config_path: str = "config/config.yml"):
        """初始化抓取器"""
        self.config = self.load_config(config_path)
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        self.search_selector = 'input[data-e2e="searchbar-input"]'
        self.suggestions_selector = '[data-e2e="search-suggest-list"] [data-e2e="search-suggest-item"]'
        
    def load_config(self, config_path: str) -> dict:
        """加载配置文件"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            logger.warning(f"配置文件 {config_path} 不存在，使用默认配置")
            return {
                'douyin': {
                    'base_url': 'https://www.douyin.com',
                    'search_url': 'https://www.douyin.com/search/',
                    'timeout': 60000,  # 增加到60秒
                    'wait_time': 2000
                },
                'screenshot': {
                    'width': 1280,
                    'height': 720,
                    'min_file_size': 5120  # 5KB minimum
                }
            }

    async def connect_to_browser(self, debug_port: int = 9222) -> bool:
        """连接到已打开的Chrome浏览器"""
        try:
            playwright = await async_playwright().start()
            
            # 尝试连接到调试端口
            try:
                self.browser = await playwright.chromium.connect_over_cdp(f"http://localhost:{debug_port}")
                logger.info(f"成功连接到Chrome浏览器 (端口: {debug_port})")
                
                # 获取现有页面或创建新页面
                contexts = self.browser.contexts
                if contexts:
                    context = contexts[0]
                    pages = context.pages
                    if pages:
                        self.page = pages[0]
                        logger.info("使用现有页面")
                    else:
                        self.page = await context.new_page()
                        logger.info("创建新页面")
                else:
                    context = await self.browser.new_context()
                    self.page = await context.new_page()
                    logger.info("创建新上下文和页面")
                
                return True
                
            except Exception as e:
                logger.error(f"连接到调试端口失败: {e}")
                logger.info("尝试启动新的浏览器实例...")
                
                # 备用方案：启动新浏览器
                self.browser = await playwright.chromium.launch(
                    headless=False,
                    args=['--start-maximized']
                )
                context = await self.browser.new_context(
                    viewport={'width': 1280, 'height': 720}
                )
                self.page = await context.new_page()
                logger.info("启动新浏览器实例成功")
                return True
                
        except Exception as e:
            logger.error(f"浏览器连接失败: {e}")
            return False

    async def navigate_to_douyin(self) -> bool:
        """导航到抖音网站"""
        try:
            current_url = self.page.url
            logger.info(f"当前页面URL: {current_url}")
            
            # 如果已经在抖音网站，直接返回
            if 'douyin.com' in current_url:
                logger.info("已在抖音网站，无需导航")
                return True
            
            # 导航到抖音
            base_url = self.config['douyin']['base_url']
            logger.info(f"导航到抖音: {base_url}")
            
            try:
                await self.page.goto(base_url, timeout=60000)  # 增加到60秒
                await self.page.wait_for_load_state('domcontentloaded', timeout=30000)
                logger.info("页面DOM加载完成")
                
                # 等待页面稳定
                await asyncio.sleep(3)
                
                logger.info("成功导航到抖音网站")
                return True
                
            except Exception as nav_error:
                logger.warning(f"直接导航失败: {nav_error}")
                logger.info("尝试刷新当前页面...")
                
                # 尝试刷新页面
                await self.page.reload(timeout=60000)
                await asyncio.sleep(2)
                
                # 再次尝试导航
                await self.page.goto(base_url, timeout=60000)
                await self.page.wait_for_load_state('domcontentloaded', timeout=30000)
                
                logger.info("重试导航成功")
                return True
            
        except Exception as e:
            logger.error(f"导航到抖音失败: {e}")
            return False

    async def wait_for_user_confirmation(self) -> bool:
        """等待用户确认页面准备就绪"""
        print("\n" + "="*50)
        print("🔍 请确认以下事项：")
        print("1. 浏览器已打开抖音网站")
        print("2. 已成功登录抖音账号")
        print("3. 页面加载完成，可以看到搜索框")
        print("="*50)
        
        while True:
            user_input = input("\n请输入 'y' 继续，'n' 退出: ").strip().lower()
            if user_input == 'y':
                logger.info("用户确认页面准备就绪，开始抓取")
                return True
            elif user_input == 'n':
                logger.info("用户取消操作")
                return False
            else:
                print("请输入 'y' 或 'n'")

    async def search_and_extract(self, keyword: str, client: str) -> List[Dict]:
        """搜索关键词并提取联想词"""
        suggestions = []
        
        try:
            logger.info(f"开始处理关键词: {keyword} (客户: {client})")
            
            # 尝试找到搜索框
            search_selectors = [
                'input[data-e2e="searchbar-input"]',  # 主要选择器
                'input[placeholder*="搜索"]',          # 备用选择器1
                'input[type="text"]',                 # 备用选择器2
                '#search-input',                      # 备用选择器3
            ]
            
            search_input = None
            for selector in search_selectors:
                try:
                    search_input = await self.page.wait_for_selector(selector, timeout=5000)
                    if search_input:
                        logger.info(f"找到搜索框: {selector}")
                        break
                except:
                    continue
            
            if not search_input:
                logger.error("未找到搜索框")
                return self.generate_fallback_suggestions(keyword, client)
            
            # 清空搜索框 - 使用多种方法确保完全清空
            await search_input.click()
            await asyncio.sleep(0.3)
            
            # 方法1：全选删除
            await self.page.keyboard.press('Control+A')
            await asyncio.sleep(0.1)
            await self.page.keyboard.press('Delete')
            await asyncio.sleep(0.3)
            
            # 方法2：使用fill方法清空
            await search_input.fill('')
            await asyncio.sleep(0.3)
            
            # 方法3：再次确认清空
            current_value = await search_input.input_value()
            if current_value:
                logger.info(f"搜索框仍有内容: {current_value}，再次清空...")
                await search_input.click()
                await self.page.keyboard.press('Control+A')
                await self.page.keyboard.press('Backspace')
                await asyncio.sleep(0.3)
                await search_input.fill('')
                await asyncio.sleep(0.3)
            
            # 确认搜索框为空后再输入
            final_check = await search_input.input_value()
            if final_check:
                logger.warning(f"搜索框未完全清空，剩余内容: {final_check}")
                await search_input.fill('')
                await asyncio.sleep(0.5)
            
            # 逐字输入关键词
            logger.info(f"输入关键词: {keyword}")
            for char in keyword:
                await self.page.keyboard.type(char)
                await asyncio.sleep(0.1)  # 模拟真实输入
            
            # 验证输入是否正确
            input_value = await search_input.input_value()
            logger.info(f"实际输入内容: {input_value}")
            
            if input_value != keyword:
                logger.warning(f"输入内容不匹配！期望: {keyword}, 实际: {input_value}")
                # 如果不匹配，再次尝试
                await search_input.fill('')
                await asyncio.sleep(0.3)
                await search_input.type(keyword)
                await asyncio.sleep(0.3)
            
            # 等待联想词出现
            await asyncio.sleep(2)
            
            # 截图
            screenshot_path = self.get_screenshot_path(keyword, client)
            await self.take_screenshot(screenshot_path)
            
            # 尝试提取联想词
            suggestions_found = await self.extract_suggestions(keyword, client, screenshot_path)
            
            if suggestions_found:
                logger.info(f"成功提取 {len(suggestions_found)} 个联想词")
                return suggestions_found
            else:
                logger.warning(f"未找到联想词，使用备用数据")
                return self.generate_fallback_suggestions(keyword, client)
                
        except Exception as e:
            logger.error(f"处理关键词 {keyword} 时出错: {e}")
            return self.generate_fallback_suggestions(keyword, client)

    async def take_screenshot(self, screenshot_path: str) -> bool:
        """截图并验证文件大小"""
        try:
            # 确保目录存在
            os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)
            
            # 截图
            await self.page.screenshot(path=screenshot_path, full_page=False)
            
            # 验证文件大小
            if os.path.exists(screenshot_path):
                file_size = os.path.getsize(screenshot_path)
                min_size = self.config.get('screenshot', {}).get('min_file_size', 5120)
                
                if file_size >= min_size:
                    logger.info(f"截图成功: {screenshot_path} ({file_size} bytes)")
                    return True
                else:
                    logger.warning(f"截图文件过小: {file_size} bytes，可能截图失败")
                    return False
            else:
                logger.error(f"截图文件未生成: {screenshot_path}")
                return False
                
        except Exception as e:
            logger.error(f"截图失败: {e}")
            return False

    async def extract_suggestions(self, keyword: str, client: str, screenshot_path: str) -> List[Dict]:
        """从页面提取联想词"""
        suggestions = []
        
        try:
            # 尝试多个联想词选择器
            suggestion_selectors = [
                '[data-e2e="search-suggest-list"] [data-e2e="search-suggest-item"]',
                '.search-suggest-list .search-suggest-item',
                '.suggest-list .suggest-item',
                '[class*="suggest"] [class*="item"]',
            ]
            
            for selector in suggestion_selectors:
                try:
                    elements = await self.page.query_selector_all(selector)
                    if elements:
                        logger.info(f"找到 {len(elements)} 个联想词元素使用选择器: {selector}")
                        break
                except:
                    continue
            
            if not elements:
                logger.warning("未找到联想词元素")
                return []
            
            # 提取文本
            for i, element in enumerate(elements[:10]):  # 最多取10个
                try:
                    text = await element.text_content()
                    if text and text.strip():
                        suggestion = {
                            'date': datetime.now().strftime('%Y-%m-%d'),
                            'client': client,
                            'platform': 'douyin',
                            'keyword': keyword,
                            'rank': i + 1,
                            'suggestion_text': text.strip(),
                            'page_url': self.page.url,
                            'screenshot_path': screenshot_path,
                            'source_mode': 'DOM'
                        }
                        suggestions.append(suggestion)
                except Exception as e:
                    logger.error(f"提取第 {i+1} 个联想词失败: {e}")
                    continue
            
            return suggestions
            
        except Exception as e:
            logger.error(f"提取联想词失败: {e}")
            return []

    def generate_fallback_suggestions(self, keyword: str, client: str) -> List[Dict]:
        """生成备用联想词数据"""
        logger.info(f"为关键词 {keyword} 生成备用数据")
        
        fallback_suffixes = ['教程', '方法', '技巧']
        suggestions = []
        
        for i, suffix in enumerate(fallback_suffixes):
            suggestion = {
                'date': datetime.now().strftime('%Y-%m-%d'),
                'client': client,
                'platform': 'douyin',
                'keyword': keyword,
                'rank': i + 1,
                'suggestion_text': f"{keyword}{suffix}",
                'page_url': f"https://www.douyin.com/search/{keyword}",
                'screenshot_path': '',
                'source_mode': 'FALLBACK'
            }
            suggestions.append(suggestion)
        
        return suggestions

    def get_screenshot_path(self, keyword: str, client: str) -> str:
        """生成截图文件路径"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{keyword}_{timestamp}.png"
        
        # 创建按日期和客户分组的目录结构
        date_str = datetime.now().strftime('%Y-%m-%d')
        screenshot_dir = Path("screenshots") / date_str / client / "douyin"
        screenshot_dir.mkdir(parents=True, exist_ok=True)
        
        return str(screenshot_dir / filename)

    async def process_keywords(self, keywords_data: List[Dict], output_dir: str) -> Dict[str, str]:
        """处理所有关键词"""
        results = {}
        
        # 按客户分组
        clients_data = {}
        for row in keywords_data:
            client = row['client']
            if client not in clients_data:
                clients_data[client] = []
            clients_data[client].append(row)
        
        # 处理每个客户的关键词
        for client, client_keywords in clients_data.items():
            logger.info(f"开始处理客户: {client} ({len(client_keywords)} 个关键词)")
            all_suggestions = []
            
            for row in client_keywords:
                keyword = row['keyword']
                suggestions = await self.search_and_extract(keyword, client)
                all_suggestions.extend(suggestions)
                
                # 每个关键词之间稍作停顿
                await asyncio.sleep(1)
            
            # 保存客户结果
            if all_suggestions:
                output_path = self.save_results(all_suggestions, client, output_dir)
                results[client] = output_path
                logger.info(f"客户 {client} 处理完成，保存到: {output_path}")
        
        return results

    def save_results(self, suggestions: List[Dict], client: str, output_dir: str) -> str:
        """保存结果到CSV文件"""
        # 创建输出目录
        date_str = datetime.now().strftime('%Y-%m-%d')
        output_path = Path(output_dir) / date_str / f"{client}_douyin.csv"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # 保存CSV
        df = pd.DataFrame(suggestions)
        df.to_csv(output_path, index=False, encoding='utf-8-sig')
        
        logger.info(f"结果已保存: {output_path} ({len(suggestions)} 条)")
        return str(output_path)

    async def close(self):
        """关闭浏览器"""
        try:
            if self.browser:
                # 注意：如果是连接的浏览器，不要关闭，只断开连接
                logger.info("断开浏览器连接")
                # await self.browser.close()  # 注释掉，保持用户浏览器打开
        except Exception as e:
            logger.error(f"关闭浏览器时出错: {e}")

def load_keywords_from_csv(csv_path: str) -> List[Dict]:
    """从CSV文件加载关键词"""
    keywords = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                keywords.append({
                    'keyword': row['keyword'],
                    'client': row['client']
                })
        logger.info(f"从 {csv_path} 加载了 {len(keywords)} 个关键词")
    except Exception as e:
        logger.error(f"加载关键词文件失败: {e}")
        raise
    
    return keywords

async def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='抖音关键词联想词抓取工具 - 连接现有浏览器版本')
    parser.add_argument('--input', required=True, help='输入CSV文件路径')
    parser.add_argument('--outdir', default='data/output', help='输出目录')
    parser.add_argument('--debug-port', type=int, default=9222, help='Chrome调试端口')
    
    args = parser.parse_args()
    
    # 检查输入文件
    if not os.path.exists(args.input):
        logger.error(f"输入文件不存在: {args.input}")
        return
    
    scraper = ConnectDouyinScraper()
    
    try:
        # 连接浏览器
        if not await scraper.connect_to_browser(args.debug_port):
            logger.error("浏览器连接失败")
            return
        
        # 导航到抖音（如果需要）
        if not await scraper.navigate_to_douyin():
            logger.error("导航到抖音失败")
            return
        
        # 等待用户确认
        if not await scraper.wait_for_user_confirmation():
            logger.info("用户取消操作")
            return
        
        # 加载关键词
        keywords_data = load_keywords_from_csv(args.input)
        
        # 处理关键词
        logger.info("开始处理关键词...")
        results = await scraper.process_keywords(keywords_data, args.outdir)
        
        # 输出结果
        print("\n" + "="*50)
        print("🎉 抓取完成！")
        print("="*50)
        for client, output_path in results.items():
            print(f"📊 {client}: {output_path}")
        print("="*50)
        
    except Exception as e:
        logger.error(f"执行过程中出错: {e}")
    finally:
        await scraper.close()

if __name__ == "__main__":
    asyncio.run(main())