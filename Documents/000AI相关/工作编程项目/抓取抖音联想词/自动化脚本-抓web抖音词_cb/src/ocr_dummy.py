import logging

logger = logging.getLogger(__name__)

class OCRProcessor:
    def __init__(self, language='chi_sim+eng'):
        self.language = language
        logger.warning("OCR功能已禁用 - pytesseract未安装")
    
    def extract_text_from_image(self, image_path):
        """OCR功能已禁用，返回空字符串"""
        logger.warning(f"OCR功能已禁用，无法从图片 {image_path} 提取文本")
        return ""
    
    def extract_text_from_screenshot(self, screenshot_data):
        """OCR功能已禁用，返回空字符串"""
        logger.warning("OCR功能已禁用，无法从截图提取文本")
        return ""