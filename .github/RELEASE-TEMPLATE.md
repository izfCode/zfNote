## ZF·Notes v1.0.0 — 桌面端首版

第一个正式版本。一份**轻量、本地化、支持 Markdown** 的私人思考空间，现已打包为 Electron 桌面客户端，覆盖 Windows / macOS / Linux。

### 下载安装包

请到页面的 **Assets** 区下载对应平台的安装包：

- Windows：`*.exe`（NSIS 安装器）
- macOS：`*.dmg`
- Linux：`*.AppImage` / `*.deb`

### 核心功能

| 快捷键 | 功能 |
| --- | --- |
| `Ctrl/Cmd + N` | 新建笔记 |
| `Ctrl/Cmd + P` | 切换预览 / 编辑 |
| `Ctrl/Cmd + D` | 删除当前笔记 |
| `Ctrl/Cmd + /` | 聚焦搜索框 |
| `Esc` | 清空搜索 / 关闭弹层 |

- Markdown 实时渲染（**粗体** / *斜体* / `代码` / 列表 / 引用）
- 标签 / 置顶 / 关键字搜索
- Light / Dark 双主题切换
- HUD 状态条（字数 / 行数 / 自动保存提示）
- 一键导出 **Markdown / TXT / JSON**
- 复制到剪贴板
- 数据全部本地存储（基于 electron-store），不上传任何内容

### 技术栈

- Electron 33（主进程 + 预加载脚本 + IPC 桥）
- React 18 + TypeScript 5
- Vite 5（开发服务器 & 渲染端构建）
- electron-store（本地持久化）
- Vitest + Testing Library（单元测试 & 组件测试）

### 系统要求

- Windows 10 / 11 (x64)
- macOS 11 Big Sur 及以上
- 主流 Linux 发行版（AppImage 通用，deb 仅 Debian / Ubuntu 系）

### 安装提示

**Windows**：双击 `*.exe`，按向导安装。首次启动若被 SmartScreen 拦截，选「更多信息 → 仍要运行」（未做代码签名是预期内，介意可自行签名后再分发）。

**macOS**：双击 `*.dmg`，把 `ZF·Notes` 拖进「应用程序」。首次启动若提示「无法验证开发者」，到「系统设置 → 隐私与安全性」点「仍要打开」即可。

**Linux**：AppImage 直接 `chmod +x *.AppImage && ./ZF·Notes-*.AppImage`；deb 用 `sudo dpkg -i *.deb`。

### 反馈与问题

- Bug / 建议 → [Issues](https://github.com/izfCode/zfNote/issues)
- 想要的功能 / 用着不爽的地方都欢迎开 issue

---

**Made with ❤️ by ZhangFan**
