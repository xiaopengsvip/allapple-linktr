
import { NavItem, FeatureItem, TeamMember, BlogPost, SpecItem, ProductColor, Language, CryptoCoin } from './types';

// ==================================================================================
// 🟢 核心资源替换清单 & 数据源 (RESOURCE REPLACEMENT MASTER LIST)
// ==================================================================================
// 请参照下表，将您的文件放入 public/resource/ 文件夹中。
// 修改下方的变量值以匹配您的文件名。
//
// ┌─────────────┬─────────────────────┬──────────────────────────────┬──────────────────────────┐
// │   资源名称  │    变量名 (常量)    │     建议路径 (public/...)    │       修改案例 (Example)       │
// ├─────────────┼─────────────────────┼──────────────────────────────┼──────────────────────────┤
// │ 网页小图标  │ ASSETS.favicon      │ resource/huibiao.ico         │ "resource/my-fav.ico"    │
// │ 网站 Logo   │ ASSETS.logo         │ resource/logo.png            │ "resource/new-logo.png"  │
// │ 背景视频    │ ASSETS.bgVideo      │ resource/video/main.mp4      │ "resource/bg-2025.mp4"   │
// │ 视频封面    │ ASSETS.introVideoCover│ resource/img/cover.jpg     │ "resource/cover-v2.jpg"  │
// │ 音乐文件    │ MUSIC_PLAYLIST      │ resource/music/track1.mp3    │ ["resource/music/a.mp3"] │
// └─────────────┴─────────────────────┴──────────────────────────────┴──────────────────────────┘

// ==================================================================================
// 1. 全局样式配置 (Global Styles)
// ==================================================================================
export const STYLES = {
  // 玻璃拟态面板
  glassPanel: "bg-white/6 dark:bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]",
  // 悬浮导航/控制条（适度减弱）
  glassFloating: "bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_3px_8px_0_rgba(0,0,0,0.1)]",
  // 模态框（更柔和的阴影）
  glassModal: "bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_6px_20px_0_rgba(0,0,0,0.1)]",
  // 输入框
  glassInput: "bg-black/30 border border-white/10 focus:border-accent backdrop-blur-md"
};

// ==================================================================================
// 2. 资源路径配置 (Assets) - [请在此处修改文件路径]
// ==================================================================================
export const ASSETS = {
  // [替换] 浏览器标签页图标
  favicon: "resource/huibiao.ico", 
  
  // [替换] 网站左上角 Logo（优先使用根目录下的 logo.png，如需替换请放入 resource/logo.png）
  logo: "resource/logo.png", 
  
  // [替换] 背景视频
  bgVideo: "resource/video/main.mp4",
  
  // [替换] 视频加载封面
  introVideoCover: "resource/img/cover.jpg",
  
  // 3D 模型 (可选)
  model3d: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  modelPoster: "https://modelviewer.dev/shared-assets/models/Astronaut.png",
  
  // 生态系统嵌入页面 (Iframe 目标)
  iframeUrl: "https://all.allapple.top"
};

// ==================================================================================
// 3. 社交与分享配置 (Social & Share)
// ==================================================================================
export const SOCIAL_URLS = {
  // [替换] 您的 X (Twitter) 链接
  x: "https://x.com/XIAO2027btc", 
  instagram: "https://instagram.com",
};

// [替换] 预设分享文案 (用于点击分享按钮时)
export const SHARE_CONFIG = {
  title: "Everett - 未来生活方式",
  text: "我发现了 Everett：一个融合 AI、区块链与艺术的未来宇宙。快来看看！",
  url: "https://allapple.top"
};

// ==================================================================================
// 4. 音乐播放列表 (Music)
// ==================================================================================
export const MUSIC_PLAYLIST = [
  "resource/music/bgm.mp3",
  "resource/music/M500003ZdxP61ClQZ5.mp3",
  "resource/music/M500004W2yPD3GPnSO.mp3",
  "resource/music/song1 (1).mp3",
  "resource/music/song1 (2).mp3",
];

// 基础联系信息
export const CONTACT_EMAIL = "x@allapple.top";
export const WEBSITE_URL = "https://allapple.top";

