//==================================================================
const TMap = base => class extends base {
//==================================================================
	max_gridX		= 1024
	max_gridY		= 1024
	half_grid		= 48
	
	constructor(arg) {
		super(arg)
		this.info('TMAP init()', arg)
	}
}

export { TMap }
