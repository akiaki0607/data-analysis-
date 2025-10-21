#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
项目设置测试脚本
用于验证项目结构和依赖是否正确配置
"""

import os
import sys
from pathlib import Path

def check_file_exists(file_path, description):
    """检查文件是否存在"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} (文件不存在)")
        return False

def check_directory_exists(dir_path, description):
    """检查目录是否存在"""
    if os.path.exists(dir_path):
        print(f"✅ {description}: {dir_path}")
        return True
    else:
        print(f"❌ {description}: {dir_path} (目录不存在)")
        return False

def test_project_structure():
    """测试项目结构"""
    print("=" * 50)
    print("项目结构检查")
    print("=" * 50)
    
    # 必要文件检查
    files_to_check = [
        ("requirements.txt", "依赖文件"),
        ("README.md", "说明文档"),
        ("run.bat", "Windows运行脚本"),
        ("run.sh", "macOS/Linux运行脚本"),
        ("config/config.yml", "配置文件"),
        ("data/input/keywords.csv", "输入数据文件"),
        ("src/main.py", "主程序"),
        ("src/utils.py", "工具模块"),
        ("src/ocr.py", "OCR模块"),
    ]
    
    all_files_exist = True
    for file_path, description in files_to_check:
        if not check_file_exists(file_path, description):
            all_files_exist = False
    
    return all_files_exist

def test_input_file():
    """测试输入文件格式"""
    print("\n" + "=" * 50)
    print("输入文件格式检查")
    print("=" * 50)
    
    try:
        import pandas as pd
        df = pd.read_csv('data/input/keywords.csv')
        
        # 检查必要列
        required_columns = ['client', 'platform', 'keyword']
        missing_columns = []
        for col in required_columns:
            if col not in df.columns:
                missing_columns.append(col)
        
        if missing_columns:
            print(f"❌ 缺少必要列: {missing_columns}")
            return False
        else:
            print(f"✅ 包含所有必要列: {required_columns}")
        
        # 检查数据行数
        print(f"✅ 数据行数: {len(df)} 行")
        
        # 检查平台是否为douyin
        platforms = df['platform'].unique()
        if len(platforms) == 1 and platforms[0] == 'douyin':
            print(f"✅ 平台设置正确: {platforms[0]}")
        else:
            print(f"⚠️  平台设置: {platforms} (建议全部设为 douyin)")
        
        # 显示客户和关键词统计
        clients = df['client'].unique()
        print(f"✅ 客户数量: {len(clients)} ({', '.join(clients)})")
        
        return True
        
    except ImportError:
        print("❌ pandas 未安装，请先运行: pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"❌ 输入文件检查失败: {str(e)}")
        return False

def test_config_file():
    """测试配置文件"""
    print("\n" + "=" * 50)
    print("配置文件检查")
    print("=" * 50)
    
    try:
        import yaml
        with open('config/config.yml', 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        # 检查必要配置项
        if 'douyin' in config:
            print("✅ 抖音配置存在")
            douyin_config = config['douyin']
            
            if 'selectors' in douyin_config:
                print("✅ 选择器配置存在")
            else:
                print("❌ 缺少选择器配置")
                return False
            
            if 'timeouts' in douyin_config:
                print("✅ 超时配置存在")
            else:
                print("❌ 缺少超时配置")
                return False
        else:
            print("❌ 缺少抖音配置")
            return False
        
        return True
        
    except ImportError:
        print("❌ pyyaml 未安装，请先运行: pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"❌ 配置文件检查失败: {str(e)}")
        return False

def main():
    """主函数"""
    print("抖音联想词采集工具 - 项目设置检查")
    print("Python版本:", sys.version)
    print("当前目录:", os.getcwd())
    
    # 检查项目结构
    structure_ok = test_project_structure()
    
    # 检查输入文件
    input_ok = test_input_file()
    
    # 检查配置文件
    config_ok = test_config_file()
    
    print("\n" + "=" * 50)
    print("检查结果总结")
    print("=" * 50)
    
    if structure_ok and input_ok and config_ok:
        print("🎉 所有检查通过！项目已准备就绪。")
        print("\n下一步:")
        print("- Windows用户: 双击运行 run.bat")
        print("- macOS/Linux用户: 运行 ./run.sh")
        print("- 或手动运行: python src/main.py --input data/input/keywords.csv --outdir data/output --shots screenshots --headful")
    else:
        print("⚠️  发现问题，请根据上述提示进行修复。")
        print("\n建议:")
        print("1. 确保所有文件都存在")
        print("2. 运行: pip install -r requirements.txt")
        print("3. 再次运行此检查脚本")

if __name__ == '__main__':
    main()