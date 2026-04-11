import { GoogleGenAI } from "@google/genai";

// 初始化 Gemini 客户端
// 在生产环境中，请确保 build 环境中定义了 process.env.API_KEY
// 注意：API Key 通常通过环境变量注入
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

/**
 * 使用 Gemini AI 生成笔记摘要
 * @param content 笔记的完整内容
 * @returns 返回生成的摘要字符串
 */
export const summarizeNote = async (content: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Please set process.env.API_KEY.");
    return "AI 助手不可用 (缺少 API Key)。";
  }

  try {
    // 调用 Gemini API 生成内容
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // 使用轻量级快速模型
      contents: `请用中文简要总结以下笔记内容（限制在一段话内）：\n\n${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // 简单总结任务不需要深度推理预算，优化速度
      }
    });

    return response.text || "无法生成总结。";
  } catch (error) {
    console.error("Error summarizing note:", error);
    return "与 AI 助手通信时出错。";
  }
};