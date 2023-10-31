import net from 'node:net'

const INITCODE = 0x1f44f321

//==================================================================
const TServer = base => class extends base {
//==================================================================
	constructor(arg) {
		super(arg)
		this.info('TSERVER init()', arg)
	}
}

export { TServer }
