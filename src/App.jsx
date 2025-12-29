import React, { useState, useEffect } from 'react';
import { useAppStore } from './utils/store';
import { db, getTodayReviewWords } from './utils/database';

// 页面组件（稍后创建）
import HomePage from './pages/HomePage';
import QuestionGenerator from './pages/QuestionGenerator';
import VocabularyManager from './pages/VocabularyManager';
import GradingPage from './pages/GradingPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

// 图标组件
import { Home, BookOpen, FileText, Camera, BarChart3, Settings, Menu, X } from 'lucide-react';

function App() {
  const { settings } = useAppStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  
  // 检查待复习词汇数量
  useEffect(() => {
    const checkReviews = async () => {
      const words = await getTodayReviewWords();
      setReviewCount(words.length);
    };
    
    checkReviews();
    const interval = setInterval(checkReviews, 60000); // 每分钟检查一次
    
    return () => clearInterval(interval);
  }, []);
  
  // 应用主题
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);
  
  // 菜单项配置
  const menuItems = [
    { id: 'home', label: '首页', icon: Home, badge: null },
    { id: 'generate', label: '生成习题', icon: FileText, badge: null },
    { id: 'vocabulary', label: '词汇管理', icon: BookOpen, badge: reviewCount > 0 ? reviewCount : null },
    { id: 'grading', label: '拍照批改', icon: Camera, badge: null },
    { id: 'stats', label: '学习统计', icon: BarChart3, badge: null },
    { id: 'settings', label: '设置', icon: Settings, badge: null }
  ];
  
  // 渲染当前页面
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'generate':
        return <QuestionGenerator />;
      case 'vocabulary':
        return <VocabularyManager />;
      case 'grading':
        return <GradingPage />;
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 侧边栏 - 桌面端 */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              学
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">学习助手</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:pl-5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            版本 1.0.0
          </p>
        </div>
      </aside>
      
      {/* 移动端顶部栏 */}
      <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {currentPage !== 'home' && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {menuItems.find(item => item.id === currentPage)?.label || '学习助手'}
          </h1>
        </div>
        {currentPage === 'home' && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
      </header>
      
      {/* 移动端菜单 */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" 
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 w-72 h-full shadow-2xl animate-slide-in-left flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            {/* 菜单头部 */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary to-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl">
                    学
                  </div>
                  <h2 className="text-lg font-bold text-white">学习助手</h2>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* 菜单项 */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            
            {/* 菜单底部 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                版本 1.0.0 · Made with ❤️
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 主内容区域 */}
      <main className="flex-1 overflow-auto">
        <div className="container-safe max-w-7xl mx-auto p-4 md:p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
