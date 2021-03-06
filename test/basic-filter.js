// basic test of logging.

var logger = require('../index.js')();



var util = require('util');


//console.dir(logger);

var N = 0;

var HUGE = "";

for(var n=1000000;n>0;n--) {
	HUGE = HUGE + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123["+n+"] ";
}

var callback_targ_id = 0;
var file_targ_id = 0;

var disable_this_filter = 0;

var testCallback = function(str,id) {
	var entries = str.split("ϐ");      // use special char to separate entries...
	for(var n=0;n<entries.length;n++)
		console.log("CB (" + id + ")>" + entries[n] + "<");
}

//would disable all log.trace & log.debug calls
// logger.setGlobalOpts({
// 	levelFilterOutMask: logger.LEVELS.trace | logger.LEVELS.debug
// });

logger.addTarget({
//	    file: "testlog.log",
	    callback: testCallback,

	    delim: 'ϐ', // separate each entry with a special char
// 	    rotate: {
// 	    	max_files: 5,
// 	    	max_file_size:  10000,
// 	    	max_total_size: 100000
// //	    	,rotate_on_start: true
// 	    }
	},function(targetid,err){
		callback_targ_id = targetid;
		if(err) {
			console.log("error: "+ util.inspect(err));
		} else {
			console.log("added target: " + targetid);
			var ret = logger.addFilter({ 
				target: targetid,
				mask: logger.LEVELS.error
			});
			console.log("added filter: " + ret);
			var ret = logger.addFilter({ 
				target: targetid,
				mask: logger.LEVELS.debug,
				tag: 'Eds'
//				,disable: true
			});
			console.log("added filter: " + ret);
			var disable_this_filter = logger.addFilter({ 
				target: targetid,
				mask: logger.LEVELS.debug,
				tag: 'Eds',
				origin: 'special.js'
			});
			if(!disable_this_filter) {
				console.log("Failure of logger.addFilter");
				process.exit(1);
			} else {
				console.log("disable_this_filter = " + disable_this_filter);
			}

			console.log("added filter: " + ret);
		}


		console.log("HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE");

		setTimeout(function(){
			console.log("2 second timeout over.");
		},2000); 
		// stall long enough for the logger to setup the second target 
		// this isn't a hack - it just shows that grease won't hang the node.js event loop
		// when setting up a target.

		logger.addTarget({
			    file: "testlog2.log",
			    delim: '\n', // separate each entry with a hard return
			    rotate: {
			    	max_files: 5,
			    	max_file_size:  10000,
			    	max_total_size: 100000
			    	,rotate_on_start: true
			    }
			},function(tid2,err){
				file_targ_id = tid2;
				if(err) {
					console.log("error: "+ util.inspect(err));
				} else {
					console.log("added target: " + tid2);
					var ret = logger.addFilter({ 
						target: tid2,
						mask: logger.LEVELS.error
					});
					console.log("added filter: " + ret);
					var ret = logger.addFilter({ 
						target: tid2,
						mask: logger.LEVELS.debug,
						tag: 'Eds',
						pre: "EDS>",
						post: "EDS<"
					});
					console.log("added filter: " + ret);
					var ret = logger.addFilter({ 
						target: tid2,
						mask: logger.LEVELS.debug,
						origin: 'special.js'
					});
					console.log("added filter: " + ret);
					var ret = logger.addFilter({ 
						target: tid2,
						mask: logger.LEVELS.debug,
						tag: 'Eds',
						origin: 'special.js'
					});
					console.log("added targets / filter (2): " + ret);


///////////
					console.time('logit');
		logger.error("************ FIRST **********");


		var disabled = false;

		var N = 1000;

		var do_log = function()  {




			var n = 10;
			while(N > 0 && n > 0) {
				if(N%2 > 0) {
					logger.disableTarget(callback_targ_id);
				} else {
					logger.enableTarget(callback_targ_id);
				}

				// if(N > 960 && N < 990 && !disabled) {
				// 	logger.debug("MODIFYING FILTER - disable=true");	
				// 	logger.modifyFilter({
				// 		id:disable_this_filter,
				// 		tag: 'Eds',
				// 		origin: 'special.js',
				// 		disable: true
				// 	});
				// 	disabled = true;
				// }

				// if(N < 960 && disabled) {
				// 	logger.debug("MODIFYING FILTER - disable=false");
				// 	logger.modifyFilter({
				// 		id:disable_this_filter,
				// 		tag: 'Eds',
				// 		origin: 'special.js',
				// 		disable: false
				// 	});
				// 	disabled = false;
				// }


				logger.debug("....DEBUG(1) "+N+"....");
				if((N % 7) == 0) {0
					logger.debug('Eds', "....DEBUG(2)("+N+") HUGE " + HUGE);								
				}
				logger.debug('Eds', "....DEBUG(2) "+N+"....");			
				logger.debug('special.js','Eds', "....DEBUG(3) "+N+"....");			
				logger.debug('special.js',undefined, "....DEBUG(4)"+N+"....");				 // should go to file only...
				logger.error("....ERROR...." + N);
				logger.log(" log log log");
				logger.debug({ignores:callback_targ_id},undefined,'Eds'," NO-CALLBACK NO-CALLBACK");
				logger.debug('Eds'," CALLBACK CALLBACK ");
				logger.debug({ignores:callback_targ_id},undefined,'Eds'," NO-CALLBACK -> File ");	      // FIXME - no working
				logger.trace("test");
				logger.trace({stuff:"stuff"},"dumb idea"); // a poor way to log - slower
				logger.log("slow", "uses","util.format()","style","logging");
				N--; n--;
			} 
			
			if(N > 0) {
				setTimeout(do_log, 200);
			} else {
				logger.error("************ LAST **********");
			}
		}

		console.log("Starting log ... 1 second");
		setTimeout(function(){
			do_log();			
		},1000);


//		console.timeEnd('logit');
/////////////////
			


				}
			});


	});

