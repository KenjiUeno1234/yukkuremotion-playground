#!/usr/bin/env python3
"""
makimono.pngの紫色の枠を透過させるスクリプト
"""

from PIL import Image
import os
import shutil

def make_purple_transparent(input_path, output_path, tolerance=50):
    """
    紫色系の色を透過させる

    Args:
        input_path: 入力画像のパス
        output_path: 出力画像のパス
        tolerance: 色の許容範囲（大きいほど広い範囲の色を透過）
    """
    # 画像を開く
    img = Image.open(input_path)

    # RGBAモードに変換（透明度チャンネルを追加）
    img = img.convert("RGBA")

    # ピクセルデータを取得
    datas = img.getdata()

    new_data = []
    transparent_count = 0

    # 紫色の代表的な色（検出された値）
    # RGB(78, 20, 34), RGB(97, 34, 53) など
    # 特徴: R > 70, R > B > G, B < R * 0.8, G < R * 0.5

    for item in datas:
        r, g, b, a = item

        # 紫色系の判定条件
        # 1. Rが最も大きい
        # 2. Bが2番目に大きい
        # 3. Gが最も小さい
        # 4. Rが一定以上の値
        is_purple = (
            r > 60 and  # Rが60以上
            r > g and   # R > G
            r > b and   # R > B
            b > g and   # B > G（紫色の特徴）
            g < r * 0.6  # Gが小さい
        )

        # より緩い条件：暗い紫色も含める
        is_dark_purple = (
            r > 50 and
            r > g and
            b > g - 10 and
            g < r * 0.7 and
            r + b > g * 2
        )

        if is_purple or is_dark_purple:
            # 透明にする
            new_data.append((255, 255, 255, 0))
            transparent_count += 1
        else:
            # そのまま保持
            new_data.append(item)

    # 新しいピクセルデータを設定
    img.putdata(new_data)

    # 保存
    img.save(output_path, "PNG")

    total_pixels = len(datas)
    percentage = (transparent_count / total_pixels) * 100

    print(f"[OK] 透過処理完了")
    print(f"  - 透過したピクセル: {transparent_count:,} / {total_pixels:,} ({percentage:.2f}%)")

    return transparent_count

def main():
    # makimono.png のパス（2箇所）
    paths = [
        "src/marp-test/makimono.png",
        "src/slide-pattern/makimono.png",
    ]

    print("=" * 60)
    print("makimono.png の紫色枠を透過処理")
    print("=" * 60)

    for path in paths:
        if not os.path.exists(path):
            print(f"\n[WARN] {path} が見つかりません（スキップ）")
            continue

        print(f"\n処理中: {path}")

        # バックアップを作成
        backup_path = path.replace(".png", "_backup.png")
        if not os.path.exists(backup_path):
            shutil.copy2(path, backup_path)
            print(f"[BACKUP] バックアップ作成: {backup_path}")
        else:
            print(f"[INFO] バックアップ済み: {backup_path}")

        # 透過処理を実行
        try:
            make_purple_transparent(path, path, tolerance=50)
        except Exception as e:
            print(f"[ERROR] エラー: {e}")

    print("\n" + "=" * 60)
    print("[COMPLETE] 処理完了")
    print("=" * 60)
    print("\n注意:")
    print("- 元の画像は *_backup.png として保存されています")
    print("- 透過がうまくいかない場合は、スクリプト内のis_purple条件を調整してください")
    print("- 元に戻す場合: cp *_backup.png makimono.png")

if __name__ == "__main__":
    main()
