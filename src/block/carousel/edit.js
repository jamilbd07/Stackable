/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks,
	ControlSeparator,
	GroupPlaceholder,
	InspectorLayoutControls,
	InspectorTabs,
	AdvancedToolbarControl,
	AdvancedRangeControl,
	AdvancedToggleControl,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	ColumnsControl,
} from '~stackable/block-components'
import { useBlockContext, useDeviceType } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	useState, useRef, useEffect,
} from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { range } from 'lodash'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
		attributes,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const carouselType = attributes.carouselType === '' ? 'slide' : attributes.carouselType

	const blockClassNames = classnames( [
		className,
		'stk-block-carousel',
		rowClass,
		separatorClass,
		columnTooltipClass,
		{
			'stk--is-slide': carouselType === 'slide',
			'stk--is-fade': carouselType === 'fade',
			'stk--hide-others': carouselType === 'fade' && attributes.fadeOutOtherSlides,
		},
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-block-carousel__slider-wrapper',
	], getContentAlignmentClasses( props.attributes ) )

	const deviceType = useDeviceType()
	// const getAttributeName = ( attrName, state = 'normal' ) => _getAttributeName( attrName, 'Desktop', state )
	const { numInnerBlocks, innerBlocks } = useBlockContext()
	const [ activeSlide, setActiveSlide ] = useState( 1 )
	const [ dotActiveSlide, setDotActiveSlide ] = useState( 1 )
	const sliderRef = useRef()
	const dotActiveJustChanged = useRef()

	let maxSlides = numInnerBlocks
	if ( carouselType === 'slide' ) {
		const slidesToShow = attributes[ getAttributeName( 'slidesToShow', deviceType ) ]
		maxSlides -= ( slidesToShow - 1 )
	}

	const nextSlide = ev => {
		ev.preventDefault()

		let newSlide = activeSlide + 1
		if ( newSlide > maxSlides ) {
			newSlide = 1
		}
		goToSlide( newSlide )
	}

	const prevSlide = ev => {
		ev.preventDefault()

		let newSlide = activeSlide - 1
		if ( newSlide <= 0 ) {
			newSlide = maxSlides
		}
		goToSlide( newSlide )
	}

	const goToSlide = slide => {
		setActiveSlide( slide )
		setDotActiveSlide( slide )

		if ( carouselType === 'slide' ) {
			const slider = sliderRef.current.querySelector( '.block-editor-block-list__layout' )
			if ( slider ) {
				sliderRef.current.scrollLeft = slider.children[ slide - 1 ].offsetLeft
			}
		}

		// Disallow rapid changing of the dotActiveSlide because this will cause
		// the active dot to flicker.
		clearTimeout( dotActiveJustChanged.current )
		dotActiveJustChanged.current = setTimeout( () => {
			dotActiveJustChanged.current = null
		}, 500 )
	}

	// Reset the slider location when the carousel type changes.
	useEffect( () => {
		sliderRef.current.scrollLeft = 0
		setActiveSlide( 1 )
		setDotActiveSlide( 1 )
	}, [ carouselType ] )

	// Update the active dot when the slider is scrolled.  This checks the
	// scroll position and finds the closest slide to the left. This is the best
	// way here because there are a number of ways to change the slide position.
	// (e.g. changing column order)
	useEffect( () => {
		const timeout = setInterval( () => {
			if ( carouselType === 'slide' ) {
				const slider = sliderRef.current.querySelector( '.block-editor-block-list__layout' )
				const scrollLeft = sliderRef.current.scrollLeft
				const { slide } = Array.from( slider.children ).reduce( ( result, slideEl, i ) => {
					const slide = i + 1
					const offsetDiff = Math.abs( slideEl.offsetLeft - scrollLeft )
					if ( offsetDiff <= result.offsetDiff ) {
						return { slide, offsetDiff }
					}
					return result
				}, { slide: 1, offsetDiff: 1000 } )

				// Disallow rapid changing of the dotActiveSlide because this will cause
				// the active dot to flicker.
				if ( ! dotActiveJustChanged.current ) {
					setActiveSlide( slide )
					setDotActiveSlide( slide )
				}
			}
		}, 500 )
		return () => clearInterval( timeout )
	}, [ carouselType ] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					{ /* <Columns.InspectorControls /> */ }
					<InspectorLayoutControls>
						<ColumnsControl
							label={ __( 'Slides', i18n ) }
							sliderMax={ 10 }
						/>
						<AdvancedToolbarControl
							controls={ [
								{
									value: '',
									title: __( 'Slide', i18n ),
								},
								{
									value: 'fade',
									title: __( 'Fade', i18n ),
								},
							] }
							attribute="carouselType"
							// isSmall={ true }
							// fullwidth={ false }
						/>
						{ carouselType === 'slide' && (
							<>
								<AdvancedRangeControl
									label={ __( 'Slides to Show', i18n ) }
									sliderMax={ 4 }
									min={ 1 }
									attribute="slidesToShow"
									placeholder="3"
									responsive="all"
								/>
								<AdvancedRangeControl
									label={ __( 'Slide Gap', i18n ) }
									sliderMax={ 100 }
									min={ 0 }
									attribute="slideColumnGap"
									placeholder="30"
									responsive="all"
								/>
							</>
						) }
						{ carouselType === 'fade' && (
							<AdvancedToggleControl
								label={ __( 'Fade out previous slide', i18n ) }
								attribute="fadeOutOtherSlides"
								help={ __( 'Useful for backgroundless slides. May cause unwanted white fadeout on slides with a background', i18n ) }
								defaultValue={ true }
							/>
						) }
						<ControlSeparator />
					</InspectorLayoutControls>
					<ContentAlign.InspectorControls />
					<Alignment.InspectorControls hasColumnJustify={ true } hasRowAlignment={ true } />
					<BlockDiv.InspectorControls />
					<Separator.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-columns" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				// enableVariationPicker={ true }
			>
				<BlockStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-columns" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
					<div
						className={ contentClassNames }
						data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
							: props.attributes.contentAlign === 'alignwide' ? 'wide'
								: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
					>
						{ carouselType === 'fade' && (
							<style>
								{ `.stk-${ attributes.uniqueId }-column .stk-block-carousel__slider .block-editor-inner-blocks .block-editor-block-list__layout [data-type="stackable/column"]:nth-child(${ activeSlide }) {
									opacity: 1;
									visibility: visible;
									left: -${ 100 * ( activeSlide - 1 ) }%;
								}` }
							</style>
						) }
						{ carouselType === 'slide' && (
							<style>
								{ `.stk-${ attributes.uniqueId }-column .stk-block-carousel__slider .block-editor-inner-blocks .block-editor-block-list__layout [data-type="stackable/column"]:nth-child(${ activeSlide }) {
									// opacity: 1;
									// visibility: visible;
									// left: -${ 100 * ( activeSlide - 1 ) }%;
								}` }
							</style>
						) }
						<div
							className="stk-block-carousel__slider"
							ref={ sliderRef }
							// this.sliderEl.scrollLeft = this.slideEls[ slide - 1 ].offsetLeft
							role="list"
						>
							<ColumnInnerBlocks
								providerValue={ columnProviderValue }
								orientation="horizontal"
								template={ props.attributes.templateLock ? undefined : TEMPLATE }
								allowedBlocks={ ALLOWED_INNER_BLOCKS }
								renderAppender={ false }
								templateLock={ props.attributes.templateLock || false }
								// ref={ sliderRef }
							/>
						</div>
						{ attributes.showButtons && (
							<div className="stk-block-carousel__buttons">
								<button
									className="stk-block-carousel__button stk-block-carousel__button__prev"
									onClick={ prevSlide }>
									{ '<' }
								</button>
								<button
									className="stk-block-carousel__button stk-block-carousel__button__next"
									onClick={ nextSlide }>
									{ '>' }
								</button>
							</div>
						) }
					</div>
					{ attributes.showDots && (
						<div className="stk-block-carousel__dots" role="list" data-label="Slide %d">
							{ range( maxSlides ).map( i => {
								const className = classnames( 'stk-block-carousel__dot', {
									'stk-block-carousel__dot--active': i + 1 === dotActiveSlide,
								} )
								return (
									<div key={ i } role="listitem">
										<button
											className={ className }
											onClick={ ev => {
												ev.preventDefault()
												goToSlide( i + 1 )
											} }
										/>
									</div>
								)
							} ) }
						</div>
					) }
				</Separator>
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
