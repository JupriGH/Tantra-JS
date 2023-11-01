import { MIXIN } from '../core/core.js'
import { TClient } from './socket.js'

//==================================================================
const TPlayer = base => class extends base {
//==================================================================
	is_pc = 1
	
	UserMode = 0 // USER_EMPTY
}

//==================================================================
class CUser extends MIXIN( // Glue all together
	TClient, 
	//TMob, 
	TPlayer
	//TFileDB, 
	//THelp, 
	//TQuest
) {
//==================================================================
	tag = '[USER]' // new connection
	
	constructor({server, ...args}) {
		super({server, ...args})
	}

	process_message = (code, tick, size, head, msg) => {
	
		if (code === 0x1831) { 
			this.warn('{{ PING }}') // CSP_CHAR_PING
		
		} else {
			
			var { UserMode } = this
			
			this.error('mode:', UserMode, 'recv:', tick, code.hex(), size)
		}
		
	}
}

export { CUser }