// ==================================================================================
// 5. 导航链接 (Navigation)
// ==================================================================================
export const NAV_LINKS: NavItem[] = [
  { key: 'home', href: '#home' },
  { key: 'video', href: '#video' },
  { key: 'dashboard', href: '#dashboard' },
  { key: 'crypto', href: '#crypto' }, // 新增：加密金融板块
  { key: 'ecosystem', href: '#ecosystem', isExternal: true }, // 新增：生态系统 (Iframe)
  { key: 'customizer', href: '#customizer' },
  { key: 'features', href: '#features' },
  { key: 'contact', href: '#contact' },
];

// ==================================================================================
// 6. 区块链数据 (Blockchain Data) - 模拟数据
// ==================================================================================
export const CRYPTO_DATA: CryptoCoin[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$94,230.50', change: '+2.4%', isUp: true },
  { symbol: 'ETH', name: 'Ethereum', price: '$5,120.00', change: '+1.8%', isUp: true },
  { symbol: 'EVT', name: 'Everett Coin', price: '$12.50', change: '+15.4%', isUp: true },
  { symbol: 'SOL', name: 'Solana', price: '$145.20', change: '-0.5%', isUp: false },
];

// ==================================================================================
// 7. 多语言翻译 (Translations)
// ==================================================================================
export const TRANSLATIONS = {
  zh: {
    siteTitle: "Everett 未来已来",
    siteDesc: "欢迎踏入 AllApple 的全新宇宙！Everett 不仅是产品，更是一种生活方式的革命。",
    loading: "系统初始化...",
    weatherFetching: "卫星信号校准中...",
    searchPlaceholder: "检索全站数据...",
    shareTitle: "分享未来",
    shareMessage: SHARE_CONFIG.text,
    readMore: "深度阅读",
    contactUs: "联系我们",
    followUs: "关注我们的 X (Twitter)", 
    sendMessage: "发送讯息",
    namePlaceholder: "您的姓名 / 代号",
    emailPlaceholder: "电子邮箱",
    msgPlaceholder: "请输入您的留言...",
    privacyTitle: "隐私政策声明",
    privacyText: "AllApple 严格遵守国际数据保护条例 (GDPR)。您的数据仅用于提升体验。",
    footerText: "Designed by 小鹏 | AllApple Inc. 版本：v 2025.12.02 00：33",
    
    // 导航
    nav: {
      home: '首页',
      video: '视觉',
      dashboard: '中枢',
      crypto: '金融',
      ecosystem: '生态',
      customizer: '定制',
      features: '功能',
      contact: '联系'
    },

    hero: {
      slide1Title: "Everett：自然与科技的共生",
      slide1Desc: "像花朵绽放一样自然的交互体验。Everett 不仅是产品，更是生命的延伸，打破虚拟与现实的边界。",
      slide1Btn: "立即探索",
      slide2Title: "发现无限可能",
      slide2Desc: "Everett 重新定义智能生活，融合AI与艺术。新增AR增强现实功能，将数字信息无缝叠加于真实世界。",
      slide2Btn: "深入了解",
      slide3Title: "加入星际计划",
      slide3Desc: "订阅以解锁独家功能和优先更新。享受个性化AI助手、全球社区支持以及专属的数字资产空投。",
      slide3Btn: "立即订阅",
    },
    dashboard: {
      title: "全球指挥中心",
      subtitle: "实时行星环境数据同步",
      timeZone: "世界时区",
      weather: "大气监测",
      humidity: "湿度",
      wind: "风速",
      condition: "气象状况",
    },
    crypto: {
      title: "去中心化金融中枢",
      subtitle: "实时资产监控与 K 线分析",
      marketCap: "总市值",
      volume: "24h 交易量"
    },
    aboutStory: {
      title: "品牌纪元",
      subtitle: "从一个微小的想法到改变世界的旅程",
      story1Title: "起源",
      story1Desc: "Everett 诞生于二次元与代码的碰撞。",
      story2Title: "进化",
      story2Desc: "流体交互界面，赋予系统生命。",
      story3Title: "愿景",
      story3Desc: "创造能理解情感的数字生命体。",
    },
    customizer: {
      title: "定义您的专属风格",
      subtitle: "Everett 的外观可随心定制，支持纳米级色彩喷涂工艺。",
      selectColor: "选择机身涂装",
      shipping: "预计发货周期",
      weeks: "2-3 周",
      preorder: "立即预订",
      limited: "限量版",
      previewText: "交互式 3D 预览"
    },
    specs: {
      title: "核心技术规格",
      param: "参数项",
      detail: "详细数据"
    },
    team: {
      title: "创造者联盟",
      desc: "AllApple 汇聚了全球顶尖的工程师、设计师与艺术家，共同构建未来。"
    },
    blog: {
      title: "未来前沿动态",
      subtitle: "来自实验室的最新情报与深度思考"
    },
    scanToEnter: "扫码接入系统",
    iframeClose: "关闭生态视窗"
  },
  en: {
    siteTitle: "Everett - The Future is Here",
    siteDesc: "Welcome to the new universe of AllApple. Everett is a revolution in lifestyle.",
    loading: "System Initializing...",
    weatherFetching: "Calibrating Satellite...",
    searchPlaceholder: "Search Database...",
    shareTitle: "Share",
    shareMessage: "Check out Everett - The future of tech experience",
    readMore: "Read More",
    contactUs: "Contact Us",
    followUs: "Follow us on X",
    sendMessage: "Send Transmission",
    namePlaceholder: "Your Name / Codename",
    emailPlaceholder: "Email Address",
    msgPlaceholder: "Your Message...",
    privacyTitle: "Privacy Policy",
    privacyText: "AllApple strictly follows GDPR. Your data is used only to enhance experience.",
    footerText: "Designed by XiaoPeng | AllApple Inc.",

    nav: {
      home: 'Home',
      video: 'Visuals',
      dashboard: 'Command',
      crypto: 'DeFi',
      ecosystem: 'Ecosystem',
      customizer: 'Design',
      features: 'Features',
      contact: 'Contact'
    },

    hero: {
      slide1Title: "Everett: Symbiosis of Nature & Tech",
      slide1Desc: "Interaction as natural as a blooming flower. Everett is not just a product, it's an extension of life.",
      slide1Btn: "Explore Now",
      slide2Title: "Discover Possibilities",
      slide2Desc: "Redefining smart living with AI and Art fusion. New AR capabilities included.",
      slide2Btn: "Learn More",
      slide3Title: "Join Interstellar Plan",
      slide3Desc: "Subscribe for exclusive features and priority updates.",
      slide3Btn: "Subscribe",
    },
    dashboard: {
      title: "Global Command",
      subtitle: "Real-time planetary data synchronization",
      timeZone: "World Time",
      weather: "Atmospheric Data",
      humidity: "Humidity",
      wind: "Wind",
      condition: "Condition",
    },
    crypto: {
      title: "DeFi Hub",
      subtitle: "Real-time Asset Monitoring & K-Line Analysis",
      marketCap: "Market Cap",
      volume: "24h Volume"
    },
    aboutStory: {
      title: "Brand Epoch",
      subtitle: "The journey from a tiny idea to changing the world",
      story1Title: "Origin",
      story1Desc: "Anime meets code.",
      story2Title: "Evolution",
      story2Desc: "Fluid interfaces giving life to systems.",
      story3Title: "Vision",
      story3Desc: "Creating Digital Beings with emotion.",
    },
    customizer: {
      title: "Define Your Style",
      subtitle: "Everett extends your personal aesthetic.",
      selectColor: "Select Finish",
      shipping: "Est. Shipping",
      weeks: "2-3 Weeks",
      preorder: "Pre-order",
      limited: "Edition",
      previewText: "Interactive 3D Preview"
    },
    specs: {
      title: "Tech Specs",
      param: "Parameter",
      detail: "Detail"
    },
    team: {
      title: "The Creators",
      desc: "AllApple brings together top engineers to build the future."
    },
    blog: {
      title: "Frontier News",
      subtitle: "Latest intelligence from the lab"
    },
    scanToEnter: "SCAN TO ENTER",
    iframeClose: "Close Portal"
  }
};

