import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	Notice,
	ButtonGroup,
	Button,
} from '@wordpress/components';

// コアの button ブロックと同じ幅の選択肢。
const WIDTHS = [ 25, 50, 75, 100 ];

/**
 * ブロックの編集画面を描画する。
 *
 * 色・タイポグラフィ・余白・枠線・影の装飾はブロックサポート機能により
 * リンク（アンカー）要素へ自動的に反映されるため、独自のコントロールは実装しない。
 *
 * @param {Object}   props               ブロックプロパティ。
 * @param {Object}   props.attributes    ブロック属性。
 * @param {Function} props.setAttributes 属性更新関数。
 * @return {JSX.Element} 編集画面の要素。
 */
export default function Edit( { attributes, setAttributes } ) {
	const { metaKey, openInNewTab, label, width } = attributes;

	// コアの button ブロックと同様、装飾関連のスタイル・クラスはリンク要素側に適用する。
	const blockProps = useBlockProps( {
		className: 'wp-block-button__link',
	} );

	const wrapperClassName = [
		'wp-block-button',
		width ? `has-custom-width wp-block-button__width-${ width }` : '',
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'リンク設定',
						'next-custom-field-link-button-block'
					) }
				>
					<TextControl
						label={ __(
							'カスタムフィールド名',
							'next-custom-field-link-button-block'
						) }
						help={ __(
							'リンク先URLを取得する投稿メタのフィールド名（メタキー）を入力してください。',
							'next-custom-field-link-button-block'
						) }
						value={ metaKey }
						onChange={ ( value ) =>
							setAttributes( { metaKey: value } )
						}
					/>
					<ToggleControl
						label={ __(
							'新しいタブで開く',
							'next-custom-field-link-button-block'
						) }
						help={
							openInNewTab
								? __(
										'リンクは新しいタブ（target="_blank"）で開きます。',
										'next-custom-field-link-button-block'
								  )
								: __(
										'リンクは同じタブで開きます。',
										'next-custom-field-link-button-block'
								  )
						}
						checked={ openInNewTab }
						onChange={ ( value ) =>
							setAttributes( { openInNewTab: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __(
						'設定',
						'next-custom-field-link-button-block'
					) }
				>
					<p>{ __( '幅', 'next-custom-field-link-button-block' ) }</p>
					<ButtonGroup
						aria-label={ __(
							'ボタンの幅',
							'next-custom-field-link-button-block'
						) }
					>
						{ WIDTHS.map( ( widthValue ) => (
							<Button
								key={ widthValue }
								size="small"
								variant={
									width === widthValue
										? 'primary'
										: undefined
								}
								onClick={ () =>
									setAttributes( {
										width:
											width === widthValue
												? undefined
												: widthValue,
									} )
								}
							>
								{ widthValue }%
							</Button>
						) ) }
					</ButtonGroup>
				</PanelBody>
			</InspectorControls>
			{ ! metaKey && (
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'カスタムフィールド名が未設定です。右側の設定パネルから入力してください。',
						'next-custom-field-link-button-block'
					) }
				</Notice>
			) }
			<div className={ wrapperClassName }>
				<RichText
					{ ...blockProps }
					tagName="a"
					value={ label }
					onChange={ ( value ) =>
						setAttributes( { label: value } )
					}
					placeholder={ __(
						'ボタンラベルを入力',
						'next-custom-field-link-button-block'
					) }
					allowedFormats={ [] }
				/>
			</div>
		</>
	);
}
