# 超详细部署指南 🚀

本指南将手把手教你如何将应用部署到互联网，让你能在任何地方访问。

---

## 📋 部署前准备清单

在开始之前，请确保：

- [ ] 已完成本地测试（`npm run dev` 能正常运行）
- [ ] 有一个Gemini API密钥
- [ ] 有一个GitHub账号（或准备注册一个）
- [ ] 有稳定的网络连接

---

## 🎯 方案选择

| 方案 | 难度 | 时间 | 推荐度 | 适合人群 |
|------|------|------|--------|---------|
| **Vercel (推荐)** | ⭐ 简单 | 10分钟 | ⭐⭐⭐⭐⭐ | 所有人 |
| **Netlify** | ⭐ 简单 | 10分钟 | ⭐⭐⭐⭐ | 所有人 |
| **GitHub Pages** | ⭐⭐ 中等 | 15分钟 | ⭐⭐⭐ | 了解Git |
| **自己的服务器** | ⭐⭐⭐ 复杂 | 30分钟 | ⭐⭐ | 有服务器 |

**建议：选择Vercel，最简单且完全免费！**

---

# 方案一：Vercel部署（⭐推荐）

## 为什么选择Vercel？

✅ 完全免费（个人使用）
✅ 自动HTTPS
✅ 全球CDN加速
✅ 自动部署（推送代码即部署）
✅ 简单易用（3步完成）

---

## 第一步：上传代码到GitHub

### 1.1 注册GitHub账号

如果还没有GitHub账号：

1. 访问：https://github.com
2. 点击右上角 **Sign up**
3. 填写信息：
   - Email: 你的邮箱
   - Password: 设置密码（至少15个字符或8个字符+数字）
   - Username: 用户名（全局唯一）
4. 验证邮箱
5. 完成注册

### 1.2 安装Git（如果还没装）

**Windows系统：**
1. 下载：https://git-scm.com/download/win
2. 双击安装包
3. 一路点击 "Next"
4. 选择默认编辑器时选 "Use Visual Studio Code" 或保持默认
5. 其他选项保持默认
6. 安装完成

**验证安装：**
```bash
# 打开命令提示符（CMD）或PowerShell
git --version
# 应该显示：git version 2.x.x
```

**Mac系统：**
```bash
# 打开终端（Terminal）
# 方法1：使用Homebrew
brew install git

# 方法2：Xcode命令行工具会自动安装Git
xcode-select --install
```

### 1.3 配置Git

```bash
# 设置你的Git用户名（GitHub上显示的提交者）
git config --global user.name "你的名字"

# 设置你的邮箱（必须是GitHub注册邮箱）
git config --global user.email "your@email.com"

# 验证配置
git config --list
```

### 1.4 创建GitHub仓库

1. 登录GitHub
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - Repository name: `multilang-learning-app` （或你喜欢的名字）
   - Description: `多语言学习助手` （可选）
   - Public/Private: 选 **Public**（公开，免费部署）
   - ❌ **不要勾选** "Add a README file"
   - ❌ **不要勾选** "Add .gitignore"
   - ❌ **不要勾选** "Choose a license"
4. 点击 **Create repository**

### 1.5 上传代码到GitHub

**打开命令行，进入项目文件夹：**

```bash
# Windows (CMD/PowerShell)
cd C:\Users\你的用户名\Downloads\multilang-learning-app

# Mac/Linux
cd ~/Downloads/multilang-learning-app
```

**初始化Git仓库并上传：**

```bash
# 1. 初始化Git仓库
git init

# 2. 添加所有文件
git add .

# 3. 创建第一次提交
git commit -m "Initial commit: 多语言学习助手"

# 4. 连接到GitHub仓库（替换下面的用户名和仓库名）
git remote add origin https://github.com/你的用户名/multilang-learning-app.git

# 5. 上传代码
git push -u origin main
```

**如果提示输入用户名和密码：**
- Username: 你的GitHub用户名
- Password: 使用**Personal Access Token**（不是账号密码）

**如何生成Personal Access Token：**

1. 登录GitHub
2. 右上角头像 → **Settings**
3. 左侧菜单最下方 → **Developer settings**
4. 左侧 **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token** → **Generate new token (classic)**
6. 填写：
   - Note: `Vercel Deploy`
   - Expiration: 选 **No expiration**（永不过期）
   - 勾选权限：只勾选 **repo**（仓库权限）
