import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 全局状态管理
export const useAppStore = create(
  persist(
    (set, get) => ({
      // 用户设置
      settings: {
        language: 'zh-CN', // 界面语言
        theme: 'light', // light/dark
        notifications: true,
        soundEnabled: true
      },
      
      // 当前学习状态
      currentSubject: null,
      currentLanguage: null,
      currentLevel: null,
      
      // 设置更新
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      
      setCurrentSubject: (subject) => set({ currentSubject: subject }),
      setCurrentLanguage: (language) => set({ currentLanguage: language }),
      setCurrentLevel: (level) => set({ currentLevel: level }),
      
      // 重置所有状态
      resetState: () => set({
        currentSubject: null,
        currentLanguage: null,
        currentLevel: null
      })
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ settings: state.settings })
    }
  )
);

// 学习会话状态
export const useSessionStore = create((set) => ({
  isStudying: false,
  currentQuestions: [],
  currentAnswers: {},
  sessionStartTime: null,
  
  startSession: (questions) => set({
    isStudying: true,
    currentQuestions: questions,
    currentAnswers: {},
    sessionStartTime: Date.now()
  }),
  
  updateAnswer: (questionId, answer) => set((state) => ({
    currentAnswers: {
      ...state.currentAnswers,
      [questionId]: answer
    }
  })),
  
  endSession: () => set({
    isStudying: false,
    currentQuestions: [],
    currentAnswers: {},
    sessionStartTime: null
  })
}));

// 通知状态
export const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now(),
        timestamp: Date.now(),
        ...notification
      }
    ]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] })
}));

export default { useAppStore, useSessionStore, useNotificationStore };
