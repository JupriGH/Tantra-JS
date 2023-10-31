import { MIXIN } from '../core/core.js'
import { TClient } from './socket.js'

//==================================================================
class CUser extends MIXIN(TClient) {
//==================================================================
	constructor({server, ...args}) {
		super({server, ...args})
	}
}

export { CUser }