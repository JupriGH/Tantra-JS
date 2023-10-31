import net from 'node:net'
import { MIXIN } from './core.js'
import { S_MSG_HEADER } from './base.js'

const INITCODE = 0x1f44f321

//==================================================================
const TClient = base => class extends base { 
//==================================================================
	tag 		= `[TClient]`
	socket 		= null

	init		= false // INITCODE status
	recv_buf	= null
	recv_seq 	= 0
	recv_sum	= 0

	send_buf	= Buffer.alloc(32*1024) // 32Kb
	send_seq	= 0
	send_sum	= 0
	send_pos	= 0
	
	constructor({socket, server}) {
		super({socket, server})

		// socket.setNoDelay()
		socket.on('error', 	this.on_error.bind(this))
		socket.on('end',	this.on_end.bind(this))
		socket.on('close', 	this.on_close.bind(this))
		socket.on('data', 	this.on_data.bind(this))	

		this.socket = socket
	}
	
	// DECODE & ENCODE IN-PLACE
	
	decode_message(data) {
	}
	encode_message(data) {
	}
	
	// HANDLERS
	
	on_error() {
		this.info('ERROR')
	}
	on_end() {
		this.info('END')
	}
	on_close() {
		this.info('CLOSE')
	}
	on_data = data => {
		// add previous bytes
		var tmp = this.recv_buf
		if (tmp && tmp.length) data = Buffer.concat([tmp, data])

		var pos = 0
		
		// initcode
		if (!this.init) {
			var code = data.DWORD(pos)
			
			// TODO: check init code!
			if (code === INITCODE)
				this.info('INITCODE: OK')		
			else
				this.error('INITCODE: ERROR')		

			this.init = true
			pos += 4
		}
		
		while (1) {
			if ((data.length - pos) < 12) break // to short ...
			
			var m_base = pos
			var m_head = new S_MSG_HEADER(data.slice(pos, pos += 12))
			var m_pmsg = pos
			var m_long = m_head.wPDULength	
			
			if ((data.length - m_pmsg) < m_long) break // to short ...

			pos += m_long
			
			this.decode_message(data.slice(m_base, pos))

			var code = m_head.wType			
			var tick = m_head.dwClientTick			
			var msg = m_long ? data.slice(m_pmsg, pos) : null

			this.process_message(code, tick, m_long, m_head, msg)
		}
		
		// store remaining bytes
		this.recv_buf = (data.length > pos) ? data.slice(pos) : null		
		
	}
}
//==================================================================
const TServer = base => class extends base {
//==================================================================
	static CLIENT = MIXIN(TClient)
	
	tag = `[TServer]`
	socket = null
	
	constructor({id}) {
		super({id})
		
		this.socket = net.Server()
		this.socket.on('connection', this.on_connect)
	}
	
	listen = (... args) => new Promise(resolve => {
		var { socket } = this
		socket.on('listening', () => {
			this.info('listening', socket.address())
			resolve(this)
		})
		socket.listen(...args)
	})
	
	on_connect = socket => {
		this.info('connection:', socket.remoteAddress, socket.remotePort)
		var client = new this.constructor.CLIENT({socket, server:this})		
	}
}

export { TServer, TClient }
