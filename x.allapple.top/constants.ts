
import { NavItem, FeatureItem, TeamMember, BlogPost, SpecItem, ProductColor, Language } from './types';

// ==================================================================================
// GLOBAL STYLES (Glassmorphism & Common Utilities)
// ==================================================================================
export const STYLES = {
  // Main content cards (Features, Specs, Blog, etc.)
  glassPanel: "bg-white/10 dark:bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
  
  // Floating elements (Navbar, Controls, Floating Action Buttons)
  glassFloating: "bg-black/60 backdrop-blur-xl border border-white/10 shadow-lg",
  
  // Modals and Overlays
  glassModal: "bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl",
  
  // Input fields
  glassInput: "bg-black/30 border border-white/10 focus:border-accent backdrop-blur-md"
};

// ==================================================================================
// 资源管理中心 (ASSETS CENTER)
// 文件夹结构:
// resource/img/
// resource/video/
// resource/music/
// ==================================================================================
export const ASSETS = {
  // [REPLACE] 网站图标 / Site Favicon
  // 路径: resource/huibiao
  favicon: "resource/huibiao", 
  
  // [REPLACE] 网站Logo / Site Logo
  // 路径: resource/huibiao
  logo: "resource/huibiao", 
  
  // [REPLACE] 背景视频 / Background Video
  // 路径: resource/video/video.mp4
  bgVideo: "resource/video/video.mp4",
  
  // [REPLACE] 视频封面图 / Video Cover Image
  // 路径: resource/img/beijing(1).jpg
  introVideoCover: "resource/img/beijing(1).jpg",
  
  // [REPLACE] 3D 模型 / 3D Model (.glb or .gltf)
  model3d: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  
  // [REPLACE] 3D 模型封面 / 3D Model Poster
  modelPoster: "https://modelviewer.dev/shared-assets/models/Astronaut.png",
  
  // 默认占位图 / Default Placeholder
  placeholder: "https://picsum.photos/200/200"
};

// ==================================================================================
// 音乐播放列表 (MUSIC PLAYLIST)
// 请在此处添加 resource/music/ 文件夹下的所有音乐文件名
// [REPLACE] Add your music files here
// ==================================================================================
export const MUSIC_PLAYLIST = [
  "resource/music/bgm.mp3",
  "resource/music/song1.mp3", 
  "resource/music/song2.mp3",
  // 在此处继续添加您的音乐...
];

export const CONTACT_EMAIL = "x@allapple.top";
export const WEBSITE_URL = "https://allapple.top";

// ==================================================================================
// 翻译字典 (TRANSLATION DICTIONARY)
// ==================================================================================

