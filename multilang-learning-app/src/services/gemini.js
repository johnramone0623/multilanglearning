// Gemini API 服务
// 注意：在生产环境中，API密钥应该通过后端代理保护

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// API配置 - 使用最新的Flash模型
const API_CONFIG = {
  'flash': {
    endpoint: `${GEMINI_API_BASE}/gemini-flash:generateContent`,
    rateLimit: 15, // 每分钟15次
    maxTokens: 8192
  },
  'pro': {
    endpoint: `${GEMINI_API_BASE}/gemini-pro:generateContent`,
    rateLimit: 15,
    maxTokens: 8192
  }
};

// 简单的速率限制器
class RateLimiter {
  constructor(limit) {
    this.limit = limit;
    this.requests = [];
  }
  
  async checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < 60000);
    
    if (this.requests.length >= this.limit) {
      const waitTime = 60000 - (now - this.requests[0]);
      throw new Error(`请求过于频繁，请等待${Math.ceil(waitTime / 1000)}秒`);
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(15);

// 调用Gemini API
export async function callGemini(prompt, options = {}) {
  const {
    model = 'flash',
    temperature = 0.7,
    maxTokens = 2048,
    images = [],
    systemInstruction = ''
  } = options;
  
  try {
    await rateLimiter.checkLimit();
    
    const config = API_CONFIG[model];
    if (!config) throw new Error(`不支持的模型: ${model}`);
    
    // 构建请求内容
    const contents = [{
      parts: []
    }];
    
    // 添加文本提示
    if (prompt) {
      contents[0].parts.push({ text: prompt });
    }
    
    // 添加图片（如果有）
    for (const image of images) {
      contents[0].parts.push({
        inline_data: {
          mime_type: image.mimeType || 'image/jpeg',
          data: image.data
        }
      });
    }
    
    const requestBody = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topP: 0.95,
        topK: 40
      }
    };
    
    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '请求失败');
    }
    
    const data = await response.json();
    
    // 提取文本内容
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return {
      text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      }
    };
  } catch (error) {
    console.error('Gemini API错误:', error);
    throw error;
  }
}

// 生成练习题
export async function generateQuestions(params) {
  const { subject, language, level, count = 5, topics = [] } = params;
  
  const prompts = {
    japanese: {
      vocabulary: `请生成${count}道日语${level}级别的词汇练习题。
要求：
1. 题目类型包括：汉字读音、词义选择、填空
2. 难度符合${level}标准
3. 每题提供4个选项，标明正确答案
4. 提供详细解析

请以JSON格式输出，格式如下：
[
  {
    "question": "题目内容",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "answer": "正确答案",
    "explanation": "解析"
  }
]`,
      
      grammar: `请生成${count}道日语${level}级别的语法练习题。
要求：
1. 涵盖重要语法点（助词、动词变形、句型等）
2. 难度符合${level}标准
3. 提供详细解析和例句

请以JSON格式输出。`
    },
    
    spanish: {
      vocabulary: `Generate ${count} Spanish ${level} level vocabulary exercises.
Requirements:
1. Include multiple choice, fill-in-blank questions
2. Difficulty matches ${level} standard
3. Provide 4 options per question with correct answer marked
4. Include detailed explanations in Chinese

Output in JSON format.`,
      
      grammar: `Generate ${count} Spanish ${level} level grammar exercises.
Focus on: verb conjugation, articles, prepositions
Output in JSON format with Chinese explanations.`
    },
    
    english: {
      vocabulary: `生成${count}道适合${level}阶段的英语词汇题。
要求：
1. 包含单词选择、词义匹配、拼写题
2. 难度适合小学到初中学生
3. 提供详细解析

JSON格式输出。`,
      
      grammar: `生成${count}道适合${level}阶段的英语语法题。
涵盖：时态、句型转换、介词等
JSON格式输出。`
    },
    
    math: `生成${count}道适合${level}阶段的数学题。
${topics.length > 0 ? `重点考察：${topics.join('、')}` : ''}
要求：
1. 题目难度适中，有梯度
2. 提供详细解题步骤
3. 标注知识点

JSON格式输出，格式：
[
  {
    "question": "题目",
    "answer": "答案",
    "steps": ["步骤1", "步骤2"],
    "knowledgePoint": "知识点"
  }
]`
  };
  
  let prompt;
  if (subject === 'math') {
    prompt = prompts.math;
  } else {
    prompt = prompts[language]?.[subject] || prompts[language]?.vocabulary;
  }
  
  const result = await callGemini(prompt, {
    temperature: 0.8,
    maxTokens: 4096
  });
  
  // 解析JSON响应
  try {
    // 移除可能的markdown代码块标记
    let cleanText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // 尝试提取JSON数组
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // 验证返回的数据格式
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    
    console.warn('无法解析生成的题目，返回空数组');
    return [];
  } catch (e) {
    console.error('JSON解析失败:', e, '\n原始响应:', result.text);
    return [];
  }
}

