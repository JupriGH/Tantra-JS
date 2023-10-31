import assert from 'node:assert' 

import { TZone } from './zone.js'

const TICKSIZE 		= 250
const ZONELIST 		= {}

/// Main
var zone_iter = []

const process_timers = () => {
}

const addZone = zone_id => {
	assert (!(zone_id in ZONELIST), `Zone "${zone_id}" already exists!`)
	return ZONELIST[zone_id] = new TZone({zone_id})
}

const startServer = () => {
	zone_iter.length = 0
	zone_iter.push(... Object.values(ZONELIST))
	
	return Promise.all(zone_iter.map(zone => zone.reboot())).then(() => {
		console.log('*** Processing timers ...')
		setInterval(process_timers, TICKSIZE)	
	})
}

export { addZone, startServer }