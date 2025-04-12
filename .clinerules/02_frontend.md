# Frontend (blog ディレクトリ)

## ディレクトリ構成

```
blog/
├── app/                  # React Router アプリケーションのフロントエンドコード
│   ├── app.css           # グローバルCSS
│   ├── entry.server.tsx  # サーバーサイドレンダリングのエントリーポイント
│   ├── root.tsx          # アプリケーションのルートコンポーネント (レイアウト、エラーハンドリング等)
│   ├── routes.ts         # ルート定義
│   └── routes/           # 各ルートに対応するコンポーネント
│       └── home.tsx      # ホームページのコンポーネント例
├── public/               # 静的ファイル (favicon など)
│   └── favicon.ico
├── workers/              # Cloudflare Workers のエントリーポイントと関連コード
│   └── app.ts            # Cloudflare Workers のメイン処理
├── .gitignore
├── biome.json            # Biome (リンター/フォーマッター) 設定ファイル
├── package-lock.json
├── package.json          # プロジェクト依存関係とスクリプト
├── react-router.config.ts # React Router 設定ファイル
├── README.md
├── tsconfig.cloudflare.json # Cloudflare Workers 向け TypeScript 設定
├── tsconfig.json         # TypeScript 設定 (共通)
├── tsconfig.node.json    # Node.js 環境向け TypeScript 設定
├── vite.config.ts        # Vite 設定ファイル
├── worker-configuration.d.ts # Cloudflare Workers 設定の型定義
└── wrangler.jsonc        # Wrangler (Cloudflare Workers CLI) 設定ファイル
```

**主要ディレクトリの役割:**

*   `app/`: React Router を使用したフロントエンドアプリケーションのソースコードが含まれます。ルーティング、コンポーネント、スタイルなどが配置されます。
*   `workers/`: Cloudflare Workers 上でアプリケーションを動作させるためのサーバーサイドのエントリーポイント (`app.ts`) が含まれます。Wrangler によってデプロイされます。
*   `public/`: ビルドプロセスを経ずに直接配信される静的ファイル（例: `favicon.ico`）を配置します。

## 主要なライブラリ構成

*   **フレームワーク:**
    *   React Router (`react-router`): v7.5.0 - ルーティングとサーバー/クライアントレンダリング
    *   Vite (`vite`): v6.2.1 - フロントエンドのビルドツールと開発サーバー
*   **UI/スタイリング:**
    *   Tailwind CSS (`tailwindcss`): v4.0.0 - ユーティリティファーストの CSS フレームワーク
    *   `@tailwindcss/vite`: Tailwind CSS の Vite プラグイン
*   **Cloudflare Workers 関連:**
    *   Wrangler (`wrangler`): v4.9.1 - Cloudflare Workers の開発・デプロイ用 CLI
    *   `@cloudflare/workers-types`: Cloudflare Workers の型定義
    *   `@cloudflare/vite-plugin`: Cloudflare 連携用 Vite プラグイン
*   **その他:**
    *   React (`react`): v19.0.0
    *   TypeScript (`typescript`): v5.7.2

## 静的解析・フォーマット

*   `Biome` (`@biomejs/biome`): v1.9.4 - コードのリンティングとフォーマットに使用します。設定は `biome.json` で管理されます。
*   CI (`.github/workflows/lint.yml`) で Pull Request に対して検証されるため、必ずパスする必要があります。

## テスト

*   フロントエンドのテストは現状存在しません。

## デプロイメント

*   Cloudflare Workers を使用してデプロイされます。設定は `wrangler.jsonc` で管理されます。
