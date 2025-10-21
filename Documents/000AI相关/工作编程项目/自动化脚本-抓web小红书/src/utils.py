import os
import re
import logging
from datetime import datetime
from pathlib import Path

def setup_logging(level='INFO'):
    """设置日志配置"""
    logging.basicConfig(
        level=getattr(logging, level),
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('xiaohongshu_scraper.log', encoding='utf-8'),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

def sanitize_filename(filename):
    """净化文件名，移除特殊字符"""
    # 移除或替换不安全的字符
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    filename = re.sub(r'[\s]+', '_', filename)  # 多个空格替换为单个下划线
    filename = filename.strip('._')  # 移除开头结尾的点和下划线
    return filename[:100]  # 限制长度

def get_current_date():
    """获取当前日期字符串 YYYY-MM-DD"""
    return datetime.now().strftime('%Y-%m-%d')

def get_timestamp():
    """获取时间戳字符串"""
    return datetime.now().strftime('%Y%m%d_%H%M%S')

def ensure_dir(path):
    """确保目录存在"""
    Path(path).mkdir(parents=True, exist_ok=True)

def get_output_paths(client, platform, base_output_dir, base_screenshot_dir):
    """生成输出路径"""
    current_date = get_current_date()
    
    # CSV输出路径
    csv_dir = os.path.join(base_output_dir, current_date)
    ensure_dir(csv_dir)
    csv_filename = f"{sanitize_filename(client)}_{platform}.csv"
    csv_path = os.path.join(csv_dir, csv_filename)
    
    # 截图输出路径
    screenshot_dir = os.path.join(base_screenshot_dir, current_date, sanitize_filename(client), platform)
    ensure_dir(screenshot_dir)
    
    return csv_path, screenshot_dir

def create_screenshot_filename(keyword, timestamp=None, platform='xiaohongshu'):
    """创建截图文件名"""
    if timestamp is None:
        timestamp = get_timestamp()
    safe_keyword = sanitize_filename(keyword)
    return f"{safe_keyword}_{timestamp}.png"

def get_relative_screenshot_path(screenshot_full_path, base_dir):
    """获取截图的相对路径"""
    try:
        return os.path.relpath(screenshot_full_path, base_dir)
    except ValueError:
        return screenshot_full_path