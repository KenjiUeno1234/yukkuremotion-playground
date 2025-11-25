#!/usr/bin/env python3
"""
PDFファイルを個別のPNG画像に変換するスクリプト
各ページをS001.png, S002.png, ... のような形式で保存
PyMuPDFを使用
"""

import sys
import os
from pathlib import Path
import fitz  # PyMuPDF

def convert_pdf_to_slides(pdf_path: str, output_dir: str, base_name: str = "S"):
    """
    PDFを個別のPNG画像に変換

    Args:
        pdf_path: 入力PDFファイルのパス
        output_dir: 出力ディレクトリ
        base_name: ファイル名のベース (デフォルト: "S")
    """
    # 出力ディレクトリの確認・作成
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"Converting PDF: {pdf_path}")
    print(f"Output directory: {output_dir}")

    try:
        # PDFを開く
        pdf_document = fitz.open(pdf_path)
        page_count = len(pdf_document)

        print(f"Found {page_count} pages")

        # 各ページをPNGとして保存
        for page_num in range(page_count):
            # ページを取得
            page = pdf_document[page_num]

            # ページを画像に変換 (zoom=2.0 で高品質)
            mat = fitz.Matrix(2.0, 2.0)  # 2倍のズームで高品質
            pix = page.get_pixmap(matrix=mat)

            # ファイル名: S001.png, S002.png, ...
            filename = f"{base_name}{page_num + 1:03d}.png"
            output_file = output_path / filename

            # PNG形式で保存
            pix.save(output_file)
            print(f"  Saved: {filename}")

        # PDFを閉じる
        pdf_document.close()

        print(f"\nSuccessfully converted {page_count} pages!")
        print(f"Output directory: {output_dir}")

    except Exception as e:
        print(f"\nError: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    # コマンドライン引数のチェック
    if len(sys.argv) < 2:
        print("Usage: python convertPdfToSlides.py <pdf_file> [output_dir] [base_name]")
        print("Example: python convertPdfToSlides.py slide-out/slides_plan.pdf public/slide S")
        sys.exit(1)

    pdf_file = sys.argv[1]
    output_directory = sys.argv[2] if len(sys.argv) > 2 else "public/slide"
    base_filename = sys.argv[3] if len(sys.argv) > 3 else "S"

    # PDFファイルの存在確認
    if not os.path.exists(pdf_file):
        print(f"Error: PDF file not found: {pdf_file}", file=sys.stderr)
        sys.exit(1)

    convert_pdf_to_slides(pdf_file, output_directory, base_filename)
