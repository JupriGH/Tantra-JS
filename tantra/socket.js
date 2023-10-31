import net from 'node:net'

const INITCODE = 0x1f44f321

//==================================================================
const TServer = base => class extends base {
//==================================================================
	socket = null
	
	constructor({id}) {
		super({id})
		this.info('TSERVER init()', id)
		
		var server = this.socket = net.Server()
		server.on('connection', this.on_connect)
	}
	
	listen = (... args) => new Promise(resolve => {
		var server = this.socket
		server.on('listening', () => {
			this.log('listening', server.address())
			resolve(this)
		})
		server.listen(...args)
	})
	
	on_connect = client_socket => {
	}
}

export { TServer }