7. 点击最下方 **Generate token**
8. **立即复制token**（只显示一次！）
9. 在命令行粘贴这个token作为密码

**上传成功后，刷新GitHub页面，应该能看到所有代码文件。**

---

## 第二步：在Vercel部署

### 2.1 注册Vercel账号

1. 访问：https://vercel.com
2. 点击 **Sign Up**
3. 选择 **Continue with GitHub**（用GitHub账号登录）
4. 授权Vercel访问你的GitHub
5. 注册完成

### 2.2 导入项目

1. 登录Vercel后台：https://vercel.com/dashboard
2. 点击 **Add New...** → **Project**
3. 找到你的仓库 `multilang-learning-app`
4. 点击 **Import**

### 2.3 配置项目

**Build & Development Settings：**

Vercel会自动检测到这是一个Vite项目，配置应该是：

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**如果没有自动填写，手动填入上面的配置。**

### 2.4 配置环境变量（重要！）

在 **Environment Variables** 部分：

1. 点击 **Add**
2. Name: `VITE_GEMINI_API_KEY`
3. Value: 粘贴你的Gemini API密钥（如：AIzaSyXXXXXX）
4. 环境选择：勾选 **Production**, **Preview**, **Development**（全选）
5. 点击 **Add**

### 2.5 开始部署

1. 确认所有配置正确
2. 点击最下方 **Deploy**
3. 等待2-3分钟（可以看到实时构建日志）

**部署成功标志：**
- 看到 🎉 **Congratulations!** 页面
- 显示你的应用URL（如：`https://multilang-learning-app.vercel.app`）

### 2.6 访问你的应用

1. 点击 **Visit** 或复制显示的URL
2. 在浏览器打开
3. 🎉 你的应用已上线！

---

## 第三步：在手机上使用

### 3.1 添加到主屏幕（Android）

**Chrome浏览器：**
1. 在手机浏览器打开你的应用URL
2. 点击右上角 ⋮ （三个点）
3. 选择 **添加到主屏幕** 或 **安装应用**
4. 确认添加
5. 现在桌面上有一个图标，像原生APP一样使用！

**小米浏览器：**
1. 打开应用URL
2. 底部菜单 → **添加到桌面**
3. 确认

### 3.2 测试离线功能

1. 打开应用
2. 进入词汇管理，复习几个单词
3. 开启飞行模式
4. 刷新应用 → 应该还能打开
5. 查看词汇和统计 → 应该正常显示
6. 尝试生成题目 → 会提示需要网络

---

## 常见问题排查

### Q1: 部署成功但打开是空白页

**原因1：API密钥没配置**

解决方法：
1. 回到Vercel项目页面
2. 点击 **Settings** → **Environment Variables**
3. 检查 `VITE_GEMINI_API_KEY` 是否存在
4. 如果不存在，添加它
5. 回到 **Deployments** 标签
6. 找到最新的部署，点击右边的 ⋮ → **Redeploy**

**原因2：构建失败**

解决方法：
1. 查看 **Deployments** 标签
2. 点击失败的部署
3. 查看构建日志（Build Logs）
4. 根据错误信息修复代码
5. 重新推送到GitHub

### Q2: 推送到GitHub时提示错误

**错误：`fatal: not a git repository`**

解决：
```bash
git init
git add .
git commit -m "Initial commit"
```

**错误：`Authentication failed`**

解决：使用Personal Access Token代替密码

**错误：`Permission denied`**

解决：
```bash
git remote set-url origin https://你的token@github.com/你的用户名/仓库名.git
```

### Q3: 生成题目失败

**检查清单：**

1. API密钥是否正确？
   - 登录 https://makersuite.google.com/app/apikey
   - 检查密钥是否有效
   
2. 是否超过免费额度？
   - 检查API使用情况
   - 免费额度：每月45,000次

3. 网络是否正常？
   - 尝试刷新页面
   - 检查浏览器控制台（F12）错误信息

### Q4: 无法上传照片批改

**原因：浏览器权限**

解决：
1. 点击浏览器地址栏左边的锁图标
2. 找到 **相机** 权限
3. 改为 **允许**
4. 刷新页面

**注意：**
- 必须使用HTTPS（Vercel自动提供）
- localhost也可以使用相机
- HTTP网站无法使用相机

---

## 自动部署配置

### 当你修改代码后

只需要三步：

```bash
# 1. 添加修改
git add .

# 2. 提交修改
git commit -m "描述你做了什么修改"

# 3. 推送到GitHub
git push
```

