import net from 'node:net'
import { MIXIN } from './core.js'

const INITCODE = 0x1f44f321

//==================================================================
const TSocket = base => class extends base { 
//==================================================================
	tag = `[${this.constructor.name}]`
	socket = null
	
	constructor(socket, server) {
		super()

		// socket.setNoDelay()
		socket.on('error', 	this.on_error.bind(this))
		socket.on('end',	this.on_end.bind(this))
		socket.on('close', 	this.on_close.bind(this))
		socket.on('data', 	this.on_data.bind(this))	

		this.socket = socket
	}
	on_error() {
		this.info('ERROR')
	}
	on_end() {
		this.info('END')
	}
	on_close() {
		this.info('CLOSE')
	}
	on_data() {
		this.info('DATA')
	}
}
//==================================================================
const TServer = base => class extends base {
//==================================================================
	static CLIENT = MIXIN(TSocket)
	
	tag = `[${this.constructor.name}]`
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
		var client = new this.constructor.CLIENT(socket, this)		
	}
}

export { TServer }
