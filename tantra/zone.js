/// Zone Server

import { DATAPATH, SERVERHOST, BASEPORT } from './config.js'
import { MIXIN } from './core.js'

import { TServer } from './socket.js'
import { TMap } from './map.js'

import { CUser } from './user.js'

//==================================================================
class CZone extends MIXIN(TServer, TMap) {
//==================================================================
	static CLIENT = CUser
	
	zone_id = 0
	port = 0
	
	constructor({id}) {
		super({id})
		this.tag = `Z[${id}]` 
		this.zone_id = id
		this.port = BASEPORT + id
	}
	
	reboot() {
		this.init_map()
		return this.listen(this.port, SERVERHOST)
	}
	
	/// Timers
	async process_sec_timer() {
	}
}


export { CZone }