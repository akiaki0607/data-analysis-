# 自动化测试套件

## 📋 测试概述

本测试套件基于 `需求描述_1015V3.1_技术方案.md` 编写，涵盖了系统的所有关键功能。

### 测试模块

1. **API测试** (`test_api.py`)
   - 健康检查接口
   - 演示数据接口
   - 文件上传和分析接口
   - 数据验证规则
   - AI平台筛选器独立性（需求6.1.3重点）

2. **数据处理器测试** (`test_data_processor.py`)
   - 数据处理器初始化
   - 元数据提取
   - 百分比计算
   - 排名计算
   - 数据验证规则（需求3.5）

3. **前端测试** (`test_frontend.py`)
   - 页面加载
   - Tab切换功能
   - AI平台筛选器独立性
   - 数据可视化渲染

## 🚀 快速开始

### 1. 安装测试依赖

```bash
pip install -r requirements_test.txt
```

### 2. 启动服务

**前端服务**（终端1）:
```bash
cd frontend
python3 -m http.server 3000
```

**后端服务**（终端2）:
```bash
cd backend
PORT=5001 python app.py
```

### 3. 运行测试

**运行所有测试**:
```bash
python tests/run_all_tests.py
```

**只运行API测试**:
```bash
python tests/run_all_tests.py --type api
```

**只运行数据处理器测试**:
```bash
python tests/run_all_tests.py --type processor
```

**只运行前端测试** (需要Chrome浏览器):
```bash
python tests/run_all_tests.py --type frontend
```

**跳过前端测试** (不需要浏览器):
```bash
python tests/run_all_tests.py --skip-frontend
```

**检查服务状态**:
```bash
python tests/run_all_tests.py --check-services
```

**生成HTML测试报告**:
```bash
python tests/run_all_tests.py --report
```

## 📊 测试覆盖

### API测试覆盖

- ✅ 健康检查 (`GET /api/health`)
- ✅ 演示数据 (`GET /api/demo-data`)
  - 数据结构验证
  - 元数据字段完整性
  - 品牌核心指标结构
  - AI平台指标结构
- ✅ 文件上传 (`POST /api/analyze`)
  - 无文件上传处理
  - 无效文件格式处理
  - 有效Excel文件处理
- ✅ 数据验证
  - 百分比数值范围 (0-100)
  - 排名数据连续性
- ✅ AI平台筛选器独立性（需求6.1.3）
  - 品牌核心指标包含"所有AI平台"
  - 关键词分析不包含"所有AI平台"

### 数据处理器测试覆盖

- ✅ 处理器初始化
- ✅ 列字母转索引 (A→0, B→1, AA→26)
- ✅ 元数据提取
- ✅ 百分比计算
- ✅ 排名计算
- ✅ 数据验证规则
  - 百分比范围验证
  - 排名连续性验证

### 前端测试覆盖

- ✅ 页面基础功能
  - 页面加载
  - 上传按钮存在
  - 演示数据按钮存在
- ✅ 演示数据展示
  - 数据加载
  - 元数据显示
- ✅ Tab切换功能
  - 品牌核心指标 ↔ 关键词分析
- ✅ AI平台筛选器（需求6.1.3重点）
  - 品牌核心指标筛选器（含"所有AI平台"）
  - 关键词分析筛选器（不含"所有AI平台"）
  - 两个筛选器的独立性
- ✅ 数据可视化
  - 图表渲染

## 🔧 测试配置

### pytest配置

测试使用 `pytest` 框架，配置文件为 `conftest.py`。

### 标记 (Markers)

- `@pytest.mark.slow` - 慢速测试
- `@pytest.mark.integration` - 集成测试
- `@pytest.mark.frontend` - 前端测试（需要浏览器）

### 跳过条件

某些测试会在特定条件下自动跳过：
- 测试文件不存在时跳过文件上传测试
- Chrome浏览器不可用时跳过前端测试

## 📈 持续集成

测试可以集成到CI/CD流程中：

```yaml
# 示例 GitHub Actions 配置
- name: Run tests
  run: |
    python tests/run_all_tests.py --skip-frontend
```

## 🐛 调试

### 查看详细输出

```bash
python tests/run_all_tests.py --verbose
```

### 运行单个测试

```bash
pytest tests/test_api.py::TestAPIHealth::test_health_check -v -s
```

### 查看后端日志

```bash
tail -f /tmp/backend_api.log
```

## 📝 编写新测试

1. 在相应的测试文件中添加测试类和测试方法
2. 使用有意义的测试名称 (`test_xxx`)
3. 添加断言 (`assert`)
4. 添加打印输出说明测试通过

示例:
```python
def test_new_feature(self):
    """测试新功能"""
    result = my_function()
    assert result == expected_value
    print("✅ 新功能测试通过")
```

## ⚠️ 注意事项

1. **前端测试需要Chrome浏览器**
   - 如果没有安装Chrome，使用 `--skip-frontend`
   
2. **服务必须运行**
   - 测试前确保前后端服务都在运行
   - 使用 `--check-services` 检查服务状态

3. **测试数据文件**
   - 某些测试需要 `待处理数据_副本` 目录中的测试文件
   - 如果文件不存在，相关测试会自动跳过

## 📞 支持

如有问题，请查看：
- 项目主README: `../README.md`
- 技术方案文档: `../需求_副本/需求描述_1015V3.1_技术方案.md`

