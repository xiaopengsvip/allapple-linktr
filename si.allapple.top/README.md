<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Rba5vQLLWiHxfdq0cif9Hdcx7bPuKJ1Y

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build & Preview Production

Create a production build and preview the generated `dist/` locally.

```powershell
D:\nodee\npm.cmd run build
D:\nodee\node.exe scripts\serve-dist.js
# open http://localhost:5000
```

The repository includes `vercel.json` configured to deploy the site to Vercel (builds using `npm run build` and serves the `dist` directory).

## Deploy to Vercel

1. Install the Vercel CLI (optional):

```bash
npx vercel login
```

2. From repo root run:

```bash
npx vercel --prod
```

During the first deploy, set the build command to `npm run build` and the output directory to `dist` if prompted. `vercel.json` already sets `dist` as the output directory.

### Notes
- If you use environment secrets (API keys), configure them in the Vercel dashboard or via `vercel env add` before deploying.
- If anything fails during the build or deploy, capture the logs and send them to me and I will help debug.

## Fixes Performed

- 临时移除 `tsconfig.json` 中对 `node` 类型的强制引用（删除 `types: ["node"]`），以避免在尚未安装依赖的环境中出现类型检查错误。
- 如果在本机环境中已安装 Node/npm，请运行 `npm install` 以恢复并安装 `@types/node`（更推荐的长期方案）。

## Next Steps

- 在机器上安装 Node.js (含 npm)，然后运行：

```powershell
cd c:\Users\XIAO2027\Desktop\www\s.allapple.top
npm install
npm run dev
```

如果你希望，我可以在你确认已安装 Node/npm 后继续：运行构建、修复运行时错误并完成全面验证。
