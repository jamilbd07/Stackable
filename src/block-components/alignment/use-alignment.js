/**
 * External dependencies
 */
import classnames from 'classnames'
import { useBlockAttributes } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'

export const useAlignment = () => {
	const { clientId } = useBlockEditContext()
	const { innerBlockOrientation } = useBlockAttributes( clientId )

	return {
		blockOrientation: innerBlockOrientation || 'vertical',
	}
}

export const getAlignmentClasses = attributes => {
	const innerBlocksClass = classnames( {
		// We need to put this in a class to we can also target horizontal
		// orientations in css.
		[ `stk--block-orientation-${ attributes.innerBlockOrientation }` ]: attributes.innerBlockOrientation,

		// We need to add our own class so we won't have to worry about rules
		// being applied to the nested children of our blocks.
		[ `stk--block-align-${ attributes.uniqueId }` ]:
			attributes.rowAlign || attributes.rowAlign || attributes.rowAlign ||
			attributes.innerBlockVerticalAlign || attributes.innerBlockVerticalAlignTablet || attributes.innerBlockVerticalAlignMobile,
	} )

	return innerBlocksClass
}