export const TRANSLATIONS = {
  zh: {
    siteTitle: "Everett 未来已来",
    siteDesc: "欢迎踏入 AllApple 的全新宇宙！Everett 不仅是产品，更是一种生活方式的革命。",
    loading: "加载中...",
    weatherFetching: "定位中...",
    searchPlaceholder: "搜索...",
    shareTitle: "分享",
    shareMessage: "查看 Everett - 未来的科技体验",
    readMore: "阅读全文",
    contactUs: "联系我们",
    sendMessage: "发送消息",
    namePlaceholder: "您的姓名",
    emailPlaceholder: "您的邮箱",
    msgPlaceholder: "您的消息",
    privacyTitle: "隐私政策声明",
    privacyText: "AllApple 严格遵守国际数据保护条例 (GDPR)。您的数据仅用于提升体验。",
    footerText: "Designed by 小鹏",
    hero: {
      slide1Title: "Everett：自然与科技的共生",
      slide1Desc: "像花朵绽放一样自然的交互体验。Everett 不仅是产品，更是生命的延伸。",
      slide1Btn: "立即探索",
      slide2Title: "发现无限可能",
      slide2Desc: "Everett 重新定义智能生活，融合AI与艺术。新增AR增强现实功能。",
      slide2Btn: "了解更多",
      slide3Title: "加入星际计划",
      slide3Desc: "订阅以解锁独家功能和优先更新。享受个性化AI助手和全球社区支持。",
      slide3Btn: "订阅现在",
    },
    dashboard: {
      title: "全球指挥中心",
      subtitle: "实时行星数据同步",
      timeZone: "世界时区",
      weather: "大气监测",
      humidity: "湿度",
      wind: "风速",
      feelsLike: "体感",
      condition: "气象状况",
      localTime: "本地时间"
    },
    customizer: {
      title: "设计您的未来",
      subtitle: "Everett 不仅仅是科技，更是个人风格的延伸。",
      selectColor: "选择配色",
      shipping: "预计发货时间",
      weeks: "2-3 周",
      preorder: "预订",
      limited: "限量版",
      previewText: "交互式 3D 预览"
    },
    specs: {
      title: "技术规格",
      param: "参数",
      detail: "详情"
    },
    team: {
      title: "创造者团队",
      desc: "AllApple 是一家致力于推动科技与人文融合的创新公司。"
    },
    blog: {
      title: "新闻与博客",
      subtitle: "来自未来的最新动态"
    },
    scanToEnter: "扫码进入"
  },
  en: {
    siteTitle: "Everett - The Future is Here",
    siteDesc: "Welcome to the new universe of AllApple. Everett is a revolution in lifestyle.",
    loading: "Loading...",
    weatherFetching: "Locating...",
    searchPlaceholder: "Search...",
    shareTitle: "Share",
    shareMessage: "Check out Everett - The future of tech experience",
    readMore: "Read More",
    contactUs: "Contact Us",
    sendMessage: "Send Message",
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    msgPlaceholder: "Your Message",
    privacyTitle: "Privacy Policy",
    privacyText: "AllApple strictly follows GDPR. Your data is used only to enhance experience.",
    footerText: "Designed by XiaoPeng",
    hero: {
      slide1Title: "Everett: Symbiosis of Nature & Tech",
      slide1Desc: "Interaction as natural as a blooming flower. Everett is not just a product, it's an extension of life.",
      slide1Btn: "Explore Now",
      slide2Title: "Discover Possibilities",
      slide2Desc: "Redefining smart living with AI and Art fusion. New AR capabilities included.",
      slide2Btn: "Learn More",
      slide3Title: "Join Interstellar Plan",
      slide3Desc: "Subscribe for exclusive features and priority updates. Enjoy personalized AI support.",
      slide3Btn: "Subscribe",
    },
    dashboard: {
      title: "Global Command",
      subtitle: "Real-time planetary data synchronization",
      timeZone: "World Time",
      weather: "Atmospheric Data",
      humidity: "Humidity",
      wind: "Wind",
      feelsLike: "Feels Like",
      condition: "Condition",
      localTime: "Local Time"
    },
    customizer: {
      title: "Design Your Future",
      subtitle: "Everett is not just tech, it's an extension of your style.",
      selectColor: "Select Color",
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
      desc: "AllApple is dedicated to merging technology with humanity."
    },
    blog: {
      title: "News & Blog",
      subtitle: "Latest updates from the future"
    },
    scanToEnter: "SCAN TO ENTER"
  }
};

export const NAV_LINKS: NavItem[] = [
  { key: 'home', href: '#home' },
  { key: 'video', href: '#video' },
  { key: 'dashboard', href: '#dashboard' }, // Added Dashboard link
  { key: 'customizer', href: '#customizer' },
  { key: 'features', href: '#features' },
  { key: 'specs', href: '#specs' },
  { key: 'about', href: '#about' },
  { key: 'blog', href: '#blog' },
  { key: 'contact', href: '#contact' },
];

export const FEATURES: FeatureItem[] = [
  {
    title: { zh: '全息智能交互', en: 'Holographic AI Interaction' },
    description: { 
      zh: 'Everett 的 AI 核心如同您的私人助手，感知您的需求，响应您的每一个动作。', 
      en: 'Everett’s AI core acts as your personal assistant, sensing your needs and responding to every move.' 
    },
    modalContent: {
      zh: '详细描述：Everett 的 AI 核心如同您的私人助手，感知您的需求，响应您的每一个动作。',
      en: 'Detail: Everett’s AI core acts as your personal assistant. It uses advanced neural networks to predict your intent.'
    }
  },
  {
    title: { zh: '星际订阅计划', en: 'Interstellar Subscription' },
    description: {
      zh: '成为 Everett 星际会员，解锁专属功能：超高清虚拟体验、优先升级特权。',
      en: 'Become an Interstellar member to unlock exclusive features: Ultra-HD virtual experiences and priority upgrades.'
    },
    modalContent: {
      zh: '详细描述：成为 Everett 星际会员，享受前所未有的专属荣耀。',
      en: 'Detail: Enjoy unprecedented exclusive glory as a member, including dedicated support and experimental features.'
    }
  },
  {
    title: { zh: '全球创新社区', en: 'Global Innovation Community' },
    description: {
      zh: '加入 AllApple 全球社区，与千万创新者并肩同行。',
      en: 'Join the AllApple global community and walk alongside millions of innovators.'
    },
    modalContent: {
      zh: '详细描述：加入 AllApple 全球社区，我们在全球建立了12个创新中心。',
      en: 'Detail: Join our global community. We have established 12 innovation centers worldwide hosting hackathons.'
    }
  },
  {
    title: { zh: '可持续能源管理', en: 'Sustainable Energy' },
    description: {
      zh: 'Everett 内置智能能源优化系统，自动调整功耗。',
      en: 'Everett features an intelligent energy optimization system that automatically adjusts power consumption.'
    },
    modalContent: {
      zh: '详细描述：Everett 内置智能能源优化系统，支持太阳能充电配件。',
      en: 'Detail: Built-in energy optimization. The casing is made from recycled ocean plastics.'
    }
  }
];

