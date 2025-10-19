import pytesseract
from PIL import Image
import logging
import os
import platform

logger = logging.getLogger(__name__)

class OCRProcessor:
    def __init__(self, language='chi_sim+eng'):
        self.language = language
        self._setup_tesseract()
    
    def _setup_tesseract(self):
        """设置Tesseract路径（Windows需要）"""
        system = platform.system()
        if system == 'Windows':
            # Windows用户需要根据实际安装路径修改
            # 常见路径：
            # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            # pytesseract.pytesseract.tesseract_cmd = r'C:\Users\{username}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'
            
            # 尝试常见路径
            common_paths = [
                r'C:\Program Files\Tesseract-OCR\tesseract.exe',
                r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
                r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(os.getenv('USERNAME', ''))
            ]
            
            for path in common_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    logger.info(f"Found Tesseract at: {path}")
                    break
            else:
                logger.warning("Tesseract not found in common paths. Please install Tesseract and set the path manually.")
    
    def extract_text_from_image(self, image_path):
        """从图片中提取文本"""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, lang=self.language)
            return text.strip()
        except Exception as e:
            logger.error(f"OCR failed for {image_path}: {str(e)}")
            return ""
    
    def extract_text_suggestions(self, image_path):
        """从联想词截图中提取建议文本列表"""
        text = self.extract_text_from_image(image_path)
        if not text:
            return []
        
        # 简单的文本处理，按行分割并清理
        suggestions = []
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if line and len(line) > 1:  # 过滤太短的文本
                suggestions.append(line)
        
        return suggestions[:10]  # 限制最多10个建议

    def is_available(self):
        """检查OCR是否可用"""
        try:
            # 创建一个简单的测试图片
            test_image = Image.new('RGB', (100, 50), color='white')
            pytesseract.image_to_string(test_image)
            return True
        except Exception as e:
            logger.warning(f"OCR not available: {str(e)}")
            return False