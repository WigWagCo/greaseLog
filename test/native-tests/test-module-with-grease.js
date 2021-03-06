// one module sets up the logger. This is the only logger instance
// the node.js process needs.
var logger = require('../../index.js')();


logger.addTarget({
	    file: "rotateThis.log",
	    delim: "\n",
	    format: {
	    	pre: '\x1B[1m', // pre: "pre>"   // 'bold' escape sequence
	    	time: "[%ld:%d] ",
	    	level: "<%s> ",
	    	tag: "{%s} ",
	    	origin: "(%s) ",
	    	post: "\x1B[22m" // post: "<post"
	    },
	    rotate: {
	    	max_files: 5,
	    	max_file_size:  10000,
	    	max_total_size: 100000
	    	,rotate_on_start: true
	    }
	},function(targetid,err){

var ret = logger.addFilter({ 
	// target: targetid,   // same as saying target: 0 (aka default target)
	mask: logger.LEVELS.debug,
	pre: "\x1B[94m[DEBUG]   ",  // light blue
	post: "\x1B[39m"
}); 
var ret = logger.addFilter({ 
	// target: targetid,   // same as saying target: 0 (aka default target)
	mask: logger.LEVELS.debug2,
	pre: "\x1B[90m[DEBUG2]  ",  // grey
	post: "\x1B[39m"
}); 
var ret = logger.addFilter({ 
	// target: targetid,   // same as saying target: 0 (aka default target)
	mask: logger.LEVELS.debug3,
	pre: "\x1B[90m[DEBUG3]  ",  // grey
	post: "\x1B[39m"
}); 
var ret = logger.addFilter({ 
	// target: targetid,
	mask: logger.LEVELS.warn,
	pre: '\x1B[33m[WARN]    ',  // yellow
	post: '\x1B[39m'
});
var ret = logger.addFilter({ 
	// target: targetid,
	mask: logger.LEVELS.error,
	pre: '\x1B[31m[ERROR]   ',  // red
	post: '\x1B[39m'
});
var ret = logger.addFilter({ 
	// target: targetid,
	mask: logger.LEVELS.success,
	pre: '\x1B[32m[SUCCESS] ',  // green
	post: '\x1B[39m'
});
var ret = logger.addFilter({ 
	// target: targetid,
	mask: logger.LEVELS.log,
	pre: '\x1B[39m[LOG]     '  // default
});

	
});

// colors, to differentiate levels
// more here: http://misc.flogisoft.com/bash/tip_colors_and_formatting



// some logging in another module....

for(var n=0;n<10;n++)
	logger.log("I am from node.js"); // most of these will be at the end, that's ok for this test

var clearme = setInterval(function(){
	for(var n=0;n<4;n++) {
		logger.log("I am from node.js"); // most of these will be at the end, that's ok for this test
		logger.debug("I am from node.js"); // most of these will be at the end, that's ok for this test
		logger.trace("I am from node.js");
	}
},100); 

// -------------------------------------------------------------------------------------------------------
// THE TEST:
// -------------------------------------------------------------------------------------------------------

// Your module is pulled in. When it is, INIT_GLOG is called by your 
// InitAll(). Grease will 'auto-detect' (using glib symbol hunt magic)
// the other shared libraries (greaselog.node) library calls. So they will go to the same backed logger.
var testmodule = null;
try {
	testmodule = require('./build/Debug/obj.target/testmodule.node');
} catch(e) {
	if(e.code == 'MODULE_NOT_FOUND')
		testmodule = require('./build/Release/obj.target/testmodule.node');
	else
		console.error("Error in loading test module [debug]: " + e + " --> " + e.stack);
}

var tester = testmodule.testModule();

tester.doSomeLoggin("Hello",100,10,function(){
	console.log("native test over");
});


// grease buffers, so wait a second to see it all dump out for the test.
setTimeout(function(){
	clearInterval(clearme);
	logger.log("end (logger)"); // might not be at end (expected - b/c of interval above)
},20000);

