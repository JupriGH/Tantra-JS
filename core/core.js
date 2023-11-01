// Number
Number.prototype.parity = function() { var n = this; var p = 0; while (n) { if (n & 1) ++p; n >>= 1 }; return p }
Number.prototype.hex = function() { return this.toString(16) }

// TODO: optimize this
Buffer.prototype.WORD 	= Buffer.prototype.readUint16LE
Buffer.prototype.DWORD 	= Buffer.prototype.readUint32LE
Buffer.prototype.SHORT 	= Buffer.prototype.readInt16LE
Buffer.prototype.LONG 	= Buffer.prototype.readInt32LE

// Base of everything
class CLogger { 
	tag = `[${this.constructor.name}]`
	log = (... args) => console.log(new Date().toLocaleTimeString('en-GB'), this.tag, ... args) // toLocaleString
	info = (... args) => this.log('🟢', ... args)
	error = (... args) => this.log('🔴', ... args)
	fatal = (... args) => this.log('❌', ... args)
	warn = (... args) => this.log('🟡', ... args)
	debug = (... args) => this.log('🔵', ... args)
}

const MIXIN = (... features) => {
	var base = CLogger
	for (var f of features) base = f(base)
	return base
}

export { MIXIN }