**Vercel会自动检测到更新，自动重新部署！**

大约2分钟后，你的网站就更新了。

---

# 方案二：Netlify部署

如果Vercel有问题，可以试试Netlify（步骤几乎相同）。

## 步骤1：上传到GitHub

（同Vercel的第一步，如果已完成可跳过）

## 步骤2：部署到Netlify

### 2.1 注册Netlify

1. 访问：https://netlify.com
2. 点击 **Sign up**
3. 选择 **GitHub** 登录
4. 授权Netlify

### 2.2 导入项目

1. 点击 **Add new site** → **Import an existing project**
2. 选择 **Deploy with GitHub**
3. 授权访问你的仓库
4. 选择 `multilang-learning-app` 仓库

### 2.3 配置构建

**Build settings:**
```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

### 2.4 添加环境变量

1. 在部署前，点击 **Show advanced**
2. 点击 **New variable**
3. Key: `VITE_GEMINI_API_KEY`
4. Value: 你的API密钥
5. 点击 **Add**

### 2.5 部署

1. 点击 **Deploy site**
2. 等待3-5分钟
3. 部署成功后会显示URL（如：`https://xxx.netlify.app`）

### 2.6 自定义域名（可选）

1. 点击 **Site settings** → **Domain management**
2. 点击 **Options** → **Edit site name**
3. 修改为你想要的名字（如：`my-learning-app`）
4. 保存后URL变为：`https://my-learning-app.netlify.app`

---

# 方案三：GitHub Pages部署

**注意：** GitHub Pages不支持环境变量，需要修改代码。

## 步骤1：修改代码

编辑 `src/services/gemini.js`：

```javascript
// 在文件顶部修改
const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXX'; // 直接写入你的API密钥
```

⚠️ **警告：** 这会将API密钥暴露在代码中，不推荐！

## 步骤2：修改配置

编辑 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/multilang-learning-app/', // 添加这一行，使用你的仓库名
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 步骤3：安装gh-pages

```bash
npm install --save-dev gh-pages
```

## 步骤4：修改package.json

添加部署脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

## 步骤5：部署

```bash
# 构建并部署
npm run deploy
```

## 步骤6：启用GitHub Pages

1. 访问你的GitHub仓库
2. 点击 **Settings**
3. 左侧菜单 → **Pages**
4. Source 选择：**Deploy from a branch**
5. Branch 选择：**gh-pages** / **root**
6. 点击 **Save**
7. 等待几分钟
8. 页面会显示访问URL：`https://你的用户名.github.io/multilang-learning-app/`

---

# 方案四：自己的服务器部署

如果你有VPS（如阿里云、腾讯云、DigitalOcean）。

## 前置条件

- 一台Linux服务器（Ubuntu/Debian推荐）
- SSH访问权限
- 域名（可选）

## 步骤1：连接服务器

```bash
# Windows使用PowerShell或PuTTY
# Mac/Linux使用Terminal
ssh username@your-server-ip
```

## 步骤2：安装Node.js

```bash
# 更新系统
sudo apt update

# 安装Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version  # 应该显示 v20.x.x
npm --version   # 应该显示 10.x.x
```

## 步骤3：安装Nginx

```bash
sudo apt install nginx -y

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

## 步骤4：上传项目

**方法1：使用Git**

```bash
# 在服务器上
cd /var/www
sudo git clone https://github.com/你的用户名/multilang-learning-app.git
cd multilang-learning-app
```

**方法2：使用SCP上传**

```bash
# 在本地电脑
scp -r multilang-learning-app username@your-server-ip:/var/www/
```

## 步骤5：构建项目

```bash
cd /var/www/multilang-learning-app

# 创建.env文件
sudo nano .env
# 添加：VITE_GEMINI_API_KEY=你的密钥
# 按Ctrl+X，然后Y，然后Enter保存

# 安装依赖
sudo npm install

# 构建
sudo npm run build
```

## 步骤6：配置Nginx

```bash
# 创建Nginx配置文件
sudo nano /etc/nginx/sites-available/multilang-app
```

**添加以下内容：**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改成你的域名，或服务器IP
    
    root /var/www/multilang-learning-app/dist;
    index index.html;
    
    # 处理SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**按Ctrl+X，然后Y，然后Enter保存。**

## 步骤7：启用站点

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/multilang-app /etc/nginx/sites-enabled/

# 测试Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 步骤8：配置防火墙

```bash
# 允许HTTP
sudo ufw allow 'Nginx HTTP'

