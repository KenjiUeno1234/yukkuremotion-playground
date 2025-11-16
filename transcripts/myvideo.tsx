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
      reimuKuchipakuMap: {frames: [], amplitude: []},
      marisaKuchipakuMap: {frames: [], amplitude: []},
      talks: [
        {
          text: '1-1. 本動画の位置づけについて説明するわね。登壇者は「自社データ＝RAG」という早合点に疑問を投げかけます。相談現場ではRAG不要の案件が多く、プロンプト設計だけで成果が出る例も豊富だと指摘します。',
          speaker: 'reimu',
          id: '06726c8aa0f14edea4016c9506083439',
          audioDurationFrames: 529,
        },
        {
          text: '1-2. 「3つの問」の全体像だが、RAG導入前に次の3点を確認します。1. 網羅的参照は必要か。2. 元データはLLMの上限内か。3. 動的に変えるパターン数はいくつか。これに該当すれば、RAGより簡便で高精度な代替が成立しやすいと述べます。',
          speaker: 'marisa',
          id: '99c473a125034d5f8a4f26853316d3ee',
          audioDurationFrames: 744,
        }
      ],
    }
  ],
};
