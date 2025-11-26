#!/usr/bin/env python3
"""
スライド画像の紫色の背景を透過させるスクリプト
"""

from PIL import Image
import os
import glob

def make_background_transparent(input_path, output_path, target_color=(96, 27, 61), tolerance=30):
    """
    指定した色を透過させる

    Args:
        input_path: 入力画像のパス
        output_path: 出力画像のパス
        target_color: 透過させる色 (R, G, B)
        tolerance: 色の許容範囲
    """
    # 画像を開く
    img = Image.open(input_path)

    # RGBAモードに変換（透明度チャンネルを追加）
    img = img.convert("RGBA")

    # ピクセルデータを取得
    datas = img.getdata()

    new_data = []
    for item in datas:
        # 紫色の範囲にあるピクセルを透明にする
        # RGB値が target_color に近い場合は透明にする
        r_diff = abs(item[0] - target_color[0])
        g_diff = abs(item[1] - target_color[1])
        b_diff = abs(item[2] - target_color[2])

        if r_diff <= tolerance and g_diff <= tolerance and b_diff <= tolerance:
            # 透明にする (R, G, B, Alpha)
            new_data.append((255, 255, 255, 0))
        else:
            # そのまま保持
            new_data.append(item)

    # 新しいピクセルデータを設定
    img.putdata(new_data)

    # 保存
    img.save(output_path, "PNG")
    print(f"✓ {os.path.basename(output_path)} - 透過処理完了")

def main():
    # スライド画像のディレクトリ
    slide_dir = "public/slide"

    # 全てのPNGファイルを取得
    png_files = glob.glob(f"{slide_dir}/S*.png")
    png_files.sort()

    print("=" * 50)
    print("スライド画像の透過処理")
    print("=" * 50)
    print(f"対象ファイル数: {len(png_files)}\n")

    # 紫色の背景色を指定 (画像から推定した値)
    # この値は実際の画像の背景色に合わせて調整が必要
    target_color = (96, 27, 61)  # 暗い紫色
    tolerance = 30  # 許容範囲

    for input_path in png_files:
        # 元のファイルをバックアップ
        backup_path = input_path.replace(".png", "_original.png")
        if not os.path.exists(backup_path):
            os.rename(input_path, backup_path)
            print(f"📦 {os.path.basename(input_path)} をバックアップ → {os.path.basename(backup_path)}")
            input_to_use = backup_path
        else:
            input_to_use = backup_path

        # 透過処理を実行
        make_background_transparent(input_to_use, input_path, target_color, tolerance)

    print("\n" + "=" * 50)
    print("✅ 全ての画像の透過処理が完了しました")
    print("=" * 50)
    print("\n注意:")
    print("- 元の画像は *_original.png として保存されています")
    print("- 透過がうまくいかない場合は、target_color や tolerance を調整してください")

if __name__ == "__main__":
    main()
