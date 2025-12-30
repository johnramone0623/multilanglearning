import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { getStudyStats } from '../utils/database';

function StatsPage() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState(7);
  
  useEffect(() => {
    loadStats();
  }, [period]);
  
  const loadStats = async () => {
    const data = await getStudyStats(period);
    setStats(data);
  };
  
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">学习统计</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">查看你的学习进度和表现</p>
        </div>
        
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="input-field w-auto"
        >
          <option value={7}>近7天</option>
          <option value={30}>近30天</option>
          <option value={90}>近90天</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">总学习时长</h3>
          <p className="text-3xl font-bold text-coral">
            {Math.round(stats.totalDuration / 60)}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">分钟</span>
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">完成活动</h3>
          <p className="text-3xl font-bold text-green-500">
            {stats.totalActivities}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">次</span>
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">平均得分</h3>
          <p className="text-3xl font-bold text-orange-500">
            {isNaN(stats.avgScore) ? 0 : stats.avgScore.toFixed(0)}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">%</span>
          </p>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-bold mb-4">按科目统计</h3>
        <div className="space-y-3">
          {Object.entries(stats.bySubject || {}).map(([subject, activities]) => (
            <div key={subject} className="flex items-center justify-between">
              <span className="font-medium capitalize">{subject}</span>
              <span className="text-gray-600 dark:text-gray-400">
                {activities.length} 次活动
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-bold mb-4">按语言统计</h3>
        <div className="space-y-3">
          {Object.entries(stats.byLanguage || {}).map(([language, activities]) => (
            <div key={language} className="flex items-center justify-between">
              <span className="font-medium capitalize">
                {language === 'japanese' ? '日语 🇯🇵' :
                 language === 'spanish' ? '西班牙语 🇪🇸' :
                 language === 'english' ? '英语 🇺🇸' : language}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {activities.length} 次活动
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
