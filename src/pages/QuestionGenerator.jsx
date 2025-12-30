import React, { useState } from 'react';
import { FileText, Download, Loader, Check, AlertCircle, Sparkles } from 'lucide-react';
import { generateQuestions } from '../services/gemini';
import { generateWorksheetDocx, generateWorksheetWithAnswersDocx } from '../utils/documentExport';
import { db } from '../utils/database';

function QuestionGenerator() {
  const [formData, setFormData] = useState({
    subject: '',
    language: '',
    level: '',
    questionType: 'vocabulary',
    count: 10,
    topics: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  
  const subjects = {
    language: ['japanese', 'spanish', 'english'],
    math: ['math']
  };
  
  const levels = {
    japanese: ['N5', 'N4', 'N3', 'N2', 'N1'],
    spanish: ['A1', 'A2', 'B1', 'B2'],
    english: ['小学', '初中', '高中'],
    math: [
      '小学一年级', '小学二年级', '小学三年级', 
      '小学四年级', '小学五年级', '小学六年级',
      '初中一年级', '初中二年级', '初中三年级',
      '高中一年级', '高中二年级', '高中三年级'
    ]
  };
  
  const questionTypes = {
    japanese: ['vocabulary', 'grammar', 'reading'],
    spanish: ['vocabulary', 'grammar', 'conversation'],
    english: ['vocabulary', 'grammar', 'reading'],
    math: ['综合']
  };
  
  const questionTypeLabels = {
    vocabulary: '词汇',
    grammar: '语法',
    reading: '阅读',
    conversation: '会话',
    '综合': '综合练习'
  };
  
  const handleGenerate = async () => {
    if (!formData.subject) {
      setError('请选择科目类型');
      return;
    }
    
    if (formData.subject === 'math') {
      if (!formData.level) {
        setError('请选择年级');
        return;
      }
    } else {
      if (!formData.language || !formData.level) {
        setError('请选择语言和难度级别');
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await generateQuestions({
        subject: formData.subject === 'math' ? 'math' : formData.questionType,
        language: formData.language,
        level: formData.level,
        count: parseInt(formData.count),
        topics: formData.topics ? formData.topics.split('，').map(t => t.trim()).filter(t => t) : []
      });
      
      if (result.length === 0) {
        throw new Error('生成失败，请重试');
      }
      
      setQuestions(result);
      
      for (const q of result) {
        await db.questions.add({
          subject: formData.subject,
          language: formData.language,
          level: formData.level,
          type: formData.questionType,
          content: q,
          createdAt: Date.now()
        });
      }
      
    } catch (err) {
      setError(err.message || '生成失败，请检查网络连接和API密钥配置');
      console.error('生成错误:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async (withAnswers = false) => {
    const metadata = {
      title: `${formData.subject === 'math' ? '数学' : formData.language} ${formData.level} 练习题${withAnswers ? '（含答案）' : ''}`,
      subject: formData.subject,
      language: formData.language,
      level: formData.level
    };
    
    if (withAnswers) {
      await generateWorksheetWithAnswersDocx(questions, metadata);
    } else {
      await generateWorksheetDocx(questions, metadata);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">习题生成器</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">使用AI生成个性化练习题</p>
      </div>
      
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-coral" size={20} />
          <h3 className="text-lg font-bold">生成参数</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">科目类型 *</label>
            <select
              value={formData.subject}
              onChange={(e) => {
                setFormData({ ...formData, subject: e.target.value, language: '', level: '', questionType: 'vocabulary' });
                setQuestions([]);
                setError('');
              }}
              className="input-field"
            >
              <option value="">-- 请选择科目 --</option>
              <option value="language">📚 语言学习</option>
              <option value="math">🔢 数学</option>
            </select>
          </div>
          
          {formData.subject === 'language' && (
            <div>
              <label className="block text-sm font-medium mb-2">语言 *</label>
              <select
                value={formData.language}
                onChange={(e) => {
                  setFormData({ ...formData, language: e.target.value, level: '', questionType: 'vocabulary' });
                  setQuestions([]);
                }}
                className="input-field"
              >
                <option value="">-- 请选择语言 --</option>
                <option value="japanese">🇯🇵 日语</option>
                <option value="spanish">🇪🇸 西班牙语</option>
                <option value="english">🇺🇸 英语</option>
              </select>
            </div>
          )}
          
          {(formData.language || formData.subject === 'math') && (
            <div className={formData.subject === 'language' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium mb-2">
                {formData.subject === 'math' ? '年级' : '难度级别'} *
              </label>
              <select
                value={formData.level}
                onChange={(e) => {
                  setFormData({ ...formData, level: e.target.value });
                  setQuestions([]);
                }}
                className="input-field"
              >
                <option value="">-- 请选择{formData.subject === 'math' ? '年级' : '级别'} --</option>
                {levels[formData.language || 'math']?.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          )}
          
          {formData.language && (
            <div>
              <label className="block text-sm font-medium mb-2">题目类型</label>
              <select
                value={formData.questionType}
                onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                className="input-field"
              >
                {questionTypes[formData.language]?.map(type => (
                  <option key={type} value={type}>
                    {questionTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">题目数量</label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: e.target.value })}
              className="input-field"
            />
          </div>
          
          {(formData.language || formData.subject === 'math') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                特定知识点 <span className="text-gray-500 text-xs">(可选，用中文逗号分隔)</span>
              </label>
              <input
                type="text"
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                placeholder={formData.subject === 'math' ? '例如：加减法，分数运算' : '例如：助词，动词变形'}
                className="input-field"
              />
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full md:w-auto mt-4"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={18} />
              AI生成中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" size={18} />
              生成习题
            </>
          )}
        </button>
      </div>
      
      {questions.length > 0 && (
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Check className="text-green-500" size={24} />
              <h3 className="text-lg font-bold">已生成 {questions.length} 道题</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport(false)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Download size={16} />
                导出试卷
              </button>
              <button
                onClick={() => handleExport(true)}
                className="btn-primary text-sm flex items-center gap-1"
              >
                <Download size={16} />
                导出答案版
              </button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {questions.map((q, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-medium mb-3 flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-coral to-orange-400 text-white text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex-1">{q.question}</span>
                </p>
                
                {q.options && (
                  <div className="ml-9 space-y-1.5 mb-3">
                    {q.options.map((opt, i) => (
                      <div key={i} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                        <span className="font-semibold text-coral">{String.fromCharCode(65 + i)}.</span> {opt}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="ml-9 mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2">
                  <p className="text-sm flex items-start gap-2">
                    <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Check size={16} /> 答案：
                    </span>
                    <span className="flex-1 font-medium text-gray-800 dark:text-gray-200">{q.answer}</span>
                  </p>
                  {q.explanation && (
                    <p className="text-sm flex items-start gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">💡 解析：</span>
                      <span className="flex-1 text-gray-600 dark:text-gray-400">{q.explanation}</span>
                    </p>
                  )}
                  {q.steps && (
                    <div className="text-sm">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">📝 步骤：</span>
                      <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 ml-4 mt-1 space-y-1">
                        {q.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {q.knowledgePoint && (
                    <p className="text-sm flex items-start gap-2">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">🎯 知识点：</span>
                      <span className="flex-1 text-gray-600 dark:text-gray-400">{q.knowledgePoint}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionGenerator;
