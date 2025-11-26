#!/usr/bin/env python3
"""
画像の背景色（最も多く使われている色）を検出するスクリプト
"""

from PIL import Image
from collections import Counter

def detect_background_color(image_path, sample_size=1000):
    """
    画像の背景色を検出する（画像の四隅からサンプリング）

    Args:
        image_path: 画像ファイルのパス
        sample_size: サンプリングするピクセル数

    Returns:
        最も多く使われている色 (R, G, B)
    """
    img = Image.open(image_path)
    img = img.convert("RGB")

    width, height = img.size

    # 四隅と辺からピクセルをサンプリング
    sample_pixels = []

    # 上辺
    for x in range(0, width, max(1, width // 100)):
        sample_pixels.append(img.getpixel((x, 0)))

    # 下辺
    for x in range(0, width, max(1, width // 100)):
        sample_pixels.append(img.getpixel((x, height - 1)))

    # 左辺
    for y in range(0, height, max(1, height // 100)):
        sample_pixels.append(img.getpixel((0, y)))

    # 右辺
    for y in range(0, height, max(1, height // 100)):
        sample_pixels.append(img.getpixel((width - 1, y)))

    # 最も多く使われている色を検出
    color_counter = Counter(sample_pixels)
    most_common_color = color_counter.most_common(1)[0]

    return most_common_color[0], most_common_color[1]

def main():
    # サンプル画像
    image_path = "public/slide/S001.png"

    print("=" * 50)
    print("背景色の検出")
    print("=" * 50)

    color, count = detect_background_color(image_path)

    print(f"\n画像: {image_path}")
    print(f"検出された背景色 (RGB): {color}")
    print(f"出現回数: {count}")
    print(f"\nPythonスクリプトで使用する値:")
    print(f"target_color = {color}")

    # 推奨される tolerance 値
    print(f"\n推奨 tolerance: 20-40")
    print("=" * 50)

if __name__ == "__main__":
    main()
