import React from 'react';
import { Settings, Globe, Moon, Sun, Volume2, Bell } from 'lucide-react';
import { useAppStore } from '../utils/store';

function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  
  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };
  
  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'zh-CN' ? 'en-US' : 'zh-CN' });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">设置</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">自定义你的学习体验</p>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-bold mb-4">外观设置</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.theme === 'light' ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-blue-500" size={20} />
              )}
              <div>
                <p className="font-medium">深色模式</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  保护眼睛，适合夜间学习
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.theme === 'dark'}
                onChange={toggleTheme}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="text-blue-500" size={20} />
              <div>
                <p className="font-medium">界面语言</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {settings.language === 'zh-CN' ? '简体中文' : 'English'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="btn-secondary"
            >
              切换语言
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-bold mb-4">通知设置</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-primary" size={20} />
              <div>
                <p className="font-medium">复习提醒</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  根据遗忘曲线提醒复习
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSettings({ notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="text-green-500" size={20} />
              <div>
                <p className="font-medium">音效</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  答题时的提示音
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-bold mb-4">关于</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>应用名称：</strong>多语言学习助手</p>
          <p><strong>版本：</strong>1.0.0</p>
          <p><strong>技术栈：</strong>React + Vite + Gemini AI</p>
          <p><strong>支持语言：</strong>日语、西班牙语、英语</p>
          <p><strong>支持科目：</strong>语言学习、数学</p>
        </div>
      </div>
      
      <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-bold mb-2 text-yellow-900 dark:text-yellow-100">⚠️ API配置说明</h4>
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          请在项目根目录创建 <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env</code> 文件，
          并添加你的Gemini API密钥：<br/>
          <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">VITE_GEMINI_API_KEY=your_key_here</code>
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;