// setTimeout(function() {
// 	console.log("TIMEOUT on main wait.");
// },5000)



// var testCallback = function(str,id) {
// 	console.log("CB (" + id + ")>" + str + "<");
// }

// logger.addTarget({
// 	    file: "rotateThis.log",
// 	    callback: testCallback,
// 	    delim: '\n', // separate each entry with a hard return
// 	    rotate: {
// 	    	max_files: 5,
// 	    	max_file_size:  10000,
// 	    	max_total_size: 100000
// //	    	,rotate_on_start: true
// 	    }
// 	},function(targetid,err){
// 		if(err) {
// 			console.log("error: "+ util.inspect(err));
// 		} else {
// 			console.log("added rotate target: " + targetid);
// 			var ret = logger.addFilter({ 
// 				target: targetid,
// 				tag: 'rotate'
// 				// ,
// 				// mask: logger.LEVELS.ALL
// 			});
// 		}		
// 		var N = 1000;
// 		logger.debug('rotate',"************ FIRST **********");
// 		var I = setInterval(function(){
// 			for(var n=0;n<10;n++) {
// 				logger.debug('rotate',"....rotate me ["+N+"]....");
// 				N--;
// 			}
// 			if(N == 0) {
// 				clearInterval(I);
// 				logger.debug('rotate',"************ LAST **********");	
// //				setTimeout(function(){},2000);
// 			}
// 		},10);


// 	});



// var big = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";
// for(var n=0;n<10000;n++) {
// 	logger.log("test log " + n);
// 	setTimeout(function(q){
// 		logger.error("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA--"+q+"--");
// 		N++;
// 		if(N == 9999) {
// 			setTimeout(function(p) {
// 				console.log("------------END--------------");
// 				logger.debug("LAST ONELAST ONELAST ONELAST ONELAST ONELAST ONELAST ONELAST ONELAST ONELAST ONELAST ONE");				
// 			}, 10+n*10, n);
// 		}
// 	}, 50+n*10,n);
// 	if(n % 11 == 0) {
// 		setTimeout(function(q){
// 			logger.log(big +"#################" + q + "*");
// 		}, 100+n*10,n);
// 	}		

// }





//console.log("done");
