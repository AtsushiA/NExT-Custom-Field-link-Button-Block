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
| `urlPrefix` | string | カスタムフィールドの値の前に付加する文字列（接頭子）。ブロックのインスペクターで指定 |
| `urlSuffix` | string | カスタムフィールドの値の後に付加する文字列（接尾子）。ブロックのインスペクターで指定 |
| `openInNewTab` | boolean | 有効な場合、フロントエンドで `target="_blank" rel="noopener noreferrer"` を付与 |
| `label` | string | ボタンラベル。ブロックのキャンバス上で `RichText` によりインライン編集（プレーンテキストのみ、装飾書式は不可） |
| `width` | number | ボタンの幅（25/50/75/100%）。コアの button ブロックと同じ選択肢 |
| `contentJustification` | string | ボタン全体の配置（`left` / `center` / `right`）。ブロックツールバーの配置コントロールで指定。未指定時は左寄せ相当の初期表示 |

### リンクURLの組み立て

出力する `href` は `urlPrefix + カスタムフィールドの値 + urlSuffix` を単純に文字列結合したものを `esc_url()` でエスケープして使用する。例えば `urlPrefix` が `http://google.com?`、フィールド値が `999999`、`urlSuffix` が `?test` の場合、`http://google.com?999999?test` が出力される。`urlPrefix` / `urlSuffix` はカスタムフィールドの値が空の場合は評価されず（空値時は何も出力しない、後述）、値が存在する場合のみ付加される。

### 投稿IDの解決

`usesContext: ["postId", "postType"]` を宣言し、クエリーループの投稿テンプレート内で使われた場合はブロックコンテキストの `postId` を優先。それ以外（通常の投稿・固定ページ、テンプレート配置時）は `get_the_ID()` にフォールバックする。

### 出力マークアップとスタイル方針

コアの `core/button` ブロックと同じマークアップ・クラス名を使用する。装飾関連のクラス・インラインスタイルはリンク（`<a>`）要素側に付与し、外側の `<div class="wp-block-button">` はレイアウト用のプレーンな要素とする（コア `core/button` の `save.js` と同じ構造上の判断）。

```html
<div class="wp-block-buttons is-content-justification-center" style="display:flex;flex-wrap:wrap;">
  <div class="wp-block-button">
    <a class="wp-block-button__link ..." href="...">ラベル</a>
  </div>
</div>
```

`wp-block-button` / `wp-block-button__link` は theme.json の `styles.elements.button` が対象とする共通クラスのため、何もカスタマイズしない状態では有効化されているテーマのボタン配色・角丸・余白をそのまま継承する。

**装飾のカスタマイズ（標準の `core/button` ブロックに準拠）:**

コアの `core/button` ブロック（`wp-includes/blocks/button/block.json`）と同等の `supports` を `block.json` に宣言し、標準のボタンブロックと同じ範囲の装飾設定（色・タイポグラフィ・余白・枠線・影、幅25/50/75/100%、塗りつぶし/輪郭スタイル）を編集画面から行えるようにする。何もカスタマイズしなければテーマのボタンスタイルにそのまま準拠し、必要な場合のみ個別に上書きできる（コアボタンと同じ挙動）。

- `supports.color`（text/background/gradients）、`supports.typography`（fontSize 等）、`supports.spacing.padding`、`supports.__experimentalBorder`（color/radius/style/width）、`supports.shadow` を宣言。`__experimentalSkipSerialization` は使わず、通常のブロックサポートのシリアライズに任せる。
- `useBlockProps()`（edit.js）／`get_block_wrapper_attributes()`（render.php）は **外側の div ではなくリンク（`<a>`）要素に適用**する。これにより装飾系の class・style が自動的に `<a>` 側へ出力される。外側の `<div class="wp-block-button">` は素の要素として手動で組み立て、`width` 属性がある場合のみ `has-custom-width wp-block-button__width-{n}` クラスを付与する。
- `styles: [{"name":"fill","isDefault":true},{"name":"outline"}]` を宣言し、標準ボタンと同じ塗りつぶし/輪郭のスタイル切り替えに対応する。
- 独自のCSSは持たず、`block.json` の `style` / `editorStyle` にコア標準ボタンの登録済みスタイルハンドル `wp-block-button` / `wp-block-button-editor` に加え、`wp-block-buttons` / `wp-block-buttons-editor`（配列指定）もそのまま指定して再利用する（`file:` プレフィックスなしのハンドル名指定）。

