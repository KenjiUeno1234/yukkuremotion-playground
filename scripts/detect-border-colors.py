#!/usr/bin/env python3
"""
画像の外枠の色を検出するスクリプト
"""

from PIL import Image
from collections import Counter

def detect_border_colors(image_path, border_width=50):
    """
    画像の外枠部分の色を検出

    Args:
        image_path: 画像ファイルのパス
        border_width: 枠の幅（ピクセル）
    """
    img = Image.open(image_path)
    img = img.convert("RGB")

    width, height = img.size

    border_pixels = []

    # 上辺
    for y in range(min(border_width, height)):
        for x in range(width):
            border_pixels.append(img.getpixel((x, y)))

    # 下辺
    for y in range(max(0, height - border_width), height):
        for x in range(width):
            border_pixels.append(img.getpixel((x, y)))

    # 左辺（上下を除く）
    for y in range(border_width, height - border_width):
        for x in range(min(border_width, width)):
            border_pixels.append(img.getpixel((x, y)))

    # 右辺（上下を除く）
    for y in range(border_width, height - border_width):
        for x in range(max(0, width - border_width), width):
            border_pixels.append(img.getpixel((x, y)))

    # 色の出現回数をカウント
    color_counter = Counter(border_pixels)

    return color_counter.most_common(30), img.size, len(border_pixels)

def main():
    image_path = "src/marp-test/makimono.png"

    print("=" * 60)
    print("makimono.png の外枠の色分析")
    print("=" * 60)

    colors, (width, height), total_border_pixels = detect_border_colors(image_path, border_width=50)

    print(f"\n画像: {image_path}")
    print(f"サイズ: {width} x {height}")
    print(f"外枠ピクセル数: {total_border_pixels:,}")
    print(f"\n外枠部分の上位30色:")
    print("-" * 60)

    for i, (color, count) in enumerate(colors, 1):
        percentage = (count / total_border_pixels) * 100
        color_str = f"{color}"

        # 紫色系を判定（R > 80, B > 40, G < R * 0.7）
        is_purple = color[0] > 70 and color[2] > 30 and color[1] < color[0] * 0.7
        marker = " ← 紫色系" if is_purple else ""

        print(f"{i:2d}. RGB{color_str:20s} - {count:7,} ({percentage:5.2f}%){marker}")

    print("\n" + "=" * 60)
    print("紫色系の色のRGB値をメモしてください")
    print("=" * 60)

if __name__ == "__main__":
    main()
