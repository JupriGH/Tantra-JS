//==================================================================
const TMap = base => class extends base {
//==================================================================
	// defaults
	max_gridX		= 1024
	max_gridY		= 1024
	half_grid		= 48
	
	constructor({id}) {
		super({id})
		this.info('TMAP init()', id)
	}
	
	init_map() {
		this.log('initializing MAP ...')
	}
}

export { TMap }
