define(["apps/ui/app"], function(UI) {

	describe('Breadcrumb Tests', function() {
      var old_verifyaccess;

      before(function() {
         old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

         // scaffold the RBACResolver's verifyAccess method used by the UI.
         Slipstream.SDK.RBACResolver.prototype.verifyAccess = function() {
             return true;
         };
      });

      after(function() {
          Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
      });

      it('Test for creation of breadcrumb for a valid navigation path', function(done) {
          Slipstream.vent.on("ui:afterShow", function() {
    
              Slipstream.vent.on("ui:breadcrumb:updated", function() { 
                  var breadcrumb_fragments = $(".breadcrumb-entry > span");

                  assert.equal(breadcrumb_fragments.length, 2);
                  assert.equal(breadcrumb_fragments[0].textContent, "Monitor");
                  assert.equal(breadcrumb_fragments[1].textContent, "Alerts & Alarms");
                  done();  
              });
              
              Slipstream.vent.trigger("activity:beforeStart", activity);
          });

          var activity = {
              paths: [{
                  path: "nav.monitors/nav.alerts_alarms",
                  filter: {
                     filter: {
                         "id": "1",
                         "action": "some_action",
                         "data": "vnd.fake.mime.type",
                      },
                      activity: {}
                  } 
              }],

              breadcrumb: true
          };

          Slipstream.vent.trigger("nav:discovered", activity.paths[0]); 
          UI.render();
      }); 
   });
});