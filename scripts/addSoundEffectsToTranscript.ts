import * as fs from 'fs';
import * as path from 'path';
import {FPS} from '../src/constants';

// myvideo.tsxに効果音を追加するスクリプト（ClaudeCode内蔵の判定機能を使用）

const TRANSCRIPT_FILE = path.join(
  process.cwd(),
  'transcripts',
  'myvideo.tsx'
);

// 効果音の定義
const SOUND_EFFECTS = {
  WAODAIKO: 'koukaon/和太鼓でドン.mp3',
  KIRAKIRA: 'koukaon/きらきら輝く3.mp3',
  SHOCK: 'koukaon/ショック2.mp3',
} as const;

type SoundEffectType = keyof typeof SOUND_EFFECTS;

interface SoundEffectJudgment {
  shouldAddEffect: boolean;
  effectType?: SoundEffectType;
  delaySeconds?: number;
  reason?: string;
}

/**
 * ClaudeCodeの判定ロジックを使ってセリフに適切な効果音を判定
 *
 * ルール：
 * 1. メインのメッセージを伝える、すごいものを紹介する → WAODAIKO
 * 2. 素晴らしいものが出来上がった時、成功を示す → KIRAKIRA
 * 3. 恐ろしいことが起きた時、注意喚起 → SHOCK
 */
function judgeSoundEffect(
  text: string,
  textForDisplay?: string
): SoundEffectJudgment {
  const displayText = textForDisplay || text;
  const lowerText = displayText.toLowerCase();

  // KIRAKIRA（きらきら輝く）の判定キーワード
  const kirakiraKeywords = [
    '成功', '劇的', '向上', '素晴らしい', '達成', '完成', '実現',
    '改善', '最高', '優れ', '抜群', '画期的', '革新', '進化',
    '飛躍', '効果的', '大幅', 'すごい', 'やった', 'できた'
  ];

  // WAODAIKO（和太鼓でドン）の判定キーワード
  const waodaikoKeywords = [
    'ポイント', '重要', 'キー', 'メイン', '核心', '本質',
    '注目', 'ここで', 'つまり', '結論', 'まとめ', '要は',
    '実は', 'なんと', '驚く', '紹介', '発表', 'リリース',
    '登場', '新しい', 'おすすめ', 'ベスト'
  ];

  // SHOCK（ショック）の判定キーワード
  const shockKeywords = [
    '注意', '危険', '問題', 'リスク', '失敗', 'エラー', 'ミス',
    '落とし穴', '罠', '警告', '気をつけ', 'ダメ', '避け', '防',
    'トラブル', 'バグ', '欠陥', '脆弱', '恐ろしい', 'やばい',
    '大変', 'NG', '禁止', 'しないで'
  ];

  // キーワードマッチングによる判定
  let matchedKeywords: string[] = [];
  let effectType: SoundEffectType | undefined;
  let delaySeconds = 1.5; // デフォルトのタイミング

  // SHOCK（最優先：注意喚起は最も重要）
  for (const keyword of shockKeywords) {
    if (displayText.includes(keyword)) {
      matchedKeywords.push(keyword);
      effectType = 'SHOCK';
      delaySeconds = 0.5; // 早めに鳴らす
      break;
    }
  }

  // KIRAKIRA（次に優先：ポジティブな成果）
  if (!effectType) {
    for (const keyword of kirakiraKeywords) {
      if (displayText.includes(keyword)) {
        matchedKeywords.push(keyword);
        effectType = 'KIRAKIRA';
        delaySeconds = 2.0; // 少し遅めに鳴らす
        break;
      }
    }
  }

  // WAODAIKO（最後：メインメッセージ）
  if (!effectType) {
    for (const keyword of waodaikoKeywords) {
      if (displayText.includes(keyword)) {
        matchedKeywords.push(keyword);
        effectType = 'WAODAIKO';
        delaySeconds = 1.0;
        break;
      }
    }
  }

  if (effectType) {
    return {
      shouldAddEffect: true,
      effectType,
      delaySeconds,
      reason: `キーワード「${matchedKeywords[0]}」を検出したため、${effectType}を選択`,
    };
  }

  return {
    shouldAddEffect: false,
    reason: '効果音キーワードが見つかりませんでした',
  };
}

/**
 * 効果音を追加
 */
