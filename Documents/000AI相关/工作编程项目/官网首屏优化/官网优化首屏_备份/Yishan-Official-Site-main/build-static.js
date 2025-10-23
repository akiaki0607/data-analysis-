// 临时构建脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 修改next.config.js临时文件
const nextConfigPath = path.join(__dirname, 'next.config.ts');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

// 添加静态导出配置
if (!nextConfig.includes("output: 'export'")) {
  nextConfig = nextConfig.replace(
    'const nextConfig: NextConfig = {',
    'const nextConfig: NextConfig = {\n  output: \'export\',\n'
  );
  
  // 添加unoptimized图片配置
  if (nextConfig.includes('images: {')) {
    nextConfig = nextConfig.replace(
      'images: {',
      'images: {\n    unoptimized: true,'
    );
  }
  
  // 写入临时配置
  fs.writeFileSync(nextConfigPath + '.bak', nextConfig, 'utf8');
  console.log('已创建临时配置文件备份');
}

try {
  // 执行构建
  console.log('开始构建静态网站...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('构建完成！静态文件位于 ./out 目录');
} catch (error) {
  console.error('构建失败:', error);
} finally {
  // 恢复原始配置
  if (fs.existsSync(nextConfigPath + '.bak')) {
    fs.copyFileSync(nextConfigPath + '.bak', nextConfigPath);
    fs.unlinkSync(nextConfigPath + '.bak');
    console.log('已恢复原始配置文件');
  }
}