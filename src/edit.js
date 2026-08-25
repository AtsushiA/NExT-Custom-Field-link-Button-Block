import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	JustifyContentControl,
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
	const {
		metaKey,
		urlPrefix,
		urlSuffix,
		openInNewTab,
		label,
		width,
		contentJustification,
	} = attributes;

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

	// コアの buttons ブロックと同じマークアップ・CSSクラスを利用して、
	// ボタン全体の配置（左寄せ・中央寄せ・右寄せ）を制御する。
	const outerWrapperClassName = [
		'wp-block-buttons',
		contentJustification
			? `is-content-justification-${ contentJustification }`
			: '',
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<>
			<BlockControls group="block">
				<JustifyContentControl
					allowedControls={ [ 'left', 'center', 'right' ] }
					value={ contentJustification }
					onChange={ ( value ) =>
						setAttributes( { contentJustification: value } )
					}
				/>
			</BlockControls>
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
					<TextControl
						label={ __(
							'URLの接頭子',
							'next-custom-field-link-button-block'
						) }
						help={ __(
							'カスタムフィールドの値の前に付加する文字列を入力してください。',
							'next-custom-field-link-button-block'
						) }
						value={ urlPrefix }
						onChange={ ( value ) =>
							setAttributes( { urlPrefix: value } )
						}
					/>
					<TextControl
						label={ __(
							'URLの接尾子',
							'next-custom-field-link-button-block'
						) }
						help={ __(
							'カスタムフィールドの値の後に付加する文字列を入力してください。',
							'next-custom-field-link-button-block'
						) }
						value={ urlSuffix }
						onChange={ ( value ) =>
							setAttributes( { urlSuffix: value } )
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
			<div
				className={ outerWrapperClassName }
				style={ { display: 'flex', flexWrap: 'wrap' } }
			>
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
			</div>
		</>
	);
}
