#!/usr/bin/env python3
"""
运行所有测试的主入口
自动化测试执行器
"""

import sys
import subprocess
from pathlib import Path
import argparse


def check_services():
    """检查必要的服务是否运行"""
    import requests
    
    print("🔍 检查服务状态...")
    
    # 检查前端服务
    try:
        response = requests.get("http://localhost:3000", timeout=2)
        print("  ✅ 前端服务运行正常 (端口 3000)")
    except:
        print("  ⚠️  前端服务未运行 (端口 3000)")
        print("     请运行: cd frontend && python3 -m http.server 3000")
    
    # 检查后端服务
    try:
        response = requests.get("http://localhost:5001/api/health", timeout=2)
        if response.status_code == 200:
            print("  ✅ 后端服务运行正常 (端口 5001)")
        else:
            print(f"  ⚠️  后端服务响应异常 (状态码: {response.status_code})")
    except:
        print("  ⚠️  后端服务未运行 (端口 5001)")
        print("     请运行: cd backend && PORT=5001 python app.py")
    
    print()


def run_tests(test_type='all', verbose=False, skip_frontend=False):
    """
    运行测试
    
    Args:
        test_type: 测试类型 (all, api, processor, frontend)
        verbose: 是否显示详细输出
        skip_frontend: 是否跳过前端测试
    """
    project_root = Path(__file__).parent.parent
    tests_dir = project_root / 'tests'
    
    # 基础pytest参数
    pytest_args = [
        '-v' if verbose else '-q',
        '--tb=short',
        '--color=yes',
        '-s',
    ]
    
    # 根据测试类型选择测试文件
    if test_type == 'all':
        test_files = [
            tests_dir / 'test_api.py',
            tests_dir / 'test_data_processor.py',
        ]
        if not skip_frontend:
            test_files.append(tests_dir / 'test_frontend.py')
    elif test_type == 'api':
        test_files = [tests_dir / 'test_api.py']
    elif test_type == 'processor':
        test_files = [tests_dir / 'test_data_processor.py']
    elif test_type == 'frontend':
        test_files = [tests_dir / 'test_frontend.py']
    else:
        print(f"❌ 未知的测试类型: {test_type}")
        return 1
    
    # 执行测试
    print("="*70)
    print(f"🧪 开始运行测试 (类型: {test_type})")
    print("="*70)
    print()
    
    import pytest
    
    all_passed = True
    for test_file in test_files:
        if not test_file.exists():
            print(f"⚠️  测试文件不存在: {test_file}")
            continue
        
        print(f"\n📝 运行测试文件: {test_file.name}")
        print("-"*70)
        
        exit_code = pytest.main([str(test_file)] + pytest_args)
        
        if exit_code != 0:
            all_passed = False
    
    # 打印总结
    print("\n" + "="*70)
    if all_passed:
        print("✅ 所有测试通过！")
    else:
        print("❌ 部分测试失败，请检查日志")
    print("="*70)
    
    return 0 if all_passed else 1


def generate_test_report():
    """生成测试报告"""
    project_root = Path(__file__).parent.parent
    tests_dir = project_root / 'tests'
    report_file = project_root / 'test_report.html'
    
    print("📊 生成测试报告...")
    
    import pytest
    
    pytest_args = [
        str(tests_dir),
        '--html=' + str(report_file),
        '--self-contained-html',
        '-v',
    ]
    
    pytest.main(pytest_args)
    
    print(f"✅ 测试报告已生成: {report_file}")


def main():
    parser = argparse.ArgumentParser(description='运行自动化测试套件')
    parser.add_argument(
        '--type',
        choices=['all', 'api', 'processor', 'frontend'],
        default='all',
        help='测试类型'
    )
    parser.add_argument(
        '--verbose',
        '-v',
        action='store_true',
        help='显示详细输出'
    )
    parser.add_argument(
        '--skip-frontend',
        action='store_true',
        help='跳过前端测试（不需要浏览器）'
    )
    parser.add_argument(
        '--check-services',
        action='store_true',
        help='仅检查服务状态'
    )
    parser.add_argument(
        '--report',
        action='store_true',
        help='生成HTML测试报告'
    )
    
    args = parser.parse_args()
    
    # 检查服务
    if args.check_services:
        check_services()
        return 0
    
    # 运行测试前检查服务
    check_services()
    
    # 生成报告
    if args.report:
        generate_test_report()
        return 0
    
    # 运行测试
    exit_code = run_tests(
        test_type=args.type,
        verbose=args.verbose,
        skip_frontend=args.skip_frontend
    )
    
    return exit_code


if __name__ == '__main__':
    sys.exit(main())

