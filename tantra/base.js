import { BYTE, WORD, DWORD, SHORT, INT, STRING, INT64, __INT64, FLOAT, STRUCT } from '../core/struct.js'

///////////////////////////////////// MESSAGE HEADERS
export const 
	S_MSG_HEADER = STRUCT({
		wType			: WORD,
		wSeq			: WORD,
		wPDULength		: WORD,
		wDummy			: WORD,
		dwClientTick	: DWORD  
	}),
	
	S_MSG_STANDARD = STRUCT({
		nID		: INT
	}),
	
	S_MSG_STANDARDPARM = STRUCT({
		nID		: INT,
		Parm	: INT
	}),
	
	S_MSG_STANDARDPARM2 = STRUCT({
		nID		: INT,
		Parm1	: INT,
		Parm2	: INT
	}),
	
	S_MSG_STANDARDPARM3 = STRUCT({
		nID		: INT,
		Parm1	: INT,
		Parm2	: INT,
		Parm3	: INT
	})
	
