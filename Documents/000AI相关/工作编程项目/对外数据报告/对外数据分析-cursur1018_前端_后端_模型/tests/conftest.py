"""
Pytest配置文件
全局fixtures和配置
"""

import pytest
import sys
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / 'backend'))


def pytest_configure(config):
    """Pytest配置钩子"""
    config.addinivalue_line(
        "markers", "slow: 标记测试为慢速测试"
    )
    config.addinivalue_line(
        "markers", "integration: 标记测试为集成测试"
    )
    config.addinivalue_line(
        "markers", "frontend: 标记测试为前端测试（需要浏览器）"
    )

