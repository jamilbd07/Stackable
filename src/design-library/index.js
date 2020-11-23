/**
 * External dependencies
 */
import {
	uniq, first, last, startCase, values,
} from 'lodash'
import { i18n } from 'stackable'

/**
 * Wordpress dependencies
 */
import domReady from '@wordpress/dom-ready'
import apiFetch from '@wordpress/api-fetch'
import { __, sprintf } from '@wordpress/i18n'

let designLibrary = null
let blockDesigns = {}
let designs = []

export const getBlockName = block => block.replace( /^[\w-]+\//, '' )

export const fetchDesignLibrary = async ( forceReset = false ) => {
	if ( ! designLibrary || forceReset ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_design_library${ forceReset ? '/reset' : '' }`,
			method: 'GET',
		} )
		designLibrary = await results

		// Reset all designs that we already have cached.
		if ( forceReset ) {
			blockDesigns = {}
			designs = []
		}
	}
	return designLibrary
}

export const fetchBlockDesigns = async block => {
	const blockName = getBlockName( block )
	if ( ! blockDesigns[ blockName ] ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_block_designs/${ blockName }`,
			method: 'GET',
		} )
		blockDesigns[ blockName ] = await results
	}
	return blockDesigns[ blockName ]
}

export const fetchDesign = async designId => {
	if ( ! designs[ designId ] ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_design/${ designId }`,
			method: 'GET',
		} )
		designs[ designId ] = await results
	}
	return designs[ designId ]
}

export const setDevModeDesignLibrary = async ( devMode = false ) => {
	const results = await apiFetch( {
		path: `/wp/v2/stk_design_library_dev_mode/`,
		method: 'POST',
		data: {
			devmode: devMode,
		},
	} )
	return await results
}

domReady( () => {
	// Save the option to not show the video again.
	// fetchDesignLibrary()
} )

export const getUIKits = async ( {
	mood: isMood = '',
	plan: isPlan = '',
	colors: hasColors = [],
	style: hasStyle = '',
	search = '',
	reset = false,
} ) => {
	const _library = {}

	let library = Object.values( await fetchDesignLibrary( reset ) )

	if ( isPlan ) {
		library = library.filter( ( { plan } ) => plan === isPlan )
	}

	library.forEach( style => {
		const {
			categories, image, plan, colors, mood, tags,
		} = style

		if ( ! _library[ last( categories ) ] ) {
			_library[ last( categories ) ] = {
				colors,
				count: 1,
				mood: [ mood ],
				image,
				label: startCase( last( categories ) ),
				tags,
				category: last( categories ),
				categories,
				description: sprintf( __( '%s Block Design', i18n ), 1 ),
				plan,
				blockList: [ style ],
			}
		} else {
			const { count, blockList } = _library[ last( categories ) ]
			_library[ last( categories ) ].count = count + 1
			_library[ last( categories ) ].description = sprintf( __( '%s Block Designs', i18n ), count + 1 )
			_library[ last( categories ) ].colors = uniq( [ ..._library[ last( categories ) ].colors, ...colors ] )
			_library[ last( categories ) ].categories = uniq( [ ..._library[ last( categories ) ].categories, ...categories ] )
			_library[ last( categories ) ].mood = uniq( [ ..._library[ last( categories ) ].mood, mood ] )
			_library[ last( categories ) ].tags = uniq( [ ..._library[ last( categories ) ].tags, ...tags ] )
			_library[ last( categories ) ].blockList = [ ...blockList, style ]
		}
	} )

	library = values( _library )

	if ( isMood ) {
		library = library.filter( ( { mood } ) => mood === isMood )
	}

	if ( hasColors && hasColors.length ) {
		library = library.filter( ( { colors } ) => colors.some( color => hasColors.includes( color ) ) )
	}

	if ( hasStyle !== '' ) {
		library = library.filter( ( { categories } ) => categories.some( category => hasStyle === category ) )
	}

	if ( search ) {
		const terms = search.toLowerCase().replace( /\s+/, ' ' ).trim().split( ' ' )

		// Every search term should match a property of a design.
		terms.forEach( searchTerm => {
			const searchTermRegExp = new RegExp( `^${ searchTerm }` )
			library = library.filter( design => {
				// Our search term needs to match at least one of these properties.
				return [ 'label', 'plan', 'tags', 'categories', 'colors' ].some( designProp => {
					// Search whether the term matched.
					if ( Array.isArray( design[ designProp ] ) ) {
						return design[ designProp ]?.some( item => item.toString().toLowerCase().match( searchTermRegExp ) )
					}

					return design[ designProp ]?.toLowerCase().indexOf( searchTerm ) !== -1
				} )
			} )
		} )
	}

	return library
}

export const getDesigns = async ( {
	type: isType = '',
	block: isBlock = '',
	mood: isMood = '',
	plan: isPlan = '',
	colors: hasColors = [],
	categories: hasCategories = [],
	search = '',
	reset = false,
} ) => {
	let library = Object.values( await fetchDesignLibrary( reset ) )

	if ( isType ) {
		library = library.filter( ( { type } ) => type === isType )
	}

	if ( isBlock ) {
		const blockName = isBlock.indexOf( 'ugb/' ) === -1 ? `ugb/${ isBlock }` : isBlock
		library = library.filter( ( { block } ) => block === blockName )
	}

	if ( isMood ) {
		library = library.filter( ( { mood } ) => mood === isMood )
	}

	if ( isPlan ) {
		library = library.filter( ( { plan } ) => plan === isPlan )
	}

	if ( hasColors && hasColors.length ) {
		library = library.filter( ( { colors } ) => colors.some( color => hasColors.includes( color ) ) )
	}

	if ( hasCategories && hasCategories.length ) {
		library = library.filter( ( { categories } ) => categories.some( category => hasCategories.includes( category ) ) )
	}

	if ( search ) {
		const terms = search.toLowerCase().replace( /\s+/, ' ' ).trim().split( ' ' )

		// Every search term should match a property of a design.
		terms.forEach( searchTerm => {
			const searchTermRegExp = new RegExp( `^${ searchTerm }` )
			library = library.filter( design => {
				// Our search term needs to match at least one of these properties.
				return [ 'label', 'plan', 'block', 'tags', 'categories', 'colors' ].some( designProp => {
					// Search whether the term matched.
					if ( Array.isArray( design[ designProp ] ) ) {
						return design[ designProp ]?.some( item => item.toString().toLowerCase().match( searchTermRegExp ) )
					}

					return design[ designProp ]?.toLowerCase().indexOf( searchTerm ) !== -1
				} )
			} )
		} )
	}

	library = library.map( design => ( { ...design, description: sprintf( __( '%s UI Kit', i18n ), startCase( last( design.categories ) ) ) } ) )

	return library
}

export const getDesign = async designId => {
	const library = await fetchDesignLibrary()

	const meta = library[ designId ]
	const {
		type, block, template,
	} = meta

	// We have a unified list of all designs per block, look there first to save of fetch time.
	if ( type === 'block' && block ) {
		const blockDesigns = await fetchBlockDesigns( block )
		return blockDesigns[ designId ]

	// Every design has their own template file which contains the entire design, get that.
	} else if ( template ) {
		return await fetchDesign( designId )
	}

	return null
}

/**
 * Gets the list of blocks available in the design library.
 */
export const getAllBlocks = async () => {
	const library = Object.values( await fetchDesignLibrary() )

	return library.reduce( ( blocks, design ) => {
		const { block, type } = design
		if ( ! blocks.includes( block ) && type === 'block' ) {
			blocks.push( block )
		}
		return blocks
	}, [] )
}

/**
 * Gets the list of categories available in the design library.
 */
export const getAllCategories = async () => {
	const library = Object.values( await fetchDesignLibrary() )

	return uniq( library.reduce( ( categories, designs ) => {
		const { categories: _categories } = designs
		// Only get the first index.
		return [ ...categories, first( _categories ) ]
	}, [] ) )
}
