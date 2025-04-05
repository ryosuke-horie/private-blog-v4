# 技術コンテキスト

## フロントエンド技術スタック

### フレームワーク
- React Router v7
  - `@react-router/node`: v7.4.1
  - `@react-router/serve`: v7.4.1
  - `react-router-devtools`: v1.1.0

### UIフレームワーク
- Panda CSS
  - `@pandacss/dev`: v0.53.3
  - プリフライトCSSリセット有効
- Park UI
  - `@park-ui/panda-preset`: v0.43.1
  - アクセントカラー: amber
  - グレーカラー: sand
  - 角丸設定: sm
- アイコン: lucide-react v0.487.0

### その他の依存関係
- React: v19.0.0
- React DOM: v19.0.0
- TypeScript: v5.8.2
- Vite: v6.2.4

## 開発ツール
- Biome: v1.9.4 (リンター)
- Knip: v5.46.5 (静的解析)

## ビルドと開発環境
### スクリプト
- `build`: React RouterでSSGビルド
- `dev`: 開発サーバー起動
- `start`: ビルドされたサーバーの起動
- `prepare`: Panda CSSのコード生成
- `typecheck`: 型チェック
- `lint`: Biomeでのコード検証
- `format`: Biomeでのフォーマットと静的解析

### 設定ファイル
- panda.config.ts: Panda CSSの設定
- park-ui.json: Park UIのコンポーネント出力設定
- postcss.config.cjs: PostCSSの設定
- react-router.config.ts: ルーティング設定
- tsconfig.json: TypeScript設定
- vite.config.ts: Viteの設定
