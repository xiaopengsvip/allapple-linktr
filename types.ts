export interface PreviewItem {
  id: string;
  url: string;
  title: string;
  isBuiltIn?: boolean; // 标识是否为内置站点 (Flag to indicate if the site is built-in/default)
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  color?: string;
}

export interface WeatherData {
  temp: string;
  condition: string;
}

export interface ContentItem {
  id: number | string;
  type: 'news' | 'project' | 'article';
  title: string;
  subtitle?: string; // Date for news, Category for projects
  content: string;
  image?: string;
  link?: string; // External link for projects
  tags?: string[];
}