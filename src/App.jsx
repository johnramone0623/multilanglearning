import React, { useState, useEffect } from 'react';
import { useAppStore } from './utils/store';
import { getTodayReviewWords } from './utils/database';

import HomePage from './pages/HomePage';
import QuestionGenerator from './pages/QuestionGenerator';
import VocabularyManager from './pages/VocabularyManager';
import GradingPage from './pages/GradingPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

import { Home, BookOpen, FileText, Camera, BarChart3, Settings, Menu, X } from 'lucide-react';

function App() {
  const { settings } = useAppStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  
  useEffect(() => {
    const checkReviews = async () => {
      const words = await getTodayReviewWords();
      setReviewCount(words.length);
    };
    
    checkReviews();
    const interval = setInterval(checkReviews, 60000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);
  
  const menuItems = [
    { id: 'home', label: '首页', icon: Home, badge: null },
    { id: 'generate', label: '生成习题', icon: FileText, badge: null },
    { id: 'vocabulary', label: '词汇管理', icon: BookOpen, badge: reviewCount > 0 ? reviewCount : null },
    { id: 'grading', label: '拍照批改', icon: Camera, badge: null },
    { id: 'stats', label: '学习统计', icon: BarChart3, badge: null },
    { id: 'settings', label: '设置', icon: Settings, badge: null }
  ];
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'generate': return <QuestionGenerator />;
      case 'vocabulary': return <VocabularyManager />;
      case 'grading': return <GradingPage />;
      case 'stats': return <StatsPage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream dark:bg-gray-900">
      {/* 桌面端侧边栏 */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 shadow-xl">
        <div className="p-6 bg-gradient-to-br from-coral to-orange-400">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-white">学习助手</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-coral to-orange-400 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2.5 py-1 bg-sky-500 text-white text-xs font-bold rounded-full shadow-md animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
      
      {/* 移动端顶部栏 */}
      <header className="md:hidden bg-gradient-to-r from-coral to-orange-400 shadow-lg px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <h1 className="text-lg font-bold text-white">
            {menuItems.find(item => item.id === currentPage)?.label || '学习助手'}
          </h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </header>
      
      {/* 移动端菜单 */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" 
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 w-80 h-full shadow-2xl animate-slide-in-left flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 bg-gradient-to-br from-coral to-orange-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">学习助手</h2>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-coral to-orange-400 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2.5 py-1 bg-sky-500 text-white text-xs font-bold rounded-full shadow-md">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
      
      {/* 主内容区域 */}
      <main className="flex-1 overflow-auto bg-cream dark:bg-gray-900">
        <div className="container-safe max-w-7xl mx-auto p-4 md:p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
