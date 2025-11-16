import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';

export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: 'RAG過信への警鐘と本稿の目的',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {"0":30,"1":348},
      totalFrames: 703,
      kuchipakuMap: {frames: [], amplitude: []},
      talks: [
        {
          text: '1-1. 本動画の位置づけについて説明するわね。登壇者は「自社データ＝RAG」という早合点に疑問を投げかけます。',
          speaker: 'reimu',
          id: '393109c101d44c529228fe8d00baab2f',
          audioDurationFrames: 293,
        },
        {
          text: '1-2. 「3つの問」の全体像だが、相談現場ではRAG不要の案件が多く、プロンプト設計だけで成果が出る例も豊富です。',
          speaker: 'marisa',
          id: '4755a5f7cf974b0897d56787dd079812',
          audioDurationFrames: 324,
        }
      ],
    },
    {
      title: '問1：網羅的な参照は必要か',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {"0":30},
      totalFrames: 444,
      kuchipakuMap: {frames: [], amplitude: []},
      talks: [
        {
          text: '2-1. チェックリスト型はRAG不適について説明するわね。校閲・監査などのチェックリスト型は、全観点を同時に適用する必要があります。',
          speaker: 'reimu',
          id: 'f81752c88704460c8f6c5c6e8e1c4aa5',
          audioDurationFrames: 354,
        }
      ],
    }
  ],
};
