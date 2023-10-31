import net from 'node:net'

const INITCODE = 0x1f44f321

//==================================================================
const TServer = base => class extends base {
//==================================================================
	constructor({id}) {
		super({id})
		this.info('TSERVER init()', id)
	}
}

export { TServer }
