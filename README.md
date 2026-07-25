# 📱 下注计算器 - 安卓APP

混合框架封装的安卓APP，支持离线AI自学习。

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/你的用户名/betting-calculator.git
cd betting-calculator/android-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地测试

直接用浏览器打开 `src/index.html` 即可测试。

### 4. 构建安卓APP

```bash
# 初始化Capacitor
npx cap init "下注计算器" com.betting.calculator --web-dir src

# 添加安卓平台
npx cap add android

# 同步代码
npx cap sync android

# 用Android Studio打开
npx cap open android
```

---

## 🔧 GitHub Actions 自动打包

### 1. 上传代码到GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/betting-calculator.git
git push -u origin main
```

### 2. 配置签名密钥（可选）

在仓库 Settings → Secrets and variables → Actions 中添加：

| Secret名称 | 说明 |
|-----------|------|
| `KEYSTORE_BASE64` | keystore文件的base64编码 |
| `KEYSTORE_PASSWORD` | keystore密码 |
| `KEY_ALIAS` | 密钥别名 |
| `KEY_PASSWORD` | 密钥密码 |

#### 生成keystore

```bash
keytool -genkey -v -keystore release.keystore -alias my-key -keyalg RSA -keysize 2048 -validity 10000
```

#### 转base64

```bash
# Linux/Mac
base64 -i release.keystore | tr -d '\n'

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore"))
```

### 3. 触发构建

- **自动触发**：推送代码到main分支
- **手动触发**：在Actions页面点击"Run workflow"

### 4. 下载APK

- **Artifacts**：在Actions运行页面下载
- **Releases**：在Releases页面下载

---

## 📁 项目结构

```
android-app/
├── src/                          # H5网页源码
│   ├── index.html               # 主页面
│   └── assets/
│       ├── css/style.css        # 样式
│       └── js/
│           ├── zodiac.js        # 生肖数据
│           ├── parser.js        # 解析器
│           └── app.js           # 主程序
├── android/                      # 安卓原生代码（自动生成）
├── .github/workflows/           # CI/CD配置
├── package.json                 # 依赖配置
├── capacitor.config.ts          # Capacitor配置
└── README.md                    # 本文档
```

---

## 🎯 功能特性

- ✅ 下注信息智能解析
- ✅ 生肖/号码/特码/三有等多种玩法
- ✅ AI离线自学习
- ✅ 开奖号码计算收益
- ✅ 历史记录
- ✅ 赔率自定义设置
- ✅ 完全离线可用

---

## 📝 开发说明

### 修改网页

直接编辑 `src/` 目录下的文件，然后：

```bash
npx cap sync android
```

### 添加原生功能

1. 安装Capacitor插件
2. 在JS中调用
3. 同步到安卓

---

## ❓ 常见问题

### Q: 构建失败怎么办？

A: 检查Actions日志，常见原因：
- Java版本不对（需要17）
- Node版本不对（需要18）
- 依赖安装失败

### Q: 如何自定义包名？

A: 修改 `capacitor.config.ts` 中的 `appId`

### Q: 如何添加图标？

A: 替换 `android/app/src/main/res/` 下的图标文件

---

## 📄 License

MIT
