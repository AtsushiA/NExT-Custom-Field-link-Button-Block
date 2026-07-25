<?php
/**
 * Integration テスト用の PHPUnit bootstrap ファイル。
 *
 * WordPress のテスト環境をロードしたうえで本プラグインを読み込む。
 *
 * @package NextCustomFieldLinkButtonBlock
 */

// Composer のオートローダーを読み込む.
require_once dirname( __DIR__, 2 ) . '/vendor/autoload.php';

// WordPress テストライブラリを読み込む.
require getenv( 'WP_TESTS_DIR' ) . '/includes/functions.php';

/**
 * テスト対象プラグインを手動で読み込む.
 *
 * @return void
 */
function _next_custom_field_link_button_block_manually_load_plugin() {
	require dirname( __DIR__, 2 ) . '/next-custom-field-link-button-block.php';
}
tests_add_filter( 'muplugins_loaded', '_next_custom_field_link_button_block_manually_load_plugin' );

// WordPress テスト環境を起動する.
require getenv( 'WP_TESTS_DIR' ) . '/includes/bootstrap.php';
