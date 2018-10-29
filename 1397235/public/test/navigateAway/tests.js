/** 
 * A test file that implements test cases for the Navigate Away Handler.
 * elements.
 *
 * @author Dennis Park <dpark@juniper.net> 
 * @copyright Juniper Networks, Inc. 2014
 */
define([], function() {
	describe('Navigate Away Handler Tests', function() {
      beforeEach(function() {
      });
      
      // describe('Test for existence of global functions on NavigateAwayHandler object', function() {
          // it('Global enable, disable, and isEnabled methods should be present', function() {
          //     assert.isFunction(Slipstream.SDK.NavigateAwayHandler.prototype.enable);
          //     assert.isFunction(Slipstream.SDK.NavigateAwayHandler.prototype.disable);
          //     assert.isFunction(Slipstream.SDK.NavigateAwayHandler.prototype.isEnabled);
          // });
      // });

      // describe('Manual Test for the adding of an event listener to the global window object - manual refresh', function(){
        //   it('Test that event listener added to global window object - should prompt for confirmation1.', function(){
        //       var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
        //       var isDirty = true;

        //       var isDirtyCallback = function(e) {
        //           if(isDirty){
        //             var confirmationMessage = "\o/";
        //             confirmationMessage = 'Hello'
        //             e.returnValue = confirmationMessage;     // Gecko and Trident
        //             return confirmationMessage;              // Gecko and WebKit        
        //           } else {
        //             return false;
        //           }  
        //       };

        //       navAwayHandler.enable(isDirtyCallback);
        //       navAwayHandler.disable();
        //       return true;   // or false if failed.
        //   });
        // });         

        //   it('Test that event listener added to global window object - should prompt for confirmation.', function(){
        //       var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
        //       var isDirty = true;
        //       navAwayHandler.enable(function(e){
        //           if(isDirty){
        //             var confirmationMessage = "\o/";
        //             confirmationMessage = 'Hello'
        //             e.returnValue = confirmationMessage;     // Gecko and Trident
        //             return confirmationMessage;              // Gecko and WebKit        
        //           } else {
        //             return false;
        //           }      
        //       });
        //       navAwayHandler.disable();              
        //       // window.location.reload();
        //       return true;   // or false if failed.
        //   });
        // // }); 

        // it('Test that event listener added to global window object - should not prompt for confirmation.', function(){
        //     // var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
        //     // navAwayHandler.enable();
        //     // navAwayHandler.disable();
        //     return true;   // or false if failed.
        // });
      // });       

      describe('Manual Test for the adding of an event listener to the global window object - debug mode', function(){
        it('Test that event listener added to global window object', function(){

            //  This test case is dependent on the Console API.  Must run these statements in the debugger.         
            // debugger;
            // var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
            // var eventListenerList = getEventListers(window);
            // var events = Object.keys(eventListenerList);
            // assert(events.length === 1);
            // navAwayHandler.enable();
            // eventListenerList = getEventListers(window);
            // events = Object.keys(eventListenerList);            
            // assert(events.length === 2);
            // navAwayHandler.disable();
            // eventListenerList = getEventListers(window);
            // events = Object.keys(eventListenerList);
            // assert(events.length === 1);            
            return true;   // or false if failed.
        });
      });
        describe('Test for navigateAway event', function(){
            it('navigateAway event should be triggered on search', function(done) {
                
                var all_regions = {
                    primaryNavIconRegion: '#primary-nav-icon-bar',
                    primaryNavRegion: '#primary-nav-region'
                };

                //These regions should be added to Slipstream before starting the activity. As on 'activity:beforeStart'
                //navigation_app calls renderNavigation method. This method relies on Slipstream.primaryNavRegion and 
                //Slipstream.primaryNavIconRegion.
                Slipstream.addRegions(all_regions);

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function(capabilities) {
                    return true;
                };
                
                //Set handler for navigateAway event
                Slipstream.commands.setHandler("navigation:request", function() {
                    console.log("this is navAway subscriber");
                    done();
                });
                
                // Creating a listener for 'activity:afterStart' and deleting the url_path for search activity.
                // ACTION_SEARCH intent needs url_path. However, once the intent is resolved it can be removed
                // after activity is started.
                // This is a workaround for testRunner page to not execute "route:navigate" and actually route 
                // the testRunnerIndex to search page. Even if it can be done, the url_router won't be initialized 
                // at this point because of RBACProvider issue and will result in an error.
                Slipstream.vent.on("activity:afterStart", function(activity){
                    if(activity['url_path']){
                        delete activity['url_path'];
                    }
                });

                // onCreate method in searchActivity has setContentView() method which results in 
                // 'beforeClose is not called before close' error from view_manager test. This is a
                // workaround for that. 
                Slipstream.vent.on("module:load:success", function(module){      
                    module.onCreate=function(){
                        console.log("search activity created");
                    }
                });

                //Instantiate the ActivityContext and create an intent for search.
                var activity_context = new Slipstream.SDK.ActivityContext('', '');

                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SEARCH, {
                    uri: new Slipstream.SDK.URI("search://")
                });
                 
                intent.putExtras({ query: "query" });

                //Start search activity.
                activity_context.startActivity(intent);

            });
         });

        after(function(done){
            Slipstream.vent.off("activity:afterStart");
            Slipstream.vent.off("module:load:success");
            done();
        });
    });
});