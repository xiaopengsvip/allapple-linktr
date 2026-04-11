
export type Language = 'zh' | 'en';

export interface NavItem {
  key: string; // Used to look up translation
  href: string;
  isExternal?: boolean; // 新增：标识是否为外部链接或特殊页面
}

export interface FeatureItem {
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  modalContent: { zh: string; en: string };
}

export interface TeamMember {
  name: string; // Names usually don't translate, or can be same
  role: { zh: string; en: string };
  description: { zh: string; en: string };
  avatar?: string; // Optional custom avatar path
}

export interface BlogPost {
  title: { zh: string; en: string };
  excerpt: { zh: string; en: string };
  fullContent: { zh: string; en: string };
}

export interface SpecItem {
  label: { zh: string; en: string };
  value: { zh: string; en: string };
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ProductColor {
  id: string;
  name: { zh: string; en: string };
  hex: string;
  filterClass: string;
}

// 新增：加密货币数据类型
export interface CryptoCoin {
  symbol: string;
  name: string;
  price: string;
  change: string; // 涨跌幅
  isUp: boolean; // 是否上涨
}
