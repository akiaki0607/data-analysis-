#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书联想词自动化采集工具 V1.0
主程序模块
"""

import argparse
import asyncio
import csv
import os
import sys
import time
import yaml
from datetime import datetime
from pathlib import Path

import pandas as pd
from playwright.async_api import async_playwright

# 导入本地模块
from utils import setup_logging, get_output_paths, create_screenshot_filename, get_relative_screenshot_path, get_current_date
from ocr import OCRProcessor

class XiaohongshuScraper:
    def __init__(self, config_path='config/config.yml', headful=False):
        self.headful = headful
        self.config = self._load_config(config_path)
        self.logger = setup_logging(self.config.get('logging', {}).get('level', 'INFO'))
        self.ocr = OCRProcessor(self.config.get('ocr', {}).get('language', 'chi_sim+eng'))
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
    
    def _load_config(self, config_path):
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
    
    async def navigate_to_xiaohongshu(self):
        """导航到小红书首页"""
        try:
            xhs_config = self.config['xiaohongshu']
            await self.page.goto(xhs_config['base_url'], timeout=xhs_config['timeouts']['page_load'])
            await self.page.wait_for_load_state('networkidle')
            self.logger.info("成功导航到小红书首页")
            
            # 等待页面完全加载
            await asyncio.sleep(3)
            
            return True
        except Exception as e:
            self.logger.error(f"导航到小红书失败: {str(e)}")
            return False
    
    async def search_keyword(self, keyword):
        """搜索关键词并获取联想词"""
        try:
            xhs_config = self.config['xiaohongshu']
            selectors = xhs_config['selectors']
            timeouts = xhs_config['timeouts']
            
            # 多种方式查找搜索框
            search_input = await self._find_search_input(selectors, timeouts)
            if not search_input:
                self.logger.warning(f"未找到搜索框，关键词: {keyword}")
                return [], None
            
            # 清空搜索框并输入关键词
            await search_input.click()
            await search_input.clear()
            await search_input.fill(keyword)
            
            # 等待联想词出现
            await asyncio.sleep(2)  # 给联想词一些时间加载
            
            # 截图
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            screenshot_filename = create_screenshot_filename(keyword, timestamp, 'xiaohongshu')
            
            # 获取联想词数据
            suggestions = await self._extract_suggestions(keyword)
            
            return suggestions, screenshot_filename
            
        except Exception as e:
            self.logger.error(f"搜索关键词失败 {keyword}: {str(e)}")
            return [], None
    
    async def _find_search_input(self, selectors, timeouts):
        """查找搜索框"""
        # 多种可能的搜索框选择器
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
        
        for selector in search_selectors:
            try:
                await self.page.wait_for_selector(selector, timeout=5000)
                search_input = await self.page.query_selector(selector)
                if search_input:
                    self.logger.info(f"找到搜索框: {selector}")
                    return search_input
            except:
                continue
        
        return None
    
    async def _extract_suggestions(self, keyword):
        """提取联想词"""
        suggestions = []
        xhs_config = self.config['xiaohongshu']
        selectors = xhs_config['selectors']
        
        try:
            # 方法1: 尝试从DOM提取
            await asyncio.sleep(1)  # 等待联想词加载
            
            # 多种可能的联想词容器选择器
            suggest_selectors = [
                '.search-suggest',
                '.auto-complete',
                '.dropdown-menu',
                '.suggestions',
                '.search-dropdown',
                '[class*="suggest"]',
                '[class*="dropdown"]'
            ]
            
            for container_selector in suggest_selectors:
                try:
                    container = await self.page.query_selector(container_selector)
                    if container:
                        # 尝试不同的联想词项选择器
                        item_selectors = [
                            '.suggest-item',
                            '.auto-complete-item',
                            '.suggestion-item',
                            '.dropdown-item',
                            'li',
                            'div[class*="item"]'
                        ]
                        
                        for item_selector in item_selectors:
                            suggest_elements = await container.query_selector_all(item_selector)
                            
                            for i, element in enumerate(suggest_elements[:10]):  # 最多取10个
                                try:
                                    text = await element.inner_text()
                                    if text and text.strip() and text.strip() != keyword:
                                        suggestions.append({
                                            'rank': len(suggestions) + 1,
                                            'text': text.strip(),
                                            'source_mode': 'DOM'
                                        })
                                except Exception as e:
                                    continue
                            
                            if suggestions:
                                break
                        
                        if suggestions:
                            break
                            
                except Exception as e:
                    continue
            
            if suggestions:
                self.logger.info(f"DOM方法成功提取 {len(suggestions)} 个联想词")
                return suggestions
            
            # 方法2: 尝试获取动态生成的联想词
            suggestions = await self._extract_dynamic_suggestions(keyword)
            if suggestions:
                return suggestions
            
            # 方法3: 如果DOM提取失败，尝试OCR
            if self.ocr.is_available():
                self.logger.info("尝试使用OCR方法提取联想词")
                return await self._extract_suggestions_ocr(keyword)
            else:
                self.logger.warning("OCR不可用，生成兜底联想词")
                return self._generate_fallback_suggestions(keyword)
                
        except Exception as e:
            self.logger.error(f"提取联想词异常: {str(e)}")
            return self._generate_fallback_suggestions(keyword)
    
    async def _extract_dynamic_suggestions(self, keyword):
        """提取动态生成的联想词"""
        try:
            # 等待并尝试获取所有可能包含联想词的元素
            await asyncio.sleep(1)
            
            # 通用的文本元素选择器
            text_selectors = [
                'span:has-text("' + keyword + '")',
                'div:has-text("' + keyword + '")',
                f'[title*="{keyword}"]',
                f'[alt*="{keyword}"]'
            ]
            
            suggestions = []
            for selector in text_selectors:
                try:
                    elements = await self.page.query_selector_all(selector)
                    for element in elements[:5]:  # 限制数量
                        text = await element.inner_text()
                        if text and text.strip() and keyword in text and text.strip() != keyword:
                            suggestions.append({
                                'rank': len(suggestions) + 1,
                                'text': text.strip(),
                                'source_mode': 'DYNAMIC'
                            })
                except:
                    continue
            
            return suggestions[:10]  # 最多返回10个
            
        except Exception as e:
            self.logger.error(f"动态联想词提取失败: {str(e)}")
            return []
    
    async def _extract_suggestions_ocr(self, keyword):
        """使用OCR提取联想词"""
        try:
            # 截图整个页面用于OCR
            temp_screenshot = f"temp_ocr_{keyword}_{int(time.time())}.png"
            await self.page.screenshot(path=temp_screenshot)
            
            # OCR识别
            ocr_texts = self.ocr.extract_text_suggestions(temp_screenshot)
            
            # 清理临时文件
            try:
                os.remove(temp_screenshot)
            except:
                pass
            
            # 格式化结果
            suggestions = []
            for i, text in enumerate(ocr_texts[:10]):
                suggestions.append({
                    'rank': i + 1,
                    'text': text,
                    'source_mode': 'OCR'
                })
            
            self.logger.info(f"OCR方法成功提取 {len(suggestions)} 个联想词")
            return suggestions
            
        except Exception as e:
            self.logger.error(f"OCR提取失败: {str(e)}")
            return []
    
    def _generate_fallback_suggestions(self, keyword):
        """生成兜底联想词"""
        fallback_templates = [
            f"{keyword}教程",
            f"{keyword}推荐",
            f"{keyword}种草",
            f"{keyword}测评",
            f"{keyword}好物"
        ]
        
        suggestions = []
        for i, text in enumerate(fallback_templates):
            suggestions.append({
                'rank': i + 1,
                'text': text,
                'source_mode': 'FALLBACK'
            })
        
        return suggestions
    
    async def take_screenshot(self, screenshot_path):
        """截图"""
        try:
            await self.page.screenshot(path=screenshot_path, full_page=False)
            self.logger.info(f"截图保存: {screenshot_path}")
            return True
        except Exception as e:
            self.logger.error(f"截图失败: {str(e)}")
            return False
    
    async def process_keywords(self, keywords_df, output_dir, screenshot_dir):
        """处理关键词列表"""
        results = []
        
        # 按客户分组处理
        for client in keywords_df['client'].unique():
            client_keywords = keywords_df[keywords_df['client'] == client]
            
            for _, row in client_keywords.iterrows():
                keyword = row['keyword']
                platform = 'xiaohongshu'  # 更新平台名称
                
                self.logger.info(f"处理关键词: {client} - {keyword}")
                
                # 重试机制
                max_attempts = self.config['xiaohongshu']['retry']['max_attempts']
                for attempt in range(max_attempts):
                    try:
                        # 搜索并获取联想词
                        suggestions, screenshot_filename = await self.search_keyword(keyword)
                        
                        if not suggestions:
                            if attempt == max_attempts - 1:
                                self.logger.warning(f"关键词处理失败，已达到最大重试次数: {keyword}")
                                # 记录失败结果，使用兜底数据
                                suggestions = self._generate_fallback_suggestions(keyword)
                            else:
                                self.logger.info(f"重试关键词: {keyword} (第{attempt + 1}次)")
                                await asyncio.sleep(self.config['xiaohongshu']['retry']['delay'] / 1000)
                                continue
                        
                        # 截图
                        if screenshot_filename:
                            csv_path, screenshot_base_dir = get_output_paths(client, platform, output_dir, screenshot_dir)
                            screenshot_full_path = os.path.join(screenshot_base_dir, screenshot_filename)
                            await self.take_screenshot(screenshot_full_path)
                            screenshot_relative_path = get_relative_screenshot_path(screenshot_full_path, '.')
                        else:
                            screenshot_relative_path = ''
                        
                        # 保存结果
                        for suggestion in suggestions:
                            results.append({
                                'date': get_current_date(),
                                'client': client,
                                'platform': platform,
                                'keyword': keyword,
                                'rank': suggestion['rank'],
                                'suggestion_text': suggestion['text'],
                                'page_url': self.page.url,
                                'screenshot_path': screenshot_relative_path,
                                'source_mode': suggestion['source_mode']
                            })
                        
                        self.logger.info(f"成功处理关键词: {keyword}, 获得 {len(suggestions)} 个联想词")
                        break  # 成功后跳出重试循环
                        
                    except Exception as e:
                        self.logger.error(f"处理关键词异常 {keyword} (第{attempt + 1}次): {str(e)}")
                        if attempt == max_attempts - 1:
                            # 记录失败结果，使用兜底数据
                            suggestions = self._generate_fallback_suggestions(keyword)
                            for suggestion in suggestions:
                                results.append({
                                    'date': get_current_date(),
                                    'client': client,
                                    'platform': platform,
                                    'keyword': keyword,
                                    'rank': suggestion['rank'],
                                    'suggestion_text': suggestion['text'],
                                    'page_url': '',
                                    'screenshot_path': '',
                                    'source_mode': suggestion['source_mode']
                                })
                        else:
                            await asyncio.sleep(self.config['xiaohongshu']['retry']['delay'] / 1000)
                
                # 每个关键词之间稍作等待
                await asyncio.sleep(1)
        
        return results
    
    def save_results(self, results, output_dir):
        """保存结果到CSV"""
        if not results:
            self.logger.warning("没有结果需要保存")
            return
        
        # 按客户分组保存
        results_df = pd.DataFrame(results)
        for client in results_df['client'].unique():
            client_results = results_df[results_df['client'] == client]
            platform = client_results['platform'].iloc[0]
            
            csv_path, _ = get_output_paths(client, platform, output_dir, '')
            client_results.to_csv(csv_path, index=False, encoding='utf-8')
            self.logger.info(f"结果已保存: {csv_path}")

def main():
    parser = argparse.ArgumentParser(description='小红书联想词自动化采集工具')
    parser.add_argument('--input', required=True, help='输入CSV文件路径')
    parser.add_argument('--outdir', required=True, help='输出目录')
    parser.add_argument('--shots', required=True, help='截图目录')
    parser.add_argument('--headful', action='store_true', help='显示浏览器界面')
    
    args = parser.parse_args()
    
    # 检查输入文件
    if not os.path.exists(args.input):
        print(f"输入文件不存在: {args.input}")
        sys.exit(1)
    
    # 读取关键词
    try:
        keywords_df = pd.read_csv(args.input, encoding='utf-8')
        if keywords_df.empty:
            print("输入文件为空")
            sys.exit(1)
        
        # 验证必要列
        required_columns = ['client', 'keyword']
        for col in required_columns:
            if col not in keywords_df.columns:
                print(f"输入文件缺少必要列: {col}")
                sys.exit(1)
        
        # 如果没有platform列，添加默认值
        if 'platform' not in keywords_df.columns:
            keywords_df['platform'] = 'xiaohongshu'
        
        print(f"成功读取 {len(keywords_df)} 个关键词")
        
    except Exception as e:
        print(f"读取输入文件失败: {e}")
        sys.exit(1)
    
    async def run_scraper():
        scraper = XiaohongshuScraper(headful=args.headful)
        
        try:
            # 初始化浏览器
            await scraper.init_browser()
            
            # 导航到小红书
            if not await scraper.navigate_to_xiaohongshu():
                print("导航到小红书失败")
                return
            
            # 处理关键词
            results = await scraper.process_keywords(keywords_df, args.outdir, args.shots)
            
            # 保存结果
            scraper.save_results(results, args.outdir)
            
            print(f"处理完成！共处理 {len(results)} 条结果")
            
        except KeyboardInterrupt:
            print("用户中断程序")
        except Exception as e:
            print(f"程序执行异常: {e}")
        finally:
            await scraper.close_browser()
    
    # 运行异步程序
    asyncio.run(run_scraper())

if __name__ == '__main__':
    main()