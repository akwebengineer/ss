define([], function() {
	describe('Start an activity in a new window', function() {
      var filter_action = "doit";
      var filter_mime_type = "text/html";

      var activity = {
           url_path: "/bar", 
           plugin_name: "foo",
           filters: [
               {
                    id: 1,
                    action: "doit",
                    data: {
                      "mime_type": "text/html"
                    }
               }
           ]
      };

       Slipstream.vent.trigger("activity:discovered", activity);

      it('Start an activity in a new window', function() {
          var intent = new Slipstream.SDK.Intent(filter_action, {
                "mime_type": filter_mime_type
          });

          Slipstream.vent.trigger("activity:start", intent, {
              windowSpec: {
                  name: "foobar", 
                  features: "width=100, height=200"
              }
          });

          var new_window = window.open("", "foobar"); // get the window handle

          assert.equal(typeof(new_window), "object");
      });
  });
  
  describe('Test the retrieval of the primary activity', function() {
      it('The last activity to write into the content pane should be the primary activity', function() {
          var activity = new Slipstream.SDK.Activity();

          activity.onStart = function() {
              this.locator = "me";

              this.setContentView({
                  el: document.createElement("div"),
                  render: function() {}
              });
          }

          activity.context = new Slipstream.SDK.ActivityContext("foo", "/");
          activity.onStart();

          var primaryActivity = Slipstream.SDK.UI.getPrimaryActivity();

          assert.equal(primaryActivity.locator, activity.locator);
      });
  })

  describe('Test that getCapabilities returns the correct value', function() {
      it('Set and get capabilities', function() {
          var activity = new Slipstream.SDK.Activity();
          var capabilities = [{"name": "managePolicies"}, {"name": "CreatePolicy"}];

          activity._setCapabilities(capabilities);
          var retrievedCapabilities = activity.getCapabilities();

          assert.deepEqual(capabilities, retrievedCapabilities);
      });
  })
});