/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { getBlockStyle } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * Internal dependencies
 */
import { blockStyles } from './block-styles'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				selectorCallback={ getAttribute => {
					const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name

					if ( blockStyle === 'dots' ) {
						return '.stk-block-divider__dot'
					}

					if ( blockStyle === 'asterisks' ) {
						return '.stk-block-divider__dot:before'
					}

					return 'hr.stk-block-divider__hr'
				} }
				styleRuleCallback={ getAttribute => {
					const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name

					if ( blockStyle === 'asterisks' ) {
						return 'color'
					}

					return 'background'
				} }
				attrName="color"
				dependencies={ [ 'className' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-divider__dot:before"
				styleRule="fontSize"
				attrName="height"
				responsive="all"
				format="calc(%spx * 1.8)"
				enabledCallback={ getAttribute => {
					const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
					return blockStyle === 'asterisks'
				} }
				dependencies={ [ 'className' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector="hr.stk-block-divider__hr"
				styleRule="borderRadius"
				attrName="height"
				responsive="all"
				format="calc(%spx / 2)"
				enabledCallback={ getAttribute => {
					const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
					return blockStyle === 'bar'
				} }
				dependencies={ [ 'className' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-divider__dot"
				styleRule="width"
				attrName="height"
				responsive="all"
				format="%spx"
				enabledCallback={ getAttribute => {
					const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
					return [ 'asterisks', 'dots' ].includes( blockStyle )
				} }
				dependencies={ [ 'className' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => {
					const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
					if ( [ 'dots', 'asterisks' ].includes( blockStyle ) ) {
						return '.stk-block-divider__dot'
					}

					return 'hr.stk-block-divider__hr'
				} }
				styleRule="height"
				attrName="height"
				format="%spx"
				responsive="all"
				dependencies={ [ 'className' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => {
					const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
					if ( [ 'dots', 'asterisks' ].includes( blockStyle ) ) {
						return '.stk-block-divider__dots'
					}

					return 'hr.stk-block-divider__hr'
				} }
				styleRule="width"
				attrName="width"
				format="%s%"
				responsive="all"
				dependencies={ [ 'className' ] }
				{ ...propsToPass }
			/>
		</>
	)
}

export const DividerStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Styles { ...props } />
		</>
	)
} )

DividerStyles.defaultProps = {
	version: '',
}

DividerStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

DividerStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