**配置（左寄せ・中央寄せ・右寄せ）:**

コアの `core/button` ブロックは単体では配置を持たず、親の `core/buttons` グループが `layout`（flex）サポートにより `is-content-justification-{left|center|right|space-between}` クラス＋動的な `display:flex` インラインスタイルを付与することで実現している。本ブロックは `core/buttons` の子として使われる想定がないため、同じマークアップ・CSSクラスを自前で再現する。

- `contentJustification` 属性（`left`/`center`/`right`、未指定可）を追加。
- 出力を `core/buttons` の子ブロックと同じ二重構造にする：外側に `<div class="wp-block-buttons is-content-justification-{value}">`、内側に既存の `<div class="wp-block-button ...">` を配置する。`is-content-justification-*` クラスは `wp-block-buttons` の登録済みスタイル（`.is-content-justification-center{justify-content:center}` 等）をそのまま再利用する。
- 静的CSSには外側要素の `display:flex` 宣言が含まれない（コア本体もこれを `block-supports/layout.php` により実行時に動的生成しているため）。本ブロックはコアの動的レイアウトサポートの仕組みを使わず、`style="display:flex;flex-wrap:wrap;"` を直接付与することで同等の見た目を得る。
- 副次効果として、`width`（25/50/75/100%）の幅指定CSS（`.wp-block-buttons > .wp-block-button[class*=wp-block-button__width]` 等）は `.wp-block-buttons` の直下の子であることが前提のため、この配置用ラッパーの追加によって `width` 属性も正しく機能するようになる。
- エディター側は `BlockControls group="block"` ＋ `JustifyContentControl`（`@wordpress/block-editor`）を使用し、コアの Buttons ブロックと同じツールバーUI（左/中央/右のジャスティファイ切り替え）を提供する。Inspector パネルには置かない（コアも同様のUX）。

### 空値時の挙動

`metaKey` が未指定、または対象投稿の該当メタ値が空・存在しない場合、フロントエンドでは何も出力しない（壊れたリンクを表示しないため）。編集画面では `metaKey` 未入力時に警告 Notice を表示する。

### セキュリティ

- **保護対象メタキーの除外**: `metaKey` が `is_protected_meta( $meta_key, 'post' )` で保護対象（`_` 始まり等）と判定される場合、フロントエンドには何も出力しない。他プラグイン・コアが内部利用するメタ値を、ブロック経由で意図せず一般公開してしまうことを防ぐための安全策。
- **サニタイズ／エスケープ**: `metaKey` は `sanitize_text_field()`、`width` は `absint()` で入力時に正規化。出力時は `href` を `esc_url()`、ラベルを `esc_html()`（ブロック側で装飾書式を許可していないため `wp_kses_post()` ではなく `esc_html()` を採用）、その他の属性値を `esc_attr()` で escape する。`get_block_wrapper_attributes()` の戻り値は WP core 側でエスケープ済みのためそのまま出力する。
- **型安全性**: `metaKey` / `label` はブロック属性が想定通り文字列であることを `is_string()` で確認してから使用する（`post_content` を直接改変するなど非標準経路で非文字列値が渡されても致命的エラーにしないため）。`get_post_meta()` の戻り値も `is_string()` で確認してから使用する。
- **CSRF/権限**: 本プラグインは独自の書き込みエンドポイント（REST・AJAX・フォーム送信）を持たない。属性の保存はブロックエディタ標準の投稿保存フロー（WordPress core の REST API による nonce・capability チェック）に委ねており、追加の nonce/capability チェックは不要。

### 対象外（スコープ外）

wp.org 公開は想定していない（`plugin_repo` カテゴリの Plugin Check は CI で除外）。
