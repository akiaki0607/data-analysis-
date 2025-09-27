#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GEO优化分析系统测试脚本
用于测试系统的完整功能
"""

import os
import sys
import shutil
from app import GEOAnalyzer

def test_analysis_with_sample_data():
    """使用示例数据测试分析功能"""
    print("=" * 60)
    print("GEO优化分析系统 - 功能测试")
    print("=" * 60)
    
    # 初始化分析器
    analyzer = GEOAnalyzer()
    
    # 示例数据文件路径
    sample_file = 'requerment/多工作表清洗结果_2025-09-24T02-14-36_副本.xlsx'
    
    if not os.path.exists(sample_file):
        print(f"❌ 示例数据文件不存在: {sample_file}")
        return False
    
    print(f"📁 加载示例数据文件: {sample_file}")
    
    # 1. 加载数据
    success, message = analyzer.load_excel_data(sample_file)
    if not success:
        print(f"❌ 数据加载失败: {message}")
        return False
    
    print(f"✅ 数据加载成功: {message}")
    print(f"   客户名称: {analyzer.client_name}")
    print(f"   竞品数量: {len(analyzer.competitors)}")
    print(f"   竞品列表: {', '.join(analyzer.competitors)}")
    
    # 2. 运行完整分析
    print("\n🔍 开始运行完整分析...")
    results = analyzer.run_full_analysis()
    
    # 3. 输出分析结果
    print("\n📊 分析结果概览:")
    print(f"   薄弱组合数量: {results['weak_combinations_count']}")
    print(f"   蓝海关键词数量: {results['blue_ocean_count']}")
    print(f"   信源分析记录: {len(results['source_analysis'])}")
    
    # 4. 显示前5个优先级关键词
    print("\n🏆 前5个优先级关键词 (按薄弱AI平台数量排序):")
    for i, (keyword, count) in enumerate(results['sorted_keywords'][:5], 1):
        stats = results['keyword_stats'][keyword]
        print(f"   {i}. {keyword}")
        print(f"      - 薄弱AI平台: {count}个")
        print(f"      - 平均客户可见概率: {stats['avg_client_visibility']:.1f}%")
        print(f"      - 平均竞品可见概率: {stats['avg_competitor_visibility']:.1f}%")
    
    # 5. 显示前10个薄弱组合
    print("\n⚠️  前10个薄弱组合:")
    for i, combo in enumerate(results['weak_combinations'][:10], 1):
        blue_ocean = "🌊蓝海" if combo['是否蓝海'] else "❌非蓝海"
        print(f"   {i}. {combo['关键词']} | {combo['AI平台']} | 客户:{combo['客户可见概率']:.1f}% | {blue_ocean}")
    
    # 6. 显示薄弱信源平台统计
    weak_sources = [s for s in results['source_analysis'] if s['是否薄弱信源平台']]
    print(f"\n📉 薄弱信源平台数量: {len(weak_sources)}")
    
    if weak_sources:
        print("   前5个薄弱信源平台:")
        for i, source in enumerate(weak_sources[:5], 1):
            print(f"   {i}. {source['信源平台名称']} | {source['关键词']} | 占比:{source['客户信源文章占比']:.1f}%")
    
    print("\n✅ 分析完成！")
    print(f"📅 分析时间: {results['analysis_time']}")
    
    return True

def copy_sample_to_uploads():
    """复制示例文件到uploads目录，方便Web界面测试"""
    sample_file = 'requerment/多工作表清洗结果_2025-09-24T02-14-36_副本.xlsx'
    uploads_dir = 'uploads'
    
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)
    
    if os.path.exists(sample_file):
        target_file = os.path.join(uploads_dir, '示例数据.xlsx')
        shutil.copy2(sample_file, target_file)
        print(f"📋 示例文件已复制到: {target_file}")
        return True
    
    return False

def main():
    """主函数"""
    print("🚀 启动GEO优化分析系统测试")
    
    # 测试分析功能
    if test_analysis_with_sample_data():
        print("\n" + "=" * 60)
        print("🎉 所有测试通过！系统功能正常")
        
        # 复制示例文件
        copy_sample_to_uploads()
        
        print("\n💡 使用建议:")
        print("1. 访问 http://127.0.0.1:8080 使用Web界面")
        print("2. 上传 'requerment/多工作表清洗结果_2025-09-24T02-14-36_副本.xlsx' 文件")
        print("3. 查看完整的分析过程和结果")
        print("=" * 60)
    else:
        print("\n❌ 测试失败，请检查系统配置")
        sys.exit(1)

if __name__ == "__main__":
    main()