// 国际化翻译
export const translations = {
  'zh-CN': {
    // 导航
    home: '首页',
    generate: '生成习题',
    vocabulary: '词汇管理',
    grading: '拍照批改',
    stats: '学习统计',
    settings: '设置',
    
    // 首页
    welcomeBack: '欢迎回来！',
    continueJourney: '让我们继续你的学习旅程',
    todayReview: '今日复习任务',
    reviewWords: '你有 {count} 个词汇需要复习',
    startReview: '开始复习',
    quickActions: '快速操作',
    generateQuestions: '生成习题',
    reviewVocab: '词汇复习',
    photoGrade: '拍照批改',
    viewStats: '学习统计',
    
    // 习题生成
    questionGenerator: '习题生成器',
    generateDesc: '使用AI生成个性化练习题',
    selectSubject: '科目类型',
    selectLanguage: '语言',
    selectLevel: '难度级别',
    questionType: '题目类型',
    questionCount: '题目数量',
    generate: '生成习题',
    
    // 词汇管理
    vocabManagement: '词汇管理',
    totalWords: '共 {total} 个词汇',
    pendingReview: '{count} 个待复习',
    importExcel: '导入Excel',
    exportExcel: '导出Excel',
    downloadTemplate: '下载模板',
    
    // 设置
    appearance: '外观设置',
    darkMode: '深色模式',
    interfaceLanguage: '界面语言',
    notifications: '通知设置',
    reviewReminder: '复习提醒',
    soundEffect: '音效',
    
    // 通用
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    loading: '加载中...',
    success: '成功',
    error: '错误',
  },
  
  'en-US': {
    // Navigation
    home: 'Home',
    generate: 'Generate',
    vocabulary: 'Vocabulary',
    grading: 'Grading',
    stats: 'Statistics',
    settings: 'Settings',
    
    // Home
    welcomeBack: 'Welcome Back!',
    continueJourney: "Let's continue your learning journey",
    todayReview: 'Today\'s Review',
    reviewWords: 'You have {count} words to review',
    startReview: 'Start Review',
    quickActions: 'Quick Actions',
    generateQuestions: 'Generate Questions',
    reviewVocab: 'Review Vocabulary',
    photoGrade: 'Photo Grading',
    viewStats: 'View Statistics',
    
    // Question Generator
    questionGenerator: 'Question Generator',
    generateDesc: 'Generate personalized practice questions with AI',
    selectSubject: 'Subject Type',
    selectLanguage: 'Language',
    selectLevel: 'Difficulty Level',
    questionType: 'Question Type',
    questionCount: 'Number of Questions',
    generate: 'Generate',
    
    // Vocabulary
    vocabManagement: 'Vocabulary Management',
    totalWords: '{total} words total',
    pendingReview: '{count} pending review',
    importExcel: 'Import Excel',
    exportExcel: 'Export Excel',
    downloadTemplate: 'Download Template',
    
    // Settings
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    interfaceLanguage: 'Interface Language',
    notifications: 'Notifications',
    reviewReminder: 'Review Reminder',
    soundEffect: 'Sound Effects',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
  }
};

// 翻译函数
export function t(key, params = {}) {
  const language = localStorage.getItem('app-storage') 
    ? JSON.parse(localStorage.getItem('app-storage')).state?.settings?.language || 'zh-CN'
    : 'zh-CN';
  
  let text = translations[language]?.[key] || key;
  
  // 替换参数
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
}
