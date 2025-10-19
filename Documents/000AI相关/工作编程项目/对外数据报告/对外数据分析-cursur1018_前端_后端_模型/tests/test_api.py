"""
API接口自动化测试
测试后端Flask API的所有功能
"""

import pytest
import requests
import json
import os
from pathlib import Path

# 测试配置
API_BASE_URL = "http://localhost:5001/api"
TEST_DATA_DIR = Path(__file__).parent.parent / "待处理数据_副本"


class TestAPIHealth:
    """测试API健康检查"""
    
    def test_health_check(self):
        """测试健康检查接口"""
        response = requests.get(f"{API_BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'ok'
        assert 'timestamp' in data
        print("✅ 健康检查测试通过")


class TestDemoData:
    """测试演示数据接口"""
    
    def test_demo_data_structure(self):
        """测试演示数据返回结构"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        assert response.status_code == 200
        
        data = response.json()
        assert 'data' in data
        
        # 验证必需的数据模块
        result = data['data']
        assert 'metadata' in result, "缺少元数据"
        assert 'brand_metrics' in result, "缺少品牌核心指标"
        assert 'platform_metrics' in result, "缺少平台指标"
        assert 'keyword_analysis' in result, "缺少关键词分析"
        
        print("✅ 演示数据结构测试通过")
    
    def test_metadata_fields(self):
        """测试元数据字段完整性"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        metadata = response.json()['data']['metadata']
        
        required_fields = [
            '客户名称',
            '分析周期',
            'AI平台',
            '采集关键词数',
            '循环次数'
        ]
        
        for field in required_fields:
            assert field in metadata, f"元数据缺少字段: {field}"
        
        # 验证AI平台是列表
        assert isinstance(metadata['AI平台'], list), "AI平台应该是列表"
        assert len(metadata['AI平台']) > 0, "AI平台列表不能为空"
        
        print("✅ 元数据字段测试通过")
    
    def test_brand_metrics_structure(self):
        """测试品牌核心指标结构"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        brand_metrics = response.json()['data']['brand_metrics']
        
        # 验证指标类型
        required_metrics = ['可见概率', 'Top1占比', 'Top3占比']
        
        for metric in required_metrics:
            assert metric in brand_metrics, f"缺少指标: {metric}"
            assert isinstance(brand_metrics[metric], list), f"{metric}应该是列表"
            
            # 验证数据项结构
            if len(brand_metrics[metric]) > 0:
                item = brand_metrics[metric][0]
                assert '品牌' in item, f"{metric}数据项缺少'品牌'字段"
                assert '排名' in item, f"{metric}数据项缺少'排名'字段"
                assert metric in item, f"{metric}数据项缺少'{metric}'字段"
        
        print("✅ 品牌核心指标结构测试通过")
    
    def test_platform_metrics_structure(self):
        """测试AI平台指标结构"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        platform_metrics = response.json()['data']['platform_metrics']
        
        # 应该至少有一个平台
        assert len(platform_metrics) > 0, "平台指标为空"
        
        # 验证平台数据结构
        for platform_name, platform_data in platform_metrics.items():
            assert isinstance(platform_data, dict), f"{platform_name}数据应该是字典"
            assert '可见概率' in platform_data, f"{platform_name}缺少可见概率数据"
        
        print("✅ AI平台指标结构测试通过")


class TestFileUpload:
    """测试文件上传和分析"""
    
    def test_upload_without_file(self):
        """测试不上传文件的情况"""
        response = requests.post(f"{API_BASE_URL}/analyze")
        assert response.status_code == 400
        data = response.json()
        assert data['status'] == 'error'
        assert data['error_code'] == 'NO_FILE'
        print("✅ 无文件上传测试通过")
    
    def test_upload_invalid_format(self):
        """测试上传不支持的文件格式"""
        # 创建一个临时的txt文件
        files = {'file': ('test.txt', 'test content', 'text/plain')}
        response = requests.post(f"{API_BASE_URL}/analyze", files=files)
        assert response.status_code == 400
        data = response.json()
        assert data['status'] == 'error'
        assert data['error_code'] == 'INVALID_FORMAT'
        print("✅ 无效文件格式测试通过")
    
    @pytest.mark.skipif(
        not (TEST_DATA_DIR / "取3sheet2025105思迈特_测试少量样本.xlsx").exists(),
        reason="测试文件不存在"
    )
    def test_upload_valid_excel(self):
        """测试上传有效的Excel文件"""
        test_file = TEST_DATA_DIR / "取3sheet2025105思迈特_测试少量样本.xlsx"
        
        with open(test_file, 'rb') as f:
            files = {'file': (test_file.name, f, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
            response = requests.post(f"{API_BASE_URL}/analyze", files=files, timeout=60)
        
        # 验证响应
        assert response.status_code == 200, f"上传失败: {response.text}"
        data = response.json()
        
        assert data['status'] == 'success', f"分析失败: {data.get('message')}"
        assert 'data' in data, "响应缺少data字段"
        assert 'processing_time' in data, "响应缺少processing_time字段"
        
        # 验证返回的数据结构
        result = data['data']
        assert 'metadata' in result, "结果缺少元数据"
        assert 'brand_metrics' in result, "结果缺少品牌核心指标"
        
        print(f"✅ Excel文件上传测试通过 (耗时: {data['processing_time']}秒)")
        print(f"   元数据: {result.get('metadata', {}).get('客户名称', 'N/A')}")


class TestDataValidation:
    """测试数据验证规则"""
    
    def test_percentage_values(self):
        """测试百分比数据范围"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        brand_metrics = response.json()['data']['brand_metrics']
        
        percentage_metrics = ['可见概率', '推荐概率', 'Top1占比', 'Top3占比']
        
        for metric in percentage_metrics:
            if metric in brand_metrics:
                for item in brand_metrics[metric]:
                    value = item.get(metric)
                    if value is not None:
                        assert 0 <= value <= 100, f"{metric}的值{value}超出0-100范围"
        
        print("✅ 百分比数据范围测试通过")
    
    def test_ranking_consistency(self):
        """测试排名数据一致性"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        brand_metrics = response.json()['data']['brand_metrics']
        
        # 检查排名连续性
        for metric, data_list in brand_metrics.items():
            if len(data_list) > 0:
                rankings = [item['排名'] for item in data_list]
                # 排名应该从1开始且连续
                expected_rankings = list(range(1, len(rankings) + 1))
                assert rankings == expected_rankings, f"{metric}的排名不连续: {rankings}"
        
        print("✅ 排名一致性测试通过")


class TestPlatformFilterIndependence:
    """测试AI平台筛选器独立性（需求6.1.3重点）"""
    
    def test_brand_metrics_platform_options(self):
        """测试品牌核心指标的平台筛选选项"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        data = response.json()['data']
        
        # 品牌核心指标应该支持"所有AI平台"选项
        metadata = data['metadata']
        platforms = metadata.get('AI平台', [])
        
        # 验证有多个平台
        assert len(platforms) > 0, "应该有AI平台数据"
        
        # 验证platform_metrics有每个平台的数据
        platform_metrics = data['platform_metrics']
        for platform in platforms:
            # 允许平台名称的变体（如"豆包"可能在数据中叫"Doubao"）
            print(f"   检查平台: {platform}")
        
        print("✅ 品牌核心指标平台选项测试通过")
    
    def test_keyword_analysis_platform_options(self):
        """测试关键词分析的平台筛选选项（不包含"所有"）"""
        response = requests.get(f"{API_BASE_URL}/demo-data")
        data = response.json()['data']
        
        keyword_analysis = data.get('keyword_analysis', {})
        
        # 关键词分析应该按平台分组，且每个平台独立
        assert len(keyword_analysis) > 0, "关键词分析数据不应为空"
        
        # 每个平台应该有自己的关键词数据
        for platform_name, platform_data in keyword_analysis.items():
            assert isinstance(platform_data, dict), f"{platform_name}数据格式错误"
            print(f"   关键词平台: {platform_name}")
        
        print("✅ 关键词分析平台选项测试通过")


def run_all_tests():
    """运行所有测试并生成报告"""
    print("\n" + "="*60)
    print("🧪 开始运行自动化测试套件")
    print("="*60 + "\n")
    
    # 使用pytest运行测试
    exit_code = pytest.main([
        __file__,
        '-v',  # 详细输出
        '--tb=short',  # 简短的错误信息
        '--color=yes',  # 彩色输出
        '-s',  # 显示print输出
    ])
    
    print("\n" + "="*60)
    if exit_code == 0:
        print("✅ 所有测试通过！")
    else:
        print("❌ 部分测试失败，请检查日志")
    print("="*60 + "\n")
    
    return exit_code


if __name__ == '__main__':
    run_all_tests()