export const SPECS: SpecItem[] = [
  { label: { zh: '处理器', en: 'Processor' }, value: { zh: 'AI Neural Core v2.0', en: 'AI Neural Core v2.0' } },
  { label: { zh: '显示', en: 'Display' }, value: { zh: '全息AR 8K，120Hz', en: 'Holographic AR 8K, 120Hz' } },
  { label: { zh: '电池', en: 'Battery' }, value: { zh: '48小时续航', en: '48h Battery Life' } },
  { label: { zh: '价格', en: 'Price' }, value: { zh: '起始 $999', en: 'From $999' } },
  { label: { zh: '连接', en: 'Connectivity' }, value: { zh: '5G, Wi-Fi 6E, BT 5.3', en: '5G, Wi-Fi 6E, BT 5.3' } },
];

export const TEAM: TeamMember[] = [
  { 
    name: 'Xiao Peng', 
    role: { zh: '创始人 & CEO', en: 'Founder & CEO' }, 
    description: { zh: 'Everett 品牌的灵魂人物，致力于将二次元美学与尖端科技结合。', en: 'The soul of Everett, dedicated to merging anime aesthetics with cutting-edge tech.' },
    avatar: "resource/img/image.png" // 路径: resource/img/image.png
  },
  { 
    name: 'Kaito', 
    role: { zh: '首席探索官', en: 'Chief Explorer' }, 
    description: { zh: '永远在路上，寻找下一个灵感迸发的瞬间。', en: 'Always on the road, looking for the next moment of inspiration.' },
    avatar: "resource/img/image.jpg" // 路径: resource/img/image.jpg
  },
  { 
    name: 'Jane Smith', 
    role: { zh: 'CTO', en: 'CTO' }, 
    description: { zh: 'AI 神经网络架构专家', en: 'AI Neural Network Architect' } 
  },
  { 
    name: 'Emily Chen', 
    role: { zh: '市场总监', en: 'CMO' }, 
    description: { zh: '全球品牌战略', en: 'Global Brand Strategy' } 
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: { zh: 'Everett AI 更新：v2.0 发布', en: 'Everett AI Update: v2.0 Released' },
    excerpt: { zh: '2025年10月，我们推出了Everett v2.0，集成全新全息交互。', en: 'October 2025, we launched Everett v2.0 with new holographic interactions.' },
    fullContent: { zh: '详细内容...', en: 'Full content...' }
  },
  {
    title: { zh: '可持续设计', en: 'Sustainable Design' },
    excerpt: { zh: 'Everett 使用100%可回收材料。', en: 'Everett uses 100% recycled materials.' },
    fullContent: { zh: '详细内容...', en: 'Full content...' }
  },
];

export const PRODUCT_COLORS: ProductColor[] = [
  { id: 'blue', name: { zh: '星云蓝', en: 'Nebula Blue' }, hex: '#0071e3', filterClass: 'hue-rotate-0 saturate-100' },
  { id: 'red', name: { zh: '火星红', en: 'Mars Red' }, hex: '#ff3b30', filterClass: 'hue-rotate-[140deg] saturate-150' },
  { id: 'green', name: { zh: '极光绿', en: 'Aurora Green' }, hex: '#34c759', filterClass: 'hue-rotate-[240deg] saturate-150' },
  { id: 'dark', name: { zh: '虚空黑', en: 'Void Black' }, hex: '#1d1d1f', filterClass: 'grayscale brightness-50' },
];

export const AI_SUGGESTIONS = {
  zh: ["Everett 是什么?", "这安全吗?", "联系客服"],
  en: ["What is Everett?", "Is it safe?", "Contact Support"]
};

export const AI_KNOWLEDGE_BASE = {
  zh: {
    default: "我正在学习中..."
  },
  en: {
    default: "I am still learning..."
  }
};
