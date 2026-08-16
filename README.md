# ZF·Notes - 桌面客户端

<p align="left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
    <img alt="ZF·Notes" src="assets/logo-light.svg" width="320">
  </picture>

<p align="left">
  <a href="https://github.com/izfCode/zfNote/releases/latest"><img alt="release" src="https://img.shields.io/github/v/release/izfCode/zfNote?style=flat-square&logo=github&logoColor=white&color=2563eb"></a>
  <a href="https://github.com/izfCode/zfNote/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/github/license/izfCode/zfNote?style=flat-square&color=2563eb"></a>
  <a href="https://github.com/izfCode/zfNote"><img alt="stars" src="https://img.shields.io/github/stars/izfCode/zfNote?style=flat-square&logo=github&color=2563eb"></a>
  <a href="https://github.com/izfCode/zfNote/actions"><img alt="build" src="https://img.shields.io/github/actions/workflow/status/izfCode/zfNote/release.yml?style=flat-square&logo=github-actions&logoColor=white&label=build"></a>
  <a href="https://github.com/izfCode/zfNote/releases"><img alt="downloads" src="https://img.shields.io/github/downloads/izfCode/zfNote/total?style=flat-square&logo=github&color=2563eb"></a>
  <img alt="platform" src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-2563eb?style=flat-square&logo=electron&logoColor=white">
</p>
</p>

一个轻量、本地化、支持 Markdown 的私人思考空间，现已打包为 Electron 桌面客户端。

## 品牌资源

| 文件 | 用途 |
| --- | --- |
| `assets/icon.svg` | 应用图标（256×256，自带日夜双模式可见性） |
| `assets/logo-light.svg` | 横版 logo（深色文字，浅色背景） |
| `assets/logo-dark.svg` | 横版 logo（浅色文字，深色背景） |
| `assets/preview.html` | 浏览器内对比预览（打开即可看日/夜效果） |

设计要点：

- 蓝色渐变笔记卡（`#60a5fa → #2563eb → #1e3a8a`），与项目 UI 的 `--accent` 一致
- 右上折角 + `>_` 终端提示符 + 三条内容线，呼应侧边栏现有 logo 与笔记意象
- 图标本体在 `#f8fafc` 与 `#0a0e1a` 两种主题背景下均有足够对比度
- 横版 logo 提供独立文件，避免单文件 + `currentColor` 在 `<img>` 嵌入时失效

## 技术栈

- Electron 33（主进程 + 预加载脚本 + IPC 桥）
- React 18 + TypeScript 5
- Vite 5（开发服务器 & 渲染端构建）
- electron-store（本地持久化）
- Vitest + Testing Library（单元测试 & 组件测试）

## 开发

```bash
npm install
npm run dev          # 同时启动 Vite 和 Electron（开发模式）
```

第一次安装依赖较慢，请耐心等待。

## 构建与打包

```bash
npm run build       # 仅构建渲染端 + 主进程
npm run package:dir # 生成本地可运行的版本（无安装器）
npm run dist        # 生成对应平台的安装包（exe/dmg/AppImage）
```

## 测试

```bash
npm test            # 一次性运行所有测试
npm run test:watch  # 监视模式
```

## 核心功能

| 快捷键 | 功能 |
| --- | --- |
| `Ctrl/Cmd + N` | 新建笔记 |
| `Ctrl/Cmd + P` | 切换预览/编辑 |
| `Ctrl/Cmd + D` | 删除当前笔记 |
| `Ctrl/Cmd + /` | 聚焦搜索框 |
| `Esc` | 清空搜索 / 关闭弹层 |

支持 Markdown 渲染、标签、置顶、Light/Dark 主题、HUD 状态条、自动保存、导出 Markdown / TXT / JSON、复制到剪贴板。


## 常见问题

### Electron 二进制没解压成功

如果 `npm run dev` 报 `Electron failed to install correctly`，说明 `npm install` 时 Electron 的 postinstall（下载 ~100MB 二进制并解压到 `node_modules/electron/dist/`）被沙箱/网络拦了。手动修复：

```bash
# 1. 触发下载与解压
node node_modules/electron/install.js
# 如果上面卡住只下载了部分文件，直接用 PowerShell 解压缓存 zip：
rm -r node_modules/electron/dist -Force
Expand-Archive "$env:LOCALAPPDATA\electron\Cache\*\electron-v33.3.0-win32-x64.zip" \
  -DestinationPath node_modules/electron/dist
# 2. 写 path.txt（必须不带 CRLF，否则 spawn ENOENT）
node -e "require('fs').writeFileSync('node_modules/electron/path.txt','electron.exe')"
```

### Git 写 .git 被拒

`git add/commit` 在沙箱里写 `.git/index` 会被该用户上的 Deny 规则拦截，需要 escalated 权限执行。
