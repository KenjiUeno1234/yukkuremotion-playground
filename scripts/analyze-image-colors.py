#!/usr/bin/env python3
"""
画像内の色を分析し、上位の色を表示するスクリプト
"""

from PIL import Image
from collections import Counter

def analyze_image_colors(image_path, top_n=10):
    """
    画像内の色を分析し、上位N個の色を表示

    Args:
        image_path: 画像ファイルのパス
        top_n: 表示する色の数
    """
    img = Image.open(image_path)
    img = img.convert("RGB")

    # 全ピクセルの色を取得
    pixels = list(img.getdata())

    # 色の出現回数をカウント
    color_counter = Counter(pixels)

    # 上位N個の色を取得
    most_common_colors = color_counter.most_common(top_n)

    return most_common_colors, img.size

def main():
    # サンプル画像
    image_path = "public/slide/S001.png"

    print("=" * 60)
    print("画像内の色分析")
    print("=" * 60)

    colors, (width, height) = analyze_image_colors(image_path, top_n=15)
    total_pixels = width * height

    print(f"\n画像: {image_path}")
    print(f"サイズ: {width} x {height} ({total_pixels:,} ピクセル)")
    print(f"\n上位15色:")
    print("-" * 60)

    for i, (color, count) in enumerate(colors, 1):
        percentage = (count / total_pixels) * 100
        color_str = f"{color}"
        print(f"{i:2d}. RGB{color_str:20s} - {count:7,} ピクセル ({percentage:5.2f}%)")

    print("\n" + "=" * 60)
    print("透過させたい色を確認してください")
    print("紫色系の色のRGB値をメモしてください")
    print("=" * 60)

if __name__ == "__main__":
    main()
