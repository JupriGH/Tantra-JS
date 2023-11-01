/// Zone Server
import { MIXIN } from '../core/core.js'
import { DATAPATH, SERVERHOST, BASEPORT } from './config.js'

import { TServer, KEYWORDS } from './socket.js'
import { TMap } from './map.js'

import { CUser } from './user.js'

//==================================================================
class CZone extends MIXIN(TServer, TMap) {
//==================================================================
	static CLIENT = CUser
	static SECRET = CUser.SECRET
	
	zone_id = 0
	host = SERVERHOST
	port = 0
	
	constructor({id, host, port}) {
		super({id})
		this.tag = `Z[${id}]` 
		this.zone_id = id
		
		if (host) this.host = host
		
		if (port) this.port = port
		else this.port = BASEPORT + id
	}
	
	reboot() {
		this.init_map()
		return this.listen(this.port, this.host)
	}
	
	/// Timers
	async process_sec_timer() {
	}
}


export { CZone }