define(['apps/ui/preferences/preferencesManager'], function(PreferencesManager) {
	describe('Preferences Provider Tests', function() {
      before(function() {
          // Store the fake session key for use during testing.
          document.cookie = "test-key=testSessionId;path=/";

          this.preferences = new Slipstream.SDK.PreferencesResolver();
      });
      
      describe('Test for existence of global functions on Preferences object', function() {
          it('Global save, fetch, delete methods should exist on Preferences', function() {
              assert.isFunction(this.preferences.save);
              assert.isFunction(this.preferences.fetch);
              assert.isFunction(this.preferences.delete);
          });
      }); 

      describe('Test for correct detection of invalid storage option', function() { 
          var errorThrown = false;
          var options = {
              storage: "invalid"
          };

          try {
              this.preferences.fetch(options);
              errorThrown = false;
          }
          catch(Error) {
              errorThrown = true;
          }

          it('Error should be thrown', function() {
              assert.isTrue(errorThrown);
          });
      });

      describe('Error callback should fire on unsuccessful save operation', function() {
          var errorFired = false;
          var successFired = false;

          before(function(done) {
              var options = {
                  storage: "user",
                  success: function() {
                      successFired = true;
                      done();
                  },
                  error: function(msg) {
                      errorFired = true;
                      done();
                  }
              }, 
              prefs = "{{}"; // invalid json object

              this.preferences.save(prefs, options);
          });

          it('Error should fire, success should not', function() {
              assert.isTrue(errorFired);  
              assert.isFalse(successFired);
          });
      });


      describe('Success callback should fire on successful save operation', function() {
          var successFired = false;

          before(function(done) {
              var options = {
                  storage: "user",
                  success: function() {
                      successFired = true;
                      done();
                  }
              },
              prefs = {
                foo: "bar"
              };

              this.preferences.save(prefs, options);
          });

          it('Success should fire', function() {
              assert.isTrue(successFired);
          });
      });

      describe('Fetched preference object should match the object stored', function() {
          var fetchedObject = null;

          before(function(done) {
              var options = {
                  storage: "user",
                  success: function(data) {
                      fetchedObject = data;
                      done();
                  }
              };

              this.preferences.fetch(options);
          });

          it('Stored and fetched object should be equal', function() {
              assert.deepEqual({foo: "bar"}, fetchedObject);  
          });
      });

      describe('Deleting preference object should succeed', function() {
          var deleteSuccessful = false;

          before(function(done) {
              var options = {
                  storage: "user",
                  success: function() {
                      deleteSuccessful = true;
                      done();
                  }
              };

              this.preferences.delete(options);
          });

          it('Deleting preferences object should be successful', function() {
              assert.isTrue(deleteSuccessful);
          });
      });

      describe('Fetching after delete should yield an empty object ', function() {
          var fetchedObject = null;

          before(function(done) {
              var options = {
                  storage: "user",
                  success: function(data) {
                      fetchedObject = data;
                      done();
                  }
              };

              this.preferences.fetch(options);
          });

          it('Fetched object should be empty', function() {
              assert.deepEqual({}, fetchedObject);
          });
      });

      describe('Storing via preferencesManager', function() {
          var preferencesObj = {
              a: 5, 
              b: 15
          };

          it('retrieved object should be identical to stored object', function() {

            Slipstream.vent.trigger("ui:preferences:change", "a:b:c:d", preferencesObj);
            
            var prefs = Slipstream.reqres.request("ui:preferences:get", "a:b:c:d"); 

            assert.equal(prefs.a, preferencesObj.a);
            assert.equal(prefs.b, preferencesObj.b); 
          });

          it('retrieve with empty key should return root preferences object', function() {
              var prefs = Slipstream.reqres.request("ui:preferences:get");

              assert.equal(prefs.a.b.c.d.b, preferencesObj.b);
          });
      });

      /* Uncomment after back end supports cookie-less session storage requests
      describe('Save preferences to session storage', function() {
          var successFired = false;

          before(function(done) {
              var options = {
                  storage: "session",
                  success: function() {
                      successFired = true;
                      done();
                  }
              }, 
              prefs = {
                foo: "bar"
              };

              Preferences.save(prefs, options);  
          });

          it('Success should fire', function() {
              assert.isTrue(successFired);  
          });
      });

      describe('Fetched session-scoped preference object should match the object stored', function() {
          var fetchedObject = null;

          before(function(done) {
              var options = {
                  storage: "session",
                  success: function(data) {
                      fetchedObject = data;
                      done();
                  }
              };

              Preferences.fetch(options);  
          });

          it('Stored session-scoped object and fetched object should be equal', function() {
              assert.deepEqual({foo: "bar"}, fetchedObject);  
          });
      });

      describe('Deleting session preference object should succeed', function() {
          var deleteSuccessful = false;

          before(function(done) {
              var options = {
                  storage: "session",
                  success: function() {
                      deleteSuccessful = true;
                      done();
                  }
              };

              Preferences.delete(options);  
          });

          it('Deleting session-scoped preferences object should be successful', function() {
              assert.isTrue(deleteSuccessful);
          });
      });

      describe('Fetching after delete of session-scoped preferences should yield an empty object ', function() {
          var fetchedObject = null;

          before(function(done) {
              var options = {
                  storage: "session",
                  success: function(data) {
                      fetchedObject = data;
                      done();
                  }
              };

              Preferences.fetch(options);  
          });

          it('Fetched object should be empty', function() {
              assert.deepEqual({}, fetchedObject);
          });
      });
   */

	});
});