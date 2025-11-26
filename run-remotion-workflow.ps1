# Remotion動画作成 自動実行スクリプト
# 使用方法: powershell -ExecutionPolicy Bypass -File run-remotion-workflow.ps1

param(
    [switch]$SkipVoiceGeneration,
    [switch]$NoForce,
    [switch]$SkipPreview
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n=========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "=========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-WarningMsg {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# ステップ0: 前提条件のチェック
Write-Step "ステップ0: 前提条件のチェック"

$requiredFiles = @(
    @{Path="script_final.md"; Description="字幕用スクリプトファイル"},
    @{Path="script_final_hosei.md"; Description="音声用スクリプトファイル"},
    @{Path="public\bgm\Floraria.mp3"; Description="BGMファイル"}
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file.Path) {
        Write-Success "$($file.Description): $($file.Path)"
    }
    else {
        Write-ErrorMsg "$($file.Description)が見つかりません: $($file.Path)"
        $missingFiles += $file.Path
    }
}

Write-Info "スライド画像のチェック..."
if (Test-Path "public\slide") {
    $slideCount = (Get-ChildItem "public\slide\*.png" -ErrorAction SilentlyContinue).Count
    if ($slideCount -gt 0) {
        Write-Success "スライド画像: $slideCount ファイル"
    }
    else {
        Write-ErrorMsg "public\slide\ にスライド画像（*.png）が見つかりません"
        $missingFiles += "public\slide\*.png"
    }
}
else {
    Write-ErrorMsg "public\slide\ フォルダが存在しません"
    $missingFiles += "public\slide\"
}

if (-not $SkipVoiceGeneration) {
    $voicepeakPath = "C:\voicepeak\VOICEPEAK\voicepeak.exe"
    if (Test-Path $voicepeakPath) {
        Write-Success "VOICEPEAK: インストール済み"
    }
    else {
        Write-ErrorMsg "VOICEPEAK が見つかりません: $voicepeakPath"
        $missingFiles += $voicepeakPath
    }
}

if ($missingFiles.Count -gt 0) {
    Write-ErrorMsg "`n前提条件を満たしていません。以下のファイル/フォルダを確認してください:"
    $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Write-Success "全ての前提条件を満たしています"

# ステップ1: 背景画像の準備
Write-Step "ステップ1: 背景画像の準備"

$backgroundSrc = "src\BACKGROUND_LAYER\kyaradeza-back.png"
$backgroundDest = "public\background\kyaradeza-back.png"

if (Test-Path $backgroundSrc) {
    $backgroundDir = Split-Path $backgroundDest -Parent
    if (-not (Test-Path $backgroundDir)) {
        New-Item -ItemType Directory -Path $backgroundDir -Force | Out-Null
        Write-Info "フォルダを作成: $backgroundDir"
    }
    Copy-Item -Path $backgroundSrc -Destination $backgroundDest -Force
    Write-Success "背景画像をコピー: $backgroundSrc → $backgroundDest"
}
else {
    Write-WarningMsg "背景画像が見つかりません: $backgroundSrc"
    Write-Info "スキップして続行します..."
}

# ステップ2: 音声ファイルの生成
if (-not $SkipVoiceGeneration) {
    Write-Step "ステップ2: 音声ファイルの生成"

    $voiceCommand = "npx ts-node scripts/generateScriptFinalHoseiVoices.ts"
    if ($NoForce) {
        Write-Info "モード: 既存ファイルスキップ"
    }
    else {
        $voiceCommand += " --force"
        Write-Info "モード: 強制再生成（--force）"
    }

    Write-Info "実行中: $voiceCommand"
    try {
        Invoke-Expression $voiceCommand
        if ($LASTEXITCODE -ne 0) {
            throw "音声生成コマンドがエラーコード $LASTEXITCODE で終了しました"
        }
        Write-Success "音声ファイルの生成が完了しました"
    }
    catch {
        Write-ErrorMsg "音声ファイルの生成に失敗しました: $_"
        exit 1
    }
}
else {
    Write-Step "ステップ2: 音声ファイルの生成（スキップ）"
    Write-WarningMsg "音声生成をスキップしました（-SkipVoiceGeneration オプション）"
    Write-Info "既存の音声ファイルを使用します"
}

# ステップ3: スライドショー設定ファイルの生成
Write-Step "ステップ3: スライドショー設定ファイルの生成"

$configCommand = "npx ts-node scripts/generateSlideshowConfig.ts"
Write-Info "実行中: $configCommand"

try {
    Invoke-Expression $configCommand
    if ($LASTEXITCODE -ne 0) {
        throw "設定ファイル生成コマンドがエラーコード $LASTEXITCODE で終了しました"
    }
    Write-Success "スライドショー設定ファイルの生成が完了しました"
    Write-Info "出力先: src\data\slideshowConfig.ts"
}
catch {
    Write-ErrorMsg "スライドショー設定ファイルの生成に失敗しました: $_"
    exit 1
}

# ステップ4: プレビューサーバーの起動
if (-not $SkipPreview) {
    Write-Step "ステップ4: プレビューサーバーの起動"
    Write-Success "全ての準備が完了しました！"
    Write-Info "プレビューサーバーを起動します..."
    Write-Info "起動後、ブラウザで表示されるURLを開いてください"
    Write-WarningMsg "サーバーを停止する場合は、Ctrl+C を押してください"
    Write-Host ""
    npm start
}
else {
    Write-Step "ステップ4: プレビューサーバーの起動（スキップ）"
    Write-WarningMsg "プレビューサーバーの起動をスキップしました（-SkipPreview オプション）"
    Write-Info "手動でプレビューを起動する場合は、以下のコマンドを実行してください:"
    Write-Host "  npm start" -ForegroundColor Yellow
}

# 完了メッセージ
Write-Host "`n" -NoNewline
Write-Step "✅ Remotion動画作成ワークフローが完了しました！"

if (-not $SkipPreview) {
    Write-Info "ブラウザでプレビューURLを開いて、動画を確認してください"
    Write-Info "確認事項:"
    Write-Host "  ✅ スライド画像の表示" -ForegroundColor Gray
    Write-Host "  ✅ 音声の再生" -ForegroundColor Gray
    Write-Host "  ✅ 字幕の表示" -ForegroundColor Gray
    Write-Host "  ✅ スライド・字幕・音声の同期" -ForegroundColor Gray
    Write-Host "  ✅ 口パクアニメーション" -ForegroundColor Gray
    Write-Host "  ✅ BGMの再生" -ForegroundColor Gray
}
