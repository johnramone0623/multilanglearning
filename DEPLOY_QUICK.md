# 部署速查表 ⚡

## 🚀 最快部署方案（10分钟）

### 方法：Vercel + GitHub

```
┌─────────────────────────────────────────────────────┐
│  1. 上传到GitHub  →  2. 连接Vercel  →  3. 完成！   │
│      (3分钟)            (5分钟)           (2分钟)    │
└─────────────────────────────────────────────────────┘
```

---

## 📝 第1步：上传到GitHub

### 如果你会用Git（2分钟）

```bash
cd multilang-learning-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 如果你不会用Git（3分钟）

1. 登录 https://github.com
2. 点击右上角 **+** → **New repository**
3. 仓库名: `learning-app`
4. 选 **Public**
5. 点击 **Create repository**
6. 在新页面，点击 **uploading an existing file**
7. 拖拽项目文件夹内所有文件
8. 点击 **Commit changes**

---

## ⚡ 第2步：部署到Vercel

### 2.1 注册并导入（2分钟）

```
https://vercel.com
    ↓ 点击 Sign Up
    ↓ 用GitHub登录
    ↓ 点击 Add New... → Project
    ↓ 选择你的仓库 learning-app
    ↓ 点击 Import
```

### 2.2 配置环境变量（1分钟）

**关键步骤 - 必须做！**

```
在 Environment Variables 部分：

Name:  VITE_GEMINI_API_KEY
Value: AIzaSyXXXXXXXXXXXXX  (你的密钥)

√ 勾选所有环境 (Production, Preview, Development)

点击 Add → 点击 Deploy
```

---

## ✅ 第3步：验证部署

### 3.1 等待构建（2-3分钟）

```
Vercel会显示：
Building...  ████████░░  80%
```

### 3.2 获取URL

```
部署成功后显示：
🎉 https://learning-app-xxx.vercel.app

点击 Visit 或复制URL
```

### 3.3 测试功能

```
✓ 打开网站 → 能看到首页
✓ 点击"生成习题" → 能生成题目
✓ 点击"词汇管理" → 能导入Excel
✓ 手机访问 → 能正常使用
```

---

## 📱 添加到手机

### Android

```
1. 在Chrome打开你的网站
2. 点击 ⋮ (三个点)
3. 点击 "添加到主屏幕"
4. 确认
→ 桌面出现图标！
```

### iOS

```
1. 在Safari打开你的网站
2. 点击 分享按钮
3. 点击 "添加到主屏幕"
4. 确认
→ 桌面出现图标！
```

---

## 🔄 如何更新

修改代码后：

```bash
git add .
git commit -m "更新了XXX"
git push
```

**Vercel自动重新部署！** 2分钟后网站就更新了。

---

## 🆘 常见问题

### ❌ 打开是空白页

**原因：** 没配置API密钥

**解决：**
```
Vercel → 你的项目 → Settings 
→ Environment Variables 
→ 添加 VITE_GEMINI_API_KEY
→ Deployments → Redeploy
```

### ❌ 推送到GitHub失败

**原因：** 认证失败

**解决：**
```
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. 勾选 repo 权限
5. 生成token
6. 用这个token作为Git密码
```

### ❌ 生成题目失败

**检查：**
```
1. API密钥是否正确？
2. 是否超过免费额度？（每月45,000次）
3. 网络是否正常？
```

---

## 🎯 关键配置一览

### Vercel构建配置

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 环境变量

```
VITE_GEMINI_API_KEY = 你的Gemini密钥
```

### package.json脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 📊 免费额度

| 服务 | 额度 | 重置 |
|------|------|------|
| Vercel | 100GB 带宽/月 | 每月1号 |
| Gemini API | 45,000次/月 | 每月1号 |
| GitHub | 无限仓库 | - |

**个人使用足够！**

---

## 🔗 重要链接

| 服务 | 链接 |
|------|------|
| GitHub | https://github.com |
| Vercel | https://vercel.com |
| Gemini API密钥 | https://makersuite.google.com/app/apikey |
| 域名购买 | https://namecheap.com |
| 性能测试 | https://pagespeed.web.dev |

---

## 🎨 可选：自定义域名

### 在Vercel

```
1. 项目 → Settings → Domains
2. 输入你的域名: myapp.com
3. Vercel给出DNS记录
4. 在域名注册商添加记录：
   
   CNAME: www → cname.vercel-dns.com
   A:     @   → 76.76.21.21

5. 等待DNS生效（2-24小时）
```

---

## ⏱️ 时间估算

| 步骤 | 首次 | 之后 |
|------|------|------|
| 注册账号 | 5分钟 | 0分钟 |
| 上传代码 | 3分钟 | 1分钟 |
| 配置部署 | 5分钟 | 0分钟 |
| 等待构建 | 2分钟 | 2分钟 |
| **总计** | **15分钟** | **3分钟** |

---

## ✨ 部署完成后

**你现在拥有：**

✅ 一个全球可访问的网站
✅ 自动HTTPS加密
✅ 全球CDN加速
✅ 自动部署更新
✅ 免费托管（无需服务器）

**可以做什么：**

📱 在任何设备访问
🔗 分享给朋友
📊 查看使用统计
🎨 自定义功能
💾 导出学习数据

---

## 🎓 下一步学习

想深入了解？查看这些文档：

- `README.md` - 完整功能说明
- `DEPLOYMENT_DETAILED.md` - 详细部署教程
- `FIXES.md` - 代码优化说明
- `PROJECT_STRUCTURE.md` - 项目结构

---

**部署很简单，试试看！** 🚀

有问题？查看 `DEPLOYMENT_DETAILED.md` 获取详细帮助。
