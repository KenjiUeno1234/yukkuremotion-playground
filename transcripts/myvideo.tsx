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
          id: 'a7047bccfcaf4e73914c27fcb0aa38ad',
          audioDurationFrames: 260,
        },
        {
          text: 'そこにちょっと待ったって言いたいの。',
          speaker: 'ayumi',
          id: '77f73d4e5aef484ebdb0d518ad038162',
          audioDurationFrames: 76,
        },
        {
          text: '今回の話はね、その思い込みに対して、一度立ち止まって考えてみようっていう提案なんだ。',
          speaker: 'ayumi',
          id: '2a44502d7e234efa8bb5751745ba3328',
          audioDurationFrames: 215,
        },
        {
          text: '現場での実例を通して、RAGじゃなくても十分に成果が出せるケースがたくさんあるってことを伝えたいの。',
          speaker: 'ayumi',
          id: '5773df4d7cba45ff9474ec3c1cc03f9b',
          audioDurationFrames: 237,
        },
        {
          text: 'たとえば、プロンプトをしっかり設計するだけで、ちゃんと成果が出る案件って本当に多いんだよ。',
          speaker: 'ayumi',
          id: '7d899c2b662746319ef8bb5b73051207',
          audioDurationFrames: 208,
        },
        {
          text: '全部が全部RAGを使わなきゃいけないってわけじゃないの。',
          speaker: 'ayumi',
          id: '49aa8ae5a5ab46cda0c0b1041e929d3e',
          audioDurationFrames: 124,
        },
        {
          text: '特に現場の相談を受けてると、そう感じることがよくあるのね。',
          speaker: 'ayumi',
          id: 'e6481dd164ab4d5c8b8e6866987f2add',
          audioDurationFrames: 142,
        },
        {
          text: 'それとね、「網羅的な参照が本当に必要か？」っていう問いも大事で。',
          speaker: 'ayumi',
          id: '3d0d13dd26e54715b9053912cf260dd8',
          audioDurationFrames: 170,
        },
        {
          text: 'たとえばチェックリスト型の業務、校閲とか監査とか、',
          speaker: 'ayumi',
          id: '6ad5a47f90d34f848c4b94795eb2da90',
          audioDurationFrames: 129,
        },
        {
          text: 'そういうのって全部の観点を一度にチェックしなきゃいけないでしょ？そういう場合には、',
          speaker: 'ayumi',
          id: '0db650e3f9914beabc32fda5af91f1e5',
          audioDurationFrames: 190,
        },
        {
          text: 'RAGってちょっと不向きなんだよね。',
          speaker: 'ayumi',
          id: '6b74d95ef6d44dbfa73466e21a28f0f6',
          audioDurationFrames: 79,
        },
        {
          text: 'そもそもRAGは必要な情報だけを都度取り出すのが得意なんだけど、',
          speaker: 'ayumi',
          id: 'eb98d4c800a74ae4841526a0be17b671',
          audioDurationFrames: 155,
        },
        {
          text: '全部の条件を一気に確認するっていう使い方には合わないの。',
          speaker: 'ayumi',
          id: '2aa1efc74a62458f8e7640c79adb2ca6',
          audioDurationFrames: 130,
        }
      ],
    }
  ],
};
