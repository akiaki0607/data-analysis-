#!/bin/bash
# 服务器部署后自动清理不必要的文档文件（改进版）
# 使用 .gitattributes 标记的 export-ignore 文件

echo "🧹 开始清理仅开发用文档文件..."

# 统计删除文件数量
deleted_count=0

# 读取 .gitattributes 中标记为 export-ignore 的文件并删除
if [ -f ".gitattributes" ]; then
  while IFS= read -r line; do
    # 跳过空行和注释
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    
    # 提取文件路径（忽略 export-ignore 属性）
    file=$(echo "$line" | awk '{print $1}')
    
    # 检查是否标记为 export-ignore
    if echo "$line" | grep -q "export-ignore"; then
      if [ -f "$file" ]; then
        echo "  删除: $file"
        rm -f "$file"
        ((deleted_count++))
      fi
    fi
  done < .gitattributes
else
  echo "⚠️  未找到 .gitattributes 文件，跳过清理"
fi

echo ""
echo "✅ 清理完成！共删除 $deleted_count 个文件"
echo "📦 当前目录大小："
du -sh . 2>/dev/null || echo "  (无法计算目录大小)"

