/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector = '',
		hoverSelector = '',
	} = props

	const getSvgSelector = ( getAttribute, _selector = selector, suffixes = [], fallback = selector ) => {
		const svgSelector = `${ _selector || fallback } .stk--inner-svg svg:last-child`
		if ( suffixes.length ) {
			return [
				svgSelector,
				svgSelector + ` :is(${ suffixes.join( ',' ) })`,
			]
		}
		return svgSelector
	}

	const getSvgHoverSelector = ( getAttribute, _selector = selector, suffixes = [] ) => getSvgSelector( getAttribute, _selector, suffixes, selector + ':hover' )

	const shapeSelector = `${ selector } .stk--inner-svg`
	const shapeHoverSelector = `${ hoverSelector } .stk--inner-svg`

	return (
		<>
			{ /* Icon Styles */ }
			<BlockCss
				selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
				hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
				styleRule="height"
				attrName="iconSize"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
				hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
				styleRule="width"
				attrName="iconSize"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
				hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
				styleRule="opacity"
				attrName="iconOpacity"
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
				hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
				styleRule="transform"
				attrName="iconRotation"
				hover="all"
				format="rotate(%sdeg)"
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
				hoverSelectorCallback={ getAttribute => getSvgSelector( getAttribute, hoverSelector ) }
				styleRuleCallback={ getAttribute => getAttribute( 'iconPosition' ) === 'right' ? 'marginInlineStart' : 'marginInlineEnd' }
				attrName="iconGap"
				format={ `%spx` }
				dependencies={ [ 'iconPosition' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => getSvgSelector( getAttribute, selector, [ 'g', 'path', 'rect', 'polygon', 'ellipse' ] ) }
				hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector, [ 'g', 'path', 'rect', 'polygon', 'ellipse' ] ) }
				styleRule="fill"
				attrName="iconColor1"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( getAttribute( 'iconColorType' ) === 'gradient' && getAttribute( 'iconColor1', 'desktop', state ) && getAttribute( 'iconColor2', 'desktop', state ) ) {
						return `url(#linear-gradient-${ getAttribute( 'uniqueId' ) })`
					}

					if ( ! getAttribute( 'iconColorType' ) ) {
						return value
					}

					return undefined
				} }
				dependencies={ [ 'iconColorType', 'iconColor1', 'iconColor2', 'uniqueId' ] }
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
				styleRule="transform"
				format="rotate(%sdeg)"
				attrName="iconColorGradientDirection"
				hoverSelectorCallback={ getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
				styleRuleCallback={ getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-1` }
				attrName="iconColor1"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( getAttribute( 'iconColorType' ) !== 'gradient' ||
					     ! getAttribute( 'iconColor1', 'desktop', state ) ||
					     ! getAttribute( 'iconColor2', 'desktop', state )
					) {
						return undefined
					}
					return value
				} }
				hoverSelectorCallback={ getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
				dependencies={ [ 'iconColorType', 'iconColor1', 'iconColor2' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selectorCallback={ getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
				styleRuleCallback={ getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-2` }
				attrName="iconColor2"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( getAttribute( 'iconColorType' ) !== 'gradient' ||
					! getAttribute( 'iconColor1', 'desktop', state ) ||
					! getAttribute( 'iconColor2', 'desktop', state )
					) {
						return undefined
					}
					return value
				} }
				hoverSelectorCallback={ getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
				dependencies={ [ 'iconColorType', 'iconColor1', 'iconColor2' ] }
				{ ...propsToPass }
			/>

			{ /* Shape Styles */ }
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="backgroundColor"
				attrName="shapeColor1"
				hover="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					const shapeColorType = getAttribute( 'shapeColorType' )
					if ( state !== 'normal' && shapeColorType === 'gradient' ) {
						return undefined
					}

					return value
				} }
				dependencies={ [ 'shapeColorType', 'shapeColor2', 'shapeColorType', 'shapeGradientDirection' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="borderRadius"
				attrName="shapeBorderRadius"
				format={ `%s%` }
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="padding"
				attrName="shapePadding"
				format={ `%spx` }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="borderColor"
				attrName="shapeOutlineColor"
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="borderStyle"
				attrName="borderStyle"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if (
						! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.top ||
						! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.right ||
						! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.bottom ||
						! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.left
					) {
						return undefined
					}

					return 'solid'
				} }
				hover="all"
				dependencies={ [ 'shapeOutlineWidth' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="borderTopWidth"
				attrName="shapeOutlineWidth"
				responsive="all"
				format="%spx"
				valuePreCallback={ value => value?.top }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="borderRightWidth"
				attrName="shapeOutlineWidth"
				responsive="all"
				format="%spx"
				valuePreCallback={ value => value?.right }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="borderBottomWidth"
				attrName="shapeOutlineWidth"
				responsive="all"
				format="%spx"
				valuePreCallback={ value => value?.bottom }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ shapeSelector }
				hoverSelector={ shapeHoverSelector }
				styleRule="borderLeftWidth"
				attrName="shapeOutlineWidth"
				responsive="all"
				format="%spx"
				valuePreCallback={ value => value?.left }
				{ ...propsToPass }
			/>
		</>
	)
}

export const Style = props => {
	return <>
		<Styles { ...props } />
		{ applyFilters( 'stackable.block-component.icon.get-style-params', null, props ) }
	</>
}

Style.Content = props => {
	return <>
		<Styles { ...props } />
		{ applyFilters( 'stackable.block-component.icon.get-style-params', null, props ) }
	</>
}
