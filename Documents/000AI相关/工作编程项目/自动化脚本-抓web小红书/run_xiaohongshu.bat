@echo off
chcp 65001 >nul
echo 🚀 启动小红书联想词采集工具...
echo ==================================

REM 检查Python环境
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python，请先安装Python 3
    pause
    exit /b 1
)

REM 检查必要的目录
if not exist "data\input" (
    echo ❌ 错误: data\input 目录不存在
    pause
    exit /b 1
)

REM 查找输入文件
set INPUT_FILE=
if exist "data\input\keywords.csv" (
    set INPUT_FILE=data\input\keywords.csv
) else if exist "data\input\keywords_优贝.csv" (
    set INPUT_FILE=data\input\keywords_优贝.csv
) else (
    echo ❌ 错误: 未找到关键词输入文件
    echo 请确保以下文件之一存在:
    echo   - data\input\keywords.csv
    echo   - data\input\keywords_优贝.csv
    pause
    exit /b 1
)

echo ✅ 找到输入文件: %INPUT_FILE%

REM 设置输出目录
set OUTPUT_DIR=data\output
set SCREENSHOT_DIR=screenshots

REM 创建输出目录
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"
if not exist "%SCREENSHOT_DIR%" mkdir "%SCREENSHOT_DIR%"

echo 📁 输出目录: %OUTPUT_DIR%
echo 📸 截图目录: %SCREENSHOT_DIR%
echo.

REM 询问是否显示浏览器界面
set /p SHOW_BROWSER=是否显示浏览器界面? (y/N): 

set HEADFUL_FLAG=
if /i "%SHOW_BROWSER%"=="y" (
    set HEADFUL_FLAG=--headful
    echo 🌐 将显示浏览器界面
) else (
    echo 🔒 将在后台运行（无界面）
)

echo.
echo 开始采集...
echo ==================================

REM 运行采集程序
python src\smart_xiaohongshu_scraper.py --input "%INPUT_FILE%" --outdir "%OUTPUT_DIR%" --shots "%SCREENSHOT_DIR%" %HEADFUL_FLAG%

echo.
echo ==================================
echo ✅ 采集任务完成！
echo 📊 请查看输出目录: %OUTPUT_DIR%
echo 📸 请查看截图目录: %SCREENSHOT_DIR%
pause