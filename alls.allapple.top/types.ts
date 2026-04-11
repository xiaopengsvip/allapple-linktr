export type Category = 
  // --- 新增热门 ---
  | 'sbkl' | 'ndym' | 'tianmei' | 'luoli' | 'shwd' | 'xiaoxin'
  // --- 核心保留 ---
  | 'zzxjj' | 'xgg' | 'yuzu' | 'manyao' | 'diaodai' | 'nvda'
  // --- 风格/其他 ---
  | 'yujie' | 'hanfu' | 'bianzhuang' 
  // --- 映射保留 ---
  | 'jiepai' | 'wudao' | 'gaoxiao' | 'dongman' | 'game' 
  // --- 图片 ---
  | 'gzl_acg';

export type MediaType = 'video' | 'image' | 'audio';

export interface CategoryConfig {
  label: string;
  url: string;
  type: MediaType;
  group: 'featured' | 'core' | 'style' | 'audio' | 'image'; // 新增分组字段
}

export interface VideoItem {
  id: string;
  url: string;
  category: Category;
  type: MediaType;
}

export interface VideoHistoryItem {
  url: string;
  timestamp: number;
  type: MediaType;
}