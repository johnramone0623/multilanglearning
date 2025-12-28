import * as XLSX from 'xlsx';
import { db } from '../utils/database';

// 自动检测列映射
export function detectColumnMapping(headers) {
  const mapping = {
    word: -1,
    translation: -1,
    example: -1,
    pronunciation: -1,
    notes: -1
  };
  
  headers.forEach((header, index) => {
    const lower = (header || '').toString().toLowerCase().trim();
    
    // 检测单词列
    if (lower.includes('word') || lower.includes('単語') || lower.includes('单词') || 
        lower.includes('palabra') || lower === 'word' || lower === '単語') {
      mapping.word = index;
    }
    
    // 检测翻译列
    else if (lower.includes('translation') || lower.includes('翻訳') || lower.includes('翻译') ||
             lower.includes('traducción') || lower.includes('meaning') || lower.includes('中文')) {
      mapping.translation = index;
    }
    
    // 检测例句列
    else if (lower.includes('example') || lower.includes('例文') || lower.includes('例句') ||
             lower.includes('ejemplo') || lower.includes('sentence')) {
      mapping.example = index;
    }
    
    // 检测发音列
    else if (lower.includes('pronunciation') || lower.includes('読み') || lower.includes('发音') ||
             lower.includes('pronunciación') || lower.includes('romaji') || lower.includes('pinyin')) {
      mapping.pronunciation = index;
    }
    
    // 检测备注列
    else if (lower.includes('note') || lower.includes('备注') || lower.includes('メモ') ||
             lower.includes('nota') || lower.includes('remark')) {
      mapping.notes = index;
    }
  });
  
  return mapping;
}

// 导入Excel词汇表
export async function importVocabularyFromExcel(file, language, level) {
  if (!file) {
    return { success: false, error: '未选择文件' };
  }
  
  if (!language || !level) {
    return { success: false, error: '请指定语言和级别' };
  }
  
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Excel文件中没有工作表');
    }
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    if (rows.length < 2) {
      throw new Error('Excel文件内容为空或格式不正确（至少需要标题行和一行数据）');
    }
    
    // 第一行是标题
    const headers = rows[0];
    const mapping = detectColumnMapping(headers);
    
    // 验证必需列
    if (mapping.word === -1) {
      throw new Error('未找到"单词"列，请确保表格包含单词列（列名可以是：word、単語、单词、palabra等）');
    }
    
    const imported = [];
    const failed = [];
    
    // 处理数据行
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // 跳过空行
      if (!row || row.every(cell => !cell && cell !== 0)) continue;
      
      const word = row[mapping.word]?.toString().trim();
      if (!word) {
        failed.push({ row: i + 1, reason: '单词为空' });
        continue;
      }
      
      try {
        const vocabularyItem = {
          word,
          translation: mapping.translation !== -1 ? (row[mapping.translation]?.toString().trim() || '') : '',
          example: mapping.example !== -1 ? (row[mapping.example]?.toString().trim() || '') : '',
          pronunciation: mapping.pronunciation !== -1 ? (row[mapping.pronunciation]?.toString().trim() || '') : '',
          notes: mapping.notes !== -1 ? (row[mapping.notes]?.toString().trim() || '') : '',
          language,
          level,
          nextReview: Date.now(), // 立即可复习
          reviewCount: 0,
          masteryLevel: 1,
          createdAt: Date.now()
        };
        
        await db.vocabulary.add(vocabularyItem);
        imported.push(vocabularyItem);
      } catch (error) {
        failed.push({ row: i + 1, word, reason: error.message });
      }
    }
    
    return {
      success: true,
      imported: imported.length,
      failed: failed.length,
      details: { imported, failed }
    };
  } catch (error) {
    console.error('导入失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 导出词汇表为Excel
export async function exportVocabularyToExcel(filters = {}) {
  try {
    let query = db.vocabulary;
    
    // 应用过滤条件
    if (filters.language) {
      query = query.where('language').equals(filters.language);
    }
    if (filters.level) {
      query = query.where('level').equals(filters.level);
    }
    
    const vocabulary = await query.toArray();
    
    if (vocabulary.length === 0) {
      throw new Error('没有符合条件的词汇');
    }
    
    // 准备数据
    const data = [
      ['单词', '翻译', '例句', '发音', '备注', '熟练度', '复习次数', '下次复习时间']
    ];
    
    vocabulary.forEach(item => {
      data.push([
        item.word,
        item.translation,
        item.example,
        item.pronunciation || '',
        item.notes || '',
        item.masteryLevel,
        item.reviewCount,
        new Date(item.nextReview).toLocaleDateString()
      ]);
    });
    
    // 创建工作簿
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // 设置列宽
    worksheet['!cols'] = [
      { wch: 20 }, // 单词
      { wch: 30 }, // 翻译
      { wch: 50 }, // 例句
      { wch: 20 }, // 发音
      { wch: 30 }, // 备注
      { wch: 10 }, // 熟练度
      { wch: 10 }, // 复习次数
      { wch: 15 }  // 下次复习
    ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '词汇表');
    
    // 生成文件
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // 下载
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `词汇表_${filters.language || 'all'}_${Date.now()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true, count: vocabulary.length };
  } catch (error) {
    console.error('导出失败:', error);
    return { success: false, error: error.message };
  }
}

// Excel模板下载
export function downloadExcelTemplate(language) {
  const templates = {
    japanese: [
      ['単語', '翻訳', '例文', '読み', 'メモ'],
      ['こんにちは', '你好', 'こんにちは、田中さん。', 'konnichiwa', '常用问候语'],
      ['ありがとう', '谢谢', 'ありがとうございます。', 'arigatou', '感谢表达']
    ],
    spanish: [
      ['Palabra', 'Traducción', 'Ejemplo', 'Pronunciación', 'Notas'],
      ['hola', '你好', 'Hola, ¿cómo estás?', 'ola', '常用问候'],
      ['gracias', '谢谢', 'Muchas gracias.', 'grasias', '感谢表达']
    ],
    english: [
      ['Word', 'Translation', 'Example', 'Pronunciation', 'Notes'],
      ['hello', '你好', 'Hello, how are you?', '/həˈləʊ/', '常用问候'],
      ['thanks', '谢谢', 'Thanks for your help.', '/θæŋks/', '感谢表达']
    ]
  };
  
  const data = templates[language] || templates.english;
  
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 50 },
    { wch: 20 },
    { wch: 30 }
  ];
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '词汇模板');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `词汇导入模板_${language}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default {
  detectColumnMapping,
  importVocabularyFromExcel,
  exportVocabularyToExcel,
  downloadExcelTemplate
};
