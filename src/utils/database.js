import Dexie from 'dexie';

// IndexedDB数据库定义
export const db = new Dexie('MultiLangLearnDB');

db.version(1).stores({
  // 词汇表
  vocabulary: '++id, word, translation, language, level, example, audioUrl, imageUrl, nextReview, reviewCount, masteryLevel, createdAt',
  
  // 错题本
  mistakes: '++id, questionId, subject, language, level, question, userAnswer, correctAnswer, explanation, timestamp, reviewStatus',
  
  // 学习记录
  studyLogs: '++id, subject, language, activity, duration, score, timestamp',
  
  // 生成的习题
  questions: '++id, subject, language, level, type, content, answer, explanation, difficulty, tags, createdAt',
  
  // 用户设置
  settings: 'key, value'
});

// 艾宾浩斯遗忘曲线间隔（分钟）
export const EBBINGHAUS_INTERVALS = [
  10,      // 10分钟后
  30,      // 30分钟后
  60,      // 1小时后
  720,     // 12小时后
  1440,    // 1天后
  2880,    // 2天后
  4320,    // 3天后
  10080,   // 7天后
  20160,   // 14天后
  43200    // 30天后
];

// 工具函数：计算下次复习时间
export function calculateNextReview(reviewCount) {
  const intervalIndex = Math.min(reviewCount, EBBINGHAUS_INTERVALS.length - 1);
  const intervalMinutes = EBBINGHAUS_INTERVALS[intervalIndex];
  return Date.now() + intervalMinutes * 60 * 1000;
}

// 工具函数：获取今日待复习词汇
export async function getTodayReviewWords() {
  return await db.vocabulary
    .where('nextReview')
    .belowOrEqual(Date.now())
    .toArray();
}

// 工具函数：更新词汇复习状态
export async function updateVocabularyReview(id, correct) {
  const word = await db.vocabulary.get(id);
  
  if (!word) {
    console.error('词汇不存在:', id);
    return;
  }
  
  if (correct) {
    // 答对：增加复习次数，延长下次复习时间
    const newReviewCount = word.reviewCount + 1;
    await db.vocabulary.update(id, {
      reviewCount: newReviewCount,
      nextReview: calculateNextReview(newReviewCount),
      masteryLevel: Math.min((word.masteryLevel || 1) + 1, 5)
    });
  } else {
    // 答错：重置复习计数，缩短复习时间
    const newReviewCount = Math.max((word.reviewCount || 0) - 1, 0);
    await db.vocabulary.update(id, {
      reviewCount: newReviewCount,
      nextReview: calculateNextReview(0),
      masteryLevel: Math.max((word.masteryLevel || 1) - 1, 1)
    });
  }
}

// 工具函数：添加错题
export async function addMistake(mistakeData) {
  return await db.mistakes.add({
    ...mistakeData,
    timestamp: Date.now(),
    reviewStatus: 'pending'
  });
}

// 工具函数：记录学习日志
export async function logStudyActivity(activity) {
  return await db.studyLogs.add({
    ...activity,
    timestamp: Date.now()
  });
}

// 工具函数：获取学习统计
export async function getStudyStats(days = 7) {
  const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
  
  const logs = await db.studyLogs
    .where('timestamp')
    .above(startTime)
    .toArray();
  
  const totalDuration = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
  const totalActivities = logs.length;
  const totalScore = logs.reduce((sum, log) => sum + (log.score || 0), 0);
  const avgScore = totalActivities > 0 ? totalScore / totalActivities : 0;
  
  return {
    totalDuration,
    totalActivities,
    avgScore,
    bySubject: groupBy(logs, 'subject'),
    byLanguage: groupBy(logs, 'language')
  };
}

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}

export default db;
