<?php
/**
 * next/custom-field-link-button-block のサーバーサイドレンダリング処理。
 *
 * 投稿のカスタムフィールド（投稿メタ）の値をリンク先としてボタンを出力する。
 * メタキー未設定、または対象のメタ値が空の場合は何も出力しない。
 * 色・タイポグラフィ・余白・枠線・影の装飾設定は、コアの button ブロックと同様に
 * ブロックサポート機能によりリンク（アンカー）要素へ自動的に反映される。
 *
 * @package NextCustomFieldLinkButtonBlock
 *
 * @var array    $attributes ブロック属性。
 * @var string   $content    内部ブロックの内容（未使用）。
 * @var WP_Block $block      ブロックインスタンス。
 */

defined( 'ABSPATH' ) || exit;

$meta_key        = isset( $attributes['metaKey'] ) ? sanitize_text_field( $attributes['metaKey'] ) : '';
$open_in_new_tab = ! empty( $attributes['openInNewTab'] );
$label           = isset( $attributes['label'] ) ? $attributes['label'] : '';
$width           = isset( $attributes['width'] ) ? absint( $attributes['width'] ) : 0;

// クエリーループの投稿テンプレート内で使われた場合はブロックコンテキストの postId を優先する.
$target_post_id = isset( $block->context['postId'] ) ? absint( $block->context['postId'] ) : get_the_ID();

if ( '' === $meta_key || ! $target_post_id ) {
	return;
}

$url = get_post_meta( $target_post_id, $meta_key, true );

if ( ! is_string( $url ) || '' === $url ) {
	return;
}

// コアの button ブロックと同様、装飾関連のクラス・スタイルはリンク要素側に適用する.
$link_attributes = get_block_wrapper_attributes( array( 'class' => 'wp-block-button__link' ) );

$wrapper_class = 'wp-block-button';
if ( $width ) {
	$wrapper_class .= sprintf( ' has-custom-width wp-block-button__width-%d', $width );
}
?>
<div class="<?php echo esc_attr( $wrapper_class ); ?>">
	<a
		<?php echo $link_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() はエスケープ済みの属性文字列を返す. ?>
		href="<?php echo esc_url( $url ); ?>"
		<?php echo $open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- 固定文字列のため追加のエスケープは不要. ?>
	>
		<?php echo wp_kses_post( $label ); ?>
	</a>
</div>
<?php
