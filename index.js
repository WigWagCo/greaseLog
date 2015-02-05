// DeviceJS
// (c) WigWag Inc 2014
//
// tuntap native interface


//var build_opts = require('build_opts.js');

var build_opts = { 
	debug: 1 
};
var colors = require('./colors.js');

var nativelib = null;
try {
	nativelib = require('./build/Release/greaseLog.node');
} catch(e) {
	if(e.code == 'MODULE_NOT_FOUND')
		nativelib = require('./build/Debug/greaseLog.node');
	else
		console.error("Error in nativelib [debug]: " + e + " --> " + e.stack);
}


var _logger = {};

var natives = Object.keys(nativelib);
for(var n=0;n<natives.length;n++) {
	console.log(natives[n] + " typeof " + typeof nativelib[natives[n]]);
	_logger[natives[n]] = nativelib[natives[n]];
}

var instance = null;
var setup = function(levels) {
	console.log("SETUP!!!!!!!!!!");

	var TAGS = {};
	var tagId = 1;

	var ORIGIN = {};
	var originId = 1;

	var getTagId = function(o) {
		var ret = TAGS[o];
		if(ret)
			return ret;
		else {
			ret = tagId++;
			TAGS[o] = ret;
			return ret;
		}
	}

	var getOriginId = function(o) {
		var ret = ORIGIN[o];
		if(ret)
			return ret;
		else {
			ret = originId++;
			ORIGIN[o] = ret;
			return ret;
		}
	}


	var LEVELS_default = {
		'info'     : 0x01,
		'log'      : 0x01,
		'error'    : 0x02,
		'warn'     : 0x04,
		'debug'    : 0x08,
		'debug2'   : 0x10,
		'debug3'   : 0x20,
		'user1'    : 0x40,
		'user2'    : 0x80  // Levels can use the rest of the bits too...
	};

	if(!levels) levels = LEVELS_default;
	console.dir(levels);

	this.LEVELS = {};



	var levelsK = Object.keys(levels);
	for(var n=0;n<levelsK.length;n++) {
		if(!this[levelsK[n]]) {
			var N = levels[levelsK[n]];
			var name = levelsK[n];
			this.LEVELS[name] = N;  // a copy, used for caller when creating filters
			this[name] = function(){
			}
		} else {
			throw new Error("Grease: A level name is used more than once: " + levels[n]);
		}

	}

	var self = this;

	if(!instance) {
		instance = nativelib.newLogger();
		instance.start(function(){              // replace dummy logger function with real functions... as soon as can.
			console.log("START!!!!!!!!!!!");
			var levelsK = Object.keys(levels);
			
			var createfunc = function(_name,_n) {
				self[_name] = function(){
	//				console.log("doing: " + N  + " " + name);
					self._log(_n,arguments[0],arguments[1],arguments[2]);
				}
			}

			for(var n=0;n<levelsK.length;n++) {

				var N = levels[levelsK[n]];
				var name = levelsK[n];
				console.log("adding " + name);
				createfunc(name,N);
			}
		});
	}



	/**
	 * @param {string} level
	 * @param {string} message
	 * @param {string*} tag 
	 * @param {string*} origin 
	 * @return {[type]} [description]
	 */
	this._log = function(level,message,tag,origin) {
		var originN = ORIGIN[origin];
//		var levelN  = levels[level];
//		if(!levelN) return;
		var tagN    = TAGS[tag];

		if(!originN) originN = undefined;
		if(!tagN) tagN = undefined;		

		instance.log(message,level,tagN,originN);
	}


	this.addTarget = function(obj,cb) {
		return instance.addTarget(obj,cb);
	}

	this.addFilter = function(obj) {
		// use IDs - not strings
		if(obj.tag)
			obj.tag = getTagId(obj.tag);
		if(obj.origin)
			obj.origin = getOriginId(obj.origin);
		return instance.addFilter(obj);
	}



}





module.exports = new setup();
