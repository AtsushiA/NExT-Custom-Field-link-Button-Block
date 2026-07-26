<?php
/**
 * next/custom-field-link-button-block のブロック登録・レンダリングの Integration テスト。
 *
 * @package NextCustomFieldLinkButtonBlock
 */

namespace NextCustomFieldLinkButtonBlock\Tests\Integration;

use WP_UnitTestCase;

/**
 * ブロック登録と render.php の出力内容を検証するテスト.
 */
class RenderTest extends WP_UnitTestCase {

	/**
	 * ブロックが登録されていることを確認する.
	 *
	 * @return void
	 */
	public function test_block_is_registered(): void {
		$this->assertTrue(
			\WP_Block_Type_Registry::get_instance()->is_registered( 'next/custom-field-link-button-block' )
		);
	}

	/**
	 * カスタムフィールドに値がある場合、URL・ラベル・新規タブ用属性が出力されることを確認する.
	 *
	 * @return void
	 */
	public function test_render_outputs_button_when_meta_value_exists(): void {
		$post_id = self::factory()->post->create();
		update_post_meta( $post_id, 'test_link_url', 'https://example.com/target' );
		$this->go_to( get_permalink( $post_id ) );

		$html = render_block(
			array(
				'blockName'    => 'next/custom-field-link-button-block',
				'attrs'        => array(
					'metaKey'      => 'test_link_url',
					'label'        => 'サイトを見る',
					'openInNewTab' => true,
				),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			)
		);

		$this->assertStringContainsString( 'https://example.com/target', $html );
		$this->assertStringContainsString( 'サイトを見る', $html );
		$this->assertStringContainsString( 'target="_blank"', $html );
		$this->assertStringContainsString( 'rel="noopener noreferrer"', $html );
		$this->assertStringContainsString( 'wp-block-button__link', $html );
	}

	/**
	 * カスタムフィールド名が未指定の場合、何も出力されないことを確認する.
	 *
	 * @return void
	 */
	public function test_render_outputs_nothing_when_meta_key_is_empty(): void {
		$post_id = self::factory()->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$html = render_block(
			array(
				'blockName'    => 'next/custom-field-link-button-block',
				'attrs'        => array(),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			)
		);

		$this->assertSame( '', trim( $html ) );
	}

	/**
	 * 指定したカスタムフィールドの値が存在しない場合、何も出力されないことを確認する.
	 *
	 * @return void
	 */
	public function test_render_outputs_nothing_when_meta_value_is_missing(): void {
		$post_id = self::factory()->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$html = render_block(
			array(
				'blockName'    => 'next/custom-field-link-button-block',
				'attrs'        => array( 'metaKey' => 'nonexistent_field' ),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			)
		);

		$this->assertSame( '', trim( $html ) );
	}

	/**
	 * アンダースコア始まりの保護対象メタキーが指定された場合、値が存在しても出力されないことを確認する.
	 *
	 * @return void
	 */
	public function test_render_outputs_nothing_for_protected_meta_key(): void {
		$post_id = self::factory()->post->create();
		update_post_meta( $post_id, '_secret_internal_value', 'https://example.com/secret' );
		$this->go_to( get_permalink( $post_id ) );

		$html = render_block(
			array(
				'blockName'    => 'next/custom-field-link-button-block',
				'attrs'        => array( 'metaKey' => '_secret_internal_value' ),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			)
		);

		$this->assertSame( '', trim( $html ) );
	}

	/**
	 * metaKey / label に文字列以外の値が渡されても致命的エラーにならないことを確認する.
	 *
	 * @return void
	 */
	public function test_render_does_not_fatal_on_non_string_attributes(): void {
		$post_id = self::factory()->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$html = render_block(
			array(
				'blockName'    => 'next/custom-field-link-button-block',
				'attrs'        => array(
					'metaKey' => array( 'unexpected' => 'array' ),
					'label'   => array( 'unexpected' => 'array' ),
				),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			)
		);

		$this->assertSame( '', trim( $html ) );
	}
}
