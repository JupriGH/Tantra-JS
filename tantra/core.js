class CLog { 
	tag = `[${this.constructor.name}]`

	log	= (... args) => console.log(new Date().toLocaleTimeString('en-GB'), this.tag, ... args) // toLocaleString
	info = (... args) => this.log('👉', ... args)
	error = (... args) => this.log('❌', ... args)
	warn = (... args) => this.log('⚠️', ... args)
}

const MIXIN = (... features) => {
	var base = CLog
	for (var f of features) base = f(base)
	return base
}

export { MIXIN }