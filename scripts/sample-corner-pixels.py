#!/usr/bin/env python3
"""
画像の四隅の特定ピクセルをサンプリングして色を確認
"""

from PIL import Image

def sample_corners(image_path):
    """
    画像の四隅と辺の中央のピクセルをサンプリング
    """
    img = Image.open(image_path)
    img = img.convert("RGB")

    width, height = img.size

    # サンプリングポイント
    samples = [
        ("左上隅", 0, 0),
        ("左上内側10px", 10, 10),
        ("左上内側20px", 20, 20),
        ("左上内側30px", 30, 30),
        ("右上隅", width - 1, 0),
        ("右上内側10px", width - 10, 10),
        ("右上内側20px", width - 20, 20),
        ("左下隅", 0, height - 1),
        ("左下内側10px", 10, height - 10),
        ("右下隅", width - 1, height - 1),
        ("右下内側10px", width - 10, height - 10),
        ("上辺中央", width // 2, 0),
        ("下辺中央", width // 2, height - 1),
        ("左辺中央", 0, height // 2),
        ("右辺中央", width - 1, height // 2),
    ]

    print("=" * 60)
    print("makimono.png のコーナーピクセルサンプリング")
    print("=" * 60)
    print(f"\n画像サイズ: {width} x {height}\n")

    for label, x, y in samples:
        color = img.getpixel((x, y))
        print(f"{label:20s} ({x:4d}, {y:4d}): RGB{color}")

    print("\n" + "=" * 60)

if __name__ == "__main__":
    sample_corners("src/marp-test/makimono.png")
