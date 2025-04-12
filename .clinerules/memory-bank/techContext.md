# 技術コンテキスト

## フロントエンド技術スタック

### フレームワーク
- React Router v7 (`react-router`): v7.5.0
  - `@react-router/dev`: v7.5.0
- Vite (`vite`): v6.2.1

### UIフレームワーク
- Tailwind CSS (`tailwindcss`): v4.0.0
  - `@tailwindcss/vite`: v4.0.0 (Vite プラグイン)
  - 設定ファイル: `tailwind.config.?` (ファイル名は要確認)

### Cloudflare Workers 関連
- Wrangler (`wrangler`): v4.9.1
- `@cloudflare/workers-types`: v4.20250409.0
- `@cloudflare/vite-plugin`: v1.0.0

### その他の依存関係
- React (`react`): v19.0.0
- React DOM (`react-dom`): v19.0.0
- TypeScript (`typescript`): v5.7.2
- Isbot (`isbot`): v5.1.17
- `@types/react`: v19.0.1
- `@types/react-dom`: v19.0.1
- `@types/node`: v20

## 開発ツール
- Biome (`@biomejs/biome`): v1.9.4 (リンター/フォーマッター)

## ビルドと開発環境
### スクリプト (package.json より)
- `build`: `react-router build`
- `cf-typegen`: `wrangler types`
- `deploy`: `npm run build && wrangler deploy`
- `dev`: `react-router dev`
- `preview`: `npm run build && vite preview`
- `typecheck`: `npm run cf-typegen && react-router typegen && tsc -b`
- `lint`: `npx @biomejs/biome check`
- `format`: `npx @biomejs/biome check --write`
- `check`: `npm run typecheck && npm run lint`
- `check:fix`: `npm run typecheck && npm run format`

### 設定ファイル
- `react-router.config.ts`: React Router 設定
- `vite.config.ts`: Vite 設定
- `wrangler.jsonc`: Wrangler (Cloudflare Workers CLI) 設定
- `tsconfig.json`: TypeScript 設定 (共通)
- `tsconfig.cloudflare.json`: Cloudflare Workers 向け TypeScript 設定
- `tsconfig.node.json`: Node.js 環境向け TypeScript 設定
- `biome.json`: Biome 設定
- `worker-configuration.d.ts`: Cloudflare Workers 設定の型定義
# 注意: Tailwind CSS の設定ファイル名 (例: tailwind.config.js) は別途確認が必要です。
