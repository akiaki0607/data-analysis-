"""
测试报告生成器
生成HTML和Markdown格式的测试报告
"""

import json
import os
from datetime import datetime


class TestReportGenerator:
    """测试报告生成器"""
    
    def __init__(self, test_result_file):
        self.test_result_file = test_result_file
        with open(test_result_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
    
    def generate_html_report(self, output_file):
        """生成HTML格式测试报告"""
        summary = self.data['summary']
        results = self.data['results']
        timestamp = self.data.get('timestamp', datetime.now().isoformat())
        
        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>宽表转长表功能测试报告</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f5f7fa;
            padding: 20px;
            line-height: 1.6;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
        }}
        
        .header h1 {{
            font-size: 32px;
            margin-bottom: 10px;
        }}
        
        .header .meta {{
            opacity: 0.9;
            font-size: 14px;
        }}
        
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }}
        
        .summary-card {{
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            text-align: center;
        }}
        
        .summary-card .label {{
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 8px;
        }}
        
        .summary-card .value {{
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 4px;
        }}
        
        .summary-card.passed .value {{ color: #28a745; }}
        .summary-card.failed .value {{ color: #dc3545; }}
        .summary-card.skipped .value {{ color: #ffc107; }}
        .summary-card.rate .value {{ color: #667eea; }}
        
        .results {{
            padding: 40px;
        }}
        
        .results h2 {{
            font-size: 24px;
            margin-bottom: 24px;
            color: #333;
        }}
        
        .test-table {{
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }}
        
        .test-table thead {{
            background: #f8f9fa;
        }}
        
        .test-table th {{
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
        }}
        
        .test-table td {{
            padding: 16px;
            border-bottom: 1px solid #f0f0f0;
            color: #666;
        }}
        
        .test-table tr:last-child td {{
            border-bottom: none;
        }}
        
        .test-table tbody tr:hover {{
            background: #f8f9fa;
        }}
        
        .status-badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }}
        
        .status-badge.passed {{
            background: #d4edda;
            color: #155724;
        }}
        
        .status-badge.failed {{
            background: #f8d7da;
            color: #721c24;
        }}
        
        .status-badge.skipped {{
            background: #fff3cd;
            color: #856404;
        }}
        
        .duration {{
            color: #6c757d;
            font-size: 13px;
        }}
        
        .footer {{
            padding: 24px 40px;
            background: #f8f9fa;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }}
        
        .chart {{
            width: 200px;
            height: 200px;
            margin: 0 auto;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 宽表转长表功能测试报告</h1>
            <div class="meta">
                <div>测试时间: {datetime.fromisoformat(timestamp).strftime('%Y-%m-%d %H:%M:%S')}</div>
                <div>测试版本: V4.0</div>
            </div>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <div class="label">总用例数</div>
                <div class="value">{summary['total']}</div>
            </div>
            <div class="summary-card passed">
                <div class="label">✅ 通过</div>
                <div class="value">{summary['passed']}</div>
            </div>
            <div class="summary-card failed">
                <div class="label">❌ 失败</div>
                <div class="value">{summary['failed']}</div>
            </div>
            <div class="summary-card skipped">
                <div class="label">⏭️ 跳过</div>
                <div class="value">{summary['skipped']}</div>
            </div>
            <div class="summary-card rate">
                <div class="label">通过率</div>
                <div class="value">{summary['pass_rate']:.1f}%</div>
            </div>
            <div class="summary-card">
                <div class="label">总耗时</div>
                <div class="value" style="font-size: 28px;">{summary['total_time']:.1f}s</div>
            </div>
        </div>
        
        <div class="results">
            <h2>测试详情</h2>
            <table class="test-table">
                <thead>
                    <tr>
                        <th style="width: 120px;">用例ID</th>
                        <th>测试名称</th>
                        <th style="width: 100px;">状态</th>
                        <th style="width: 100px;">耗时</th>
                        <th>备注</th>
                    </tr>
                </thead>
                <tbody>
"""
        
        for result in results:
            status_class = result['status'].lower()
            status_text = {
                'PASSED': '✅ 通过',
                'FAILED': '❌ 失败',
                'SKIPPED': '⏭️ 跳过'
            }.get(result['status'], result['status'])
            
            html += f"""
                    <tr>
                        <td><code>{result['test_id']}</code></td>
                        <td>{result['test_name']}</td>
                        <td><span class="status-badge {status_class}">{status_text}</span></td>
                        <td class="duration">{result['duration']:.2f}s</td>
                        <td>{result['message']}</td>
                    </tr>
"""
        
        html += """
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>AI平台数据分析报告 - 宽表转长表功能自动化测试</p>
            <p>基于测试用例文档 V2.0</p>
        </div>
    </div>
</body>
</html>
"""
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"✅ HTML测试报告已生成: {output_file}")
    
    def generate_markdown_report(self, output_file):
        """生成Markdown格式测试报告"""
        summary = self.data['summary']
        results = self.data['results']
        timestamp = self.data.get('timestamp', datetime.now().isoformat())
        
        md = f"""# 宽表转长表功能测试报告

## 📋 测试信息

- **测试时间**: {datetime.fromisoformat(timestamp).strftime('%Y-%m-%d %H:%M:%S')}
- **测试版本**: V4.0
- **文档依据**: 测试用例_V2.0_宽表转换.md

---

## 📊 测试摘要

| 指标 | 数值 |
|------|------|
| 总用例数 | {summary['total']} |
| ✅ 通过 | {summary['passed']} |
| ❌ 失败 | {summary['failed']} |
| ⏭️ 跳过 | {summary['skipped']} |
| **通过率** | **{summary['pass_rate']:.1f}%** |
| 总耗时 | {summary['total_time']:.2f}秒 |

---

## 📝 测试详情

| 用例ID | 测试名称 | 状态 | 耗时(s) | 备注 |
|--------|---------|------|---------|------|
"""
        
        for result in results:
            status_icon = {
                'PASSED': '✅',
                'FAILED': '❌',
                'SKIPPED': '⏭️'
            }.get(result['status'], '❓')
            
            md += f"| `{result['test_id']}` | {result['test_name']} | {status_icon} {result['status']} | {result['duration']:.2f} | {result['message']} |\n"
        
        md += f"""
---

## 📈 测试分析

### 通过的测试 ({summary['passed']} 个)

"""
        passed_tests = [r for r in results if r['status'] == 'PASSED']
        for test in passed_tests:
            md += f"- ✅ **{test['test_id']}**: {test['test_name']}\n"
        
        if summary['failed'] > 0:
            md += f"\n### 失败的测试 ({summary['failed']} 个)\n\n"
            failed_tests = [r for r in results if r['status'] == 'FAILED']
            for test in failed_tests:
                md += f"- ❌ **{test['test_id']}**: {test['test_name']}\n"
                md += f"  - 错误: {test['message']}\n"
        
        if summary['skipped'] > 0:
            md += f"\n### 跳过的测试 ({summary['skipped']} 个)\n\n"
            skipped_tests = [r for r in results if r['status'] == 'SKIPPED']
            for test in skipped_tests:
                md += f"- ⏭️ **{test['test_id']}**: {test['test_name']}\n"
                md += f"  - 原因: {test['message']}\n"
        
        md += """

---

## 🎯 结论

"""
        if summary['pass_rate'] >= 90:
            md += "✅ **测试通过** - 通过率达标，功能实现良好。\n"
        elif summary['pass_rate'] >= 70:
            md += "⚠️ **测试基本通过** - 通过率可接受，但需要改进。\n"
        else:
            md += "❌ **测试未通过** - 通过率不足，需要修复问题。\n"
        
        md += f"""
### 关键指标

- ✅ **功能完整性**: {summary['passed']} / {summary['total']} 项功能正常
- ⚡ **性能表现**: 总耗时 {summary['total_time']:.2f}秒
- 🎯 **质量评估**: {'优秀' if summary['pass_rate'] >= 90 else '良好' if summary['pass_rate'] >= 70 else '待改进'}

---

*自动生成于 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md)
        
        print(f"✅ Markdown测试报告已生成: {output_file}")


def main():
    """主函数"""
    import sys
    
    # 查找最新的测试结果文件
    report_dir = os.path.join(os.path.dirname(__file__), 'test_reports')
    
    if len(sys.argv) > 1:
        result_file = sys.argv[1]
    else:
        # 找最新的JSON文件
        json_files = [f for f in os.listdir(report_dir) if f.endswith('.json')]
        if not json_files:
            print("❌ 未找到测试结果文件")
            return False
        
        json_files.sort(reverse=True)
        result_file = os.path.join(report_dir, json_files[0])
    
    print(f"📄 读取测试结果: {result_file}")
    
    # 生成报告
    generator = TestReportGenerator(result_file)
    
    # 生成HTML报告
    html_file = result_file.replace('.json', '.html')
    generator.generate_html_report(html_file)
    
    # 生成Markdown报告
    md_file = result_file.replace('.json', '.md')
    generator.generate_markdown_report(md_file)
    
    print(f"\n✅ 测试报告生成完成!")
    print(f"  - HTML: {html_file}")
    print(f"  - Markdown: {md_file}")
    
    return True


if __name__ == '__main__':
    main()

