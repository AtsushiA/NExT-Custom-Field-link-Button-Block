名称 : NExT-Custom-Field-link-button-Block

カスタムフィールドで入力されたURLをリンク先にするボタンブロックを出力するプラグイン
- カスタムフィールドの任意の値(url形式)を設定画面で指定(Name) 編集画面のブロックオプションで指定
- ターゲットブランクの有効無効の切り替え
- ボタンスタイル、装飾は有効にされているテーマのボタンスタイルに準拠
- 表示されるボタンのボタンラベルは任意に設定可能

## 実装仕様（決定事項）

- ブロック名 : `next/custom-field-link-button-block`
- テキストドメイン : `next-custom-field-link-button-block`
- 動的ブロック（`render.php` によるサーバーサイドレンダリング）。カスタムフィールドの値は投稿ごとに異なるため、静的な保存内容は持たない。

### 属性

| 属性名 | 型 | 説明 |
|---|---|---|
| `metaKey` | string | リンク先URLを取得するカスタムフィールド名（メタキー）。ブロックのインスペクター（設定パネル）で指定 |
| `openInNewTab` | boolean | 有効な場合、フロントエンドで `target="_blank" rel="noopener noreferrer"` を付与 |
| `label` | string | ボタンラベル。ブロックのキャンバス上で `RichText` によりインライン編集（プレーンテキストのみ、装飾書式は不可） |

### 投稿IDの解決

`usesContext: ["postId", "postType"]` を宣言し、クエリーループの投稿テンプレート内で使われた場合はブロックコンテキストの `postId` を優先。それ以外（通常の投稿・固定ページ、テンプレート配置時）は `get_the_ID()` にフォールバックする。

### 出力マークアップとスタイル方針

コアの `core/button` ブロックと同じマークアップ・クラス名を使用する。装飾関連のクラス・インラインスタイルはリンク（`<a>`）要素側に付与し、外側の `<div class="wp-block-button">` はレイアウト用のプレーンな要素とする（コア `core/button` の `save.js` と同じ構造上の判断）。

```html
<div class="wp-block-button">
  <a class="wp-block-button__link ..." href="...">ラベル</a>
</div>
```

`wp-block-button` / `wp-block-button__link` は theme.json の `styles.elements.button` が対象とする共通クラスのため、何もカスタマイズしない状態では有効化されているテーマのボタン配色・角丸・余白をそのまま継承する。

**装飾のカスタマイズ（標準の `core/button` ブロックに準拠）:**

コアの `core/button` ブロック（`wp-includes/blocks/button/block.json`）と同等の `supports` を `block.json` に宣言し、標準のボタンブロックと同じ範囲の装飾設定（色・タイポグラフィ・余白・枠線・影、幅25/50/75/100%、塗りつぶし/輪郭スタイル）を編集画面から行えるようにする。何もカスタマイズしなければテーマのボタンスタイルにそのまま準拠し、必要な場合のみ個別に上書きできる（コアボタンと同じ挙動）。

- `supports.color`（text/background/gradients）、`supports.typography`（fontSize 等）、`supports.spacing.padding`、`supports.__experimentalBorder`（color/radius/style/width）、`supports.shadow` を宣言。`__experimentalSkipSerialization` は使わず、通常のブロックサポートのシリアライズに任せる。
- `useBlockProps()`（edit.js）／`get_block_wrapper_attributes()`（render.php）は **外側の div ではなくリンク（`<a>`）要素に適用**する。これにより装飾系の class・style が自動的に `<a>` 側へ出力される。外側の `<div class="wp-block-button">` は素の要素として手動で組み立て、`width` 属性がある場合のみ `has-custom-width wp-block-button__width-{n}` クラスを付与する。
- `styles: [{"name":"fill","isDefault":true},{"name":"outline"}]` を宣言し、標準ボタンと同じ塗りつぶし/輪郭のスタイル切り替えに対応する。
- 独自のCSSは持たず、`block.json` の `style` / `editorStyle` にコア標準ボタンの登録済みスタイルハンドル `wp-block-button` / `wp-block-button-editor` をそのまま指定して再利用する（`file:` プレフィックスなしのハンドル名指定）。

### 空値時の挙動

`metaKey` が未指定、または対象投稿の該当メタ値が空・存在しない場合、フロントエンドでは何も出力しない（壊れたリンクを表示しないため）。編集画面では `metaKey` 未入力時に警告 Notice を表示する。

### 対象外（スコープ外）

PHPUnit・phpcs・composer・GitHub Actions（CI/リリース）・Git初期化は今回のスコープ外（最小構成での実装）。