// ... (FEATURES, SPECS, TEAM, BLOG_POSTS 保持原有数据结构，此处省略以节省篇幅，实际文件中应包含)
// 为避免 XML 输出过长截断，这里仅展示关键修改，实际文件应包含完整的原有数据列表。
// 假设这里保留了 FEATURES, SPECS, TEAM, BLOG_POSTS, PRODUCT_COLORS 的完整定义。

export const FEATURES: FeatureItem[] = [
  {
    title: { zh: '全息智能交互', en: 'Holographic AI Interaction' },
    description: { 
      zh: 'Everett 的 AI 核心如同您的私人助手，感知您的需求，响应您的每一个动作。支持空中手势与眼球追踪。', 
      en: 'Everett’s AI core acts as your personal assistant, sensing your needs via air gestures and eye tracking.' 
    },
    modalContent: {
      zh: '详细描述：Everett 的 AI 核心如同您的私人助手，感知您的需求。采用了最新的神经网络技术，能够通过微表情识别您的情绪状态，并调整界面色调与音乐。',
      en: 'Detail: Everett’s AI core uses advanced neural networks to predict your intent, recognizing micro-expressions to adjust UI themes and music.'
    }
  },
  {
    title: { zh: '星际订阅计划', en: 'Interstellar Subscription' },
    description: {
      zh: '成为 Everett 星际会员，解锁专属功能：超高清虚拟体验、优先升级特权及云端量子算力。',
      en: 'Become an Interstellar member to unlock exclusive features: Ultra-HD virtual experiences and cloud quantum computing.'
    },
    modalContent: {
      zh: '详细描述：成为 Everett 星际会员，享受前所未有的专属荣耀。包含云端算力支持，让您的便携设备拥有超级计算机的性能。',
      en: 'Detail: Enjoy unprecedented exclusive glory as a member. Includes cloud computing support, giving your portable device supercomputer performance.'
    }
  },
  {
    title: { zh: '全球创新社区', en: 'Global Innovation Community' },
    description: {
      zh: '加入 AllApple 全球社区，与千万创新者并肩同行。分享您的插件、主题与 AR 创作。',
      en: 'Join the AllApple global community. Share your plugins, themes, and AR creations with millions.'
    },
    modalContent: {
      zh: '详细描述：加入 AllApple 全球社区，我们在全球建立了12个创新中心，定期举办极客马拉松。在这里，您的创意可以被变现。',
      en: 'Detail: Join our global community. We have established 12 innovation centers worldwide hosting hackathons where your creativity can be monetized.'
    }
  },
  {
    title: { zh: '可持续能源管理', en: 'Sustainable Energy' },
    description: {
      zh: 'Everett 内置智能能源优化系统，自动调整功耗。支持无线光合充电技术。',
      en: 'Everett features an intelligent energy optimization system. Supports wireless photosynthetic charging.'
    },
    modalContent: {
      zh: '详细描述：Everett 内置智能能源优化系统，支持太阳能充电配件。外壳采用 100% 回收海洋塑料与航空级铝合金。',
      en: 'Detail: Built-in energy optimization. The casing is made from 100% recycled ocean plastics and aerospace-grade aluminum.'
    }
  },
  {
    title: { zh: '量子级隐私加密', en: 'Quantum Encryption' },
    description: {
      zh: '您的数据属于您自己。采用后量子加密算法，确保任何时代的计算机都无法破解您的隐私。',
      en: 'Your data belongs to you. Uses post-quantum encryption algorithms ensuring absolute privacy security.'
    },
    modalContent: {
      zh: '详细描述：我们在芯片底层集成了安全格点（Secure Enclave），所有的生物识别数据仅在本地处理，绝不上传云端。',
      en: 'Detail: We integrated a Secure Enclave at the chip level. All biometric data is processed locally and never uploaded to the cloud.'
    }
  },
  {
    title: { zh: '生物共鸣引擎', en: 'Bio-Resonance Engine' },
    description: {
      zh: '通过触觉反馈与生物节律同步，Everett 能在您焦虑时通过微震动帮助您平复心情。',
      en: 'Syncs with your biorhythms via haptic feedback. Everett helps calm you down via micro-vibrations when anxious.'
    },
    modalContent: {
      zh: '详细描述：内置的线性马达能够模拟心跳、雨滴等自然频率，配合健康 App 提供全天候的情绪管理支持。',
      en: 'Detail: Built-in linear motors simulate natural frequencies like heartbeats or raindrops, providing 24/7 emotional management support.'
    }
  }
];

