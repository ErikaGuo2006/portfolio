/* 正式图层准备好后，只需修改这些资源地址；空值使用默认人物占位。 */
window.PORTFOLIO_DATA = {
  // 波光强度与鼠标扰动幅度，通常在 0 到 1.5 之间微调。
  water: { caustics: 0.42, strength: 0.45 },
  character: {
    idle: 'assets/hero-character.png',
    poses: { about: null, illustrations: null, 'ui-design': null, games: null }
  },
  socialLinks: { discord: null, instagram: null, x: null },
  // 支持本地图片和视频路径；没有资源时展示占位与待补充提示。
  projects: {
    dissonant: { coverVideo: 'assets/projects/dissonant-gameplay.mp4', images: ['assets/projects/dissonant-cover.jpg'], designSections: [{"id": "character", "title": "Character Design", "images": [{"src": "assets/projects/dissonant-character-01.jpg", "alt": "Dissonant Girls — Character Design, 1", "width": 1711, "height": 764}]}, {"id": "ui", "title": "UI Design", "images": [{"src": "assets/projects/dissonant-ui-01.png", "alt": "Dissonant Girls — UI Design, 1", "width": 1526, "height": 858}, {"src": "assets/projects/dissonant-ui-02.jpg", "alt": "Dissonant Girls — UI Design, 2", "width": 1920, "height": 1079}, {"src": "assets/projects/dissonant-ui-03.jpg", "alt": "Dissonant Girls — UI Design, 3", "width": 2731, "height": 1533}, {"src": "assets/projects/dissonant-ui-04.jpg", "alt": "Dissonant Girls — UI Design, 4", "width": 2732, "height": 1533}, {"src": "assets/projects/dissonant-ui-05.jpg", "alt": "Dissonant Girls — UI Design, 5", "width": 1920, "height": 1080}], "description": "I designed interfaces around objects on a bedroom desk and a livehouse table. Everyday items carry the menus and controls, grounding schedule planning and performance preparation in the game world."}], contributionSections: [{"id": "environment", "title": "Environment Art", "images": [{"src": "assets/projects/dissonant-environment-01.jpg", "alt": "Dissonant Girls — Environment Art, 1", "width": 1920, "height": 1080}, {"src": "assets/projects/dissonant-environment-02.jpg", "alt": "Dissonant Girls — Environment Art, 2", "width": 1920, "height": 1080}, {"src": "assets/projects/dissonant-environment-03.jpg", "alt": "Dissonant Girls — Environment Art, 3", "width": 1920, "height": 1080}]}, {"id": "props", "title": "UI Prop Art", "images": [{"src": "assets/projects/dissonant-props-01.jpg", "alt": "Dissonant Girls — UI Prop Art, 1", "width": 1920, "height": 1080}, {"src": "assets/projects/dissonant-props-02.jpg", "alt": "Dissonant Girls — UI Prop Art, 2", "width": 1920, "height": 1080}, {"src": "assets/projects/dissonant-props-03.jpg", "alt": "Dissonant Girls — UI Prop Art, 3", "width": 3700, "height": 2500}]}, {"id": "pv", "title": "Promotional PV Illustrations", "images": [{"src": "assets/projects/dissonant-pv-01.jpg", "alt": "Dissonant Girls — Promotional PV Illustrations, 1", "width": 2448, "height": 5500}, {"src": "assets/projects/dissonant-pv-02.jpg", "alt": "Dissonant Girls — Promotional PV Illustrations, 2", "width": 2448, "height": 5500}, {"src": "assets/projects/dissonant-pv-03.jpg", "alt": "Dissonant Girls — Promotional PV Illustrations, 3", "width": 2448, "height": 5500}, {"src": "assets/projects/dissonant-pv-04.jpg", "alt": "Dissonant Girls — Promotional PV Illustrations, 4", "width": 2448, "height": 5500}], "url": "https://www.bilibili.com/video/BV1vaoRYfEu9/?share_source=copy_web&vd_source=0367494718961159a36ea9ce6cdd7590", "linkLabel": "Watch the promotional PV ↗"}], video: null, download: null },
    line: { coverVideo: 'assets/projects/light-as-wind-gameplay.mp4', images: ['assets/projects/light-as-wind-cover-v2.jpg'], gallery: [{"src": "assets/projects/light-as-wind-screenshot-01.png", "alt": "Light As Wind: piano settings screen in a warm pixel-art room", "width": 3200, "height": 1592}, {"src": "assets/projects/light-as-wind-screenshot-02.png", "alt": "Light As Wind: character selection with crab, starfish and swordfish plush toys", "width": 3200, "height": 1588}, {"src": "assets/projects/light-as-wind-screenshot-03.png", "alt": "Light As Wind: crab exploring underwater ruins near the ocean surface", "width": 3200, "height": 1590}, {"src": "assets/projects/light-as-wind-screenshot-04.png", "alt": "Light As Wind: starfish descending among glowing jellyfish", "width": 3200, "height": 1584}, {"src": "assets/projects/light-as-wind-screenshot-05.png", "alt": "Light As Wind: starfish standing among luminous underwater plants", "width": 3200, "height": 1584}, {"src": "assets/projects/light-as-wind-screenshot-06.png", "alt": "Light As Wind: swordfish swimming through strands of glowing sea plants", "width": 3200, "height": 1584}, {"src": "assets/projects/light-as-wind-screenshot-07.png", "alt": "Light As Wind: swordfish leaping near the ocean surface at sunset", "width": 3200, "height": 1586}, {"src": "assets/projects/light-as-wind-screenshot-08.png", "alt": "Light As Wind: crab and turtle exploring submerged ruins", "width": 3200, "height": 1592}, {"src": "assets/projects/light-as-wind-screenshot-09.png", "alt": "Light As Wind: crab resting on a platform among underwater ruins", "width": 3200, "height": 1584}, {"src": "assets/projects/light-as-wind-screenshot-10.png", "alt": "Light As Wind: wide view of an underwater city filled with glowing jellyfish", "width": 3200, "height": 1582}], video: null, download: null },
    anata: { images: ['assets/projects/anata-cover.jpg'], gallery: [{"src": "assets/projects/anata-screenshot-01.jpg", "alt": "Subway carriage interior with five colored identity meters", "width": 3197, "height": 1629}, {"src": "assets/projects/anata-screenshot-02.jpg", "alt": "Anata Shika Mienai No start screen with five character illustrations", "width": 3199, "height": 1629}, {"src": "assets/projects/anata-screenshot-03.jpg", "alt": "Subway station screen showing an obscured character and changing identity meters", "width": 3199, "height": 1639}, {"src": "assets/projects/anata-screenshot-04.jpg", "alt": "Monochrome subway platforms with colored line accents and digital clocks", "width": 3199, "height": 1631}, {"src": "assets/projects/anata-screenshot-05.jpg", "alt": "Subway station concourse with a blue character display", "width": 3199, "height": 1636}], video: null, download: null },
    goose: { images: ['assets/projects/sleepwalk-cover.jpg'], gallery: [{"src": "assets/projects/sleepwalk-gallery-v2-07.png", "alt": "SLEEPWALK title screen with Start, Playlist, Credit and Exit options", "width": 3200, "height": 2000}, {"src": "assets/projects/sleepwalk-gallery-v2-01.jpg", "alt": "Rolling Girl level before and after changing the crescent platforms", "width": 4402, "height": 5500}, {"src": "assets/projects/sleepwalk-gallery-v2-02.jpg", "alt": "World’s End Dancehall level showing mirrored spaces and characters", "width": 4402, "height": 5500}, {"src": "assets/projects/sleepwalk-gallery-v2-03.png", "alt": "Heart-fragment alignment puzzle with a character and its shadow", "width": 3200, "height": 2000}, {"src": "assets/projects/sleepwalk-gallery-v2-04.jpg", "alt": "Geometric heart composition before and after completing the puzzle", "width": 5489, "height": 5500}, {"src": "assets/projects/sleepwalk-gallery-v2-05.jpg", "alt": "Music player interfaces for World’s End Dancehall, Rolling Girl and Unhappy Refrain", "width": 3200, "height": 5994}, {"src": "assets/projects/sleepwalk-gallery-v2-06.jpg", "alt": "Playlist menu with character silhouette and song selections", "width": 5211, "height": 5496}], video: null, download: null },
    bee: { images: ['assets/projects/bee-cover.jpg'], gallery: [{"src": "assets/projects/bee-photo-01.jpg", "alt": "Bee My Flower board, box, rulebook and handmade components on display", "width": 2793, "height": 2160}, {"src": "assets/projects/bee-photo-02.jpg", "alt": "Flower tiles and bee pieces arranged on the game board", "width": 2880, "height": 2160}, {"src": "assets/projects/bee-photo-03.jpg", "alt": "Close-up of a handmade bee piece and illustrated flower tiles", "width": 2160, "height": 2880}, {"src": "assets/projects/bee-photo-04.jpg", "alt": "Open Bee My Flower rulebook showing setup and the core game loop", "width": 2160, "height": 2530}], video: null, download: null }
  },
  // category: 'commissioned' 为委托作品，'fan-art' 为同人创作。
  // 两类作品暂用编号；正式作品名和角色信息可在 title 中补充。
  illustrations: [
    {
        "title": "Fanart / 01",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-01.jpg",
        "alt": "Pink-haired character in a maid dress against a pale blue background",
        "width": 2500,
        "height": 3700,
        "ratio": 1.48
    },
    {
        "title": "Fanart / 02",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-02.jpg",
        "alt": "Long-haired character wearing green headphones and a teal jacket",
        "width": 2500,
        "height": 3700,
        "ratio": 1.48
    },
    {
        "title": "Fanart / 03",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-03.jpg",
        "alt": "Pink-haired and dark-haired characters with a red apple",
        "width": 2048,
        "height": 2048,
        "ratio": 1.0
    },
    {
        "title": "Fanart / 04",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-04.jpg",
        "alt": "Blue-haired character with outfit, pose, and expression studies",
        "width": 3700,
        "height": 3323,
        "ratio": 0.898108
    },
    {
        "title": "Fanart / 05",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-05-v2.jpg",
        "alt": "Long-haired character with yellow stars, blue sky, and a yellow panel",
        "width": 1688,
        "height": 2048,
        "ratio": 1.21327
    },
    {
        "title": "Fanart / 06",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-06.jpg",
        "alt": "Chibi blue-haired character illustration",
        "width": 2048,
        "height": 2048,
        "ratio": 1.0
    },
    {
        "title": "Fanart / 07",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-07.jpg",
        "alt": "Pink-haired character in a dynamic composition",
        "width": 2048,
        "height": 2048,
        "ratio": 1.0
    },
    {
        "title": "Fanart / 08",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-08.jpg",
        "alt": "White-dress character with stars and a blue city nightscape",
        "width": 1080,
        "height": 1567,
        "ratio": 1.450926
    },
    {
        "title": "Fanart / 09",
        "category": "fan-art",
        "src": "assets/illustrations/fan-art-09.jpg",
        "alt": "Pink-haired character in a black and white dress beneath cherry blossoms",
        "width": 1080,
        "height": 1598,
        "ratio": 1.47963
    },
    {
        "title": "Commission / 01",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-01.jpg",
        "date": "2026-10",
        "alt": "Pink-haired character holding a drink and wearing a beret",
        "width": 2500,
        "height": 3700,
        "ratio": 1.48
    },
    {
        "title": "Commission / 02",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-02.jpg",
        "date": "2026-08",
        "alt": "Blue-haired character portrait with floral accessories",
        "width": 1024,
        "height": 1024,
        "ratio": 1.0
    },
    {
        "title": "Commission / 03",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-03.jpg",
        "date": "2026-08",
        "alt": "Purple twin-tailed character portrait with large bows",
        "width": 1024,
        "height": 1024,
        "ratio": 1.0
    },
    {
        "title": "Commission / 04",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-04.jpg",
        "date": "2026-08",
        "alt": "Blue-haired character holding an ornate staff",
        "width": 1600,
        "height": 2368,
        "ratio": 1.48
    },
    {
        "title": "Commission / 05",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-05.jpg",
        "date": "2026-09",
        "alt": "Four light-haired chibi characters",
        "width": 1600,
        "height": 1600,
        "ratio": 1.0
    },
    {
        "title": "Commission / 06",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-06.jpg",
        "date": "2026-07",
        "alt": "Three character portraits with rabbit-ear accessories",
        "width": 2109,
        "height": 1600,
        "ratio": 0.758653
    },
    {
        "title": "Commission / 07",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-07.jpg",
        "date": "2026-06",
        "alt": "Pink-haired and dark-haired cat-eared characters",
        "width": 1600,
        "height": 1600,
        "ratio": 1.0
    },
    {
        "title": "Commission / 08",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-08.jpg",
        "date": "2026-06",
        "alt": "Two characters in detective outfits",
        "width": 1600,
        "height": 1600,
        "ratio": 1.0
    },
    {
        "title": "Commission / 09",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-09.jpg",
        "date": "2026-05",
        "alt": "Pink-haired and pale-blue-haired cat-eared characters",
        "width": 1600,
        "height": 1600,
        "ratio": 1.0
    },
    {
        "title": "Commission / 10",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-10.jpg",
        "date": "2026-09",
        "alt": "Group illustration of four characters in warm tones",
        "width": 2109,
        "height": 1600,
        "ratio": 0.758653
    },
    {
        "title": "Commission / 11",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-11.jpg",
        "date": "2026-06",
        "alt": "Blue-haired character with a teal hat and yellow dress",
        "width": 1600,
        "height": 2368,
        "ratio": 1.48
    },
    {
        "title": "Commission / 12",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-12.jpg",
        "date": "2026-03",
        "alt": "Dark-haired character in formal attire holding flowers",
        "width": 1600,
        "height": 2368,
        "ratio": 1.48
    },
    {
        "title": "Commission / 13",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-13.jpg",
        "date": "2026-05",
        "alt": "Two characters with a telephone and letter motifs against pink",
        "width": 3700,
        "height": 2500,
        "ratio": 0.675676
    },
    {
        "title": "Commission / 14",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-14.jpg",
        "date": "2026-05",
        "alt": "Pink-haired character portrait with a miniature hat",
        "width": 2048,
        "height": 2048,
        "ratio": 1.0
    },
    {
        "title": "Commission / 15",
        "category": "commissioned",
        "src": "assets/illustrations/commissioned-15.jpg",
        "date": "2026-05",
        "alt": "Blue-haired and pink-haired character duo",
        "width": 2048,
        "height": 2048,
        "ratio": 1.0
    }
]
};
