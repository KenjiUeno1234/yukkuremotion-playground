@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo =====================================
echo VOICEPEAK ゆっくり音声生成
echo =====================================
echo.

REM VOICEPEAKのパス
set VOICEPEAK=C:\voicepeak\VOICEPEAK\voicepeak.exe

REM 音声出力ディレクトリ
set OUTPUT_DIR=.\public\audio\yukkuri

REM 出力ディレクトリが存在しない場合は作成
if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
    echo 出力ディレクトリを作成しました: %OUTPUT_DIR%
)

REM カウンタ初期化
set COUNT=0
set SUCCESS=0
set FAILED=0

echo VOICEPEAKの存在確認...
if not exist "%VOICEPEAK%" (
    echo エラー: VOICEPEAKが見つかりません。
    echo パス: %VOICEPEAK%
    pause
    exit /b 1
)
echo.

echo 音声生成を開始します...
echo.

REM transcripts/firstvideo.tsx から音声IDとテキストを抽出して生成
REM ここでは一旦、手動で主要な音声を生成

REM 霊夢の声設定（女性・高め・明るめ）
set REIMU_VOICE=Haruno Sora
set REIMU_SPEED=120
set REIMU_PITCH=-30
set REIMU_PAUSE=130
set REIMU_VOLUME=80
set REIMU_EMOTION=-e happy=30,sad=10,angry=0,whisper=20,cool=15

REM 魔理沙の声設定（女性・低め・落ち着き）
set MARISA_VOICE=Haruno Sora
set MARISA_SPEED=115
set MARISA_PITCH=-50
set MARISA_PAUSE=130
set MARISA_VOLUME=80
set MARISA_EMOTION=-e happy=15,sad=15,angry=0,whisper=30,cool=35

echo =====================================
echo セクション1: イントロダクション
echo =====================================
echo.

REM 5d64484cf146478aaae76a30fc4d31fa - ねえねえ魔理沙
set /a COUNT+=1
echo [!COUNT!] 生成中: ねえねえ魔理沙
echo ねえねえ魔理沙 > temp_text.txt
"%VOICEPEAK%" -t temp_text.txt -n "%REIMU_VOICE%" --speed %REIMU_SPEED% --pitch %REIMU_PITCH% --pause %REIMU_PAUSE% --volume %REIMU_VOLUME% %REIMU_EMOTION% -o "%OUTPUT_DIR%\5d64484cf146478aaae76a30fc4d31fa.wav" 2>nul
if !ERRORLEVEL! EQU 0 (set /a SUCCESS+=1) else (set /a FAILED+=1)

REM 2e3694857ad649e0bac0b092744bd896 - なんだ霊夢
set /a COUNT+=1
echo [!COUNT!] 生成中: なんだ霊夢
echo なんだ霊夢 > temp_text.txt
"%VOICEPEAK%" -t temp_text.txt -n "%MARISA_VOICE%" --speed %MARISA_SPEED% --pitch %MARISA_PITCH% --pause %MARISA_PAUSE% --volume %MARISA_VOLUME% %MARISA_EMOTION% -o "%OUTPUT_DIR%\2e3694857ad649e0bac0b092744bd896.wav" 2>nul
if !ERRORLEVEL! EQU 0 (set /a SUCCESS+=1) else (set /a FAILED+=1)

REM 962adb9911284ee9ad5ef3e794c5d785 - 私たちってめんどくさくない？
set /a COUNT+=1
echo [!COUNT!] 生成中: 私たちってめんどくさくない？
echo 私たちってめんどくさくない？ > temp_text.txt
"%VOICEPEAK%" -t temp_text.txt -n "%REIMU_VOICE%" --speed %REIMU_SPEED% --pitch %REIMU_PITCH% --pause %REIMU_PAUSE% --volume %REIMU_VOLUME% %REIMU_EMOTION% -o "%OUTPUT_DIR%\962adb9911284ee9ad5ef3e794c5d785.wav" 2>nul
if !ERRORLEVEL! EQU 0 (set /a SUCCESS+=1) else (set /a FAILED+=1)

REM 446bd269c32849d3a7439fde0971e3f4 - なんだ急にメンヘラみたいに
set /a COUNT+=1
echo [!COUNT!] 生成中: なんだ急にメンヘラみたいに
echo なんだ急にメンヘラみたいに > temp_text.txt
"%VOICEPEAK%" -t temp_text.txt -n "%MARISA_VOICE%" --speed %MARISA_SPEED% --pitch %MARISA_PITCH% --pause %MARISA_PAUSE% --volume %MARISA_VOLUME% %MARISA_EMOTION% -o "%OUTPUT_DIR%\446bd269c32849d3a7439fde0971e3f4.wav" 2>nul
if !ERRORLEVEL! EQU 0 (set /a SUCCESS+=1) else (set /a FAILED+=1)

REM 一時ファイル削除
del temp_text.txt 2>nul

echo.
echo =====================================
echo 音声生成完了
echo =====================================
echo 合計: %COUNT% ファイル
echo 成功: %SUCCESS% ファイル
echo 失敗: %FAILED% ファイル
echo =====================================
echo.

if %SUCCESS% GTR 0 (
    echo 生成された音声ファイル:
    dir /b "%OUTPUT_DIR%\*.wav"
)

pause
