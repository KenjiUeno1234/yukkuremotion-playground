import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';

export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: 'セクション1',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {"0":30,"1":315,"2":416,"3":656,"4":918,"5":1151,"6":1300,"7":1467,"8":1662,"9":1816,"10":2031,"11":2135,"12":2315},
      totalFrames: 2490,
      kuchipakuMap: {frames: [], amplitude: []},
      talks: [
        {
          text: 'けんじ、最近よく「自社データを使うならRAG一択でしょ？」って早とちりしちゃう人が多いみたいなんだけど、',
          speaker: 'ayumi',
          id: 'e2cf124d7a1e433fa1c817708adedde1',
          audioDurationFrames: 260,
        },
        {
          text: 'そこにちょっと待ったって言いたいの。',
          speaker: 'ayumi',
          id: 'f8469f5a60bc4de48fa2f669b1135471',
          audioDurationFrames: 76,
        },
        {
          text: '今回の話はね、その思い込みに対して、一度立ち止まって考えてみようっていう提案なんだ。',
          speaker: 'ayumi',
          id: '3d418150e31942e6ac7c47b9a0df98f0',
          audioDurationFrames: 215,
        },
        {
          text: '現場での実例を通して、RAGじゃなくても十分に成果が出せるケースがたくさんあるってことを伝えたいの。',
          speaker: 'ayumi',
          id: 'e385c8bea2c6498eb80a0116f38088ba',
          audioDurationFrames: 237,
        },
        {
          text: 'たとえば、プロンプトをしっかり設計するだけで、ちゃんと成果が出る案件って本当に多いんだよ。',
          speaker: 'ayumi',
          id: '54dea901bd52446f91f7e43414870d37',
          audioDurationFrames: 208,
        },
        {
          text: '全部が全部RAGを使わなきゃいけないってわけじゃないの。',
          speaker: 'ayumi',
          id: 'f4e7ec5296744190babc66c902cebc17',
          audioDurationFrames: 124,
        },
        {
          text: '特に現場の相談を受けてると、そう感じることがよくあるのね。',
          speaker: 'ayumi',
          id: '6e3399d15026487eafff82324cac8290',
          audioDurationFrames: 142,
        },
        {
          text: 'それとね、「網羅的な参照が本当に必要か？」っていう問いも大事で。',
          speaker: 'ayumi',
          id: 'fba20ac6ad774070b7caf5d60e039faf',
          audioDurationFrames: 170,
        },
        {
          text: 'たとえばチェックリスト型の業務、校閲とか監査とか、',
          speaker: 'ayumi',
          id: 'f77b459eaf1645ea81f80289ca80da1f',
          audioDurationFrames: 129,
        },
        {
          text: 'そういうのって全部の観点を一度にチェックしなきゃいけないでしょ？そういう場合には、',
          speaker: 'ayumi',
          id: '123f955026aa40b4bff06f462fae204e',
          audioDurationFrames: 190,
        },
        {
          text: 'RAGってちょっと不向きなんだよね。',
          speaker: 'ayumi',
          id: 'd360b94b333e4cdea4c98ecfd6132fcc',
          audioDurationFrames: 79,
        },
        {
          text: 'そもそもRAGは必要な情報だけを都度取り出すのが得意なんだけど、',
          speaker: 'ayumi',
          id: '0d0491df9a494b978cf80e02fb0b6fe0',
          audioDurationFrames: 155,
        },
        {
          text: '全部の条件を一気に確認するっていう使い方には合わないの。',
          speaker: 'ayumi',
          id: '0f532f13dfc841e3b3ae31afcc2a0d69',
          audioDurationFrames: 130,
        }
      ],
    }
  ],
};
