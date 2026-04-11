## 项目说明 — 构建与部署指南

本文件记录本项目的本地运行、生产打包、预览以及部署到 Vercel 的可复现步骤与注意事项。

> 说明中给出的 `npm`/`node` 命令为常规写法；如果你的系统没有把 Node/npm 加入 PATH（如本项目中使用到的 `D:\nodee\node.exe` / `D:\nodee\npm.cmd`），请把命令替换为你的本地可执行路径。

### 1) 本地开发（Dev）

先安装依赖并启动开发服务：

```powershell
# 在项目根目录下
npm install
npm run dev

# 如果你的环境需要指定 node/npm 路径（示例）：
D:\nodee\npm.cmd install
D:\nodee\npm.cmd run dev
```

如果项目需要 API Key（例如 `GEMINI_API_KEY`），请在项目根目录创建 `.env.local` 并添加对应环境变量：

```
GEMINI_API_KEY=your_api_key_here
```

### 2) 生产构建（Build）

`npm run build` 会执行 `vite build`，并在构建完成后执行 `postbuild`（本仓库已配置），自动把 `resource/` 目录复制到 `dist/resource`，确保图片、视频、音频 等静态资源被包含在构建产物中。

```powershell
# 标准命令
npm run build

# Windows（或你的 custom node 路径）示例
D:\nodee\npm.cmd run build
```

构建完成后，`dist/` 目录应包含 `index.html`、`assets/` 与 `resource/`（视频、logo 等）。

### 3) 本地预览生产构建

仓库内包含一个小的静态服务器脚本 `scripts/serve-dist.cjs`，用于在本地快速预览 `dist/`：

```powershell
# 使用系统 node
node scripts/serve-dist.cjs

# 或指定 node 路径
D:\nodee\node.exe scripts/serve-dist.cjs

# 默认监听端口 5000，访问 http://localhost:5000
```

### 4) Vercel 部署

仓库已包含 `vercel.json`，配置为使用 `@vercel/static-build` 并将输出目录设置为 `dist`，这意味着在 Vercel 上部署时会调用本仓库的 `npm run build`。

部署方式：

- 通过 Vercel CLI（交互式）：

```powershell
npx vercel
# 或直接部署为生产
npx vercel --prod
```

- 通过 Git 集成（推荐）：将仓库 push 到 GitHub/GitLab/Bitbucket，然后在 Vercel 控制台连接仓库，Vercel 会自动运行 `npm run build` 并使用 `vercel.json` 中的 `dist` 作为部署输出目录。

注意：不要把 `dist/` 提交到版本库——让 Vercel 在其平台上从源码执行构建并生成 `dist/`。

#### 环境变量

如果应用需要运行时的密钥（例如 `GEMINI_API_KEY`），请在 Vercel 控制台的 Project Settings → Environment Variables 中添加：

- 名称：`GEMINI_API_KEY`
- 值：你的密钥
- 环境：`Production`（及需要的 `Preview` / `Development`）

或者使用 CLI：

```powershell
npx vercel env add GEMINI_API_KEY production
```

### 5) 常见问题与排查

- 若构建后页面缺少视频/图片，请确认 `dist/resource` 已存在且文件可读。构建脚本会自动复制 `resource/`，如手动检查：

```powershell
Get-ChildItem -Recurse .\dist\resource\
```

- 若你的 CI 或部署环境对 Node 版本敏感，请在 Vercel 项目设置中选择合适的 Node 版本，或在 `package.json` 中声明 `engines` 字段（可选）。

### 6) 我已为你做的改动（快速记录）

- 在 `package.json` 中添加了 `postbuild` 脚本：`node scripts/copy-resources.cjs`，用于把 `resource/` 复制到构建产物 `dist/resource`。
- 添加了 `scripts/copy-resources.cjs`（在构建后执行）。
- 添加/保留了 `vercel.json`，配置 `dist` 为输出目录以便 Vercel 正确部署。

### 7) 推荐的 Git 提交消息（示例）

```
chore(build): add postbuild resource copy and vercel config

- add scripts/copy-resources.cjs
- add postbuild to package.json
- include vercel.json for static-build
```

---

如果你想，我可以：
- 现在在本地把这些改动提交并生成推荐的 Git diff；或
- 直接在终端帮你运行 `npx vercel --prod`（需要在终端完成登录/授权）。

选择你希望我接着做的下一步。