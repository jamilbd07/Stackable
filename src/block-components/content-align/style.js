/**
 * Internal dependencies
 */
import { BlockCss } from '~stackable/components'

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
				renderIn="save"
				selector=".%s-column"
				styleRule="--stk-column-gap"
				attrName="columnGap"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-column-gap"
				attrName="columnGap"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="save"
				selector=".%s-column"
				styleRule="rowGap"
				attrName="rowGap"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="rowGap"
				attrName="rowGap"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="save"
				selector=".%s-column"
				styleRule="justifyContent"
				attrName="columnFitAlign"
				responsive="all"
				enabledCallback={ getAttribute => !! getAttribute( 'columnFit' ) }
				dependencies={ [ 'columnFit' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="justifyContent"
				attrName="columnFitAlign"
				responsive="all"
				enabledCallback={ getAttribute => !! getAttribute( 'columnFit' ) }
				dependencies={ [ 'columnFit' ] }
				{ ...propsToPass }
			/>
		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}
