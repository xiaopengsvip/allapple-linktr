// 笔记历史版本接口，用于记录编辑历史
export interface NoteHistoryItem {
  timestamp: number; // 保存时间戳
  title: string;     // 历史标题
  content: string;   // 历史内容
}

// 核心笔记数据结构接口
export interface Note {
  id: string;        // 唯一标识符
  title: string;     // 笔记标题
  content: string;   // 笔记内容（支持 Markdown）
  category: Category; // 笔记分类
  mood: Mood;        // 记录时的心情
  date: string;      // 格式化的日期字符串
  timestamp: number; // 创建或更新的时间戳
  aiSummary?: string; // 可选：AI 生成的摘要
  history?: NoteHistoryItem[]; // 可选：历史版本数组
}

// 预定义的分类类型
export type Category = '工作' | '个人' | '学习' | '灵感' | '其他';

// 预定义的心情类型
export type Mood = '开心 😊' | '兴奋 😄' | '平静 😌' | '中立 😐' | '悲伤 😢';

// 表单数据接口，用于新建和编辑时的临时状态
export interface NoteFormData {
  title: string;
  content: string;
  category: Category;
  mood: Mood;
}