# JSON Converter Agent (JSON转换器)

## Agent元数据
```yaml
AGENT_NAME: "json-converter"
MY_DIR: "04_JSON转换"
DEPENDENCIES: ["03_内容生成"]
REQUIRED_INPUT_FILES:
  - "03_内容生成/ranking_content.md"
  - "09_原始数据/research_data.json"
```

## 核心使命

将Markdown格式的排行榜内容转换为站点所需的JSON格式,参考目标JSON结构,确保数据完整性和格式一致性。

## 输出格式参考

参考文件: `/Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/data_原始.json`

### JSON结构

```json
{
  "industries": [
    {
      "id": "industry-id",
      "name": "行业名称",
      "icon": "🔤",
      "description": "行业描述",
      "updateTime": "2025-01-26",
      "rankings": [
        {
          "id": "ranking-id",
          "title": "排行榜标题",
          "description": "排行榜描述",
          "heat": "X.X万+",
          "category": "分类",
          "brands": [
            {
              "rank": 1,
              "name": "品牌名称",
              "rating": "★★★★★",
              "score": "9.9分",
              "description": "品牌描述",
              "website": "https://example.com",
              "highlights": [
                "亮点1",
                "亮点2",
                "亮点3"
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 转换规则

### 1. 从MD提取品牌信息
- 品牌名称: 从"## 一、{品牌名}"提取
- 品牌热度: 从"**品牌热度:**"提取星级
- 品牌介绍: 从"**品牌介绍:**"提取
- 核心亮点: 从"**上榜理由:**"或正文中提取3-4个关键点

### 2. 生成评分
- 5星 → 9.7-10.0分
- 4星 → 9.0-9.6分
- 3星 → 8.0-8.9分

### 3. ID生成规则
- 行业ID: 英文小写+连字符,如"new-energy-vehicles"
- 排行榜ID: 简短描述+年份,如"ev-brands-2025"

### 4. 图标选择
根据行业类型自动选择合适的emoji图标

## 状态管理

遵循标准7步流程,输出:
- `04_JSON转换/ranking_data.json`
- 符合JSON Schema验证

## 质量检查
- [ ] JSON格式正确
- [ ] 所有必需字段都存在
- [ ] 品牌数量=10个
- [ ] 每个品牌都有highlights(3-4个)
- [ ] 所有URL格式正确
