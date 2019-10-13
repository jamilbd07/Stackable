/**
 * External dependencies
 */
import { BlockContainer, ButtonEditHelper } from '~stackable/components'
import { createVideoBackground, hasBackgroundOverlay } from '~stackable/util'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import classnames from 'classnames'
import { range } from 'lodash'
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className, attributes } = props
	const {
		columns = 2,
		design = 'basic',
		shadow = 3,

		titleTag = 'h4',
		showImage = true,
		showTitle = true,
		showSubtitle = true,
		showDescription = true,
		showButton = true,
		buttonIcon = '',
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-card--v2',
		`ugb-card--design-${ design }`,
		`ugb-card--columns-${ columns }`,
	], applyFilters( 'stackable.card.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const title = attributes[ `title${ i }` ]
					const subtitle = attributes[ `subtitle${ i }` ]
					const description = attributes[ `description${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ] || __( 'Button text', i18n )

					const itemClasses = classnames( [
						'ugb-card__item',
						`ugb-card__item${ i }`,
					], applyFilters( 'stackable.card.itemclasses', {
						'ugb--has-background-overlay': show.columnBackground && hasBackgroundOverlay( 'column%s', props.attributes ),
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== 3,
					}, props ) )

					const imageClasses = classnames( [
						'ugb-card__image',
					], applyFilters( 'stackable.card.imageclasses', {
						[ `ugb--shadow-${ shadow }` ]: ! show.columnBackground,
					}, props ) )

					return (
						<div
							className={ itemClasses }
							key={ i }
						>
							{ show.columnBackground && createVideoBackground( 'column%s', props ) }
							{ showImage && imageUrl &&
								<div className={ imageClasses } />
							}
							<div className="ugb-card__content">
								{ showTitle && ! RichText.isEmpty( title ) &&
									<RichText.Content
										tagName={ titleTag || 'h4' }
										className="ugb-card__title"
										value={ title }
									/>
								}
								{ showSubtitle && ! RichText.isEmpty( subtitle ) &&
									<RichText.Content
										tagName="p"
										className="ugb-card__subtitle"
										value={ subtitle }
									/>
								}
								{ showDescription && ! RichText.isEmpty( description ) &&
									<RichText.Content
										tagName="p"
										className="ugb-card__description"
										value={ description }
									/>
								}
								{ showButton && !! buttonText.length &&
									<ButtonEditHelper.Content
										attrNameTemplate={ `button%s` }
										blockAttributes={ props.attributes }
										text={ buttonText }
										icon={ attributes[ `button${ i }Icon` ] || buttonIcon }
										url={ attributes[ `button${ i }Url` ] }
										newTab={ attributes[ `button${ i }NewTab` ] }
										noFollow={ attributes[ `button${ i }NoFollow` ] }
									/>
								}
							</div>
						</div>
					)
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
