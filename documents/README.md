# private-blog-v4 ドキュメント

このディレクトリには、private-blog-v4プロジェクトに関するドキュメントが格納されています。

## ディレクトリ構成

- `機能仕様/`: 各機能の詳細な仕様に関するドキュメントを格納
- `要望メモ/`: プロジェクトに対する要望や改善案のメモを格納
- `調査_設計等/`: 技術調査や設計に関するドキュメントを格納
- `ADR/`: Architecture Decision Records（アーキテクチャの決定事項の記録）を格納

## ドキュメント運用ルール

1. **ファイル命名規則**
   - 日本語のファイル名を基本とする
   - 単語間は`_`（アンダースコア）で区切る
   - 複数のドキュメントがある場合は、連番を付与する（例: `01_概要.md`, `02_データモデル.md`）

2. **ディレクトリ構造**
   - 関連する機能や項目ごとにサブディレクトリを作成する
   - 深すぎる階層は避け、最大でも3階層程度に抑える

3. **ドキュメントフォーマット**
   - Markdownフォーマット（.md）を基本とする
   - 図表が必要な場合はPlantUMLやMermaidを使用する
   - 画像ファイルは各ディレクトリ内に`images/`フォルダを作成して格納する

4. **更新履歴**
   - 重要な更新は各ドキュメントの末尾に更新履歴として記録する
   - または、GitのコミットメッセージとPull Requestで履歴を管理する

5. **相互参照**
   - 他のドキュメントを参照する場合は、相対パスでリンクを設定する

これらのルールは、ドキュメントの整合性と可読性を確保するために設けられています。ただし、プロジェクトの進行に合わせて柔軟に対応することも重要です。
