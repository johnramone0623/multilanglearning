import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Camera, TrendingUp, Clock, Award } from 'lucide-react';
import { db, getTodayReviewWords, getStudyStats } from '../utils/database';

function HomePage({ onNavigate }) {
  const [reviewCount, setReviewCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const words = await getTodayReviewWords();
      setReviewCount(words.length);
      
      const studyStats = await getStudyStats(7);
      setStats(studyStats);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const quickActions = [
    {
      title: '生成习题',
      description: '创建个性化练习题',
      icon: FileText,
      color: 'bg-blue-500',
      action: () => onNavigate('generate')
    },
    {
      title: '词汇复习',
      description: `${reviewCount}个词汇待复习`,
      icon: BookOpen,
      color: 'bg-green-500',
      badge: reviewCount,
      action: () => onNavigate('vocabulary')
    },
    {
      title: '拍照批改',
      description: '上传作业获取即时反馈',
      icon: Camera,
      color: 'bg-purple-500',
      action: () => onNavigate('grading')
    },
    {
      title: '学习统计',
      description: '查看学习进度',
      icon: TrendingUp,
      color: 'bg-orange-500',
      action: () => onNavigate('stats')
    }
  ];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* 欢迎横幅 */}
      <div className="card bg-gradient-to-r from-primary to-blue-600 text-white p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">欢迎回来！👋</h2>
        <p className="text-blue-100">让我们继续你的学习旅程</p>
      </div>
      
      {/* 今日任务 */}
      {reviewCount > 0 && (
        <div className="card border-l-4 border-orange-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Clock className="text-orange-600 dark:text-orange-300" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">今日复习任务</h3>
              <p className="text-gray-600 dark:text-gray-400">
                你有 {reviewCount} 个词汇需要复习
              </p>
            </div>
            <button
              onClick={() => onNavigate('vocabulary')}
              className="btn-primary"
            >
              开始复习
            </button>
          </div>
        </div>
      )}
      
      {/* 快速操作 */}
      <div>
        <h3 className="text-xl font-bold mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="card text-left hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 ${action.color} opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform`}></div>
                <div className="relative">
                  <div className={`inline-flex p-3 ${action.color} text-white rounded-lg mb-3`}>
                    <Icon size={24} />
                  </div>
                  {action.badge > 0 && (
                    <span className="absolute top-0 right-0 badge badge-danger">
                      {action.badge}
                    </span>
                  )}
                  <h4 className="font-bold mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 学习统计概览 */}
      {stats && (
        <div>
          <h3 className="text-xl font-bold mb-4">近7天学习概览</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-primary" size={20} />
                <span className="text-sm text-gray-600 dark:text-gray-400">学习时长</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {Math.round(stats.totalDuration / 60)}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">分钟</span>
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-green-500" size={20} />
                <span className="text-sm text-gray-600 dark:text-gray-400">完成活动</span>
              </div>
              <p className="text-3xl font-bold text-green-500">
                {stats.totalActivities}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">次</span>
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Award className="text-orange-500" size={20} />
                <span className="text-sm text-gray-600 dark:text-gray-400">平均得分</span>
              </div>
              <p className="text-3xl font-bold text-orange-500">
                {isNaN(stats.avgScore) ? 0 : stats.avgScore.toFixed(0)}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">%</span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 学习建议 */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="font-bold mb-2 text-blue-900 dark:text-blue-100">💡 学习小贴士</h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          每天复习15-30分钟比一次性学习几小时效果更好。根据艾宾浩斯遗忘曲线，及时复习能提高记忆效率80%以上！
        </p>
      </div>
    </div>
  );
}

export default HomePage;
