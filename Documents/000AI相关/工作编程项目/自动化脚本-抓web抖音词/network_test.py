#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
网络环境检测脚本
帮助技术小白诊断网络连接问题
"""

import requests
import time
from urllib.parse import urlparse

def test_website_access():
    """测试网站访问情况"""
    print("🔍 开始检测网络环境...")
    print("=" * 50)
    
    # 测试的网站列表
    test_sites = [
        ("百度", "https://www.baidu.com"),
        ("抖音主站", "https://www.douyin.com"),
        ("抖音移动版", "https://m.douyin.com"),
        ("抖音搜索", "https://www.douyin.com/search"),
        ("字节跳动", "https://www.bytedance.com"),
    ]
    
    results = []
    
    for name, url in test_sites:
        print(f"正在测试 {name} ({url})...")
        try:
            # 设置超时和请求头
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
            
            if response.status_code == 200:
                status = "✅ 正常"
                color = "green"
            elif response.status_code == 404:
                status = "❌ 404错误"
                color = "red"
            elif response.status_code == 403:
                status = "🚫 访问被拒绝"
                color = "yellow"
            else:
                status = f"⚠️  返回{response.status_code}"
                color = "yellow"
                
            results.append((name, url, status, response.status_code, color))
            print(f"   {status}")
            
        except requests.exceptions.Timeout:
            results.append((name, url, "⏰ 超时", "timeout", "red"))
            print("   ⏰ 连接超时")
            
        except requests.exceptions.ConnectionError:
            results.append((name, url, "🔌 连接失败", "connection_error", "red"))
            print("   🔌 无法连接")
            
        except Exception as e:
            results.append((name, url, f"❌ 错误: {str(e)[:50]}", "error", "red"))
            print(f"   ❌ 错误: {str(e)[:50]}")
        
        time.sleep(1)  # 避免请求过快
    
    print("\n" + "=" * 50)
    print("📊 检测结果总结:")
    print("=" * 50)
    
    for name, url, status, code, color in results:
        print(f"{name:12} | {status}")
    
    # 分析结果并给出建议
    print("\n" + "=" * 50)
    print("💡 问题诊断和建议:")
    print("=" * 50)
    
    # 统计各种状态
    normal_count = sum(1 for r in results if r[4] == "green")
    error_count = sum(1 for r in results if r[4] == "red")
    
    if normal_count == 0:
        print("🔴 网络问题严重")
        print("建议：")
        print("1. 检查网络连接是否正常")
        print("2. 尝试重启路由器")
        print("3. 联系网络服务商")
        
    elif any("douyin" in r[1].lower() and r[4] == "red" for r in results):
        print("🟡 抖音网站访问受限")
        print("建议：")
        print("1. 尝试使用手机热点网络")
        print("2. 更换网络环境（公司、朋友家等）")
        print("3. 使用VPN连接")
        print("4. 稍后再试（可能是临时问题）")
        
    else:
        print("🟢 网络环境基本正常")
        print("建议：")
        print("1. 程序可能需要调整配置")
        print("2. 尝试在不同时间段运行")
        
    print("\n" + "=" * 50)
    print("🚀 下一步操作建议:")
    print("=" * 50)
    
    if any("douyin" in r[1].lower() and r[3] == 200 for r in results):
        print("✅ 抖音网站可以访问，可以尝试运行采集程序")
        print("运行命令：")
        print("source test_env/bin/activate && python src/main.py --input data/input/keywords.csv --outdir data/output --shots screenshots --headful")
    else:
        print("❌ 抖音网站暂时无法访问")
        print("1. 先尝试上述建议解决网络问题")
        print("2. 或者使用演示数据查看程序功能：")
        print("   python create_demo_results.py")

if __name__ == '__main__':
    print("🌐 抖音联想词采集工具 - 网络环境检测")
    print("帮助您诊断网络连接问题")
    print()
    
    try:
        test_website_access()
    except KeyboardInterrupt:
        print("\n\n⚠️  检测被用户中断")
    except Exception as e:
        print(f"\n\n❌ 检测过程出错: {str(e)}")
    
    print("\n" + "=" * 50)
    print("检测完成！如有疑问，请联系技术支持。")
    print("=" * 50)