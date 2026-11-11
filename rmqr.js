/**
	https://github.com/datalog/rmqr-generator
	under MIT license
	# rmqr.js dependency-free code
	Copyright (c) 2026 Constantine
*/

/**
	Rectangular Micro QR Code (rMQR), ISO/IEC 23941:2022.
*/

'use strict';

function rMQR( Q ) {

	var
	 qrVersion ,errorCorrectionLevel ,qrWidth ,qrHeight ,eciState ,totalBits
	,modules = []
	,max = Math.max ,min = Math.min ,abs = Math.abs
	,BASE64_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	,KANJI_DATA =
		 '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'

	,MODES = [
		 { /* byte mode: required fallback; do not remove. */
			 mbits: 3
			,flags: 1 /* count bytes. */
			,cbits: [
				   3 ,  4 ,  5 ,  5 ,  6      /* R7x */
				,  4 ,  5 ,  5 ,  6 ,  6      /* R9x */
				,  3 ,  5 ,  5 ,  6 ,  6 ,  7 /* R11x */
				,  4 ,  5 ,  6 ,  6 ,  7 ,  7 /* R13x */
				,  6 ,  6 ,  7 ,  7 ,  7      /* R15x */
				,  6 ,  6 ,  7 ,  7 ,  8      /* R17x */
			] /* character count bits; ISO Table 3. */
			,cost: function( c ) {

				return ( c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4 ) * 48;
			}
			,encode: function( text ) {

				text = encodeURI( text );

				for( var bits = [] ,length = text.length ,i = 0; i < length; i++ ) {
					if( "%" != text.charAt( i ) ) appendBits( charCode( text, i ), 8, bits );
					else {
						appendBits( parseInt( text.substr( i + 1, 2 ), 16 ), 8, bits );
						i += 2;
					}
				}

				return { numChars: bits.length / 8, bitData: bits };
			}
		}
		,{ /* alphanumeric mode. */
			 mbits: 2
			,cbits: [
				   3 ,  5 ,  5 ,  6 ,  6      /* R7x */
				,  5 ,  5 ,  6 ,  6 ,  7      /* R9x */
				,  4 ,  5 ,  6 ,  6 ,  7 ,  7 /* R11x */
				,  5 ,  6 ,  6 ,  7 ,  7 ,  8 /* R13x */
				,  6 ,  7 ,  7 ,  7 ,  8      /* R15x */
				,  6 ,  7 ,  7 ,  8 ,  8      /* R17x */
			] /* character count bits; ISO Table 3. */
			,prepare: function() {

				var charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:" ,table = [] ,i = charset.length;

				while( i-- ) table[ charCode( charset, i ) ] = i + 1;

				return table;
			}
			,cost: function( c, table ) { return table[ c ] ? 33 : Infinity; }
			,encode: function( text, table ) {

				for( var bits = [] ,length = text.length ,i = 0; i + 2 <= length; i += 2 )
					appendBits( 45 * getAlphanumericValue( text, i, table ) + getAlphanumericValue( text, i + 1, table ), 11, bits );
				if( i < length ) appendBits( getAlphanumericValue( text, i, table ), 6, bits );

				return { numChars: length, bitData: bits };
			}
		}
		,{ /* numeric mode. */
			 mbits: 1
			,cbits: [
				   4 ,  5 ,  6 ,  7 ,  7      /* R7x */
				,  5 ,  6 ,  7 ,  7 ,  8      /* R9x */
				,  4 ,  6 ,  7 ,  7 ,  8 ,  8 /* R11x */
				,  5 ,  6 ,  7 ,  7 ,  8 ,  8 /* R13x */
				,  7 ,  7 ,  8 ,  8 ,  9      /* R15x */
				,  7 ,  8 ,  8 ,  8 ,  9      /* R17x */
			] /* character count bits; ISO Table 3. */
			,cost: function( c ) { return c >= 48 && c <= 57 ? 20 : Infinity; }
			,encode: function( text ) {

				var bits = [] ,length = text.length ,i = 0 ,count;

				while( i < length ) {
					count = min( length - i, 3 );
					appendBits( parseInt( text.substr( i, count ), 10 ), 3 * count + 1, bits );
					i += count;
				}

				return { numChars: length, bitData: bits };
			}
		}
		,{ /* kanji mode. */
			 mbits: 4
			,flags: 2 /* incompatible with UTF-8 ECI. */
			,cbits: [
				   2 ,  3 ,  4 ,  5 ,  5      /* R7x */
				,  3 ,  4 ,  5 ,  5 ,  6      /* R9x */
				,  2 ,  4 ,  5 ,  5 ,  6 ,  6 /* R11x */
				,  3 ,  5 ,  5 ,  6 ,  6 ,  7 /* R13x */
				,  5 ,  5 ,  6 ,  6 ,  7      /* R15x */
				,  5 ,  6 ,  6 ,  6 ,  7      /* R17x */
			] /* character count bits; ISO Table 3. */
			,prepare: function() { /* one decoded table for all qr instances. */

				if( undefined === rMQR.kanjiLookup )
					rMQR.kanjiLookup = decodeKanjiTable( KANJI_DATA );

				return rMQR.kanjiLookup;
			}
			,cost: function( c, table ) { return undefined !== table[ c ] ? 78 : Infinity; }
			,encode: function( text, table ) {

				for( var bits = [] ,length = text.length ,i = 0; i < length; i++ )
					appendBits( table[ charCode( text, i ) ], 13, bits );

				return { numChars: length, bitData: bits };
			}
		}
	]

	,modeCount = MODES.length

	/* Version-indexed tables use ISO order R7x43 ... R17x139 (indices 0–31). */
	/* ISO Table 1: symbol height, excluding quiet zone. */
	,rmqr_height = [
				   7 ,  7 ,  7 ,  7 ,  7      /* R7x */
				,  9 ,  9 ,  9 ,  9 ,  9      /* R9x */
				, 11 , 11 , 11 , 11 , 11 , 11 /* R11x */
				, 13 , 13 , 13 , 13 , 13 , 13 /* R13x */
				, 15 , 15 , 15 , 15 , 15      /* R15x */
				, 17 , 17 , 17 , 17 , 17      /* R17x */
		]

	/* ISO Table 1: symbol width, excluding quiet zone. */
	,rmqr_width = [
				  43 , 59 , 77 , 99 ,139      /* R7x */
				, 43 , 59 , 77 , 99 ,139      /* R9x */
				, 27 , 43 , 59 , 77 , 99 ,139 /* R11x */
				, 27 , 43 , 59 , 77 , 99 ,139 /* R13x */
				, 43 , 59 , 77 , 99 ,139      /* R15x */
				, 43 , 59 , 77 , 99 ,139      /* R17x */
		]

	/* ISO Table 6: data capacity in 8-bit codewords; rows M, H. */
	,rmqr_data_codewords = [
			/* M */
			 [
				   6 , 12 , 20 , 28 , 44      /* R7x */
				, 12 , 21 , 31 , 42 , 63      /* R9x */
				,  7 , 19 , 31 , 43 , 57 , 84 /* R11x */
				, 12 , 27 , 38 , 53 , 73 ,106 /* R13x */
				, 33 , 48 , 67 , 88 ,127      /* R15x */
				, 39 , 56 , 78 ,100 ,152      /* R17x */
			]
			/* H */
			,[
				   3 ,  7 , 10 , 14 , 24      /* R7x */
				,  7 , 11 , 17 , 22 , 33      /* R9x */
				,  5 , 11 , 15 , 23 , 29 , 42 /* R11x */
				,  7 , 13 , 20 , 29 , 35 , 54 /* R13x */
				, 15 , 26 , 31 , 48 , 69      /* R15x */
				, 21 , 28 , 38 , 56 , 76      /* R17x */
			]
		]

	/* ISO Table 1: total 8-bit codewords, data + ECC. */
	,rmqr_total_codewords = [
				  13 , 21 , 32 , 44 , 68      /* R7x */
				, 21 , 33 , 49 , 66 , 99      /* R9x */
				, 15 , 31 , 47 , 67 , 89 ,132 /* R11x */
				, 21 , 41 , 60 , 85 ,113 ,166 /* R13x */
				, 51 , 74 ,103 ,136 ,199      /* R15x */
				, 61 , 88 ,122 ,160 ,232      /* R17x */
		]

	/* ISO Table 8: Reed–Solomon block count; rows M, H. */
	,rmqr_blocks = [
			/* M */
			 [
				   1 ,  1 ,  1 ,  1 ,  1      /* R7x */
				,  1 ,  1 ,  1 ,  1 ,  2      /* R9x */
				,  1 ,  1 ,  1 ,  1 ,  2 ,  2 /* R11x */
				,  1 ,  1 ,  1 ,  2 ,  2 ,  3 /* R13x */
				,  1 ,  1 ,  2 ,  2 ,  3      /* R15x */
				,  1 ,  2 ,  2 ,  3 ,  4      /* R17x */
			]
			/* H */
			,[
				   1 ,  1 ,  1 ,  1 ,  2      /* R7x */
				,  1 ,  1 ,  2 ,  2 ,  3      /* R9x */
				,  1 ,  1 ,  2 ,  2 ,  2 ,  3 /* R11x */
				,  1 ,  1 ,  2 ,  2 ,  3 ,  4 /* R13x */
				,  2 ,  2 ,  3 ,  4 ,  5      /* R15x */
				,  2 ,  2 ,  3 ,  4 ,  6      /* R17x */
			]
		]

	/* ISO Table D.1: alignment columns; width rows 43, 59, 77, 99, 139; 0 = unused. */
	,rmqr_table_d1 = [

				 [     21 ,  0 ,  0 ,  0  ]  /* width 43 */
				,[     19 , 39 ,  0 ,  0  ]  /* width 59 */
				,[     25 , 51 ,  0 ,  0  ]  /* width 77 */
				,[     23 , 49 , 75 ,  0  ]  /* width 99 */
				,[     27 , 55 , 83 ,111  ] /* width 139 */
		]

	,charCode = function( text, index ) {

		return text.charCodeAt( index );
	}

	,decodeBase64 = function( text ) { /* base64 to bytes; atob() decodes, btoa() encodes binary strings. */

		var
		 lookup = []
		,length = text.length
		,padding = '=' === text.charAt( length - 2 ) ? 2 : '=' === text.charAt( length - 1 ) ? 1 : 0
		,bytes = []
		,bits = 0 ,buffer = 0 ,i = 64;

		while( i-- ) lookup[ charCode( BASE64_CHARSET, i ) ] = i;

		for( i = 0; i < length - padding; i++ ) {
			buffer = buffer << 6 | lookup[ charCode( text, i ) ];
			bits += 6;
			if( bits >= 8 ) {
				bits -= 8;
				bytes.push( buffer >>> bits & 255 );
			}
		}

		return bytes;
	}

	,decodeKanjiTable = function( text ) { /* trusted embedded table; validated by tests. */

		var
		 bytes = decodeBase64( text )
		,length = bytes.length
		,table = []
		,offset = 0 ,index = 0 ,previous = - 1
		,token ,value ,step ,count ,encoded;

		function readInteger() { /* unsigned varint. */

			var result = 0 ,shift = 0 ,byte;

			do {
				byte = bytes[ offset++ ];
				result |= ( byte & 127 ) << shift;
				shift += 7;
			} while( byte & 128 );

			return result;
		}

		function readValue() { /* big-endian unicode value. */

			return bytes[ offset++ ] << 8 | bytes[ offset++ ];
		}

		while( offset < length ) {
			token = readInteger();
			if( 1 === token ) {
				index += readInteger();
				continue;
			}

			step = 0;
			count = 1;
			if( token >= 4 ) {
				encoded = token - 4;
				value = previous + ( ( encoded >>> 1 ) ^ - ( encoded & 1 ) ) & 65535;
			} else if( 0 === token ) value = readValue();
			else {
				value   = 2 === token ? readValue() : previous;
				encoded = readInteger();
				step    = ( encoded >>> 1 ) ^ - ( encoded & 1 );
				count   = readInteger();
				value   = 3 === token ? value + step & 65535 : value;
			}

			while( count-- ) {
				table[ value ] = index++;
				previous = value;
				value = value + step & 65535;
			}
		}

		if( 8192 !== index ) throw new Error( 'Incomplete kanji table' );

		/* These Shift JIS codes can decode to different Unicode characters in Windows-31J. */
		delete table[ 0x005c ];
		delete table[ 0x00a2 ];
		delete table[ 0x00a3 ];
		delete table[ 0x00ac ];
		delete table[ 0x2016 ];
		delete table[ 0x2212 ];
		delete table[ 0x301c ];

		return table;
	}

	,reedSolomonMultiply = function( x, y ) { /* gf(256) multiply, modulus 0x11d. */

		var z = 0, i = 8;

		while( i-- ) z = z << 1 ^ 285 * ( z >>> 7 ) ^ ( y >>> i & 1 ) * x;

		return z;
	}

	,reedSolomonComputeRemainder = function( data, divisor ) { /* reed-solomon remainder. */

		var result = [] ,length = data.length ,degree = divisor.length ,i = length ,j ,factor;

		while( i ) {
			factor = data[ length - i-- ] ^ result.shift();
			j = degree;

			while( j-- ) result[ j ] ^= reedSolomonMultiply( divisor[ j ], factor );
		}

		return result;
	}


	,appendBits = function( value, length, bits ) { /* most significant bit first. */

		while( length-- ) bits.push( value >>> length & 1 );
	}


	,getAlphanumericValue = function( text, index, table ) {

		return table[ charCode( text, index ) ] - 1;
	}

	,toCodePoints = function( text ) { /* validate utf-16 and collect unicode code points. */

		if( 'string' !== typeof text ) throw new TypeError( 'Expected text string' );

		var result = [] ,length = text.length ,c ,low;

		for( var i = 0; i < length; i++ ) {
			c = charCode( text, i );
			if( c >= 0xD800 && c <= 0xDBFF && i + 1 < length ) {
				low = charCode( text, i + 1 );
				if( low >= 0xDC00 && low <= 0xDFFF ) {
					c = 0x10000 + ( c - 0xD800 ) * 1024 + low - 0xDC00;
					i++;
				}
			}

			if( c >= 0xD800 && c <= 0xDFFF ) throw new RangeError( 'Invalid UTF-16 string' );
			result.push( c );
		}

		return result;
	}

	,fromCodePoints = function( points, start, end ) {

		var result = '' ,c;

		for( var i = start; i < end; i++ ) {
			c = points[ i ];
			if( c < 65536 ) result += String.fromCharCode( c );
			else {
				c -= 65536;
				result += String.fromCharCode( 0xD800 + ( c >>> 10 ), 0xDC00 + ( c & 1023 ) );
			}
		}

		return result;
	}



	,computeSegments = function( points, modeCosts, version ) { /* find boundaries and exact bit cost. */

		var
		 length = points.length
		,costs = [ [ 0 ], [ 11 ], [ 11 ] ] /* default, Shift JIS (ECI 20), UTF-8 (ECI 26). */
		,history = [ [], [], [] ] ,prefix = [] ,previous = [ 0 ]
		,start ,mode ,selected ,countBits ,limit ,head ,end ,point ,cost ,payload
		,state ,states ,sjis ,utf8 ,total ,i ,isByte ,characterCosts ,step;

		i = length + 1;
		while( --i ) costs[ 0 ][ i ] = costs[ 1 ][ i ] = costs[ 2 ][ i ] = Infinity;

		for( start = 0; start < length; start++ ) {
			/* Only the two explicit ECI states can switch to each other. */
			sjis = costs[ 1 ][ start ];
			utf8 = costs[ 2 ][ start ];
			prefix[ 0 ] = costs[ 0 ][ start ];
			prefix[ 1 ] = min( sjis, utf8 + 11 );
			prefix[ 2 ] = min( utf8, sjis + 11 );
			previous[ 1 ] = prefix[ 1 ] < sjis ? 2 : 1;
			previous[ 2 ] = prefix[ 2 ] < utf8 ? 1 : 2;

			mode = modeCount;
			while( mode-- ) {
				selected = MODES[ mode ];
				characterCosts = modeCosts[ mode ];
				payload = 0;
				countBits = selected.cbits[ version ];
				head = 3 + countBits;
				limit = 1 << countBits;
				isByte = selected.flags & 1;
				states = selected.flags & 2 ? 3 : 7; /* bits: default = 1, Shift JIS = 2, UTF-8 = 4. */
				step = ( start * modeCount + mode ) * 3;

				for( end = start + 1; end <= length; end++ ) {
					cost = characterCosts[ end - 1 ];
					if( Infinity === cost ) break;
					payload += cost; /* sixths of a bit; round once for the whole segment. */
					if( ( isByte ? payload / 48 : end - start ) >= limit ) break;
					if( isByte ) {
						point = points[ end - 1 ];
						if( point >= 128 ) states = 4;
						else if( 0x5c === point || 0x7e === point ) states &= ~2; /* yen and overline in JIS X 0201. */
					}
					cost = head + ( ( payload + 5 ) / 6 | 0 );

					state = 3;
					while( state-- ) {
						if( !( states & ( 1 << state ) ) ) continue;
						total = prefix[ state ] + cost;
						if( total < costs[ state ][ end ] ) {
							costs[ state ][ end ] = total;
							history[ state ][ end ] = step + previous[ state ];
						}
					}
				}
			}
		}

		eciState = 0;
		state = 3;
		while( --state ) if( costs[ state ][ length ] < costs[ eciState ][ length ] ) eciState = state;
		totalBits = costs[ eciState ][ length ];
		if( Infinity === totalBits ) throw new RangeError( 'Input cannot be encoded in the selected mode' );
		return history;
	}

	,splitIntoSegments = function( points, history, modeData ) { /* restore segments in reverse order. */

		var result = [] ,end = points.length ,state = eciState
		,start ,step ,previous ,mode ,selected ,segment;

		while( end > 0 ) {
			step = history[ state ][ end ];
			previous = step % 3;
			step = step / 3 | 0;
			start = step / modeCount | 0;
			mode = step % modeCount;
			selected = MODES[ mode ];
			segment = selected.encode( fromCodePoints( points, start, end ), modeData[ mode ] );
			segment.mbits = selected.mbits;
			segment.cbits = selected.cbits;
			if( state && ( !start || state !== previous ) ) segment.eci = 1 === state ? 20 : 26;
			result.push( segment );
			state = previous;
			end = start;
		}
		return result;
	}

	,addEccAndInterleave = function( data ) { /* append ECC and interleave blocks. */

		var
		 count = rmqr_blocks[ errorCorrectionLevel ][ qrVersion ]
		,total = rmqr_total_codewords[ qrVersion ]
		,degree = ( total - data.length ) / count
		,short = data.length / count | 0
		,shortCount = count - data.length % count
		,blocks = [] ,divisor = [] ,result = []
		,offset = 0 ,rootPower = 1 ,i = degree ,j ,length ,block ,ecc;

		divisor[ degree - 1 ] = 1;
		while( i-- ) {
			for( j = 0; j < degree; j++ )
				divisor[ j ] = reedSolomonMultiply( divisor[ j ], rootPower ) ^ divisor[ j + 1 ];
			rootPower = reedSolomonMultiply( rootPower, 2 );
		}

		for( i = 0; i < count; i++ ) {
			block = data.slice( offset, offset + short + ( i < shortCount ? 0 : 1 ) );
			offset += block.length;
			ecc = reedSolomonComputeRemainder( block, divisor );
			if( i < shortCount ) block.push( 0 ); /* align ECC in short blocks. */
			blocks.push( block.concat( ecc ) );
		}

		for( i = 0, length = blocks[ 0 ].length; i < length; i++ )
			for( j = 0; j < count; j++ )
				if( i !== short || j >= shortCount ) result.push( blocks[ j ][ i ] );

		if( result.length !== total ) throw new Error( 'Internal codeword count mismatch' );
		return result;
	}

	,formatBits = function( data ) { /* BCH(18,6). */

		var rem = data << 12 ,i = 18;

		while( i-- > 12 )
			if( rem >>> i & 1 ) rem ^= 0x1f25 << ( i - 12 );

		return data << 12 | rem;
	}

	,encodeMatrix = function( data ) {

		function set( x, y, value ) {

			cells[ y ][ x ] = +!!value;
			reserved[ y ][ x ] = true;
		}

		var
		 w = qrWidth ,h = qrHeight
		,cells = modules ,reserved = [] ,codewords = addEccAndInterleave( data )
		,widths = [ 43, 59, 77, 99, 139 ] ,alignment = []
		,edges = [ 1, 2, h - 3, h - 2 ]
		,bit = 0 ,up = true ,x ,y ,i ,j ,cx ,rawFormat ,left ,right
		,rightX ,row ,dx ,value;

		for( y = 0; y < h; y++ ) {
			cells[ y ] = [];
			reserved[ y ] = [];
		}

		for( x = 0; x < w; x++ ) {
			set( x, 0, !( x % 2 ) );
			set( x, h - 1, !( x % 2 ) );
		}
		for( y = 0; y < h; y++ ) {
			set( 0, y, !( y % 2 ) );
			set( w - 1, y, !( y % 2 ) );
		}

		for( y = 0; y < 7; y++ )
			for( x = 0; x < 7; x++ ) set( x, y, 2 !== max( abs( x - 3 ), abs( y - 3 ) ) );

		for( y = 0; y < 5; y++ )
			for( x = 0; x < 5; x++ ) set( w - 5 + x, h - 5 + y, 1 !== max( abs( x - 2 ), abs( y - 2 ) ) );

		set( 0, h - 2, 1 );
		set( 1, h - 2, 0 );
		set( 1, h - 1, 1 );
		set( w - 2, 0, 1 );
		set( w - 2, 1, 0 );
		set( w - 1, 1, 1 );

		for( y = 0; y < 7; y++ ) set( 7, y, 0 );
		if( h > 7 ) for( x = 0; x < 8; x++ ) set( x, 7, 0 );

		for( i = 0; i < widths.length; i++ )
			if( widths[ i ] === w ) alignment = rmqr_table_d1[ i ];

		for( i = 0; i < alignment.length; i++ ) {
			cx = alignment[ i ];
			if( !cx ) continue;
			for( y = 0; y < h; y++ ) set( cx, y, !( y % 2 ) );
			for( j = 0; j < 4; j++ ) {
				y = edges[ j ];
				set( cx - 1, y, 1 );
				set( cx + 1, y, 1 );
			}
		}

		rawFormat = formatBits( qrVersion | errorCorrectionLevel << 5 );
		left = rawFormat ^ 0x1fab2;
		right = rawFormat ^ 0x20a7b;
		for( i = 0; i < 18; i++ ) {
			set( 8 + ( i / 5 | 0 ), 1 + i % 5, left >>> i & 1 );
			set( i < 15 ? w - 8 + ( i / 5 | 0 ) : w - 5 + i - 15,
				i < 15 ? h - 6 + i % 5 : h - 6, right >>> i & 1 );
		}

		/* Two-column zigzag from the right, skipping function modules. */
		for( rightX = w - 2; rightX > 0; rightX -= 2 ) {
			for( row = 0; row < h; row++ ) {
				y = up ? h - 1 - row : row;
				for( dx = 0; dx < 2; dx++ ) {
					x = rightX - dx;
					if( reserved[ y ][ x ] ) continue;
					value = bit < codewords.length * 8 ? codewords[ bit >>> 3 ] >>> ( 7 - ( bit & 7 ) ) & 1 : 0;
					cells[ y ][ x ] = value ^ +( 0 === ( ( y / 2 | 0 ) + ( x / 3 | 0 ) ) % 2 );
					bit++;
				}
			}
			up = !up;
		}

		if( bit < codewords.length * 8 || bit - codewords.length * 8 > 7 ) throw new Error( 'Internal placement mismatch' );
	}

	,encodeText = function( text, ecc, boostEcl, fixedVersion ) { /* choose segments and version. */

		var
		 points = toCodePoints( text ) ,modeData = [] ,modeCosts = [] ,history ,bestHistory
		,selected ,characterCosts ,costFunction ,data ,j
		,best = -1 ,area ,bestArea = Infinity ,bestBits ,bestState ,i
		,version = fixedVersion < 0 ? -1 : fixedVersion - 1
		,limit = fixedVersion < 0 ? rmqr_height.length : fixedVersion + 1;

		if( points.length > 361 ) throw new RangeError( 'Data too long' );
		if( points.length ) for( i = 0; i < modeCount; i++ ) {
			selected = MODES[ i ];
			if( selected.prepare ) modeData[ i ] = selected.prepare();
			data = modeData[ i ];
			costFunction = selected.cost;
			characterCosts = modeCosts[ i ] = [];
			j = points.length;
			while( j-- ) characterCosts[ j ] = costFunction( points[ j ], data );
		}

		while( ++version < limit ) {
			area = rmqr_width[ version ] * rmqr_height[ version ];
			if( area >= bestArea ) continue;
			history = computeSegments( points, modeCosts, version );
			if( totalBits > rmqr_data_codewords[ ecc ][ version ] * 8 ) continue;
			best = version;
			bestArea = area;
			bestHistory = history;
			bestBits = totalBits;
			bestState = eciState;
		}
		if( best < 0 ) throw new RangeError( 'Data too long' );

		qrVersion = best;
		qrWidth = rmqr_width[ best ];
		qrHeight = rmqr_height[ best ];
		eciState = bestState;
		totalBits = bestBits;
		encodeSegments( splitIntoSegments( points, bestHistory, modeData ), ecc, boostEcl );
	}

	,encodeSegments = function( segments, ecc, boostEcl ) { /* pad payload and encode. */

		var bits = [] ,bytes = [] ,padByte = 236 ,capacity ,i ,j ,segment;

		if( boostEcl && totalBits <= rmqr_data_codewords[ 1 ][ qrVersion ] * 8 ) ecc = 1;
		errorCorrectionLevel = ecc;
		capacity = rmqr_data_codewords[ ecc ][ qrVersion ] * 8;

		i = segments.length;
		while( i-- ) { /* read restored segments from the beginning of the text. */
			segment = segments[ i ];
			if( segment.eci ) {
				appendBits( 7, 3, bits );
				appendBits( segment.eci, 8, bits );
			}
			appendBits( segment.mbits, 3, bits );
			appendBits( segment.numChars, segment.cbits[ qrVersion ], bits );
			for( j = 0; j < segment.bitData.length; j++ ) bits.push( segment.bitData[ j ] );
		}
		if( bits.length !== totalBits ) throw new Error( 'Assertion error' );
		appendBits( 0, min( 3, capacity - bits.length ), bits );
		appendBits( 0, ( 8 - bits.length % 8 ) % 8, bits );

		while( bits.length < capacity ) {
			appendBits( padByte, 8, bits );
			padByte ^= 253;
		}
		i = bits.length;
		while( i-- ) bytes[ i >>> 3 ] |= bits[ i ] << ( 7 - ( i & 7 ) );
		encodeMatrix( bytes );
	};

	return ( function() { /* svg generator */

		function contourPath( modules, width, height ) { /* my november's moons and noons */

			var
			 stride = width + 1
			,edges = []
			,emptyRow = []
			,step = [
				   0        /* 0: no edge */
				,  1        /* 1: right */
				,  stride   /* 2: down */
				,  0        /* 3: unused */
				, -1        /* 4: left */
				,  0        /* 5: unused */
				,  0        /* 6: unused */
				,  0        /* 7: unused */
				, -stride   /* 8: up */
			]
			,path = ''
			,y = height
			,x
			,v;

			while( y-- ) { /* collect boundary edges with dark modules on the right. */

				var
				 row = modules[ y ]
				,above = modules[ y - 1 ] || emptyRow
				,below = modules[ y + 1 ] || emptyRow
				,rowStart = y * stride;

				x = width;

				while( x-- ) {

					if( !row[ x ] ) continue;

					v = rowStart + x;

					if( !above[ x ] ) edges[ v ] |= 1;
					if( !row[ x + 1 ] ) edges[ v + 1 ] |= 2;
					if( !below[ x ] ) edges[ v + stride + 1 ] |= 4;
					if( !row[ x - 1 ] ) edges[ v + stride ] |= 8;
				}
			}

			var
			 start = edges.length
			,prevX = 0
			,prevY = 0;

			while( start-- ) {
				if( !edges[ start ] ) continue;

				var
				 startX = start % stride
				,startY = ( start / stride ) | 0
				,dx = startX - prevX
				,dy = startY - prevY;

				path += 'm' + dx + ( dy < 0 ? '' : ',' ) + dy;
				prevX = startX;
				prevY = startY;

				var
				 stack = [ start ]
				,route = []
				,previous = start
				,previousStep = 0;

				while( stack.length ) { /* join branches into one closed route. */

					var
					 at = stack[ stack.length - 1 ]
					,mask = edges[ at ];

					if( !mask ) {

						var
						 vertex = stack.pop()
						,delta = vertex - previous;

						if( delta !== previousStep )
							route.push( previous );

						previousStep = delta;
						previous = vertex;
						continue;
					}

					var edge = mask & -mask;

					edges[ at ] = mask ^ edge;
					stack.push( at + step[ edge ] );
				}


				var
				 i = route.length
				,turn = start;

				while( --i ) { /* write turns from the reversed route. */

					var
					 vertex = route[ i ]
					,offset = vertex - turn;

					path += -stride < offset && offset < stride
						? 'h' + offset
						: 'v' + ( offset / stride );
					turn = vertex;
				}

				path += 'z';
			}

			return path;
		}

		function ishex( c ) {

			return /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test( c );
		}

		function svg( n, a ) {

			n = document.createElementNS( ns, n );

			for( var o in a || { } ) {

				n.setAttribute( o, a[ o ] );
			}

			return n;
		}

		var
		 r ,x ,y
		,ns = 'http://www.w3.org/2000/svg'
		,path = ''
		,q = ( 'string' == typeof Q ) ? { msg: Q } : Q || { }
		,p = q.pal || [ '#000' ]
		,dm = abs( q.dim ) || 256
		,pd = abs( q.pad )
		,mx
		,fg = p[ 0 ]
		,bg = p[ 1 ]
		,optimized = q.vrb ? 0 : 1
		,s ,h
		,ecc = undefined === q.ecl ? 'M' : q.ecl
		,version = -1 ,i
		;

		pd = pd > -1 ? pd : 2;
		if( pd % 1 || pd < 2 || Infinity === 2 * pd ) throw new RangeError( 'Quiet zone must be a finite integer of at least 2 modules' );
		if( !( dm > 0 && dm < Infinity ) ) throw new RangeError( 'Invalid SVG width' );
		mx = [ 1, 0, 0, 1, pd, pd ];
		fg = ishex( fg ) ? fg : '#000';
		bg = ishex( bg ) ? bg : 0;

		if( undefined !== q.msg && 'string' !== typeof q.msg ) throw new TypeError( 'Expected text string' );
		if( 'M' !== ecc && 'H' !== ecc ) throw new RangeError( 'Invalid error correction level' );
		if( q.ver && 'auto' !== q.ver ) {
			for( i = 0; i < rmqr_height.length; i++ )
				if( q.ver === 'R' + rmqr_height[ i ] + 'x' + rmqr_width[ i ] ) version = i;
			if( version < 0 ) throw new RangeError( 'Invalid version' );
		}
		encodeText( q.msg || '', +( 'H' === ecc ), 0 != q.ecb, version );

		s = qrWidth + 2 * pd;
		h = qrHeight + 2 * pd;
		y = qrHeight;


		if( optimized ) {
			path = contourPath( modules, qrWidth, qrHeight );
		} else {
			while( y-- ) {
				x = qrWidth;
				while( x-- ) {
					if( modules[ y ][ x ] )
						path += 'M' + x + ',' + y + 'h1v1h-1z';
				}
			}
		}

		r = svg('svg', {

			 'viewBox'		: [ 0, 0, s, h ].join(' ')
			,'width'		:  dm
			,'height'		:  dm * ( h / s )
			,'fill'			:  fg
			,'shape-rendering'	: 'crispEdges'
			,'xmlns'		:  ns
			,'version'		: '1.1'
		} );

		if( bg ) r.appendChild( svg( 'path', {

			 'fill'			:  bg
			,'d'			: 'M0,0V' + h + 'H' + s + 'V0Z'
		} ) );

		r.appendChild( svg( 'path', {

			 'transform'		: 'matrix(' + mx + ')'
			,'d'			:  path
		} ) );

		return r;
	} )();
}