// 批改作业（支持图片）
export async function gradeAssignment(params) {
  const { image, subject, language, level, questions = [] } = params;
  
  const systemPrompt = `你是一位专业的${subject === 'math' ? '数学' : language === 'japanese' ? '日语' : language === 'spanish' ? '西班牙语' : '英语'}老师。
请仔细批改学生的作业，对每道题：
1. 判断对错
2. 指出错误原因
3. 提供正确答案和解析
4. 给出改进建议

批改风格要：温和鼓励、具体明确、启发思考。`;
  
  const prompt = questions.length > 0
    ? `请批改以下题目的答案：\n${JSON.stringify(questions, null, 2)}\n\n学生的答案在图片中。`
    : `请识别并批改图片中的题目。`;
  
  const result = await callGemini(prompt, {
    images: image ? [image] : [],
    systemInstruction: systemPrompt,
    temperature: 0.5,
    maxTokens: 4096
  });
  
  return result.text;
}

// 生成词汇例句
export async function generateExampleSentences(word, language, count = 3) {
  const prompts = {
    japanese: `请为日语单词"${word}"生成${count}个实用例句。
要求：
1. 例句要自然地道
2. 难度适中
3. 覆盖不同使用场景
4. 提供中文翻译

JSON格式：[{"japanese": "例句", "chinese": "翻译"}]`,
    
    spanish: `Generate ${count} practical example sentences for Spanish word "${word}".
Include Chinese translation.
JSON format: [{"spanish": "sentence", "chinese": "translation"}]`,
    
    english: `为英语单词"${word}"生成${count}个例句。
包含中文翻译。
JSON格式输出。`
  };
  
  const result = await callGemini(prompts[language], {
    temperature: 0.7,
    maxTokens: 1024
  });
  
  try {
    let cleanText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch (e) {
    console.error('例句解析失败:', e);
    return [];
  }
}

// 错题举一反三生成
export async function generateSimilarQuestions(mistakeData, count = 3) {
  const { question, correctAnswer, explanation, subject, language } = mistakeData;
  
  const prompt = `学生在以下题目中出错：
题目：${question}
正确答案：${correctAnswer}
错误原因：${explanation}

请生成${count}道类似的练习题，帮助学生巩固这个知识点。
要求：
1. 题目类型和难度相似
2. 考察相同的知识点
3. 提供答案和解析

JSON格式输出：[{"question": "...", "answer": "...", "explanation": "..."}]`;
  
  const result = await callGemini(prompt, {
    temperature: 0.8,
    maxTokens: 2048
  });
  
  try {
    let cleanText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch (e) {
    console.error('相似题解析失败:', e);
    return [];
  }
}

export default {
  callGemini,
  generateQuestions,
  gradeAssignment,
  generateExampleSentences,
  generateSimilarQuestions
};
