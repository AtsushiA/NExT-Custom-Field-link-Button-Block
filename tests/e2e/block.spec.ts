import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'NExT Custom Field Link Button Block', () => {
	test( 'プラグインが有効化されている', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'plugins.php' );
		const pluginRow = page.locator(
			'tr[data-slug="next-custom-field-link-button-block"]'
		);
		await expect( pluginRow ).toHaveClass( /active/ );
	} );

	test( 'ブロックをエディタに挿入できる', async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'next/custom-field-link-button-block',
		} );

		const block = editor.canvas.locator(
			'[data-type="next/custom-field-link-button-block"]'
		);
		await expect( block ).toBeVisible();
	} );

	test( 'インスペクターでカスタムフィールド名と新しいタブ設定を指定できる', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'next/custom-field-link-button-block',
		} );
		await editor.openDocumentSettingsSidebar();

		const metaKeyInput = page.getByLabel( 'カスタムフィールド名' );
		await metaKeyInput.fill( 'test_link_url' );
		await expect( metaKeyInput ).toHaveValue( 'test_link_url' );

		const newTabToggle = page.getByLabel( '新しいタブで開く' );
		await newTabToggle.click();
		await expect( newTabToggle ).toBeChecked();
	} );
} );

test.describe( 'Frontend (anonymous)', () => {
	test.use( { storageState: { cookies: [], origins: [] } } );

	test( 'カスタムフィールドが未設定の投稿では何も表示されない', async ( {
		page,
		requestUtils,
	} ) => {
		const post = await requestUtils.createPost( {
			title: 'CFLB E2E Test (empty)',
			status: 'publish',
			content:
				'<!-- wp:next/custom-field-link-button-block {"metaKey":"nonexistent_field","label":"表示されないはず"} /-->',
		} );

		await page.goto( `/?p=${ post.id }` );

		await expect(
			page.locator( '.wp-block-next-custom-field-link-button-block' )
		).toHaveCount( 0 );
	} );
} );
