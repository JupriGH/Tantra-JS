//==================================================================
const TMap = base => class extends base {
//==================================================================
	// defaults
	max_gridX		= 1024
	max_gridY		= 1024
	half_grid		= 48
	
	constructor({id}) {
		super({id})
	}
	
	init_map() {
		this.info('initializing MAP ...')
	}
}

export { TMap }
