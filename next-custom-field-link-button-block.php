<?php
/**
 * Plugin Name:       NExT Custom Field Link Button Block
 * Description:       投稿のカスタムフィールド（投稿メタ）の値をリンク先とするボタンブロックを追加します。
 * Version:           0.2.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            NExT-Season
 * Author URI:        https://next-season.net/
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       next-custom-field-link-button-block
 *
 * @package NextCustomFieldLinkButtonBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスされた場合は終了する.
}

/**
 * ブロックを登録する。
 *
 * @return void
 */
function next_custom_field_link_button_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'next_custom_field_link_button_block_init' );
