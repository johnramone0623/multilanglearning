import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';

// 生成DOCX试卷
export async function generateWorksheetDocx(questions, metadata = {}) {
  const {
    title = '练习题',
    subject = '',
    language = '',
    level = '',
    date = new Date().toLocaleDateString('zh-CN')
  } = metadata;
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // 标题
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        
        // 元信息
        new Paragraph({
          children: [
            new TextRun({ text: `科目：${subject}　　`, bold: true }),
            new TextRun({ text: `语言：${language}　　`, bold: true }),
            new TextRun({ text: `难度：${level}　　`, bold: true }),
            new TextRun({ text: `日期：${date}`, bold: true })
          ],
          spacing: { after: 400 }
        }),
        
        new Paragraph({
          text: '─'.repeat(50),
          spacing: { after: 300 }
        }),
        
        // 题目
        ...questions.flatMap((q, index) => [
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. `, bold: true, size: 24 }),
              new TextRun({ text: q.question, size: 24 })
            ],
            spacing: { before: 200, after: 100 }
          }),
          
          // 选项（如果有）
          ...(q.options || []).map((opt, i) => 
            new Paragraph({
              text: `   ${String.fromCharCode(65 + i)}. ${opt}`,
              spacing: { after: 50 }
            })
          ),
          
          // 答题空间
          new Paragraph({
            text: '答案：_____________________________________',
            spacing: { after: 200 }
          }),
          
          new Paragraph({ text: '' }) // 空行
        ])
      ]
    }]
  });
  
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${title}_${Date.now()}.docx`);
}

// 生成带答案的DOCX试卷
export async function generateWorksheetWithAnswersDocx(questions, metadata = {}) {
  const { title = '练习题（含答案）' } = metadata;
  
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        
        ...questions.flatMap((q, index) => [
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. `, bold: true, size: 24 }),
              new TextRun({ text: q.question, size: 24 })
            ],
            spacing: { before: 200, after: 100 }
          }),
          
          ...(q.options || []).map((opt, i) => 
            new Paragraph({
              text: `   ${String.fromCharCode(65 + i)}. ${opt}`,
              spacing: { after: 50 }
            })
          ),
          
          new Paragraph({
            children: [
              new TextRun({ text: '答案：', bold: true, color: '0000FF' }),
              new TextRun({ text: q.answer, color: '0000FF' })
            ],
            spacing: { after: 100 }
          }),
          
          ...(q.explanation ? [
            new Paragraph({
              children: [
                new TextRun({ text: '解析：', bold: true, color: '008000' }),
                new TextRun({ text: q.explanation, color: '008000' })
              ],
              spacing: { after: 200 }
            })
          ] : [])
        ])
      ]
    }]
  });
  
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${title}_${Date.now()}.docx`);
}

// 生成PDF试卷（使用jsPDF）
export function generateWorksheetPdf(questions, metadata = {}) {
  const {
    title = '练习题',
    subject = '',
    language = '',
    level = ''
  } = metadata;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // 注意：jsPDF默认不支持中文，需要添加字体
  // 这里使用基础功能，实际使用需要添加中文字体支持
  
  let yPos = 20;
  
  // 标题
  doc.setFontSize(20);
  doc.text(title, 105, yPos, { align: 'center' });
  yPos += 15;
  
  // 元信息
  doc.setFontSize(12);
  doc.text(`Subject: ${subject}  Language: ${language}  Level: ${level}`, 20, yPos);
  yPos += 10;
  
  // 分隔线
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // 题目
  doc.setFontSize(11);
  questions.forEach((q, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // 题号和问题（注意：纯英文才能正常显示，中文需要特殊字体）
    doc.text(`${index + 1}. ${q.question}`, 20, yPos, { maxWidth: 170 });
    yPos += 10;
    
    // 选项
    if (q.options) {
      q.options.forEach((opt, i) => {
        doc.text(`   ${String.fromCharCode(65 + i)}. ${opt}`, 25, yPos, { maxWidth: 165 });
        yPos += 7;
      });
    }
    
    // 答题空间
    doc.text('Answer: _____________________________________', 20, yPos);
    yPos += 15;
  });
  
  doc.save(`${title}_${Date.now()}.pdf`);
}

// 生成学习报告PDF
export function generateStudyReportPdf(stats, period = '7天') {
  const doc = new jsPDF();
  
  let yPos = 20;
  
  doc.setFontSize(18);
  doc.text('Learning Progress Report', 105, yPos, { align: 'center' });
  yPos += 15;
  
  doc.setFontSize(12);
  doc.text(`Period: Last ${period}`, 20, yPos);
  yPos += 10;
  
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // 统计数据
  const data = [
    ['Total Study Time', `${Math.round(stats.totalDuration / 60)} minutes`],
    ['Total Activities', stats.totalActivities],
    ['Average Score', `${stats.avgScore.toFixed(1)}%`],
    ['Words Reviewed', stats.wordsReviewed || 0],
    ['Mistakes Corrected', stats.mistakesCorrected || 0]
  ];
  
  data.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, 20, yPos);
    yPos += 8;
  });
  
  doc.save(`study_report_${Date.now()}.pdf`);
}

// 辅助函数：下载Blob
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default {
  generateWorksheetDocx,
  generateWorksheetWithAnswersDocx,
  generateWorksheetPdf,
  generateStudyReportPdf
};
