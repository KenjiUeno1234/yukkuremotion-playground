#!/usr/bin/env python3
"""
キャラクター画像を上半身だけに切り出すスクリプト
3つの画像すべて同じ座標で切り出して、高さを揃える
"""

from PIL import Image
import os

# 画像パス
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
input_dir = os.path.join(base_dir, 'src', 'jinbutu')
output_dir = os.path.join(base_dir, 'public', 'jinbutu')

# 画像ファイル
image_files = [
    'eye-open&moth-close.png',
    'eye-open&moth-open.png',
    'eye-close&moth-open..png'
]

def crop_upper_body(input_path, output_path, crop_box):
    """
    画像を上半身だけに切り出す

    Args:
        input_path: 入力画像パス
        output_path: 出力画像パス
        crop_box: (left, top, right, bottom) のタプル
    """
    print(f"処理中: {os.path.basename(input_path)}")

    # 画像を開く
    img = Image.open(input_path)
    original_size = img.size
    print(f"  元のサイズ: {original_size[0]}x{original_size[1]}")

    # 切り出し
    cropped = img.crop(crop_box)
    crop_size = cropped.size
    print(f"  切り出し後: {crop_size[0]}x{crop_size[1]}")

    # 保存
    cropped.save(output_path, 'PNG')
    print(f"  保存完了: {output_path}")

    return crop_size

def main():
    # 最初の画像を開いて、適切な切り出し位置を決定
    first_image_path = os.path.join(input_dir, image_files[0])
    img = Image.open(first_image_path)
    width, height = img.size

    print(f"画像サイズ: {width}x{height}")

    # 下半身まで表示できるように切り出す（上から95%の部分）
    # 足先まで入るように拡大
    crop_height = int(height * 0.95)  # 上から95%

    # 切り出し座標（全画像で統一）
    crop_box = (
        0,              # left
        0,              # top
        width,          # right
        crop_height     # bottom
    )

    print(f"\n切り出し座標: left={crop_box[0]}, top={crop_box[1]}, right={crop_box[2]}, bottom={crop_box[3]}")
    print(f"切り出しサイズ: {width}x{crop_height}\n")

    # すべての画像を同じ座標で切り出し
    for filename in image_files:
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)

        if os.path.exists(input_path):
            crop_upper_body(input_path, output_path, crop_box)
        else:
            print(f"警告: {input_path} が見つかりません")

    print("\n✅ すべての画像の切り出しが完了しました！")

if __name__ == '__main__':
    main()
