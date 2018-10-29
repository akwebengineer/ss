/** 
 * A module managing Block Module.
 * @module
 * @name BlockManager
 * @author Dharma <adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["./blockModule.js"], function(BlockModule){
	var BlockManager = function(){
		var me=this;
		//TODO once we move to generic key and keyValue this has to be refactored to take correct inputs.
		me.startBlockWorkFlow = function(options){
			//stop the module to free up the memory
			BlockModule.stop();
			BlockModule.start({
				"input": options.input,
				"activity": options.activity
			});
		};
	};
	return BlockManager;
})