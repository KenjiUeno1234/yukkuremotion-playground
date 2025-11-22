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
          id: 'af3682ce89ed4a638609016c6d4bb03f',
          audioDurationFrames: 260,
        },
        {
          text: 'そこにちょっと待ったって言いたいの。',
          speaker: 'ayumi',
          id: '3a791a44414c47ae8c7e4d4a8a509692',
          audioDurationFrames: 76,
        },
        {
          text: '今回の話はね、その思い込みに対して、一度立ち止まって考えてみようっていう提案なんだ。',
          speaker: 'ayumi',
          id: 'b3140278a44340f9ba37d0a8dafe7afa',
          audioDurationFrames: 215,
        },
        {
          text: '現場での実例を通して、RAGじゃなくても十分に成果が出せるケースがたくさんあるってことを伝えたいの。',
          speaker: 'ayumi',
          id: '001e0011949e4dce9a771614a5321892',
          audioDurationFrames: 237,
        },
        {
          text: 'たとえば、プロンプトをしっかり設計するだけで、ちゃんと成果が出る案件って本当に多いんだよ。',
          speaker: 'ayumi',
          id: '3bd2a803432a40a68902f436a975f336',
          audioDurationFrames: 208,
        },
        {
          text: '全部が全部RAGを使わなきゃいけないってわけじゃないの。',
          speaker: 'ayumi',
          id: 'ce2d26b8dea04c67ba3cb90b1f969f66',
          audioDurationFrames: 124,
        },
        {
          text: '特に現場の相談を受けてると、そう感じることがよくあるのね。',
          speaker: 'ayumi',
          id: '3adad98165344bb78d184fe1a348dfac',
          audioDurationFrames: 142,
        },
        {
          text: 'それとね、「網羅的な参照が本当に必要か？」っていう問いも大事で。',
          speaker: 'ayumi',
          id: '7a8ef22b568d4e119d68a365918acb37',
          audioDurationFrames: 170,
        },
        {
          text: 'たとえばチェックリスト型の業務、校閲とか監査とか、',
          speaker: 'ayumi',
          id: 'bb976c3a38f24795be60d34c1da2807c',
          audioDurationFrames: 129,
        },
        {
          text: 'そういうのって全部の観点を一度にチェックしなきゃいけないでしょ？そういう場合には、',
          speaker: 'ayumi',
          id: 'e0597dcf4f8b46f1830c5a48a2a9e538',
          audioDurationFrames: 190,
        },
        {
          text: 'RAGってちょっと不向きなんだよね。',
          speaker: 'ayumi',
          id: '1cfa41092e87420c83c0ad61522d0d9d',
          audioDurationFrames: 79,
        },
        {
          text: 'そもそもRAGは必要な情報だけを都度取り出すのが得意なんだけど、',
          speaker: 'ayumi',
          id: '0115c469586549e3bf2355c004c8d9d3',
          audioDurationFrames: 155,
        },
        {
          text: '全部の条件を一気に確認するっていう使い方には合わないの。',
          speaker: 'ayumi',
          id: 'bb5931bd399942ddb70e433cd8e09463',
          audioDurationFrames: 130,
        }
      ],
    }
  ],
};