export const SPECS: SpecItem[] = [
  { label: { zh: '处理器核心', en: 'Processor' }, value: { zh: 'AI Neural Core v3.0 (2nm)', en: 'AI Neural Core v3.0 (2nm)' } },
  { label: { zh: '全息显示', en: 'Display' }, value: { zh: 'AR 8K Micro-LED, 144Hz', en: 'AR 8K Micro-LED, 144Hz' } },
  { label: { zh: '内存与存储', en: 'Storage' }, value: { zh: '32GB RAM / 2TB SSD', en: '32GB RAM / 2TB SSD' } },
  { label: { zh: '续航能力', en: 'Battery' }, value: { zh: '48小时重度使用 (石墨烯电池)', en: '48h Heavy Usage (Graphene)' } },
  { label: { zh: '机身重量', en: 'Weight' }, value: { zh: '142g (零感佩戴)', en: '142g (Zero-G Feel)' } },
  { label: { zh: '防护等级', en: 'Resistance' }, value: { zh: 'IP68 + 军规防摔', en: 'IP68 + Mil-Spec Drop' } },
  { label: { zh: '无线连接', en: 'Connectivity' }, value: { zh: '6G Ready, Wi-Fi 7, 星链直连', en: '6G Ready, Wi-Fi 7, Starlink' } },
  { label: { zh: '起售价', en: 'Price' }, value: { zh: '¥ 6,999 起', en: 'From $999' } },
];

