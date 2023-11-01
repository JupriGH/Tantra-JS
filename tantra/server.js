import { CZone } from './zone.js'

const ZONELIST = {}
const TICKSIZE = 250
const SECSTANDINGBY = 8

/// Timers
export var 
	CurrentTime	= 0,
	SecCounter 	= 0,
	//RST_2		= 0,
	//RST_4		= 0,
	RST_8 		= 0,
	RST_16		= 0,
	//Div16		= 0,
	RST_32		= 0,
	//Div32		= 0,
	RST_64		= 0,
	DIV_64		= 0,
	RST_128		= 0,
	//DIV_128	= 0,
	//RST_256	= 0,
	//DIV_256	= 0,
	RST_512		= 0,
	DIV_STANDBY	= 0
	
/*===========================================================
	Main
===========================================================*/
var zone_iter = []

const process_timers = () => {
	CurrentTime = ~~ (process.uptime() * 1000) // timeGetTime
	SecCounter = (SecCounter+1) & 0xFFFFFFFF

	//Rst2	=	(SecCounter&0x01);			// SecCounter%2
	//RST_4		= (SecCounter & 0x03)		// SecCounter%4
	RST_8		= (SecCounter & 0x07)		// SecCounter%8
	RST_16		= (SecCounter & 0x0F)		// SecCounter%16
	//Div16		= (SecCounter>>4);			// SecCounter/16
	RST_32		= (SecCounter & 0x1F)		// SecCounter%32
	//var Div32	= (SecCounter>>5);			// SecCounter/32
	RST_64		= (SecCounter & 0x3F)		// SecCounter%64
	DIV_64		= (SecCounter >> 6)			// SecCounter/64		
	RST_128		= (SecCounter & 0x7F)		// SecCounter%128
	//Div128	= (SecCounter>>7)			// SecCounter/128
	//Rst256	= (SecCounter&0xFF);		// SecCounter%256
	//Div256	= (SecCounter>>8);			// SecCounter/256
	RST_512		= (SecCounter & 0x01FF) 	// SecCounter/512
	DIV_STANDBY = SecCounter % SECSTANDINGBY
	
	///
	/// if (RST_512 === 0) RentalStore.check_rental_store() /// (512 / 4 / 60) = 2.1333333333333333 minute
		
	//console.time('process_sec_timer')
	return Promise.all(zone_iter.map(zone => zone.process_sec_timer()))
	//console.timeEnd('process_sec_timer')	
}

const serverSecret = CZone.SECRET

const addZone = (zone_id, host, port) => {
	if (zone_id in ZONELIST) throw `Zone "${zone_id}" already exists!`
	return ZONELIST[zone_id] = new CZone({id:zone_id, host, port})
} 

const startServer = () => {
	zone_iter.length = 0
	zone_iter.push(... Object.values(ZONELIST))
	
	return Promise.all(zone_iter.map(zone => zone.reboot())).then(() => {
		console.log('*** Processing timers ...')
		setInterval(process_timers, TICKSIZE)	
	})
}

export { addZone, serverSecret, startServer }