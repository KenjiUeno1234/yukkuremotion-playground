# UTF-8 with BOM
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "VOICEPEAK ゆっくり音声一括生成" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 設定
$voicepeakPath = "C:\voicepeak\VOICEPEAK\voicepeak.exe"
$outputDir = ".\public\audio\yukkuri"
$transcriptFile = ".\transcripts\firstvideo.tsx"

# VOICEPEAKの存在確認
if (-not (Test-Path $voicepeakPath)) {
    Write-Host "エラー: VOICEPEAKが見つかりません。" -ForegroundColor Red
    Write-Host "パス: $voicepeakPath" -ForegroundColor Yellow
    Read-Host "Enterキーを押して終了"
    exit 1
}

# 出力ディレクトリ作成
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "出力ディレクトリを作成しました: $outputDir" -ForegroundColor Green
}

# 霊夢の声設定
$reimuConfig = @{
    Voice = "Haruno Sora"
    Speed = 120
    Pitch = -30
    Pause = 130
    Volume = 80
    Emotion = "happy=30,sad=10,angry=0,whisper=20,cool=15"
}

# 魔理沙の声設定
$marisaConfig = @{
    Voice = "Haruno Sora"
    Speed = 115
    Pitch = -50
    Pause = 130
    Volume = 80
    Emotion = "happy=15,sad=15,angry=0,whisper=30,cool=35"
}

# transcriptファイルから音声情報を抽出
Write-Host "設定ファイルを読み込んでいます..." -ForegroundColor Yellow
$content = Get-Content $transcriptFile -Raw -Encoding UTF8

# 正規表現で話者情報を抽出
$pattern = '\{\s*text:\s*[''"]([^''"]+)[''"]\s*,\s*speaker:\s*[''"](\w+)[''"]\s*,\s*id:\s*[''"]([a-f0-9]+)[''"]\s*,'
$matches = [regex]::Matches($content, $pattern)

Write-Host "見つかった音声: $($matches.Count) 個" -ForegroundColor Green
Write-Host ""

$count = 0
$success = 0
$failed = 0

foreach ($match in $matches) {
    $text = $match.Groups[1].Value
    $speaker = $match.Groups[2].Value
    $id = $match.Groups[3].Value

    $count++

    # 話者に応じた設定を選択
    $config = if ($speaker -eq "reimu") { $reimuConfig } else { $marisaConfig }
    $speakerLabel = if ($speaker -eq "reimu") { "霊夢" } else { "魔理沙" }

    Write-Host "[$count] $speakerLabel : $text" -ForegroundColor Cyan

    # 出力ファイルパス
    $outputFile = Join-Path $outputDir "$id.wav"

    # 既に存在する場合はスキップ
    if (Test-Path $outputFile) {
        Write-Host "    スキップ (既存): $outputFile" -ForegroundColor Gray
        $success++
        continue
    }

    # 一時テキストファイル作成
    $tempFile = "temp_voice_$id.txt"
    $text | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline

    try {
        # VOICEPEAK実行
        $args = @(
            "-t", $tempFile,
            "-n", $config.Voice,
            "--speed", $config.Speed,
            "--pitch", $config.Pitch,
            "--pause", $config.Pause,
            "--volume", $config.Volume,
            "-e", $config.Emotion,
            "-o", $outputFile
        )

        $process = Start-Process -FilePath $voicepeakPath -ArgumentList $args -Wait -PassThru -NoNewWindow -RedirectStandardError "nul"

        if ($process.ExitCode -eq 0 -and (Test-Path $outputFile)) {
            Write-Host "    成功: $outputFile" -ForegroundColor Green
            $success++
        } else {
            Write-Host "    失敗: エラーコード $($process.ExitCode)" -ForegroundColor Red
            $failed++
        }
    }
    catch {
        Write-Host "    失敗: $_" -ForegroundColor Red
        $failed++
    }
    finally {
        # 一時ファイル削除
        if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force
        }
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "音声生成完了" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "合計: $count ファイル" -ForegroundColor White
Write-Host "成功: $success ファイル" -ForegroundColor Green
Write-Host "失敗: $failed ファイル" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Cyan

Read-Host "`nEnterキーを押して終了"