export const TEAM: TeamMember[] = [
  { 
    name: 'Xiao Peng', 
    role: { zh: '创始人 & CEO', en: 'Founder & CEO' }, 
    description: { zh: 'Everett 品牌的灵魂人物，致力于将二次元美学与尖端科技结合。曾在一夜之间重写了操作系统的内核代码。', en: 'The soul of Everett, dedicated to merging anime aesthetics with cutting-edge tech. Rewrote the OS kernel in a single night.' },
    avatar: "resource/img/image.png"
  },
  { 
    name: 'Kaito', 
    role: { zh: '首席探索官', en: 'Chief Explorer' }, 
    description: { zh: '永远在路上，寻找下一个灵感迸发的瞬间。负责全球采风，将极光的颜色带入产品设计中。', en: 'Always on the road, looking for the next moment of inspiration. Bringing the colors of aurora into product design.' },
    avatar: "resource/img/image.jpg"
  },
  { 
    name: 'Jane Smith', 
    role: { zh: '首席技术官', en: 'CTO' }, 
    description: { zh: 'AI 神经网络架构专家，主导了 Everett OS 的情感计算模块。坚信代码是现代的诗歌。', en: 'AI Neural Network Architect, leading the affective computing module. Believes code is modern poetry.' } 
  },
  { 
    name: 'Emily Chen', 
    role: { zh: '市场总监', en: 'CMO' }, 
    description: { zh: '负责全球品牌战略与星际社区运营。成功将 Everett 推向了火星殖民地预备名单。', en: 'Responsible for global brand strategy. Successfully put Everett on the Mars colony reserve list.' } 
  },
  { 
    name: 'David Rossi', 
    role: { zh: '首席声学工程师', en: 'Lead Audio Eng.' }, 
    description: { zh: '格莱美奖获得者，为 Everett 调制了独一无二的开机音效与空间音频算法。', en: 'Grammy winner, crafted the unique startup sound and spatial audio algorithms for Everett.' } 
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: { zh: 'Everett OS 更新：v3.0 "Singularity"', en: 'Everett OS Update: v3.0 "Singularity"' },
    excerpt: { zh: '2025年10月，我们推出了Everett v3.0，代号“奇点”。集成全新全息交互，优化了40%的能耗。', en: 'October 2025, we launched Everett v3.0, codenamed "Singularity", with new holographic interactions.' },
    fullContent: { zh: '详细内容：本次更新带来了革命性的手势控制，以及深度学习用户习惯的 "Predictive UI"。系统现在可以在你想到之前，就准备好你需要的应用。', en: 'Full content: This update brings revolutionary gesture controls and "Predictive UI" that learns your habits.' }
  },
  {
    title: { zh: '设计哲学：当二次元遇见极简主义', en: 'Design: Anime Meets Minimalism' },
    excerpt: { zh: 'Everett 不仅仅是工具，它是连接现实与幻想的桥梁。探讨我们如何平衡视觉冲击力与易用性。', en: 'Everett is a bridge between reality and fantasy. Discussing how we balance visual impact with usability.' },
    fullContent: { zh: '详细内容：我们的设计师深入研究了经典动画的构图与色彩理论，将其应用于 UI 组件的微交互中。每一个按钮的按下，都有其独特的物理反馈。', en: 'Full content: Our designers studied composition and color theory from classic anime, applying it to UI micro-interactions.' }
  },
  {
    title: { zh: '2025 可持续发展报告', en: '2025 Sustainability Report' },
    excerpt: { zh: '我们承诺在 2028 年实现全产业链碳中和。Everett 使用 100% 可回收海洋塑料。', en: 'We pledge carbon neutrality by 2028. Everett uses 100% recycled ocean plastics.' },
    fullContent: { zh: '详细内容：通过改进包装设计，我们减少了 60% 的运输体积。每一台 Everett 的售出，我们都会在亚马逊雨林种植一棵树。', en: 'Full content: By improving packaging, we reduced shipping volume by 60%. For every unit sold, we plant a tree.' }
  },
  {
    title: { zh: '专访：如何训练一个有“心”的 AI', en: 'Interview: Training an AI with Heart' },
    excerpt: { zh: '与首席 AI 科学家的一席谈，揭秘 Everett 情感引擎背后的故事。', en: 'A talk with our Chief AI Scientist, revealing the story behind the Emotion Engine.' },
    fullContent: { zh: '详细内容：我们喂给 AI 看了数千部电影和小说，不是为了教它知识，而是教它理解人类的喜怒哀乐。', en: 'Full content: We fed the AI thousands of movies and novels, not to teach knowledge, but to understand human emotions.' }
  },
  {
    title: { zh: '未来生活指南：AR 时代的社交礼仪', en: 'Guide: Social Etiquette in AR Era' },
    excerpt: { zh: '当每个人都佩戴 Everett 时，我们该如何保持眼神交流？', en: 'How to maintain eye contact when everyone is wearing Everett?' },
    fullContent: { zh: '详细内容：技术不应阻碍连接。我们设计了 "专注模式"，在面对面交谈时自动降低信息密度，让您专注于眼前的人。', en: 'Full content: Technology shouldn\'t block connection. We designed "Focus Mode" to lower info density during face-to-face talks.' }
  },
];

