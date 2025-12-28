# 多语言学习助手 🎓

一个基于AI驱动的多语言学习平台，支持日语、西班牙语、英语和数学的智能学习。

## ✨ 核心功能

### 1. 智能习题生成
- 📝 支持多语言（日语、西班牙语、英语）
- 🔢 数学题目生成（小学到初中）
- 🎯 自定义难度级别（N5-N1, A1-B2, 小学-初中）
- 📄 一键导出DOCX/PDF格式

### 2. 词汇管理系统
- 📚 Excel批量导入词汇
- 🔄 艾宾浩斯遗忘曲线复习
- ⭐ 熟练度追踪（5级评分）
- 📊 自动计算复习时间

### 3. AI智能批改
- 📷 拍照上传作业
- 🤖 Gemini AI自动批改
- 💡 详细错误解析
- 🎯 个性化改进建议

### 4. 学习统计分析
- 📈 学习时长追踪
- 📊 多维度数据统计
- 🏆 学习成就系统

## 🚀 快速开始

### 前置要求
- Node.js 16+
- 现代浏览器（Chrome/Firefox/Safari）

### 安装步骤

1. **克隆/下载项目**
```bash
cd multilang-learning-app
```

2. **安装依赖**
```bash
npm install
```

3. **配置API密钥**

创建 `.env` 文件：
```bash
cp .env.example .env
```

编辑 `.env`，添加你的Gemini API密钥：
```
VITE_GEMINI_API_KEY=你的密钥
```

> 🔑 获取免费API密钥：https://makersuite.google.com/app/apikey

4. **启动开发服务器**
```bash
npm run dev
```

5. **打开浏览器**
访问 `http://localhost:3000`

## 📱 设备适配

### Windows笔记本
- ✅ 完整功能支持
- ✅ 多窗口布局
- ✅ 键盘快捷键
- ✅ 文件拖放上传

### 安卓手机（Pixel 6 / 小米 11 Lite 5G NE）
- ✅ 响应式设计
- ✅ 相机拍照批改
- ✅ PWA离线支持
- ✅ 手势操作优化

## 🎯 使用指南

### 生成习题
1. 选择科目（语言/数学）
2. 选择语言和难度级别
3. 设置题目数量
4. 点击"生成习题"
5. 导出为DOCX或PDF

### 词汇管理
1. 下载Excel模板
2. 填写词汇数据
3. 导入到系统
4. 系统自动安排复习计划

### 拍照批改
1. 点击"拍照批改"
2. 上传作业照片
3. AI自动识别并批改
4. 查看详细反馈

## 🛠️ 技术栈

- **前端框架**: React 18 + Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **数据库**: IndexedDB (Dexie.js)
- **AI服务**: Google Gemini 2.0 Flash
- **文档处理**: docx.js + jsPDF
- **Excel处理**: SheetJS (xlsx)
- **PWA支持**: Service Worker

## 📊 API使用说明

### Gemini免费额度
- **免费调用**: 每月45,000次
- **速率限制**: 15 RPM (每分钟15次)
- **建议模型**: Gemini 2.0 Flash (速度快+免费)

### 成本估算
- 习题生成: ~10次/天 = 300次/月
- 批改作业: ~5次/天 = 150次/月
- 词汇例句: ~20次/天 = 600次/月
- **总计**: ~1050次/月（完全在免费额度内）

## 🎨 自定义配置

### 修改主题颜色
编辑 `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#你的颜色',
    }
  }
}
```

### 调整遗忘曲线间隔
编辑 `src/utils/database.js`:
```javascript
export const EBBINGHAUS_INTERVALS = [
  10,   // 10分钟
  30,   // 30分钟
  // ... 自定义间隔
];
```

## 📦 构建部署

### 构建生产版本
```bash
npm run build
```

### 部署到Vercel（推荐）
1. 注册 [Vercel](https://vercel.com)
2. 导入GitHub仓库
3. 添加环境变量 `VITE_GEMINI_API_KEY`
4. 自动部署完成

### 部署到Netlify
1. 注册 [Netlify](https://netlify.com)
2. 拖放 `dist` 文件夹
3. 在设置中添加环境变量
4. 发布完成

## 🐛 常见问题

### Q: API密钥无效？
A: 确保在 `.env` 文件中正确配置了 `VITE_GEMINI_API_KEY`

### Q: 拍照功能不工作？
A: 确保浏览器有相机权限，并且使用HTTPS（本地开发localhost除外）

### Q: 词汇导入失败？
A: 检查Excel格式，确保至少有"单词"列

### Q: 离线能用吗？
A: 词汇复习、统计查看支持离线；生成习题、AI批改需要联网

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- Google Gemini AI
- React社区
- 所有开源贡献者

---

**开发者**: 你的名字
**联系方式**: your@email.com
**最后更新**: 2024-12-26
