/** 
 * A module that implements the SD block workflow
 * @module
 * @name Slipstream/SDBlock
 * @author Dharma <adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["./views/blockApplicationView.js", "widgets/overlay/overlayWidget"], function(BlockApplicationView, OverlayWidget) {
	//
	Slipstream.module("SDBlock", function(SDBlock, Slipstream, Backbone, Marionette, $, _) {
		var _input,
			_activity,
			_context,
			_blockView;
		//
		this.startWithParent = false;
		//
		var _invokeBlockWorkFlow = function(){
			_blockView = new SDBlock.BlockView(_input, _activity);
			_displayBlockViewInAnOverlay();
		};
		//
		var _displayBlockViewInAnOverlay = function(){
			var conf = {
				view: _blockView,
				cancelButton: false,
				okButton: false,
				showBottombar : false,
				showScrollbar: true,
				type: 'large'
			};
			var blockOverLay = new OverlayWidget(conf);
			_blockView.overlay = blockOverLay;
			blockOverLay.build();
			_blockView.displayProgressBar(_context.getMessage('load_title'), _context.getMessage('load_progress_display'),false,true);
		}
		//
		SDBlock.addInitializer(function(options){
			_input = options.input;
			_activity = options.activity;
			_context = options.activity.context;
			_invokeBlockWorkFlow();
		});
		//
		SDBlock.addFinalizer(function(){
			//clear the memory
			_blockView.remove();
			_activity = null;
			_input = null;
			_context = null;
		});
		//extend the existing block application view -- refactor later
		SDBlock.BlockView = BlockApplicationView.extend({});
	});
	//
	return Slipstream.SDBlock;
});