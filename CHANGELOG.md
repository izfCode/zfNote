# Changelog

所有「新增」「修改」「修复」「移除」按版本倒序排列。日期格式：`YYYY-MM-DD`。

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [v1.0.3] - 2026-08-16

### 修复
- **build**: 给 `package.json#author` 补 `email`，并给 `build.linux` 显式声明 `maintainer`，让 `electron-builder` 能正常生成 `.deb`（之前会因为缺 maintainer 字段直接报错退出）

### 构建
- **ci**: workflow 在 `npm ci` 之后加一步 `npm version <tag> --no-git-tag-version`，让 package.json 里的 `version` 跟 git tag 自动同步；之后 installer / asar / electron-updater `latest.yml` 里的版本号都会跟 tag 对齐

---

## [v1.0.2] - 2026-08-16 — ⚠️ 未发布，已删除

构建在 Linux runner 打 `deb` 时因 `package.json#author.email` 缺失而失败，整条流水线 exit 1。
macOS / Windows 产物未生成。Tag 已删除；如果你下载到了任何 v1.0.2 的产物，**不要使用**，请改用 v1.0.3。

---

## [v1.0.1] - 2026-08-16

### 新增
- **ci**: GitHub Actions 发布流水线（`.github/workflows/release.yml`）
  - 推送 `v*` tag 自动在 windows-latest / macOS-latest / ubuntu-latest 三台 runner 上跑 `npm run dist`
  - 用 `softprops/action-gh-release@v2` 把三平台产物统一挂到同名 Release 下
- **docs**: README 顶部加 6 个徽章（release / license / stars / build / downloads / platform）

### 构建
- Windows NSIS 安装器 (`ZF·Notes Setup 1.0.1.exe`)
- macOS NSIS dmg（x64 / arm64 各一）— **v1.0.3 改为 universal 单包**
- Linux AppImage

---

## [v1.0.0] - 2026-08-16

### 新增
- 首次正式发布
- Electron 33 + React 18 + TypeScript 5 + Vite 5 桌面客户端
- Markdown 实时渲染、标签 / 置顶 / 搜索
- Light / Dark 双主题
- HUD 状态条、自动保存
- 一键导出 Markdown / TXT / JSON
- 全局快捷键：`Ctrl/Cmd + N` 新建、`Ctrl/Cmd + P` 切换预览/编辑、`Ctrl/Cmd + D` 删除、`Ctrl/Cmd + /` 聚焦搜索、`Esc` 清空

[unreleased]: https://github.com/izfCode/zfNote/compare/v1.0.3...HEAD
[v1.0.3]: https://github.com/izfCode/zfNote/releases/tag/v1.0.3
[v1.0.1]: https://github.com/izfCode/zfNote/releases/tag/v1.0.1
[v1.0.0]: https://github.com/izfCode/zfNote/releases/tag/v1.0.0
