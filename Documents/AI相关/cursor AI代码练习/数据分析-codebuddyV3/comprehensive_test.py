#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GEO优化分析系统 - 全面测试脚本
按照PRD V3要求进行完整功能测试
"""

import os
import sys
import pandas as pd
import json
from datetime import datetime
import traceback
from app import GEOAnalyzer

class ComprehensiveTestSuite:
    def __init__(self):
        self.test_results = []
        self.analyzer = GEOAnalyzer()
        self.test_data_path = None
        self.start_time = datetime.now()
        
    def log_test(self, test_name, status, message, details=None):
        """记录测试结果"""
        result = {
            'test_name': test_name,
            'status': status,  # PASS, FAIL, SKIP
            'message': message,
            'details': details,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        self.test_results.append(result)
        
        # 实时输出测试结果
        status_symbol = "✓" if status == "PASS" else "✗" if status == "FAIL" else "○"
        print(f"{status_symbol} {test_name}: {message}")
        if details and status == "FAIL":
            print(f"   详细信息: {details}")
    
    def find_test_data(self):
        """查找测试数据文件"""
        possible_paths = [
            'uploads',
            '.',
            'test_data',
            'data'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                for file in os.listdir(path):
                    if file.endswith('.xlsx') and ('数据' in file or 'data' in file.lower()):
                        full_path = os.path.join(path, file)
                        self.test_data_path = full_path
                        self.log_test("数据文件查找", "PASS", f"找到测试数据: {full_path}")
                        return True
        
        self.log_test("数据文件查找", "FAIL", "未找到Excel测试数据文件")
        return False
    
    def test_data_loading(self):
        """测试数据加载功能"""
        if not self.test_data_path:
            self.log_test("数据加载测试", "SKIP", "没有测试数据文件")
            return False
            
        try:
            success, message = self.analyzer.load_excel_data(self.test_data_path)
            
            if success:
                # 验证数据结构
                required_sheets = ['cover', 'summary', 'keywords', 'sources']
                missing_sheets = [sheet for sheet in required_sheets if sheet not in self.analyzer.data]
                
                if missing_sheets:
                    self.log_test("数据加载测试", "FAIL", f"缺少必要的数据表: {missing_sheets}")
                    return False
                
                # 验证客户名称和竞品信息
                if not self.analyzer.client_name:
                    self.log_test("数据加载测试", "FAIL", "未能获取客户名称")
                    return False
                
                if not self.analyzer.competitors:
                    self.log_test("数据加载测试", "FAIL", "未能获取竞品信息")
                    return False
                
                self.log_test("数据加载测试", "PASS", 
                            f"成功加载数据 - 客户: {self.analyzer.client_name}, 竞品数量: {len(self.analyzer.competitors)}")
                return True
            else:
                self.log_test("数据加载测试", "FAIL", f"数据加载失败: {message}")
                return False
                
        except Exception as e:
            self.log_test("数据加载测试", "FAIL", f"数据加载异常: {str(e)}", traceback.format_exc())
            return False
    
    def test_weak_combinations_identification(self):
        """测试薄弱组合识别功能"""
        try:
            weak_combinations = self.analyzer.identify_weak_combinations()
            
            if not weak_combinations:
                self.log_test("薄弱组合识别", "FAIL", "未识别到任何薄弱组合")
                return False
            
            # 验证数据结构
            required_fields = ['关键词', 'AI平台', '客户可见概率', '竞品最高可见概率', '最高竞品名称', '是否蓝海']
            sample_combo = weak_combinations[0]
            missing_fields = [field for field in required_fields if field not in sample_combo]
            
            if missing_fields:
                self.log_test("薄弱组合识别", "FAIL", f"薄弱组合数据结构不完整，缺少字段: {missing_fields}")
                return False
            
            # 验证薄弱组合逻辑（客户可见概率 < 35%）
            invalid_combinations = [combo for combo in weak_combinations if combo['客户可见概率'] >= 35]
            if invalid_combinations:
                self.log_test("薄弱组合识别", "FAIL", 
                            f"发现不符合薄弱条件的组合（可见概率>=35%）: {len(invalid_combinations)}个")
                return False
            
            # 统计蓝海关键词
            blue_ocean_count = len([combo for combo in weak_combinations if combo['是否蓝海']])
            
            self.log_test("薄弱组合识别", "PASS", 
                        f"成功识别 {len(weak_combinations)} 个薄弱组合，其中 {blue_ocean_count} 个蓝海组合")
            return True
            
        except Exception as e:
            self.log_test("薄弱组合识别", "FAIL", f"薄弱组合识别异常: {str(e)}", traceback.format_exc())
            return False
    
    def test_blue_ocean_prioritization(self):
        """测试蓝海关键词优先级排序"""
        try:
            weak_combinations = self.analyzer.identify_weak_combinations()
            sorted_keywords, blue_ocean_combinations, keyword_stats = self.analyzer.prioritize_blue_ocean_keywords(weak_combinations)
            
            if not sorted_keywords:
                self.log_test("蓝海关键词优先级", "FAIL", "未找到蓝海关键词")
                return False
            
            # 验证排序逻辑（按薄弱AI平台数量降序）
            for i in range(len(sorted_keywords) - 1):
                current_count = sorted_keywords[i][1]
                next_count = sorted_keywords[i + 1][1]
                if current_count < next_count:
                    self.log_test("蓝海关键词优先级", "FAIL", 
                                f"排序错误: {sorted_keywords[i][0]}({current_count}) 应该排在 {sorted_keywords[i+1][0]}({next_count}) 之后")
                    return False
            
            # 验证统计数据
            for keyword, count in sorted_keywords:
                if keyword not in keyword_stats:
                    self.log_test("蓝海关键词优先级", "FAIL", f"关键词统计数据缺失: {keyword}")
                    return False
                
                if keyword_stats[keyword]['platform_count'] != count:
                    self.log_test("蓝海关键词优先级", "FAIL", 
                                f"关键词 {keyword} 平台数量统计不一致: {keyword_stats[keyword]['platform_count']} vs {count}")
                    return False
            
            self.log_test("蓝海关键词优先级", "PASS", 
                        f"成功排序 {len(sorted_keywords)} 个蓝海关键词，最高优先级: {sorted_keywords[0][0]}({sorted_keywords[0][1]}个平台)")
            return True
            
        except Exception as e:
            self.log_test("蓝海关键词优先级", "FAIL", f"蓝海关键词优先级异常: {str(e)}", traceback.format_exc())
            return False
    
    def test_excellent_source_platforms(self):
        """测试优秀信源平台识别（PRD V3要求）"""
        try:
            weak_combinations = self.analyzer.identify_weak_combinations()
            sorted_keywords, blue_ocean_combinations, keyword_stats = self.analyzer.prioritize_blue_ocean_keywords(weak_combinations)
            source_analysis = self.analyzer.identify_excellent_source_platforms(blue_ocean_combinations, sorted_keywords)
            
            if not source_analysis:
                self.log_test("优秀信源平台识别", "FAIL", "未识别到任何信源平台数据")
                return False
            
            # 验证数据结构
            required_fields = ['关键词', 'AI平台', '信源平台名称', '选用信源文章总数', '客户信源文章占比', '是否薄弱信源平台']
            sample_source = source_analysis[0]
            missing_fields = [field for field in required_fields if field not in sample_source]
            
            if missing_fields:
                self.log_test("优秀信源平台识别", "FAIL", f"信源平台数据结构不完整，缺少字段: {missing_fields}")
                return False
            
            # 验证是否按照PRD V3要求选择了前20个优秀信源平台
            unique_sources = list(set([item['信源平台名称'] for item in source_analysis]))
            if len(unique_sources) > 20:
                self.log_test("优秀信源平台识别", "FAIL", f"信源平台数量超过20个: {len(unique_sources)}")
                return False
            
            # 验证薄弱信源平台逻辑（客户信源文章占比 < 50%）
            weak_sources = [item for item in source_analysis if item['是否薄弱信源平台']]
            strong_sources = [item for item in source_analysis if not item['是否薄弱信源平台']]
            
            self.log_test("优秀信源平台识别", "PASS", 
                        f"成功分析 {len(unique_sources)} 个优秀信源平台，薄弱平台: {len(weak_sources)}个，强势平台: {len(strong_sources)}个")
            return True
            
        except Exception as e:
            self.log_test("优秀信源平台识别", "FAIL", f"优秀信源平台识别异常: {str(e)}", traceback.format_exc())
            return False
    
    def test_full_analysis_integration(self):
        """测试完整分析流程集成"""
        try:
            analysis_results = self.analyzer.run_full_analysis()
            
            # 验证分析结果结构
            required_keys = [
                'client_name', 'competitors', 'weak_combinations_count', 'blue_ocean_count',
                'weak_combinations', 'blue_ocean_combinations', 'sorted_keywords', 
                'keyword_stats', 'source_analysis', 'analysis_time'
            ]
            
            missing_keys = [key for key in required_keys if key not in analysis_results]
            if missing_keys:
                self.log_test("完整分析集成", "FAIL", f"分析结果缺少必要字段: {missing_keys}")
                return False
            
            # 验证数据一致性
            if len(analysis_results['weak_combinations']) != analysis_results['weak_combinations_count']:
                self.log_test("完整分析集成", "FAIL", "薄弱组合数量统计不一致")
                return False
            
            if len(analysis_results['blue_ocean_combinations']) != analysis_results['blue_ocean_count']:
                self.log_test("完整分析集成", "FAIL", "蓝海组合数量统计不一致")
                return False
            
            self.log_test("完整分析集成", "PASS", 
                        f"完整分析成功 - 薄弱组合: {analysis_results['weak_combinations_count']}, "
                        f"蓝海关键词: {len(analysis_results['sorted_keywords'])}, "
                        f"信源平台分析: {len(analysis_results['source_analysis'])}")
            return True
            
        except Exception as e:
            self.log_test("完整分析集成", "FAIL", f"完整分析集成异常: {str(e)}", traceback.format_exc())
            return False
    
    def test_data_accuracy_validation(self):
        """测试数据准确性验证"""
        try:
            # 获取原始数据进行验证
            keyword_df = self.analyzer.data['keywords']
            source_df = self.analyzer.data['sources']
            
            # 验证薄弱组合数据准确性
            weak_combinations = self.analyzer.identify_weak_combinations()
            
            # 随机抽取几个薄弱组合进行验证
            import random
            sample_size = min(5, len(weak_combinations))
            sample_combinations = random.sample(weak_combinations, sample_size)
            
            accuracy_errors = []
            
            for combo in sample_combinations:
                keyword = combo['关键词']
                platform = combo['AI平台']
                
                # 验证客户可见概率
                client_data = keyword_df[
                    (keyword_df['关键词'] == keyword) & 
                    (keyword_df['平台'] == platform) & 
                    (keyword_df['品牌'] == self.analyzer.client_name)
                ]
                
                if len(client_data) == 0:
                    accuracy_errors.append(f"未找到客户数据: {keyword} - {platform}")
                    continue
                
                actual_client_visibility = client_data['可见概率'].iloc[0]
                if abs(actual_client_visibility - combo['客户可见概率']) > 0.01:
                    accuracy_errors.append(f"客户可见概率不匹配: {keyword} - {platform}")
                
                # 验证竞品最高可见概率
                competitor_data = keyword_df[
                    (keyword_df['关键词'] == keyword) & 
                    (keyword_df['平台'] == platform) & 
                    (keyword_df['品牌'].isin(self.analyzer.competitors))
                ]
                
                if len(competitor_data) > 0:
                    actual_max_competitor = competitor_data['可见概率'].max()
                    if abs(actual_max_competitor - combo['竞品最高可见概率']) > 0.01:
                        accuracy_errors.append(f"竞品最高可见概率不匹配: {keyword} - {platform}")
            
            if accuracy_errors:
                self.log_test("数据准确性验证", "FAIL", f"发现 {len(accuracy_errors)} 个数据准确性问题", accuracy_errors)
                return False
            else:
                self.log_test("数据准确性验证", "PASS", f"随机验证 {sample_size} 个组合，数据准确性良好")
                return True
                
        except Exception as e:
            self.log_test("数据准确性验证", "FAIL", f"数据准确性验证异常: {str(e)}", traceback.format_exc())
            return False
    
    def run_all_tests(self):
        """运行所有测试"""
        print("=" * 60)
        print("GEO优化分析系统 - 全面测试开始")
        print("=" * 60)
        
        # 测试序列
        test_sequence = [
            self.find_test_data,
            self.test_data_loading,
            self.test_weak_combinations_identification,
            self.test_blue_ocean_prioritization,
            self.test_excellent_source_platforms,
            self.test_full_analysis_integration,
            self.test_data_accuracy_validation
        ]
        
        # 执行测试
        for test_func in test_sequence:
            try:
                test_func()
            except Exception as e:
                self.log_test(test_func.__name__, "FAIL", f"测试执行异常: {str(e)}", traceback.format_exc())
        
        # 生成测试报告
        self.generate_test_report()
    
    def generate_test_report(self):
        """生成测试报告"""
        end_time = datetime.now()
        duration = end_time - self.start_time
        
        # 统计测试结果
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['status'] == 'PASS'])
        failed_tests = len([r for r in self.test_results if r['status'] == 'FAIL'])
        skipped_tests = len([r for r in self.test_results if r['status'] == 'SKIP'])
        
        # 生成报告
        report = {
            'test_summary': {
                'total_tests': total_tests,
                'passed': passed_tests,
                'failed': failed_tests,
                'skipped': skipped_tests,
                'success_rate': f"{(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "0%",
                'duration': str(duration),
                'start_time': self.start_time.strftime('%Y-%m-%d %H:%M:%S'),
                'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S')
            },
            'test_results': self.test_results,
            'system_info': {
                'python_version': sys.version,
                'test_data_path': self.test_data_path,
                'client_name': getattr(self.analyzer, 'client_name', 'N/A'),
                'competitors_count': len(getattr(self.analyzer, 'competitors', []))
            }
        }
        
        # 保存报告到文件
        report_filename = f"test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        # 输出测试总结
        print("\n" + "=" * 60)
        print("测试总结")
        print("=" * 60)
        print(f"总测试数: {total_tests}")
        print(f"通过: {passed_tests} ✓")
        print(f"失败: {failed_tests} ✗")
        print(f"跳过: {skipped_tests} ○")
        print(f"成功率: {report['test_summary']['success_rate']}")
        print(f"测试时长: {duration}")
        print(f"详细报告已保存至: {report_filename}")
        
        if failed_tests > 0:
            print("\n失败的测试:")
            for result in self.test_results:
                if result['status'] == 'FAIL':
                    print(f"  ✗ {result['test_name']}: {result['message']}")
        
        print("=" * 60)
        
        return report

if __name__ == "__main__":
    # 运行测试套件
    test_suite = ComprehensiveTestSuite()
    test_suite.run_all_tests()