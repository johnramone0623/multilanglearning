import React, { useState } from 'react';
import { FileText, Download, Loader, Check, AlertCircle } from 'lucide-react';
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
    math: ['小学', '初中', '高中']
  };
  
  const questionTypes = {
    japanese: ['vocabulary', 'grammar', 'reading', 'listening'],
    spanish: ['vocabulary', 'grammar', 'conversation'],
    english: ['vocabulary', 'grammar', 'reading', 'writing'],
    math: ['arithmetic', 'algebra', 'geometry', 'application']
  };
  
  const handleGenerate = async () => {
    if (!formData.subject || (!formData.language && formData.subject !== 'math') || !formData.level) {
      setError('请填写完整的生成参数');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await generateQuestions({
        subject: formData.questionType,
        language: formData.language,
        level: formData.level,
        count: parseInt(formData.count),
        topics: formData.topics ? formData.topics.split(',').map(t => t.trim()) : []
      });
      
      if (result.length === 0) {
        throw new Error('生成失败，请重试');
      }
      
      setQuestions(result);
      
      // 保存到数据库
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
      setError(err.message || '生成失败，请重试');
      console.error('生成错误:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async (withAnswers = false) => {
    const metadata = {
      title: `${formData.language || 'Math'} ${formData.level} 练习题${withAnswers ? '（含答案）' : ''}`,
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
      <div className="flex items-center gap-3">
        <FileText className="text-primary" size={32} />
        <div>
          <h1 className="text-3xl font-bold">习题生成器</h1>
          <p className="text-gray-600 dark:text-gray-400">使用AI生成个性化练习题</p>
        </div>
      </div>
      
      {/* 生成表单 */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">生成参数</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 科目选择 */}
          <div>
            <label className="block text-sm font-medium mb-2">科目类型</label>
            <select
              value={formData.subject}
              onChange={(e) => {
                setFormData({ ...formData, subject: e.target.value, language: '', level: '' });
                setQuestions([]);
              }}
              className="input-field"
            >
              <option value="">请选择科目</option>
              <option value="language">语言学习</option>
              <option value="math">数学</option>
            </select>
          </div>
          
          {/* 语言选择 (仅语言学习) */}
          {formData.subject === 'language' && (
            <div>
              <label className="block text-sm font-medium mb-2">语言</label>
              <select
                value={formData.language}
                onChange={(e) => {
                  setFormData({ ...formData, language: e.target.value, level: '' });
                  setQuestions([]);
                }}
                className="input-field"
              >
                <option value="">请选择语言</option>
                <option value="japanese">日语 🇯🇵</option>
                <option value="spanish">西班牙语 🇪🇸</option>
                <option value="english">英语 🇺🇸</option>
              </select>
            </div>
          )}
          
          {/* 难度级别 */}
          {(formData.language || formData.subject === 'math') && (
            <div>
              <label className="block text-sm font-medium mb-2">难度级别</label>
              <select
                value={formData.level}
                onChange={(e) => {
                  setFormData({ ...formData, level: e.target.value });
                  setQuestions([]);
                }}
                className="input-field"
              >
                <option value="">请选择级别</option>
                {levels[formData.language || 'math']?.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* 题目类型 */}
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
                    {type === 'vocabulary' ? '词汇' :
                     type === 'grammar' ? '语法' :
                     type === 'reading' ? '阅读' :
                     type === 'listening' ? '听力' :
                     type === 'conversation' ? '会话' :
                     type === 'writing' ? '写作' : type}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* 题目数量 */}
          <div>
            <label className="block text-sm font-medium mb-2">题目数量</label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: e.target.value })}
              className="input-field"
            />
          </div>
          
          {/* 知识点 (可选) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              特定知识点 <span className="text-gray-500">(可选，多个用逗号分隔)</span>
            </label>
            <input
              type="text"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="例如：助词、动词变形、过去时"
              className="input-field"
            />
          </div>
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
              生成中...
            </>
          ) : (
            <>
              <FileText className="mr-2" size={18} />
              生成习题
            </>
          )}
        </button>
      </div>
      
      {/* 生成结果 */}
      {questions.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Check className="text-green-500" size={24} />
              <h3 className="text-xl font-bold">已生成 {questions.length} 道题</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport(false)}
                className="btn-secondary text-sm"
              >
                <Download size={16} className="mr-1" />
                导出试卷
              </button>
              <button
                onClick={() => handleExport(true)}
                className="btn-primary text-sm"
              >
                <Download size={16} className="mr-1" />
                导出答案版
              </button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((q, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium mb-2">
                  <span className="text-primary">{index + 1}.</span> {q.question}
                </p>
                
                {q.options && (
                  <div className="ml-6 space-y-1 mb-2">
                    {q.options.map((opt, i) => (
                      <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                        {String.fromCharCode(65 + i)}. {opt}
                      </p>
                    ))}
                  </div>
                )}
                
                <div className="ml-6 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm">
                    <span className="font-medium text-green-600 dark:text-green-400">答案：</span>
                    {q.answer}
                  </p>
                  {q.explanation && (
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">解析：</span>
                      {q.explanation}
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
