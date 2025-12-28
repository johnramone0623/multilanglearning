import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Download, Plus, Trash2, Search } from 'lucide-react';
import { db, getTodayReviewWords, updateVocabularyReview } from '../utils/database';
import { importVocabularyFromExcel, exportVocabularyToExcel, downloadExcelTemplate } from '../utils/excelImport';

function VocabularyManager() {
  const [words, setWords] = useState([]);
  const [reviewWords, setReviewWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ language: '', level: '' });
  const [reviewMode, setReviewMode] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  useEffect(() => {
    loadWords();
    loadReviewWords();
  }, [filter]);
  
  const loadWords = async () => {
    let query = db.vocabulary;
    
    if (filter.language) {
      query = query.where('language').equals(filter.language);
    }
    
    const result = await query.toArray();
    setWords(result);
  };
  
  const loadReviewWords = async () => {
    const dueWords = await getTodayReviewWords();
    setReviewWords(dueWords);
  };
  
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 使用更友好的提示
    const language = window.prompt(
      '请输入语言（3选1）：\njapanese (日语)\nspanish (西班牙语)\nenglish (英语)',
      'japanese'
    );
    
    if (!language || !['japanese', 'spanish', 'english'].includes(language)) {
      alert('语言输入无效，请输入：japanese、spanish 或 english');
      return;
    }
    
    const level = window.prompt(
      `请输入${language === 'japanese' ? '级别（如：N5、N4）' : language === 'spanish' ? '级别（如：A1、A2）' : '级别（如：小学、初中）'}:`,
      language === 'japanese' ? 'N5' : language === 'spanish' ? 'A1' : '小学'
    );
    
    if (!level) {
      alert('未输入级别，导入取消');
      return;
    }
    
    const result = await importVocabularyFromExcel(file, language, level);
    
    if (result.success) {
      alert(`✅ 成功导入 ${result.imported} 个词汇！${result.failed > 0 ? `\n⚠️ ${result.failed} 个词汇导入失败` : ''}`);
      loadWords();
      loadReviewWords();
    } else {
      alert(`❌ 导入失败：${result.error}`);
    }
    
    // 清空input以允许重复导入相同文件
    e.target.value = '';
  };
  
  const handleReviewAnswer = async (correct) => {
    const currentWord = reviewWords[currentReviewIndex];
    await updateVocabularyReview(currentWord.id, correct);
    
    setShowAnswer(false);
    
    if (currentReviewIndex < reviewWords.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      alert('今日复习完成！🎉');
      setReviewMode(false);
      setCurrentReviewIndex(0);
      loadReviewWords();
    }
  };
  
  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (reviewMode && reviewWords.length > 0) {
    const currentWord = reviewWords[currentReviewIndex];
    
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="card text-center">
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              进度: {currentReviewIndex + 1} / {reviewWords.length}
            </span>
          </div>
          
          <div className="progress-bar mb-6">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentReviewIndex + 1) / reviewWords.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
            <h2 className="text-4xl font-bold mb-4">{currentWord.word}</h2>
            
            {currentWord.pronunciation && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                [{currentWord.pronunciation}]
              </p>
            )}
            
            {showAnswer && (
              <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600 animate-fade-in">
                <p className="text-2xl mb-4">{currentWord.translation}</p>
                {currentWord.example && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {currentWord.example}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="btn-primary w-full"
            >
              显示答案
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleReviewAnswer(false)}
                className="flex-1 btn-secondary"
              >
                ❌ 不记得
              </button>
              <button
                onClick={() => handleReviewAnswer(true)}
                className="flex-1 btn-primary"
              >
                ✅ 记得
              </button>
            </div>
          )}
          
          <button
            onClick={() => {
              setReviewMode(false);
              setCurrentReviewIndex(0);
              setShowAnswer(false);
            }}
            className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            退出复习
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="text-primary" size={32} />
          <div>
            <h1 className="text-3xl font-bold">词汇管理</h1>
            <p className="text-gray-600 dark:text-gray-400">
              共 {words.length} 个词汇，{reviewWords.length} 个待复习
            </p>
          </div>
        </div>
      </div>
      
      {reviewWords.length > 0 && (
        <div className="card border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">今日复习任务</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {reviewWords.length} 个词汇等待复习
              </p>
            </div>
            <button
              onClick={() => setReviewMode(true)}
              className="btn-primary"
            >
              开始复习
            </button>
          </div>
        </div>
      )}
      
      <div className="card">
        <h3 className="text-xl font-bold mb-4">词汇库操作</h3>
        
        <div className="flex flex-wrap gap-3">
          <label className="btn-secondary cursor-pointer">
            <Upload size={18} className="mr-2" />
            导入Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => exportVocabularyToExcel(filter)}
            className="btn-secondary"
          >
            <Download size={18} className="mr-2" />
            导出Excel
          </button>
          
          <button
            onClick={() => downloadExcelTemplate('japanese')}
            className="btn-secondary"
          >
            <Download size={18} className="mr-2" />
            下载模板
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索词汇..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={filter.language}
            onChange={(e) => setFilter({ ...filter, language: e.target.value })}
            className="input-field md:w-40"
          >
            <option value="">全部语言</option>
            <option value="japanese">日语</option>
            <option value="spanish">西班牙语</option>
            <option value="english">英语</option>
          </select>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredWords.map(word => (
            <div
              key={word.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">{word.word}</span>
                  <span className="badge badge-primary">{word.language}</span>
                  <span className="badge badge-secondary">{word.level}</span>
                  {word.masteryLevel >= 4 && (
                    <span className="text-yellow-500">⭐</span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  {word.translation}
                </p>
                {word.example && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {word.example}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  复习次数: {word.reviewCount} | 熟练度: {word.masteryLevel}/5
                </p>
              </div>
              
              <button
                onClick={async () => {
                  if (confirm('确定删除这个词汇吗？')) {
                    await db.vocabulary.delete(word.id);
                    loadWords();
                  }
                }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          {filteredWords.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              暂无词汇，请导入Excel或添加新词汇
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VocabularyManager;
