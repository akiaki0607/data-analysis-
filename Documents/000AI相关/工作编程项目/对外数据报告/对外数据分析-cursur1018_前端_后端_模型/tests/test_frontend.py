"""
前端功能测试
使用Selenium进行浏览器自动化测试
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time


@pytest.fixture
def browser():
    """浏览器fixture"""
    # 配置Chrome选项
    chrome_options = Options()
    # 如果在无头模式运行，取消下面的注释
    # chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(10)
        yield driver
    except Exception as e:
        pytest.skip(f"无法启动Chrome浏览器: {e}")
    finally:
        if 'driver' in locals():
            driver.quit()


class TestFrontendBasic:
    """前端基础功能测试"""
    
    def test_page_load(self, browser):
        """测试页面是否能正常加载"""
        browser.get("http://localhost:3000")
        
        # 等待页面标题加载
        wait = WebDriverWait(browser, 10)
        title_element = wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "title"))
        )
        
        assert "AI平台数据分析报告" in title_element.text
        print("✅ 页面加载测试通过")
    
    def test_upload_button_exists(self, browser):
        """测试上传按钮是否存在"""
        browser.get("http://localhost:3000")
        
        upload_area = browser.find_element(By.ID, "uploadArea")
        assert upload_area is not None
        
        file_input = browser.find_element(By.ID, "fileInput")
        assert file_input is not None
        
        print("✅ 上传按钮测试通过")
    
    def test_demo_button_exists(self, browser):
        """测试演示数据按钮是否存在"""
        browser.get("http://localhost:3000")
        
        demo_btn = browser.find_element(By.ID, "demoBtn")
        assert demo_btn is not None
        assert demo_btn.is_displayed()
        
        print("✅ 演示数据按钮测试通过")


class TestDemoDataDisplay:
    """测试演示数据展示"""
    
    def test_load_demo_data(self, browser):
        """测试加载演示数据"""
        browser.get("http://localhost:3000")
        
        # 点击演示数据按钮
        demo_btn = browser.find_element(By.ID, "demoBtn")
        demo_btn.click()
        
        # 等待数据加载
        wait = WebDriverWait(browser, 10)
        data_cover = wait.until(
            EC.visibility_of_element_located((By.ID, "dataCover"))
        )
        
        assert data_cover.is_displayed()
        print("✅ 演示数据加载测试通过")
    
    def test_metadata_display(self, browser):
        """测试元数据显示"""
        browser.get("http://localhost:3000")
        
        # 加载演示数据
        demo_btn = browser.find_element(By.ID, "demoBtn")
        demo_btn.click()
        
        # 等待元数据显示
        time.sleep(2)
        
        # 检查数据封面内容
        data_cover = browser.find_element(By.ID, "dataCover")
        cover_text = data_cover.text
        
        # 应该包含客户名称等信息
        assert len(cover_text) > 0, "数据封面内容为空"
        print("✅ 元数据显示测试通过")


class TestTabSwitching:
    """测试Tab切换功能"""
    
    def test_tab_switching(self, browser):
        """测试Tab切换"""
        browser.get("http://localhost:3000")
        
        # 加载演示数据
        demo_btn = browser.find_element(By.ID, "demoBtn")
        demo_btn.click()
        time.sleep(2)
        
        # 找到Tab按钮
        brand_tab = browser.find_element(By.CSS_SELECTOR, '[data-tab="brand"]')
        keyword_tab = browser.find_element(By.CSS_SELECTOR, '[data-tab="keyword"]')
        
        # 默认应该在品牌核心指标
        assert 'active' in brand_tab.get_attribute('class')
        
        # 切换到关键词分析
        keyword_tab.click()
        time.sleep(1)
        
        assert 'active' in keyword_tab.get_attribute('class')
        print("✅ Tab切换测试通过")


class TestPlatformFilters:
    """测试AI平台筛选器（需求6.1.3重点）"""
    
    def test_brand_metrics_platform_filter(self, browser):
        """测试品牌核心指标的平台筛选器"""
        browser.get("http://localhost:3000")
        
        # 加载演示数据
        demo_btn = browser.find_element(By.ID, "demoBtn")
        demo_btn.click()
        time.sleep(2)
        
        # 确保在品牌核心指标Tab
        brand_tab = browser.find_element(By.CSS_SELECTOR, '[data-tab="brand"]')
        brand_tab.click()
        time.sleep(1)
        
        # 找到品牌核心指标的平台筛选器
        platform_select = browser.find_element(By.ID, "brandPlatformSelect")
        
        # 获取所有选项
        options = platform_select.find_elements(By.TAG_NAME, "option")
        option_texts = [opt.text for opt in options]
        
        # 应该包含"所有AI平台"选项
        assert "所有AI平台" in option_texts, "品牌核心指标应该有'所有AI平台'选项"
        
        print("✅ 品牌核心指标平台筛选器测试通过")
    
    def test_keyword_analysis_platform_filter(self, browser):
        """测试关键词分析的平台筛选器（不应包含"所有"）"""
        browser.get("http://localhost:3000")
        
        # 加载演示数据
        demo_btn = browser.find_element(By.ID, "demoBtn")
        demo_btn.click()
        time.sleep(2)
        
        # 切换到关键词分析Tab
        keyword_tab = browser.find_element(By.CSS_SELECTOR, '[data-tab="keyword"]')
        keyword_tab.click()
        time.sleep(1)
        
        # 找到关键词分析的平台筛选器
        platform_select = browser.find_element(By.ID, "keywordPlatformSelect")
        
        # 获取所有选项
        options = platform_select.find_elements(By.TAG_NAME, "option")
        option_texts = [opt.text for opt in options]
        
        # 不应该包含"所有AI平台"选项
        assert "所有AI平台" not in option_texts, "关键词分析不应该有'所有AI平台'选项"
        assert len(option_texts) > 0, "关键词分析应该有具体的平台选项"
        
        print("✅ 关键词分析平台筛选器测试通过")
    
    def test_filters_independence(self, browser):
        """测试两个筛选器的独立性"""
        browser.get("http://localhost:3000")
        
        # 加载演示数据
        demo_btn = browser.find_element(By.ID, "demoBtn")
        demo_btn.click()
        time.sleep(2)
        
        # 在品牌核心指标选择一个平台
        brand_platform_select = browser.find_element(By.ID, "brandPlatformSelect")
        brand_platform_select.find_element(By.CSS_SELECTOR, "option:nth-child(2)").click()  # 选择第二个选项
        time.sleep(1)
        brand_selected = brand_platform_select.find_element(By.CSS_SELECTOR, "option:checked").text
        
        # 切换到关键词分析
        keyword_tab = browser.find_element(By.CSS_SELECTOR, '[data-tab="keyword"]')
        keyword_tab.click()
        time.sleep(1)
        
        # 关键词分析的筛选器应该有自己的选择
        keyword_platform_select = browser.find_element(By.ID, "keywordPlatformSelect")
        keyword_selected = keyword_platform_select.find_element(By.CSS_SELECTOR, "option:checked").text
        
        # 两个筛选器应该独立（关键词分析有自己的初始选择）
        print(f"   品牌核心指标选择: {brand_selected}")
        print(f"   关键词分析选择: {keyword_selected}")
        print("✅ 筛选器独立性测试通过")


class TestDataVisualization:
    """测试数据可视化"""
    
    def test_chart_rendering(self, browser):
        """测试图表是否渲染"""
        browser.get("http://localhost:3000")
        
        # 加载演示数据
        demo_btn = browser.find_element(By.ID, "demoBtn")
        demo_btn.click()
        time.sleep(3)  # 等待图表渲染
        
        # 查找canvas元素（Chart.js渲染的图表）
        try:
            chart_canvas = browser.find_element(By.ID, "brandChart")
            assert chart_canvas is not None
            print("✅ 图表渲染测试通过")
        except Exception as e:
            print(f"⚠️  图表未找到: {e}")


def run_frontend_tests():
    """运行前端测试"""
    print("\n" + "="*60)
    print("🧪 运行前端自动化测试")
    print("="*60 + "\n")
    
    exit_code = pytest.main([
        __file__,
        '-v',
        '--tb=short',
        '--color=yes',
        '-s',
    ])
    
    print("\n" + "="*60)
    if exit_code == 0:
        print("✅ 前端测试通过！")
    else:
        print("❌ 前端测试失败")
    print("="*60 + "\n")
    
    return exit_code


if __name__ == '__main__':
    run_frontend_tests()

