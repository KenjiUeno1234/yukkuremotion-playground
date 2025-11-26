@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo.
echo =========================================
echo Remotion動画作成 自動実行スクリプト
echo =========================================
echo.

REM ステップ0: 前提条件のチェック
echo =========================================
echo ステップ0: 前提条件のチェック
echo =========================================
echo.

set ERROR_COUNT=0

if exist "script_final.md" (
    echo [92m✅ 字幕用スクリプトファイル: script_final.md[0m
) else (
    echo [91m❌ 字幕用スクリプトファイルが見つかりません: script_final.md[0m
    set /a ERROR_COUNT+=1
)

if exist "script_final_hosei.md" (
    echo [92m✅ 音声用スクリプトファイル: script_final_hosei.md[0m
) else (
    echo [91m❌ 音声用スクリプトファイルが見つかりません: script_final_hosei.md[0m
    set /a ERROR_COUNT+=1
)

if exist "public\bgm\Floraria.mp3" (
    echo [92m✅ BGMファイル: public\bgm\Floraria.mp3[0m
) else (
    echo [91m❌ BGMファイルが見つかりません: public\bgm\Floraria.mp3[0m
    set /a ERROR_COUNT+=1
)

if exist "public\slide\" (
    dir /b "public\slide\*.png" > nul 2>&1
    if !errorlevel! == 0 (
        for /f %%A in ('dir /b "public\slide\*.png" ^| find /c /v ""') do set SLIDE_COUNT=%%A
        echo [92m✅ スライド画像: !SLIDE_COUNT! ファイル[0m
    ) else (
        echo [91m❌ public\slide\ にスライド画像（*.png）が見つかりません[0m
        set /a ERROR_COUNT+=1
    )
) else (
    echo [91m❌ public\slide\ フォルダが存在しません[0m
    set /a ERROR_COUNT+=1
)

if exist "C:\voicepeak\VOICEPEAK\voicepeak.exe" (
    echo [92m✅ VOICEPEAK: インストール済み[0m
) else (
    echo [91m❌ VOICEPEAK が見つかりません: C:\voicepeak\VOICEPEAK\voicepeak.exe[0m
    set /a ERROR_COUNT+=1
)

if !ERROR_COUNT! gtr 0 (
    echo.
    echo [91m❌ 前提条件を満たしていません。上記のエラーを修正してください。[0m
    echo.
    pause
    exit /b 1
)

echo [92m✅ 全ての前提条件を満たしています[0m
echo.

REM ステップ1: 背景画像の準備
echo.
echo =========================================
echo ステップ1: 背景画像の準備
echo =========================================
echo.

if exist "src\BACKGROUND_LAYER\kyaradeza-back.png" (
    if not exist "public\background\" mkdir "public\background\"
    copy /Y "src\BACKGROUND_LAYER\kyaradeza-back.png" "public\background\kyaradeza-back.png" > nul
    echo [92m✅ 背景画像をコピー: src\BACKGROUND_LAYER\kyaradeza-back.png → public\background\kyaradeza-back.png[0m
) else (
    echo [93m⚠️  背景画像が見つかりません: src\BACKGROUND_LAYER\kyaradeza-back.png[0m
    echo [94mℹ️  スキップして続行します...[0m
)
echo.

REM ステップ2: 音声ファイルの生成
echo.
echo =========================================
echo ステップ2: 音声ファイルの生成
echo =========================================
echo.

echo [94mℹ️  モード: 強制再生成（--force）[0m
echo [94mℹ️  実行中: npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force[0m
echo.

call npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force
if errorlevel 1 (
    echo.
    echo [91m❌ 音声ファイルの生成に失敗しました[0m
    pause
    exit /b 1
)

echo.
echo [92m✅ 音声ファイルの生成が完了しました[0m
echo.

REM ステップ3: スライドショー設定ファイルの生成
echo.
echo =========================================
echo ステップ3: スライドショー設定ファイルの生成
echo =========================================
echo.

echo [94mℹ️  実行中: npx ts-node scripts/generateSlideshowConfig.ts[0m
echo.

call npx ts-node scripts/generateSlideshowConfig.ts
if errorlevel 1 (
    echo.
    echo [91m❌ スライドショー設定ファイルの生成に失敗しました[0m
    pause
    exit /b 1
)

echo.
echo [92m✅ スライドショー設定ファイルの生成が完了しました[0m
echo [94mℹ️  出力先: src\data\slideshowConfig.ts[0m
echo.

REM ステップ4: プレビューサーバーの起動
echo.
echo =========================================
echo ステップ4: プレビューサーバーの起動
echo =========================================
echo.

echo [92m✅ 全ての準備が完了しました！[0m
echo [94mℹ️  プレビューサーバーを起動します...[0m
echo.
echo [93m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m
echo [93m重要: サーバー起動後、以下のようなログが表示されます:[0m
echo [92m  Server ready - Local: http://localhost:3000[0m
echo [93m上記に表示されたURLをブラウザで開いてください！[0m
echo [93m（ポート番号は3000、3006などの場合があります）[0m
echo [93m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m
echo.
echo [94mℹ️  サーバーを停止する場合は、Ctrl+C を押してください[0m
echo.

call npm start