export const PRODUCT_COLORS: ProductColor[] = [
  { id: 'blue', name: { zh: '星云蓝', en: 'Nebula Blue' }, hex: '#0071e3', filterClass: 'hue-rotate-0 saturate-100' },
  { id: 'red', name: { zh: '火星红', en: 'Mars Red' }, hex: '#ff3b30', filterClass: 'hue-rotate-[140deg] saturate-150' },
  { id: 'green', name: { zh: '极光绿', en: 'Aurora Green' }, hex: '#34c759', filterClass: 'hue-rotate-[240deg] saturate-150' },
  { id: 'dark', name: { zh: '虚空黑', en: 'Void Black' }, hex: '#1d1d1f', filterClass: 'grayscale brightness-50' },
  { id: 'gold', name: { zh: '泰坦金', en: 'Titan Gold' }, hex: '#d4af37', filterClass: 'sepia brightness-90' },
];

// ==================================================================================
// 8. AI 助手预设 (AI Config) - 全面汉化
// ==================================================================================
export const AI_SUGGESTIONS = {
  zh: ["Everett 是什么?", "Everett 币走势", "生态系统入口", "安全性如何?", "播放音乐", "联系创始人"],
  en: ["What is Everett?", "Crypto Trends", "Enter Ecosystem", "Is it safe?", "Play Music", "Contact Founder"]
};

export const AI_KNOWLEDGE_BASE = {
  zh: {
    default: "Everett 主脑连接中... 请检查您的神经网络连接。"
  },
  en: {
    default: "Everett Core connecting... Please check your neural link."
  }
};
