/**
 * BLOCK: Icon Label Block
 */
/**
 * External dependencies
 */
import { VideoPopupIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

export const settings = {
	...metadata,
	icon: VideoPopupIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
	},

	edit,
	save,
}