/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import { nth } from 'lodash'
import {
	AdvancedToggleControl,
	IconControl,
	InspectorBottomTip,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import { useAttributeEditHandlers, useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import variations from './variations'

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { useSelect } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'

// Use the default template from the block variations.
const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const [ isOpen, setIsOpen ] = useState( true )
	const { hasInnerBlocks } = useBlockContext()
	const [ hasInitClickHandler, setHasInitClickHandler ] = useState( false )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	// Opens or closes the accordion when the heading is clicked.
	useEffect( () => {
		if ( ! hasInitClickHandler ) {
			return
		}
		const headerEl = document.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
		const onClick = ev => {
			// Dom't open the accordion if the user is clicking on the icon.
			if ( ! ev.target.closest( '[data-type="stackable/icon"]' ) ) {
				setIsOpen( ! isOpen )
			}
		}
		headerEl?.addEventListener( 'click', onClick )
		return () => {
			headerEl?.removeEventListener( 'click', onClick )
		}
	}, [ clientId, isOpen, setIsOpen, hasInitClickHandler ] )

	// If the className changes (e.g. layout switch), we need to re-apply the
	// Accordion open/close click handler.
	useEffect( () => {
		if ( hasInitClickHandler ) {
			setHasInitClickHandler( false )
		}
	}, [ props.className ] )

	// When first adding an accordion, the inner blocks may not be rendered yet, wait for it.
	if ( ! hasInitClickHandler ) {
		const headerEl = document.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
		if ( headerEl ) {
			setHasInitClickHandler( true )
		}
	}

	const blockClassNames = classnames( [
		className,
		'stk-block-accordion',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], {
		'stk--is-open': isOpen, // This opens the accordion in the editor.
	} )

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-accordion" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<AdvancedToggleControl
						label={ __( 'Open at the start', i18n ) }
						attribute="startOpen"
					/>
					<AdvancedToggleControl
						label={ __( 'Close adjacent on open', i18n ) }
						attribute="onlyOnePanelOpen"
						className="ugb--help-tip-accordion-adjacent-open"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

			<BlockStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-accordion" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				renderHtmlTag={ false }
				enableVariationPicker={ true }
			>
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="insert"
				/>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Add another icon picker to the Icon block for picking the icon for the opened accordion.
addFilter( 'stackable.block-component.icon.after', 'stackable/blockquote', output => {
	const { clientId } = useBlockEditContext()

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers()

	const isAccordionIcon = useSelect(
		select => {
			const { getBlock } = select( 'core/block-editor' )
			const { parentTree } = select( 'stackable/block-context' ).getBlockContext( clientId )
			const columnClientId = nth( parentTree, -2 )?.clientId
			const accordionClientId = nth( parentTree, -3 )?.clientId
			const iconLabelName = nth( parentTree, -1 )?.name
			const columnName = nth( parentTree, -2 )?.name
			const accordionName = nth( parentTree, -3 )?.name
			if ( ! iconLabelName || ! columnName || ! accordionName ) {
				return false
			}
			if ( iconLabelName !== 'stackable/icon-label' ||
			     columnName !== 'stackable/column' ||
				 accordionName !== 'stackable/accordion' ) {
				return false
			}
			if ( getBlock( accordionClientId ).innerBlocks[ 0 ].clientId !== columnClientId ) {
				return false
			}
			return true
		},
		[ clientId ]
	)

	if ( isAccordionIcon ) {
		return (
			<>
				{ output }
				<IconControl
					label={ __( 'Open Icon', i18n ) }
					value={ getAttribute( 'icon2' ) }
					onChange={ updateAttributeHandler( 'icon2' ) }
					help={ __( 'The open icon will appear when the accordion is opened', i18n ) }
				/>
			</>
		)
	}
	return output
} )

// Prevent the icon label from being being styled with a saved default style.
addFilter( 'stackable.block-default-styles.use-saved-style', 'stackable/icon-label', ( enabled, block, parentBlockNames ) => {
	if ( block.name === 'stackable/icon-label' && parentBlockNames.length >= 2 && parentBlockNames[ parentBlockNames.length - 2 ] === 'stackable/accordion' ) {
		return false
	}
	return enabled
} )
