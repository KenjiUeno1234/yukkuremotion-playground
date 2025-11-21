import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * フォントを読み込む関数（オプショナル）
 * フォントファイルが存在しない場合でも、レンダリングは正常に続行されます
 */
export function loadFont() {
	const waitForFont = delayRender();

	// フォントファイルのパス（必要に応じて変更）
	const fontPath = 'font/LanobePOPv2/LightNovelPOPv2.otf';

	// タイムアウト設定（5秒）
	const timeout = setTimeout(() => {
		console.warn(`⚠️ フォント読み込みがタイムアウトしました: ${fontPath}`);
		console.warn('デフォルトフォントを使用してレンダリングを続行します');
		continueRender(waitForFont);
	}, 5000);

	try {
		const font = new FontFace(
			`GenshinGothic`,
			`url(${staticFile(fontPath)}) format('opentype')`
		);

		font
			.load()
			.then(() => {
				clearTimeout(timeout);
				document.fonts.add(font);
				console.log('✅ フォント読み込み成功:', fontPath);
				continueRender(waitForFont);
			})
			.catch((err) => {
				clearTimeout(timeout);
				console.warn('⚠️ フォント読み込みエラー:', err.message);
				console.warn('デフォルトフォントを使用してレンダリングを続行します');
				// フォント読み込み失敗時もレンダリングを続行
				continueRender(waitForFont);
			});
	} catch (err) {
		clearTimeout(timeout);
		console.error('❌ フォント初期化エラー:', err);
		continueRender(waitForFont);
	}
}
