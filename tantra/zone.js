/// Zone Server

import { DATAPATH, SERVERHOST, BASEPORT } from './config.js'
import { MIXIN } from './core.js'

import { TServer } from './socket.js'
import { TMap } from './map.js'

//==================================================================
class CZone extends MIXIN(TServer, TMap) {
//==================================================================
	zone_id = 0
	port = 0
	
	constructor({id}) {
		super()
		this.tag = `Z[${id}]` 
		this.zone_id = id
		this.port = BASEPORT + id
	}
	
	reboot() {
	}
	
	/// Timers
	async process_sec_timer() {
	}
}


export { CZone }