# 允许HTTPS（稍后配置SSL时需要）
sudo ufw allow 'Nginx HTTPS'

# 检查状态
sudo ufw status
```

## 步骤9：配置SSL（HTTPS）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取免费SSL证书
sudo certbot --nginx -d your-domain.com

# 按照提示操作：
# - 输入邮箱
# - 同意服务条款
# - 选择是否重定向HTTP到HTTPS（推荐选Yes）
```

## 步骤10：自动更新

**创建更新脚本：**

```bash
sudo nano /var/www/update.sh
```

**添加内容：**

```bash
#!/bin/bash
cd /var/www/multilang-learning-app
git pull
npm install
npm run build
sudo systemctl restart nginx
echo "更新完成！"
```

**设置权限：**

```bash
sudo chmod +x /var/www/update.sh
```

**以后更新只需运行：**

```bash
sudo /var/www/update.sh
```

---

# 部署后的验证清单

部署完成后，请逐一检查：

## 功能测试

- [ ] 能打开网站
- [ ] 首页正常显示
- [ ] 点击"生成习题"能生成题目
- [ ] 下载模板能正常下载
- [ ] 导入Excel能成功
- [ ] 词汇复习功能正常
- [ ] 拍照上传功能正常（需要HTTPS）
- [ ] 统计页面显示正常
- [ ] 设置能保存
- [ ] 暗色模式切换正常

## 性能测试

访问 https://pagespeed.web.dev 测试你的网站

目标：
- 性能分数 > 90
- 首次内容绘制 < 1.8秒
- 最大内容绘制 < 2.5秒

## 移动端测试

- [ ] 在手机浏览器打开正常
- [ ] 能添加到主屏幕
- [ ] 离线能访问（部分功能）
- [ ] 触摸操作流畅
- [ ] 拍照功能正常

---

# 常用维护命令

## 查看部署日志

**Vercel:**
```
进入项目 → Deployments → 点击部署 → 查看Build Logs
```

**服务器:**
```bash
# Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 检查磁盘空间
df -h

# 检查内存使用
free -h
```

## 更新应用

**Vercel/Netlify:**
```bash
# 本地修改代码后
git add .
git commit -m "更新说明"
git push
# 会自动部署
```

**服务器:**
```bash
sudo /var/www/update.sh
```

---

# 域名配置（可选）

如果你有自己的域名（如：myapp.com）

## 在Vercel添加域名

1. 项目设置 → **Domains**
2. 点击 **Add**
3. 输入域名：`myapp.com` 和 `www.myapp.com`
4. Vercel会给你DNS记录

**在域名注册商（如阿里云、GoDaddy）配置：**

添加DNS记录：
```
类型: CNAME
名称: www
值: cname.vercel-dns.com

类型: A
名称: @
值: 76.76.21.21 (Vercel提供的IP)
```

5. 等待DNS生效（可能需要几小时）
6. 完成！

---

# 💰 费用说明

## 完全免费方案

| 服务 | 费用 |
|------|------|
| Vercel托管 | $0/月 |
| Gemini API | $0/月（45,000次额度）|
| GitHub | $0/月 |
| **总计** | **$0/月** |

**限制：**
- Vercel: 100GB带宽/月（个人使用绰绰有余）
- GitHub: 仓库大小 < 1GB
- Gemini: 15 RPM速率限制

## 升级方案（可选）

如果需要更多：

- **域名**: $10-15/年
- **Vercel Pro**: $20/月（更多带宽和功能）
- **VPS服务器**: $5-10/月（完全控制）

---

# 🆘 获取帮助

如果遇到问题：

1. **查看文档**
   - README.md - 项目说明
   - FIXES.md - 常见问题
   
2. **检查浏览器控制台**
   - 按F12
   - 查看Console标签的错误

3. **查看部署日志**
   - Vercel/Netlify后台的构建日志

4. **常见错误搜索**
   - Google搜索错误信息
   - Stack Overflow
   - Vercel文档

---

## 部署成功后的下一步

✅ 在手机上添加到主屏幕
✅ 分享给朋友使用
✅ 定期备份数据（导出Excel）
✅ 关注Gemini API使用量
✅ 根据需求自定义功能

**祝你部署顺利！** 🎉

如有任何问题，仔细阅读错误信息，90%的问题都能在本文档中找到解决方案。
