/**
 * Unit test for ViewToolbarElement
 *
 * @author Sanket Desai<sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(["Slipstream", "apps/utilityToolbar/app"], function(Slipstream, Utility) {

    var $SlipstreamUI = $('#slipstream_ui');

	 describe('ViewToolbarElement tests', function () {
        
	 	describe('ViewToolbarElement when capabilities are specified', function () {
     		before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                	if(capabilities[0] == "blockAccess"){
                    	return false;
                    }
                    return true;
                };

                var capabilities = [
                    {
                        'name': 'blockAccess'
                    }
                ];

                // If topbar container is not rendered because of rbacProvider then create a new topbar container.
                if($SlipstreamUI.find('.top-bar').length == 0) {
                    Slipstream.UI.render(false);
                }

                var activity_context = new Slipstream.SDK.ActivityContext('', '');
	     		var activity = {
		           module: "/test/app/utility_toolbar/viewToolbarElement/SampleUtilityActivity.js",
		           context: activity_context,
		           capabilities: capabilities
		      	};

		      	var toolbar_element = {
		      		activity: activity,
		      		protoModule: "sdk/viewToolbarElement"
		      	};

	      		Slipstream.vent.trigger("utilityToolbar_element:discovered", toolbar_element);
	            Utility._isInitialized = false;
	            Utility.start();
            });

            after(function(done) {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
                Slipstream.vent.off("utilityToolbar:privilegesError");
                done();
            });

            it('ViewToolbarElement shouldnot render if user does not have required capabilities', function () {

            	Slipstream.vent.on("utilityToolbar:privilegesError", function (intent){
            		var sampleToolbarView;
                    var top_bar_container = $SlipstreamUI.find('.top-bar');
            		sampleToolbarView = top_bar_container.find('.utility_sample_view');
            		
                    assert.isTrue(sampleToolbarView && sampleToolbarView.length == 0, 'SampleToolbarView is rendered');
            	});

            });
	           
	    });
	     describe('ViewToolbarElement when capabilities are not specified', function () {

     		before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    return true;
                };

                var activity_context = new Slipstream.SDK.ActivityContext('SampleUtilityActivity', '');
	     		var activity = {
		           module: "/test/app/utility_toolbar/viewToolbarElement/SampleUtilityActivity.js",
		           context: activity_context
		      	};

		      	var toolbar_element = {
		      		activity: activity,
		      		protoModule: "sdk/viewToolbarElement"
		      	};

	      		Slipstream.vent.trigger("utilityToolbar_element:discovered", toolbar_element);
	            Utility._isInitialized = false;
	            Utility.start();
            });

            after(function(done) {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
                Slipstream.vent.off("activity:afterStart");
                done();
            });

            it('ViewToolbarElement should render if no capabilities are specified', function () {
            	Slipstream.vent.on("activity:afterStart", function (intent){
            		var sampleToolbarView;
                    var top_bar_container = $SlipstreamUI.find('.top-bar');
            		sampleToolbarView = top_bar_container.find('.utility_sample_view');
                    if(intent.context.ctx_name == "SampleUtilityActivity") {
                	   assert.isTrue(sampleToolbarView && sampleToolbarView.length > 0, 'SampleToolbarView is not rendered');
                    }
            	});

            });
	           
        });
        
        describe('Toolbar Element Alignment', function () {

            var activity_context = new Slipstream.SDK.ActivityContext('SampleUtilityActivity', '');
            var activity = {
            module: "/test/app/utility_toolbar/viewToolbarElement/SampleUtilityActivity.js",
            context: activity_context                           
            };            

            describe('Generic Elements', function(){
                before(function () {
                    var toolbar_element = {
                        activity: activity,
                        protoModule: "sdk/viewToolbarElement",
                        alignLeft: true
                    };

                    Slipstream.vent.trigger("utilityToolbar_element:discovered", toolbar_element);
                    Utility._isInitialized = false;
                    Utility.start();
                });
                    
                after(function(done) {                
                    Slipstream.vent.off("activity:afterStart");
                    done();
                });
                    
                it('should align the given generic toolbar element on the left side of the toolbar', function () {
                    Slipstream.vent.on("activity:afterStart", function (intent){
                        var $sampleToolbarView;
                        var top_bar_container = $SlipstreamUI.find('.top-bar');
                        $sampleToolbarView = top_bar_container.find('.utility_sample_view');                                             
                        if(intent.context.ctx_name == "SampleUtilityActivity") {
                            assert.equal($sampleToolbarView.closest('ul').id, "view_elements_left", 'Generic toolbar element is rendered to the left');
                        }
                    });
                });
            });

            describe('Icon Elements', function(){
                before(function () {
                    var toolbar_element = {
                        "icon": "icon_alert.svg",
                        "alignLeft": true
                      };

                    Slipstream.vent.trigger("utilityToolbar_element:discovered", toolbar_element);
                    Utility._isInitialized = false;
                    Utility.start();
                });
                    
                after(function(done) {                
                    Slipstream.vent.off("activity:afterStart");
                    done();
                });
                    
                it('should align the given generic toolbar element on the left side of the toolbar', function () {
                    Slipstream.vent.on("activity:afterStart", function (intent){
                        var $sampleToolbarView;
                        var top_bar_container = $SlipstreamUI.find('.top-bar');
                        $leftIconContainer = top_bar_container.find('.toolbar_elements_left');
                        assert.isTrue($leftIconContainer.find('.toolbar_icon').length > 0, 'Icon toolbar element is rendered to the left');
                    });
                });
            });                         
        });
	});
});
