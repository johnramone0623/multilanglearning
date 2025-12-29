import React from 'react';
import { Globe, Moon, Sun, Volume2, Bell, Info } from 'lucide-react';
import { useAppStore } from '../utils/store';

function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  
  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };
  
  const toggleLanguage = () => {
    const newLang = settings.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    updateSettings({ language: newLang });
    window.location.reload();
  };
  
  const isEnglish = settings.language === 'en-US';
  
  const text = {
    title: isEnglish ? 'Settings' : '设置',
    subtitle: isEnglish ? 'Customize your learning experience' : '自定义你的学习体验',
    appearance: isEnglish ? 'Appearance' : '外观设置',
    darkMode: isEnglish ? 'Dark Mode' : '深色模式',
    darkModeDesc: isEnglish ? 'Protect your eyes, suitable for night study' : '保护眼睛，适合夜间学习',
    interfaceLanguage: isEnglish ? 'Interface Language' : '界面语言',
    currentLanguage: isEnglish ? 'English' : '简体中文',
    switchLanguage: isEnglish ? 'Switch Language' : '切换语言',
    notifications: isEnglish ? 'Notifications' : '通知设置',
    reviewReminder: isEnglish ? 'Review Reminder' : '复习提醒',
    reviewReminderDesc: isEnglish ? 'Remind based on forgetting curve' : '根据遗忘曲线提醒复习',
    soundEffect: isEnglish ? 'Sound Effects' : '音效',
    soundEffectDesc: isEnglish ? 'Sound prompts when answering questions' : '答题时的提示音',
    about: isEnglish ? 'About' : '关于',
    appName: isEnglish ? 'App Name' : '应用名称',
    appNameValue: isEnglish ? 'Multilingual Learning Assistant' : '多语言学习助手',
    version: isEnglish ? 'Version' : '版本',
    supportedLanguages: isEnglish ? 'Supported Languages' : '支持语言',
    supportedLanguagesValue: isEnglish ? 'Japanese, Spanish, English' : '日语、西班牙语、英语',
    supportedSubjects: isEnglish ? 'Supported Subjects' : '支持科目',
    supportedSubjectsValue: isEnglish ? 'Language Learning, Mathematics' : '语言学习、数学'
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{text.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{text.subtitle}</p>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-bold mb-4">{text.appearance}</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.theme === 'light' ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-blue-500" size={20} />
              )}
              <div>
                <p className="font-medium">{text.darkMode}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {text.darkModeDesc}
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
                <p className="font-medium">{text.interfaceLanguage}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {text.currentLanguage}
                </p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="btn-secondary text-sm"
            >
              {text.switchLanguage}
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-bold mb-4">{text.notifications}</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-primary" size={20} />
              <div>
                <p className="font-medium">{text.reviewReminder}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {text.reviewReminderDesc}
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
                <p className="font-medium">{text.soundEffect}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {text.soundEffectDesc}
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
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-gray-600 dark:text-gray-400" size={20} />
          <h3 className="text-lg font-bold">{text.about}</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">{text.appName}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{text.appNameValue}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">{text.version}:</span>
            <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">{text.supportedLanguages}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{text.supportedLanguagesValue}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">{text.supportedSubjects}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{text.supportedSubjectsValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
