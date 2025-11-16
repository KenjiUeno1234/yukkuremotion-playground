import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';

export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: 'RAG過信への警鐘と本稿の目的',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {"0":30,"1":584},
      totalFrames: 1359,
      kuchipakuMap: {frames: [], amplitude: []},
      talks: [
        {
          text: '1-1. 本動画の位置づけについて説明するわね。登壇者は「自社データ＝RAG」という早合点に疑問を投げかけます。相談現場ではRAG不要の案件が多く、プロンプト設計だけで成果が出る例も豊富だと指摘します。',
          speaker: 'ayumi',
          id: 'f7c3f142fda54b3d8e59f8fce5716d89',
          audioDurationFrames: 529,
        },
        {
          text: '1-2. 「3つの問」の全体像だが、RAG導入前に次の3点を確認します。1. 網羅的参照は必要か。2. 元データはLLMの上限内か。3. 動的に変えるパターン数はいくつか。これに該当すれば、RAGより簡便で高精度な代替が成立しやすいと述べます。',
          speaker: 'ayumi',
          id: '2891b986fb994d03a5a5e5f7c73557ff',
          audioDurationFrames: 744,
        }
      ],
    },
    {
      title: '問1：網羅的な参照は必要か',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {"0":30},
      totalFrames: 857,
      kuchipakuMap: {frames: [], amplitude: []},
      talks: [
        {
          text: '2-1. チェックリスト型はRAG不適について説明するわね。校閲・監査などのチェックリスト型は、全観点を同時に適用する必要があります。RAGは必要部分だけを引く設計のため、一部のみ参照すると他観点が欠落します。結論として「網羅チェックはプロンプトに全観点を明示して回す」が正解です。',
          speaker: 'ayumi',
          id: '1a2ec0499d5d44aa820821de6f46445b',
          audioDurationFrames: 767,
        }
      ],
    }
  ],
};
