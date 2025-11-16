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
          id: 'effe384df729489fb1bb64a0e49ca574',
          audioDurationFrames: 260,
        },
        {
          text: 'そこにちょっと待ったって言いたいの。',
          speaker: 'ayumi',
          id: 'b91909a200dd4d0bafb68f40bb300334',
          audioDurationFrames: 76,
        },
        {
          text: '今回の話はね、その思い込みに対して、一度立ち止まって考えてみようっていう提案なんだ。',
          speaker: 'ayumi',
          id: 'af376ab10fd04a5bab4d7e0d13655b7b',
          audioDurationFrames: 215,
        },
        {
          text: '現場での実例を通して、RAGじゃなくても十分に成果が出せるケースがたくさんあるってことを伝えたいの。',
          speaker: 'ayumi',
          id: '3b8160d64ebe4dc9955fef5b31758596',
          audioDurationFrames: 237,
        },
        {
          text: 'たとえば、プロンプトをしっかり設計するだけで、ちゃんと成果が出る案件って本当に多いんだよ。',
          speaker: 'ayumi',
          id: 'd8344d5601214cd68d80515b628624ae',
          audioDurationFrames: 208,
        },
        {
          text: '全部が全部RAGを使わなきゃいけないってわけじゃないの。',
          speaker: 'ayumi',
          id: '158b58429d6e474298eae3a125b440a3',
          audioDurationFrames: 124,
        },
        {
          text: '特に現場の相談を受けてると、そう感じることがよくあるのね。',
          speaker: 'ayumi',
          id: '792152d0e4414c8082e5c82ba4e8fa60',
          audioDurationFrames: 142,
        },
        {
          text: 'それとね、「網羅的な参照が本当に必要か？」っていう問いも大事で。',
          speaker: 'ayumi',
          id: '7a35ec8ad9d04a3caf00a40f22c02b50',
          audioDurationFrames: 170,
        },
        {
          text: 'たとえばチェックリスト型の業務、校閲とか監査とか、',
          speaker: 'ayumi',
          id: 'ed4cd3e3af8248db83099a0d66b48faa',
          audioDurationFrames: 129,
        },
        {
          text: 'そういうのって全部の観点を一度にチェックしなきゃいけないでしょ？そういう場合には、',
          speaker: 'ayumi',
          id: 'be7afc6becc9447286970d6fc78e3b92',
          audioDurationFrames: 190,
        },
        {
          text: 'RAGってちょっと不向きなんだよね。',
          speaker: 'ayumi',
          id: 'cc7d74734d29403690f8d5823677fed3',
          audioDurationFrames: 79,
        },
        {
          text: 'そもそもRAGは必要な情報だけを都度取り出すのが得意なんだけど、',
          speaker: 'ayumi',
          id: 'dab03b7b183f4388af36f7dd8e4ff358',
          audioDurationFrames: 155,
        },
        {
          text: '全部の条件を一気に確認するっていう使い方には合わないの。',
          speaker: 'ayumi',
          id: '7eabe9163faf4eeebfdd5f6acfa71964',
          audioDurationFrames: 130,
        }
      ],
    }
  ],
};
