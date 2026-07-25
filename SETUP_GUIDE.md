# 📋 分步操作文档

## 第一步：准备GitHub仓库

### 1.1 创建新仓库

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写：
   - Repository name: `betting-calculator`
   - Description: `下注计算器安卓APP`
   - 选择: **Public** 或 **Private**
   - **不要**勾选 "Add a README file"
4. 点击 "Create repository"

### 1.2 上传代码

```bash
# 进入项目目录
cd C:\Users\Tao\Desktop\code\calculator\android-app

# 初始化Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 设置主分支
git branch -M main

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/betting-calculator.git

# 推送
git push -u origin main
```

---

## 第二步：配置签名密钥（可选）

### 2.1 生成签名密钥

```bash
# 打开命令行，运行以下命令
keytool -genkey -v -keystore release.keystore -alias my-key -keyalg RSA -keysize 2048 -validity 10000
```

按提示输入：
- 密码（记住这个密码）
- 姓名、组织等信息（可以随便填）
- 确认信息

### 2.2 转换为Base64

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Set-Clipboard
```
（已复制到剪贴板）

**Mac/Linux:**
```bash
base64 -i release.keystore | tr -d '\n'
```

### 2.3 添加到GitHub Secrets

1. 打开你的GitHub仓库页面
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 点击 "New repository secret"
4. 添加以下4个Secret：

| Name | Value |
|------|-------|
| `KEYSTORE_BASE64` | 刚才复制的base64字符串 |
| `KEYSTORE_PASSWORD` | 你设置的keystore密码 |
| `KEY_ALIAS` | `my-key`（或你设置的别名） |
| `KEY_PASSWORD` | 你设置的密钥密码 |

---

## 第三步：触发自动构建

### 方法1：推送代码触发

```bash
# 修改任意文件后
git add .
git commit -m "Trigger build"
git push
```

### 方法2：手动触发

1. 打开仓库页面
2. 点击 "Actions" 标签
3. 选择 "Build Android APK"
4. 点击 "Run workflow"
5. 点击绿色的 "Run workflow" 按钮

### 3.2 等待构建完成

- 构建通常需要 5-10 分钟
- 可以在 Actions 页面实时查看进度
- 绿色 ✅ 表示成功，红色 ❌ 表示失败

---

## 第四步：下载APK

### 方法1：从Artifacts下载

1. 点击完成的构建任务
2. 滚动到页面底部 "Artifacts"
3. 点击 "debug-apk" 下载

### 方法2：从Releases下载

1. 点击仓库的 "Releases" 标签
2. 找到最新版本
3. 下载 APK 文件

### 4.2 安装到手机

1. 将 APK 传到安卓手机
2. 打开文件管理器，找到 APK
3. 点击安装
4. 如果提示"未知来源"，去设置里允许

---

## 第五步：后续更新

### 更新流程

```bash
# 1. 修改代码
# 2. 提交推送
git add .
git commit -m "Update: 描述你的修改"
git push

# 3. 自动构建新版本
# 4. 下载新APK安装
```

---

## 🔧 常见问题

### Q1: 构建失败怎么办？

**查看日志：**
1. 点击失败的构建任务
2. 展开 "Build Debug APK" 步骤
3. 查看红色的错误信息

**常见原因：**
- 依赖安装失败 → 删除 `node_modules` 重新推送
- Java版本错误 → 检查workflow中的java-version
- 内存不足 → 等一会儿重试

### Q2: 如何修改APP名称？

编辑 `capacitor.config.ts`：
```typescript
appName: '你的APP名称',
```

### Q3: 如何修改包名？

编辑 `capacitor.config.ts`：
```typescript
appId: 'com.yourcompany.yourapp',
```

### Q4: 如何更换图标？

替换 `android/app/src/main/res/` 目录下的图标文件。

### Q5: APK太大怎么办？

- 删除不必要的依赖
- 使用 `assembleRelease` 替代 `assembleDebug`
- 启用ProGuard混淆

---

## 📞 需要帮助？

如果遇到问题，检查：
1. GitHub Actions 日志
2. 本文档的常见问题
3. 搜索错误信息

---

## ✅ 检查清单

- [ ] GitHub仓库已创建
- [ ] 代码已上传
- [ ] Secrets已配置（如果需要签名）
- [ ] Actions已触发
- [ ] APK已下载
- [ ] APP已安装测试
