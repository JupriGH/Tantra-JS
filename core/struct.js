const
	_SIZE 	= 0,
	_PACK	= 1,
	_SIGN	= 2,
	_LIST	= 3,
	_POS	= 4,
	_GET 	= 5,
	_SET	= 6,
	_ARR	= 7 // DataView (TypedArray)


const TYPEDEF_PROXY = {
	get: (target, name, recv) => {
		
		if (name === '__target__') 	return target
		//if (name === '__size__')
		if (name === 'prototype') 	return target.prototype
		
		// strict mode
		throw `TYPEDEF_PROXY.get(): ${name}`
		//return Reflect.get(target, name, recv)
	}		
}

const TYPEDEF = c => { // c => config
	var { prototype: r } = Buffer

	if (true) 
	switch(c[_SIZE]) {
	case 1:
			switch (c[_SIGN]) {
			case 0: case 1: // CHAR, BYTE
				c[_ARR] = c[_SIGN] ? Int8Array : Uint8Array
				c[_GET] = c[_SIGN] ? r .readInt8 : r .readUInt8
				c[_SET] = c[_SIGN] ? r.writeInt8 : r.writeUInt8				
				break
			case 2: // STRING
				break
			default:
				throw `TYPEDEF: invalid sign (1)`
			}
			break
	case 2: // WORD, SHORT
			c[_ARR] = c[_SIGN] ? Int16Array : Uint16Array
			c[_GET] = c[_SIGN] ? r .readInt16LE	: r .readUInt16LE
			c[_SET] = c[_SIGN] ? r.writeInt16LE : r.writeUInt16LE
			break
	case 4:
			switch (c[_SIGN]) {
			case 0: case 1: // DWORD, INT
				c[_ARR] = c[_SIGN] ? Int32Array : Uint32Array
				c[_GET] = c[_SIGN] ? r .readInt32LE	: r .readUInt32LE
				c[_SET] = c[_SIGN] ? r.writeInt32LE : r.writeUInt32LE
				break
			case 3: // FLOAT
				c[_ARR] = Float32Array
				c[_GET] = r.readFloatLE
				c[_SET] = r.writeFloatLE			
				break
			default:
				throw `TYPEDEF: invalid sign (4)`
			}
			break
	case 8:
			switch (c[_SIGN]) {
			case 0: case 1: // BIGUINT, BIGINT
				c[_ARR] = c[_SIGN] ? BigInt64Array : BigUint64Array
				c[_GET] = c[_SIGN] ? r .readBigInt64LE : r .readBigUInt64LE
				c[_SET] = c[_SIGN] ? r.writeBigInt64LE : r.writeBigUInt64LE
				break
			case 4: // DOUBLE
				c[_ARR] = Float64Array
				c[_GET] = r.readDoubleLE
				c[_SET] = r.writeDoubleLE			
				break
			default:
				throw `TYPEDEF: invalid sign (8)`
			}	
			break
	default:
			throw `TYPEDEF: invalid size => ${c[_SIZE]}`
	}

	return new Proxy(c, TYPEDEF_PROXY)
}

const STRUCT_PROXY = {	
	get (target, name, recv) {
		var { constructor } = target, { __item__ } = constructor
		if (__item__.hasOwnProperty(name)) {
			var { __source__ } = target // buffer
			
			var c = __item__[name]

			if (false) { 
				// STRING
			} else if (false) { 
				// STRUCT
			} else { 
				// NUMBER
				if (c[_LIST]) {
					throw 'STRUCT_PROXY.get(): TODO'
				} else {
					return c[_GET].call(__source__, c[_POS])
				}
			}
		
		} else if (name in target) {
			return Reflect.get(...arguments)
			
		} else {
			throw `STRUCT_PROXY.get(): invalid attribute => ${name}`
		}

		//console.log('### STRUCT_PROXY.get()', name, target)
		//return Reflect.get(...arguments)
	},
	
	set (target, name, value, recv) {
		var { constructor } = target, { __item__ } = constructor
		if (__item__.hasOwnProperty(name)) {
			var { __source__ } = target // buffer

			var c = __item__[name]
			
			if (false) { 
				// STRING
			} else if (false) { 
				// STRUCT
			} else { 
				// NUMBER
				if (c[_LIST]) {
					throw 'STRUCT_PROXY.set(): TODO'
				} else {
					c[_SET].call(__source__, value, c[_POS])
				}
			}
		} else {
			throw `STRUCT_PROXY.set(): invalid attribute => ${name}`
		}
		return true
	}
}

class STRUCT_BASE {
	__source__ = null // buffer
	
	constructor(value) {
		var prox = new Proxy(this, STRUCT_PROXY)
		
		if (value) {
			if (value instanceof Buffer) {
				// view only
				this.__source__ = value
			} else {
				// allocate buffer, create copy of value
				this.__source__ = Buffer.alloc(this.constructor.__size__)
				if (value.constructor === Object)
					Object.assign(prox, value)
				else {
					console.log('### VALUE', value)
					throw 'STRUCT_BASE(): TODO => initialize()'
				}
			}
		}
		return prox
	}
	
	get __dump() {
		var { constructor } = this, { __item__ } = constructor
		
		return Object.fromEntries( Object.entries(__item__).map( e => {
				var v = this[e[0]]
				
				if (v instanceof STRUCT_BASE)
					e[1] = v.__dump
				
				//else if (is_array(v))
				//	e[1] = v.map(o => is_struct(o) ? o.__dump : o)
				
				//else if (util.types.isTypedArray(v))
				//	e[1] = Array.from(v)
		
				else
					e[1] = v					
				return e
			})
		)	
	}
}

const STRUCT = (item, pack=4) => {
	var o = 0 // size
	var m = 0 // max pack
	var p = 0 
	var s = 0
	
	for (var [n,t] of Object.entries(item)) {
	
		var c = t.__target__.slice()
		
		s = c[_SIZE]
		
		if (false) {
			
		} else if (s)  {
			p = c[_PACK]
		}
		
		if (p > pack) 	p = pack
		if (p > m) 		m = p
		
		while (o % p) ++o
		
		c[_POS] = o
		c[_LIST] ||= 0
		
		o += s * (c[_LIST]||1)
		
		item[n] = c 
	}
	
	return new Proxy(class extends STRUCT_BASE {
		static __item__ = item
		static __size__ = o
		static __pack__ = m
	}, TYPEDEF_PROXY)
}
	
/**
[size/struct, pack-size, sign]
sign: 
	0 = unsigned
	1 = signed
	2 = string
	3 = float
	4 = double
**/
const 
	BYTE 	= TYPEDEF([1, 1, 0]), 
	WORD 	= TYPEDEF([2, 2, 0]),
	DWORD 	= TYPEDEF([4, 4, 0]),
	SHORT 	= TYPEDEF([2, 2, 1]),
	INT   	= TYPEDEF([4, 4, 1]),
	FLOAT	= TYPEDEF([4, 4, 3]),
	INT64 	= TYPEDEF([8, 8, 0]),
	__INT64 = TYPEDEF([8, 4, 0]),
	STRING	= TYPEDEF([1, 1, 2])

export {
	BYTE, WORD, DWORD, SHORT, INT, FLOAT, INT64, __INT64, STRING,
	STRUCT
}

/**
var S_MSG_HEADER = STRUCT({
		wType			: WORD,
		wSeq			: WORD,
		wPDULength		: WORD,
		wDummy			: WORD,
		dwClientTick	: DWORD  
	})
	

var test = new S_MSG_HEADER({wType: 200})

console.log(test)

console.log(test.wType)

throw 'OK'
**/