function addSoundEffects() {
  try {
    console.log('📖 myvideo.tsxを読み込んでいます...');
    const content = fs.readFileSync(TRANSCRIPT_FILE, 'utf-8');

    // MyVideoConfigをインポートして使用
    const {MyVideoConfig} = require(TRANSCRIPT_FILE.replace('.tsx', ''));

    console.log('🎵 キーワードベースで効果音を判定しています...\n');

    let totalTalks = 0;
    let addedEffects = 0;
    const MAX_EFFECTS_PER_SECTION = 5; // 1セクションあたりの最大効果音数

    for (const section of MyVideoConfig.sections) {
      let sectionEffectCount = 0;

      console.log(`━━━ セクション: ${section.title} ━━━`);

      for (const talk of section.talks) {
        totalTalks++;

        // 既に効果音が設定されている場合はスキップ
        if (talk.audio) {
          console.log(
            `[${talk.id}] スキップ (既に効果音が設定されています)`
          );
          sectionEffectCount++;
          continue;
        }

        // セクションごとの効果音数制限
        if (sectionEffectCount >= MAX_EFFECTS_PER_SECTION) {
          console.log(
            `[${talk.id}] スキップ (セクション内の効果音上限に達しました)`
          );
          continue;
        }

        // キーワードベースで効果音を判定
        const judgment = judgeSoundEffect(talk.text, talk.textForDisplay);

        if (judgment.shouldAddEffect && judgment.effectType) {
          const soundEffectPath = SOUND_EFFECTS[judgment.effectType];
          const delayFrames = Math.floor(
            (judgment.delaySeconds || 0) * FPS
          );

          // audio フィールドを追加
          talk.audio = {
            src: soundEffectPath,
            from: delayFrames,
            volume: 0.8,
          };

          addedEffects++;
          sectionEffectCount++;

          console.log(`[${talk.id}] ✅ 効果音を追加`);
          console.log(`  テキスト: ${talk.textForDisplay || talk.text}`);
          console.log(`  効果音: ${judgment.effectType}`);
          console.log(`  タイミング: ${judgment.delaySeconds}秒後`);
          console.log(`  理由: ${judgment.reason}`);
        } else {
          console.log(`[${talk.id}] スキップ (効果音不要)`);
          if (judgment.reason) {
            console.log(`  理由: ${judgment.reason}`);
          }
        }

        console.log('');
      }

      console.log(
        `セクション "${section.title}" の効果音数: ${sectionEffectCount}\n`
      );
    }

    console.log('💾 myvideo.tsxを更新しています...');

    // ファイルを再生成
    const updatedContent = generateTypeScriptFile(MyVideoConfig);
    fs.writeFileSync(TRANSCRIPT_FILE, updatedContent, 'utf-8');

    console.log('✅ myvideo.tsxを更新しました');
    console.log(`総セリフ数: ${totalTalks}`);
    console.log(`追加した効果音数: ${addedEffects}`);
    console.log(
      '\n次のステップ: npm run update:audio-durations を実行してください'
    );
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

/**
 * TypeScriptファイルを生成
 */
function generateTypeScriptFile(config: any): string {
  const sectionsCode = config.sections
    .map((section: any) => {
      const talksCode = section.talks
        .map((talk: any) => {
          const textForDisplayLine = talk.textForDisplay
            ? `\n          textForDisplay: '${talk.textForDisplay.replace(/'/g, "\\'")}',`
            : '';

          const audioLine = talk.audio
            ? `\n          audio: {src: '${talk.audio.src}', from: ${talk.audio.from}, volume: ${talk.audio.volume}},`
            : '';

          return `        {
          text: '${talk.text.replace(/'/g, "\\'")}',${textForDisplayLine}
          speaker: '${talk.speaker}',
          id: '${talk.id}',
          audioDurationFrames: ${talk.audioDurationFrames},${audioLine}
        }`;
        })
        .join(',\n');

      // fromFramesMapをオブジェクトとして出力
      const fromFramesMapCode = JSON.stringify(section.fromFramesMap || {});

      return `    {
      title: '${section.title.replace(/'/g, "\\'")}',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: ${fromFramesMapCode},
      totalFrames: ${section.totalFrames},
      kuchipakuMap: {frames: [], amplitude: []},
      talks: [
${talksCode}
      ],
    }`;
    })
    .join(',\n');

  return `import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';

export const MyVideoConfig: VideoConfig = {
  sections: [
${sectionsCode}
  ],
};
`;
}

addSoundEffects();
