/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const typographyOptions = {
	selector: '.stk-block-text__text',
	hoverSelector: '.stk-block-text__text:hover',
}

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
				selector=""
				styleRule="columnCount"
				attrName="columns"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=""
				styleRule="columnGap"
				attrName="columnGap"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
		</>
	)
}

export const TextStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<Styles { ...props } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

TextStyles.defaultProps = {
	version: '',
}

TextStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

TextStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

