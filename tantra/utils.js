import fs from 'node:fs'

export const 
	fileexists = fs.existsSync,
	fileopen	= fs.openSync,
	fileclose	= fs.closeSync,
	fileread	= fs.readSync,
	filewrite	= fs.writeSync,
	filestat	= fs.statSync,
	filetrunc	= fs.truncateSync,
	fileload	= fs.readFileSync,
	filesave	= fs.writeFileSync,
	filestream	= fs.createReadStream

export const read_offset = (path, position, output) => {
	var fd = fileopen(path)
	var len = fileread(fd, output, { position })
	fileclose(fd)	
	// SYSLOG.log('*** Loading keywords:', path, 'offset', position.hex(), 'bytes', len)
}
