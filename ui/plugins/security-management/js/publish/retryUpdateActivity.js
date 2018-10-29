/**
 * Retry Update Activity page
 *
 * @module retryUpdateActivity
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 * 
 **/
define([ 
	'./views/retryUpdateView.js', 
     '../sdBaseActivity.js' 
	], 
	function(
		RetryUpdateView,
		BaseActivity
	) {

		var retryUpdateActivity = function() {
			var self = this, view;
			BaseActivity.call(self);
			this.onStart = function() {
				 view = new RetryUpdateView({
					activity : self
				});
                self.buildOverlay(view, {size: 'medium'});
			};

		};
		retryUpdateActivity.prototype = new Slipstream.SDK.Activity();

		return retryUpdateActivity;
});
