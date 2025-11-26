#!/usr/bin/env python3
"""
makimono.png の色を分析するスクリプト
"""

from PIL import Image
from collections import Counter

def analyze_image_colors(image_path, top_n=20):
    """
    画像内の色を分析し、上位N個の色を表示
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
    # makimono.png
    image_path = "src/marp-test/makimono.png"

    print("=" * 60)
    print("makimono.png の色分析")
    print("=" * 60)

    colors, (width, height) = analyze_image_colors(image_path, top_n=20)
    total_pixels = width * height

    print(f"\n画像: {image_path}")
    print(f"サイズ: {width} x {height} ({total_pixels:,} ピクセル)")
    print(f"\n上位20色:")
    print("-" * 60)

    for i, (color, count) in enumerate(colors, 1):
        percentage = (count / total_pixels) * 100
        color_str = f"{color}"
        # 紫色系を判定
        is_purple = color[0] > 80 and color[2] > 40 and color[1] < color[0] * 0.6
        marker = " ← 紫色？" if is_purple else ""
        print(f"{i:2d}. RGB{color_str:20s} - {count:7,} ピクセル ({percentage:5.2f}%){marker}")

    print("\n" + "=" * 60)
    print("紫色系の色を確認してください")
    print("=" * 60)

if __name__ == "__main__":
    main()
