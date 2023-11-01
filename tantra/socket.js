import net from 'node:net'
import { MIXIN } from '../core/core.js'
import { S_MSG_HEADER } from './base.js'

const INITCODE = 0x1f44f321
const HEADER_SIZE = 12
const KEYWORDS = Buffer.alloc(2048) // new Uint8Array(2048) // which is faster ? 

//==================================================================
const TClient = base => class extends base { 
//==================================================================
	static SECRET = KEYWORDS

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
		var kFlag 	= this.recv_sum & 1 // % 2
		var	pos 	= this.recv_seq
		var sum 	= 0
		var u 		= data.length

		for	(var i = 12; i < u; ++i) {

			var trans = KEYWORDS[(pos++ & 0x3FF) << 1 | kFlag]		
			var mod = (i & 3)
			
				 if (mod === 0) data[i] -= (trans << 2) 
			else if (mod === 1) data[i] += (trans >> 1)
			else if (mod === 2) data[i] -= (trans << 1)
			else if (mod === 3) data[i] += (trans >> 2)
	
			sum += data[i]
		}

		// return packet, even check_sum not match
		sum &= 0xFF
		if	(sum !== data[3]) {
			this.error('decode(): checksum mismatch =>', 
				'seq:', this.recv_seq, 
				'sum:', sum.toString(16), data[3].toString(16), 
				data
			)
		}

		this.recv_sum = data[3]
		this.recv_seq = (++ this.recv_seq) & 0xFF // 0xFF // BYTE		
	}
	encode_message(data) {
	}
	
	// HANDLERS
	
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
			if ((data.length - pos) < HEADER_SIZE) break // to short ...
			
			var m_base = pos
			var m_head = new S_MSG_HEADER(data.slice(pos, pos += HEADER_SIZE))
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

	// IMPLEMENT THIS METHODS
	
	on_error() 	{ this.error('ERROR') }
	on_end() 	{ this.warn('END') }
	on_close() 	{ this.warn('CLOSE') }
	
	process_message = (code, tick, len, head, msg) => {
		this.debug('recv:', tick, code.toString(16), len, 'bytes', head.__dump, ... (msg ? ["\r\n", msg] : ['<empty>']) )
	}	
	
}
//==================================================================
const TServer = base => class extends base {
//==================================================================
	static CLIENT = MIXIN(TClient)
	static SECRET = KEYWORDS
	
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

export { KEYWORDS, TServer, TClient }
