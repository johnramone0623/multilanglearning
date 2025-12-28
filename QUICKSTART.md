# 快速启动指南 🚀

## 第一次使用？跟着这5步走！

### 步骤 1: 安装Node.js
如果还没有安装Node.js，请访问 https://nodejs.org 下载并安装。

验证安装：
```bash
node --version  # 应该显示 v16+ 或更高版本
npm --version   # 应该显示 8+ 或更高版本
```

### 步骤 2: 获取Gemini API密钥（免费）

1. 访问 https://makersuite.google.com/app/apikey
2. 使用Google账号登录
3. 点击 "Create API Key"
4. 复制生成的密钥（类似：AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX）

> 💡 **提示**: 这是完全免费的！每月有45,000次调用额度。

### 步骤 3: 配置项目

在项目根目录（multilang-learning-app文件夹）中：

1. 复制环境变量模板：
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

2. 用文本编辑器打开 `.env` 文件

3. 粘贴你的API密钥：
```
VITE_GEMINI_API_KEY=AIzaSy你的密钥粘贴在这里
```

4. 保存文件

### 步骤 4: 安装依赖

在项目文件夹中打开终端/命令提示符，运行：

```bash
npm install
```

等待安装完成（可能需要3-5分钟）。

### 步骤 5: 启动应用

```bash
npm run dev
```

看到这样的输出：
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

打开浏览器，访问 `http://localhost:3000`

## 🎉 完成！现在可以开始使用了

### 推荐的第一次体验流程：

1. **生成习题**
   - 点击 "生成习题"
   - 选择 "语言学习" → "日语" → "N5"
   - 生成5道题试试
   - 导出为DOCX查看

2. **导入词汇**
   - 点击 "词汇管理"
   - 点击 "下载模板"
   - 在Excel中添加一些词汇
   - 导入到系统
   - 开始复习

3. **测试批改**
   - 在纸上写几个日语单词
   - 拍照上传
   - 查看AI批改结果

## 📱 在手机上使用

### 安卓手机（Pixel 6 / 小米 11 Lite 5G NE）

**方法1：通过局域网访问**
1. 确保手机和电脑在同一WiFi
2. 在电脑终端运行：`npm run dev -- --host`
3. 找到显示的Network地址（如 192.168.1.100:3000）
4. 在手机浏览器输入这个地址

**方法2：部署到在线服务**
- 推荐使用Vercel（免费）
- 5分钟内即可完成部署
- 获得一个永久的网址

### 添加到主屏幕（PWA）
1. 在浏览器中打开应用
2. 点击浏览器菜单
3. 选择 "添加到主屏幕"
4. 像原生App一样使用！

## 🛠️ 故障排除

### 问题：npm install 失败
**解决**：
```bash
# 清理缓存重试
npm cache clean --force
npm install
```

### 问题：页面空白或报错
**检查**：
1. `.env` 文件是否存在且API密钥正确？
2. 浏览器控制台（F12）有什么错误信息？
3. 重新启动开发服务器

### 问题：API调用失败
**检查**：
1. API密钥是否正确粘贴（无多余空格）？
2. 是否超过了免费额度？（查看 https://console.cloud.google.com）
3. 网络连接是否正常？

## 💬 需要帮助？

- 📖 查看完整文档：README.md
- 🐛 报告问题：在GitHub创建Issue
- 💡 功能建议：欢迎提交想法

---

**祝学习愉快！** 🎓📚
