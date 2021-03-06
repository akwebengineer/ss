/*
 * jQuery UI Vertical Tabs 0.1.1
 * https://github.com/tjvantoll/jquery-ui-vertical-tabs
 *
 * Copyright TJ VanToll
 * Released under the MIT license.
 */

// SLIPSTREAM EDIT: Original library file has been edited to call "jqueryui" as a dependency as opposed to "jqueryui-tabs"

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define([
			"jquery",
//			"tabs/jquery-ui/widget",
			"jqueryui"
		], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

return $.widget( "ui.tabs", $.ui.tabs, {
	options: {
		orientation: "horizontal"
	},
	_create: function() {
		this._super();
		this._handleOrientation();
	},
	_handleOrientation: function() {
		this.element.toggleClass( "ui-tabs-vertical",
			this.options.orientation === "vertical" );
	},
	_setOption: function( key, value ) {
		this._superApply( arguments );
		if ( key === "orientation" ) {
			this._handleOrientation();
		}
	},
	_destroy: function() {
		this._super();
		this.element.removeClass( "ui-tabs-vertical" );
	}
});

}));
