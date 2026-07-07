@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo === Подготовка архива для Beget ===
echo.

where composer >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] composer не найден в PATH
    exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] npm не найден в PATH
    exit /b 1
)

echo [1/3] composer install --no-dev ...
call composer install --no-dev --optimize-autoloader
if errorlevel 1 exit /b 1

echo [2/3] npm install ...
call npm install
if errorlevel 1 exit /b 1

echo [3/3] npm run build ...
call npm run build
if errorlevel 1 exit /b 1

echo.
if exist "public\build\manifest.json" (
    echo OK: public\build\manifest.json создан
) else (
    echo [ОШИБКА] нет public\build\manifest.json
    exit /b 1
)

if exist "vendor\autoload.php" (
    echo OK: vendor\autoload.php есть
) else (
    echo [ОШИБКА] нет vendor\
    exit /b 1
)

echo.
echo Готово. Упакуйте архив: bash scripts\pack-beget.sh
echo Или залейте vendor и public\build вручную.
echo Инструкция: UPDATE_BEGET.md
pause
