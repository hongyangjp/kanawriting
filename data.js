// 內建固定詞彙數據
const defaultVocabulary = [
    { text: "さくら", meaning: "櫻花" },
    { text: "すし", meaning: "Sushi" },
    { text: "せんせい", meaning: "老師/Teacher" },
    { text: "カメラ", meaning: "相機" },
    { text: "ありがとう", meaning: "謝謝/Thanks" }
];

// 50音基礎數據排列（右到左）
const rows = [
    { romaji: ['a', 'i', 'u', 'e', 'o'], hira: ['あ', 'い', 'う', 'え', 'お'], kata: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
    { romaji: ['ka', 'ki', 'ku', 'ke', 'ko'], hira: ['か', 'き', 'く', 'け', 'こ'], kata: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
    { romaji: ['sa', 'shi', 'su', 'se', 'so'], hira: ['さ', 'し', 'す', 'せ', 'そ'], kata: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
    { romaji: ['ta', 'chi', 'tsu', 'te', 'to'], hira: ['た', 'ち', 'つ', 'て', 'と'], kata: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
    { romaji: ['na', 'ni', 'nu', 'ne', 'no'], hira: ['な', 'に', 'ぬ', 'ね', 'の'], kata: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
    { romaji: ['ha', 'hi', 'fu', 'he', 'ho'], hira: ['は', 'ひ', 'ふ', 'へ', 'ほ'], kata: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
    { romaji: ['ma', 'mi', 'mu', 'me', 'mo'], hira: ['ま', 'み', 'む', 'め', 'も'], kata: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
    { romaji: ['ya', '', 'yu', '', 'yo'], hira: ['や', '', 'ゆ', '', 'よ'], kata: ['ヤ', '', 'ユ', '', 'ヨ'] },
    { romaji: ['ra', 'ri', 'ru', 're', 'ro'], hira: ['ら', 'り', 'る', 'れ', 'ろ'], kata: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
    { romaji: ['wa', '', '', '', 'wo', 'n'], hira: ['わ', '', '', '', 'を', 'ん'], kata: ['ワ', '', '', '', 'ヲ', 'ン'] } 
];

// 💡 濁音與半濁音數據排列（右到左）
const dakuonRows = [
    { romaji: ['ga', 'gi', 'gu', 'ge', 'go'], hira: ['が', 'ぎ', 'ぐ', 'げ', 'ご'], kata: ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'] },
    { romaji: ['za', 'ji', 'zu', 'ze', 'zo'], hira: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], kata: ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'] },
    { romaji: ['da', 'ji', 'zu', 'de', 'do'], hira: ['だ', 'ぢ', 'づ', 'で', 'ど'], kata: ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'] },
    { romaji: ['ba', 'bi', 'bu', 'be', 'bo'], hira: ['ば', 'び', 'ぶ', 'べ', 'ぼ'], kata: ['バ', 'ビ', 'ブ', 'ベ', 'ボ'] },
    { romaji: ['pa', 'pi', 'pu', 'pe', 'po'], hira: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'], kata: ['パ', 'ピ', 'プ', 'ペ', 'ポ'] }
];
// data.js 最底部追加：

// 💡 拗音基礎數據排列（由右至左）
const yoonRows = [
    { romaji: ['kya', 'kyu', 'kyo'], hira: ['きゃ', 'きゅ', 'きょ'], kata: ['キャ', 'キュ', 'キョ'] },
    { romaji: ['sha', 'shu', 'sho'], hira: ['しゃ', 'しゅ', 'しょ'], kata: ['シャ', 'シュ', 'ショ'] },
    { romaji: ['cha', 'chu', 'cho'], hira: ['ちゃ', 'ちゅ', 'ちょ'], kata: ['チャ', 'チュ', 'チョ'] },
    { romaji: ['nya', 'nyu', 'nyo'], hira: ['にゃ', 'にゅ', 'にょ'], kata: ['ニャ', 'ニュ', 'ニョ'] },
    { romaji: ['hya', 'hyu', 'hyo'], hira: ['ひゃ', 'ひゅ', 'ひょ'], kata: ['ヒャ', 'ヒュ', 'ヒョ'] },
    { romaji: ['mya', 'myu', 'myo'], hira: ['みゃ', 'みゅ', 'みょ'], kata: ['ミャ', 'ミュ', 'ミョ'] },
    { romaji: ['rya', 'ryu', 'ryo'], hira: ['りゃ', 'りゅ', 'りょ'], kata: ['リャ', 'リュ', 'リョ'] }
];

// 💡 濁拗音與半濁拗音數據排列（由右至左）
const yoonDakuonRows = [
    { romaji: ['gya', 'gyu', 'gyo'], hira: ['ぎゃ', 'ぎゅ', 'ぎょ'], kata: ['ギャ', 'ギュ', 'ギョ'] },
    { romaji: ['ja', 'ju', 'jo'], hira: ['じゃ', 'じゅ', 'じょ'], kata: ['ジャ', 'ジュ', 'ジョ'] },
    { romaji: ['bya', 'byu', 'byo'], hira: ['びゃ', 'びゅ', 'びょ'], kata: ['ビャ', 'ビュ', 'ビョ'] },
    { romaji: ['pya', 'pyu', 'pyo'], hira: ['ぴゃ', 'ぴゅ', 'ぴょ'], kata: ['ピャ', 'ピュ', 'ピョ'] }
];
