/**
 * Internal dependencies
 */
import { BorderStyle } from '../helpers/borders'
import { Icon } from '../icon'
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attrNameTemplate = 'button%s',
		selector,
		backgroundSelector = `${ selector }:after`,
		hoverSelector,
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ [ '', '.stk-button' ] }
				styleRule="width"
				attrName="fullWidth"
				attrNameTemplate={ attrNameTemplate }
				key="buttonFullWidth"
				valueCallback={ () => '100%' }
				format="%spx"
				enabledCallback={ getAttribute => getAttribute( 'fullWidth' ) }
			/>
			{
			// This makes the full-width button occupy the available space, but make
			// others wrap when it's too small.
			}
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=""
				styleRule="flex"
				attrName="fullWidth"
				attrNameTemplate={ attrNameTemplate }
				key="buttonFullWidth-save"
				valueCallback={ () => '1 1 0' }
				enabledCallback={ getAttribute => getAttribute( 'fullWidth' ) }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				styleRule="flex"
				attrName="fullWidth"
				attrNameTemplate={ attrNameTemplate }
				key="buttonFullWidth-flex"
				valueCallback={ () => '1 1 0' }
				enabledCallback={ getAttribute => getAttribute( 'fullWidth' ) }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="minHeight"
				attrName="minHeight"
				attrNameTemplate={ attrNameTemplate }
				key="buttonMinHeight"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="width"
				attrName="width"
				attrNameTemplate={ attrNameTemplate }
				key="buttonWidth"
				format="%spx"
				enabledCallback={ getAttribute => ! getAttribute( 'fullWidth' ) }
				dependencies={ [
					'fullWidth',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingTop"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				key="buttonPadding-top"
				hasUnits="px"
				valuePreCallback={ value => value?.top }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingRight"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				key="buttonPadding-right"
				hasUnits="px"
				valuePreCallback={ value => value?.right }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingBottom"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				key="buttonPadding-bottom"
				hasUnits="px"
				valuePreCallback={ value => value?.bottom }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingLeft"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				key="buttonPadding-left"
				hasUnits="px"
				valuePreCallback={ value => value?.left }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="background"
				attrName="backgroundColor"
				attrNameTemplate={ attrNameTemplate }
				key="buttonBackgroundColor"
				dependencies={ [
					'backgroundColorType',
					...dependencies,
				 ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ backgroundSelector || `${ selector }:after` }
				styleRule="background"
				attrName="backgroundColor"
				attrNameTemplate={ attrNameTemplate }
				key="buttonBackgroundColor-after"
				hover="all"
				hoverSelector={ hoverSelector ? hoverSelector : `${ selector }:hover:after` }
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}
					return value
				} }
				dependencies={ [
					'backgroundColorType',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ backgroundSelector || `${ selector }:after` }
				styleRule="opacity"
				attrName="backgroundColor"
				attrNameTemplate={ attrNameTemplate }
				key="buttonBackgroundColor-opacity"
				hover="all"
				hoverSelector={ hoverSelector ? hoverSelector : `${ selector }:hover:after` }
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}

					const buttonBackgroundColor = getAttribute( 'backgroundColor', 'desktop', state )

					if (
						typeof buttonBackgroundColor !== 'undefined' &&
					buttonBackgroundColor !== ''
					) {
						return 1
					}

					return undefined
				} }
			/>
		</>
	)
}

export const Style = props => {
	const {
		selector = '',
		attrNameTemplate = 'button%s',
		borderSelector = `${ selector }:before`,
		borderHoverSelector = `${ selector }:hover:before`,
	} = props

	return (
		<>
			<Styles
				{ ...props }
				attrNameTemplate={ attrNameTemplate }
			/>
			<BorderStyle
				{ ...props }
				selector={ borderSelector }
				// Adding border radius clips button's shadow.
				// This prevents this from happening.
				// @see src/block-components/borders/style.js
				addBorderRadiusOverflow={ false }
				hoverSelector={ borderHoverSelector }
				borderRadiusSelector={ selector }
				attrNameTemplate={ attrNameTemplate }
			/>
			<Icon.Style { ...props } />
		</>
	)
}

Style.Content = props => {
	const {
		selector = '',
		attrNameTemplate = 'button%s',
		borderSelector = `${ selector }:before`,
		borderHoverSelector = `${ selector }:hover:before`,
	} = props

	return (
		<>
			<Styles
				{ ...props }
				attrNameTemplate={ attrNameTemplate }
			/>
			<BorderStyle.Content
				{ ...props }
				selector={ borderSelector }
				// Adding border radius clips button's shadow.
				// This prevents this from happening.
				// @see src/block-components/borders/style.js}
				addBorderRadiusOverflow={ false }
				hoverSelector={ borderHoverSelector }
				borderRadiusSelector={ selector }
				attrNameTemplate={ attrNameTemplate }
			/>
			<Icon.Style.Content { ...props } />
		</>
	)
}
