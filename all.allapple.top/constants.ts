import { Category, CategoryConfig } from './types';

export const CATEGORY_CONFIGS: Record<Category, CategoryConfig> = {
  // === 新增/热门视频 (Featured) ===
  sbkl: { label: '双倍快乐', url: 'https://api.yujn.cn/api/sbkl.php?type=video', type: 'video', group: 'featured' },
  ndym: { label: '你的欲梦', url: 'https://api.yujn.cn/api/ndym.php?type=video', type: 'video', group: 'featured' },
  tianmei: { label: '甜妹系列', url: 'https://api.yujn.cn/api/tianmei.php?type=video', type: 'video', group: 'featured' },
  luoli: { label: '萝莉系列', url: 'https://api.yujn.cn/api/luoli.php?type=video', type: 'video', group: 'featured' },
  shwd: { label: '丝滑舞蹈', url: 'https://api.yujn.cn/api/shwd.php?type=video', type: 'video', group: 'featured' },

  // === 核心视频 (Core) ===
  zzxjj: { label: '小姐姐', url: 'https://api.yujn.cn/api/zzxjj.php', type: 'video', group: 'core' },
  xgg: { label: '小哥哥', url: 'https://api.yujn.cn/api/xgg.php', type: 'video', group: 'core' },
  yuzu: { label: '玉足美腿', url: 'https://api.yujn.cn/api/yuzu.php', type: 'video', group: 'core' },
  manyao: { label: '慢摇舞曲', url: 'https://api.yujn.cn/api/manyao.php?type=video', type: 'video', group: 'core' },
  diaodai: { label: '吊带系列', url: 'https://api.yujn.cn/api/diaodai.php?type=video', type: 'video', group: 'core' },
  nvda: { label: '女大学生', url: 'https://api.yujn.cn/api/nvda.php?type=video', type: 'video', group: 'core' },

  // === 听觉盛宴 (Audio/MV) ===
  xiaoxin: { label: '小新翻唱', url: 'https://api.yujn.cn/api/xiaoxin.php?type=video', type: 'video', group: 'audio' }, // 虽是视频格式，但偏听觉
  yujie: { label: '御姐语音', url: 'https://api.yujn.cn/api/yujie.php?type=video', type: 'audio', group: 'audio' },

  // === 风格与映射 (Style) ===
  hanfu: { label: '汉服国潮', url: 'https://api.yujn.cn/api/hanfu.php?type=video', type: 'video', group: 'style' },
  bianzhuang: { label: '惊艳变装', url: 'https://api.yujn.cn/api/bianzhuang.php?type=video', type: 'video', group: 'style' },
  
  // 映射区 (Mappings)
  jiepai: { label: '街拍路人', url: 'https://api.yujn.cn/api/zzxjj.php', type: 'video', group: 'style' },
  wudao: { label: '热舞秀', url: 'https://api.yujn.cn/api/manyao.php?type=video', type: 'video', group: 'style' }, 
  gaoxiao: { label: '搞笑沙雕', url: 'https://api.yujn.cn/api/zzxjj.php', type: 'video', group: 'style' }, 
  dongman: { label: '动漫视频', url: 'https://api.yujn.cn/api/manzhan.php?type=video', type: 'video', group: 'style' },
  game: { label: '游戏集锦', url: 'https://api.yujn.cn/api/manyao.php?type=video', type: 'video', group: 'style' },

  // === 图片专区 (Image) ===
  gzl_acg: { label: 'ACG 精选', url: 'https://api.yujn.cn/api/gzl_ACG.php?type=image&form=pc', type: 'image', group: 'image' },
};

export const API_ENDPOINTS: Record<Category, string> = Object.entries(CATEGORY_CONFIGS).reduce((acc, [key, val]) => {
  acc[key as Category] = val.url;
  return acc;
}, {} as Record<Category, string>);

export const CATEGORY_LABELS: Record<Category, string> = Object.entries(CATEGORY_CONFIGS).reduce((acc, [key, val]) => {
  acc[key as Category] = val.label;
  return acc;
}, {} as Record<Category, string>);

export const HISTORY_KEY = 'video_app_history_v7';