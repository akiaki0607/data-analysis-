# Chrome调试模式启动说明

## 步骤1：关闭所有Chrome窗口

## 步骤2：在终端中运行以下命令启动Chrome调试模式

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

## 步骤3：在打开的Chrome中
1. 访问 https://www.douyin.com/
2. 登录您的抖音账号
3. 确保页面完全加载

## 步骤4：告诉我准备好了
当您完成上述步骤后，请告诉我，我将重新运行抓取脚本连接到您的浏览器。

## 注意事项
- 这个命令会在9222端口启动Chrome的调试模式
- 使用临时用户数据目录，不会影响您的正常Chrome配置
- 完成抓取后可以正常关闭Chrome