# NExT Custom Field Link Button Block

投稿のカスタムフィールド（投稿メタ）の値をリンク先とするボタンブロックを追加する WordPress プラグインです。

| 項目 | 内容 |
|------|------|
| Contributors | NExT-Season |
| Tags | block, button, custom field, link, meta |
| Tested up to | 6.8 |
| Stable tag | 0.2.0 |
| License | GPLv2 or later |

## Description

このブロックは、投稿ごとに設定されたカスタムフィールド（投稿メタ）の値をリンク先URLとして使用するボタンを表示します。

### 主な機能

- リンク先URLを取得するカスタムフィールド名（メタキー）をブロックの設定パネルから指定可能
- 新しいタブで開く（target="_blank"）の有効・無効を切り替え可能
- ボタンラベルはブロック上で自由に編集可能
- ボタンのスタイル・装飾は、初期状態では有効化されているテーマのボタンブロックのスタイルに準拠。標準のボタンブロックと同様に、幅・スタイル（塗りつぶし/輪郭）・色・タイポグラフィ・余白・枠線・影も個別にカスタマイズ可能

### 使い方

1. 投稿またはページの編集画面で「カスタムフィールドリンクボタン」ブロックを追加
2. ブロックの設定パネルで、リンク先URLが入っているカスタムフィールド名を入力
3. 必要に応じて「新しいタブで開く」を有効化
4. ブロック上でボタンラベルを入力

### 注意事項

指定したカスタムフィールド名の値が空、または投稿に存在しない場合、フロントエンドでは何も表示されません。

## Installation

1. `/wp-content/plugins/next-custom-field-link-button-block` ディレクトリにプラグインファイルをアップロード、またはWordPressのプラグイン画面から直接インストール
2. WordPressの「プラグイン」画面でプラグインを有効化
3. 投稿またはページの編集画面で「カスタムフィールドリンクボタン」ブロックを使用

## Frequently Asked Questions

### カスタムフィールドはどこで設定しますか？

投稿編集画面の「カスタムフィールド」パネルから、任意のフィールド名とURL形式の値を設定してください。

### ボタンのスタイルは変更できますか？

標準のボタンブロックと同様に、設定パネルから幅・スタイル（塗りつぶし/輪郭）・色・タイポグラフィ・余白・枠線・影を変更できます。何もカスタマイズしない場合は、有効化されているテーマのボタンブロックのスタイルがそのまま適用されます。

## 開発

このブロックは [`@wordpress/scripts`](https://www.npmjs.com/package/@wordpress/scripts) でビルドします。`src/` が編集対象、`build/` がビルド生成物（プラグインの動作に必要なため git 管理下に含めています）です。

### セットアップ・ビルド

```bash
npm install
composer install
npm run build
```

### 開発時（ファイル変更を監視）

```bash
npm start
```

### ローカル環境（wp-env）

```bash
npm run env:start   # wp-env start
npm run env:stop     # wp-env stop
```

| 環境 | URL |
|------|-----|
| 開発 | http://localhost:8888 |
| テスト | http://localhost:8889 |

### コーディング規約チェック（phpcs）

```bash
composer run phpcs
composer run phpcbf  # 自動修正
```

`git commit` 時に husky + lint-staged 経由でステージされた PHP ファイルに対して自動実行されます。

### PHPUnit テスト

```bash
# Unit テスト（WordPress 非依存、ローカルでそのまま実行可能）
vendor/bin/phpunit --testsuite unit

# Integration テスト（wp-env 上で実行）
npx wp-env run tests-cli --env-cwd=wp-content/plugins/NExT-Custom-Field-link-button-Block vendor/bin/phpunit --testsuite integration --bootstrap=tests/phpunit/bootstrap.php
```

### E2E テスト（Playwright）

```bash
npx wp-env start
npx playwright install chromium
npm run test:e2e
```

### ファイル構成

```
NExT-Custom-Field-link-button-Block/
├── next-custom-field-link-button-block.php  # メインプラグインファイル
├── src/
│   ├── block.json    # ブロック定義（属性・supports）
│   ├── index.js       # ブロック登録
│   ├── edit.js        # エディター画面
│   └── render.php     # フロントエンド／エディタープレビューのサーバーサイドレンダリング
├── build/             # ビルド生成物
├── tests/
│   ├── phpunit/        # PHPUnit（Unit・Integration）
│   └── e2e/            # Playwright E2E テスト
├── bin/install-wp-tests.sh
├── .wp-env.json
├── phpcs.xml.dist
├── phpunit.xml.dist
├── playwright.config.ts
├── .github/workflows/  # CI（phpcs/phpunit/plugin-check/e2e）・Release
├── readme.txt          # WordPress.org 形式の説明（日本語）
├── composer.json
└── package.json
```

### 実装方針

- 動的ブロック（`render.php`）として実装しており、静的な保存内容は持たない。カスタムフィールドの値は投稿ごとに異なるため、表示時に都度 `get_post_meta()` で取得する。
- コアの `core/button` ブロックと同じマークアップ・クラス名（`wp-block-button` / `wp-block-button__link`）を使用し、`block.json` の `style` / `editorStyle` もコア標準のスタイルハンドルをそのまま参照することで、独自CSSなしに有効化されているテーマのボタンスタイルを継承する。
- 色・タイポグラフィ・余白・枠線・影などの装飾設定は、コアの `core/button` ブロックと同等の `supports` を宣言することで、標準のボタンブロックと同じ範囲のカスタマイズに対応している。

詳細な仕様・設計判断は [SPEC.md](SPEC.md) を参照してください。

## Changelog

### 0.2.0

- 標準のボタンブロックと同様の装飾設定（幅・スタイル・色・タイポグラフィ・余白・枠線・影）に対応

### 0.1.0

- 初回リリース

## License

GPLv2 or later - https://www.gnu.org/licenses/gpl-2.0.html
