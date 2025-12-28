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
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-primary">学习助手</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI驱动的多语言学习</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="badge badge-danger">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
      
      {/* 移动端顶部栏 */}
      <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">学习助手</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
      
      {/* 移动端菜单 */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-64 h-full p-4 space-y-2" onClick={e => e.stopPropagation()}>
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="badge badge-danger">{item.badge}</span>
                  )}
                </button>
              );
            })}
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
