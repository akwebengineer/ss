define(['apps/navigation/navElementRegistry',
        'apps/navigation/schemaImportResolver',
        'lib/utils', 
        './schemas/schema1.js',
        './schemas/schema2.js',
        './schemas/baseSchemaWithImports.js'], function(NavElementRegistry, SchemaImportResolver, Utils, schema1, schema2, baseSchemaWithImports) {

  describe('Navigation Element Registry Tests', function() {
      var navElementRegistry;
      var oldRBACResolver;
      var activityFilter = {
          filter: {
             "id": "1",
             "action": "some_action",
             "data": "vnd.fake.mime.type"
          }, 
          activity: {
              "capabilities": [
                  {
                      "name": "some_capability"
                  }
               ]
          }
      }     

      beforeEach(function() {
          navElementRegistry = new NavElementRegistry();
          oldRBACResolver = Slipstream.SDK.RBACResolver;

          Slipstream.SDK.RBACResolver = function() {}
          Slipstream.SDK.RBACResolver.prototype.verifyAccess = function() {return true;}
      });

      afterEach(function() {
          Slipstream.SDK.RBACResolver = oldRBACResolver;  
      })

      describe('Test for existence of public functions on NavElementRegistry object', function() {
          it('Public methods should exist on NavElementRegistry object', function() {
              assert.isFunction(navElementRegistry.addElement);
              assert.isFunction(navElementRegistry.registerContextSchema);
              assert.isFunction(navElementRegistry.getDefinedNavElementsByContext);
              assert.isFunction(navElementRegistry.getDefinedNavElementsByPath);
          });
      }); 

      describe('Test that nav elements are correctly bound to a schema context and retrievable', function() {
          it('One defined element should be returned from getDefinedNavElementsByContext, elements added before schema registered', function() {
              var navElements = [
                {
                    path: "nav.devices_and_connections/nav.all_devices",
                    context: "context1",
                    filter: activityFilter
                }
              ];

              navElements.forEach(function(element) {
                  navElementRegistry.addElement(element);  
              });

              navElementRegistry.registerContextSchema(schema1, "context1");

              var definedElements = navElementRegistry.getDefinedNavElementsByContext("context1");
              assert.isTrue(definedElements.roots.length == 1);
              assert.equal(definedElements.defaultNode.name, "nav.devices_and_connections");
              assert.equal(definedElements.roots[0].get("internal_name"), "nav.devices_and_connections");
          });

          it('One defined element should be returned from getDefinedNavElementsByContext, schema registered before elements added', function() {
              var navElements = [
                {
                    path: "nav.devices_and_connections/nav.all_devices",
                    context: "context1",
                    filter: activityFilter   
                }
              ];

              navElementRegistry.registerContextSchema(schema1, "context1");

              navElements.forEach(function(element) {
                  navElementRegistry.addElement(element);  
              });

              var definedElements = navElementRegistry.getDefinedNavElementsByContext("context1");
              assert.isTrue(definedElements.roots.length == 1);
              assert.equal(definedElements.roots[0].get("internal_name"), "nav.devices_and_connections");
          });
      });

      describe('Test that nav elements can be fetched by navigation path', function() {
          it('The nodes along a navigation path should be fetched when the path is provided', function() {
              var navElements = [
                {
                    path: "nav.devices_and_connections/nav.all_devices/nav.security_devices/nav.srx_devices",
                    context: "context2",
                    filter: activityFilter    
                }
              ];

              navElementRegistry.registerContextSchema(schema2, "context2");

              navElements.forEach(function(element) {
                  navElementRegistry.addElement(element);  
              });

              var path_nodes = navElementRegistry.getDefinedNavElementsByPath(navElements[0].path, "context2");
              assert.equal(path_nodes.length, 4);
              assert.equal(path_nodes[0].get("internal_name"), "nav.devices_and_connections");
              assert.equal(path_nodes[1].get("internal_name"), "nav.all_devices");
              assert.equal(path_nodes[2].get("internal_name"), "nav.security_devices");
              assert.equal(path_nodes[3].get("internal_name"), "nav.srx_devices");
          });
      });

      describe('Test that nav elements have correct ids', function() {
          it('Nodes should have . replaced with _ and _ replaced with __', function() {
            var navElements = [
                {
                    path: "nav.devices_and_connections/nav.all_devices/nav.security_devices/nav.srx_devices",
                    context: "context2",
                    filter: activityFilter
                }
            ];

            navElementRegistry.registerContextSchema(schema2, "context2");

            navElements.forEach(function(element) {
                navElementRegistry.addElement(element);
            });

            var path_nodes = navElementRegistry.getDefinedNavElementsByPath(navElements[0].path, "context2");
            assert.equal(path_nodes.length, 4);
            assert.equal(path_nodes[0].get("internal_name"), "nav.devices_and_connections");
            assert.equal(path_nodes[0].get("internal_dom_id"), "nav_devices__and__connections");
            assert.equal(path_nodes[1].get("internal_name"), "nav.all_devices");
            assert.equal(path_nodes[1].get("internal_dom_id"), "nav_all__devices");
            assert.equal(path_nodes[2].get("internal_name"), "nav.security_devices");
            assert.equal(path_nodes[2].get("internal_dom_id"), "nav_security__devices");
            assert.equal(path_nodes[3].get("internal_name"), "nav.srx_devices");
            assert.equal(path_nodes[3].get("internal_dom_id"), "nav_srx__devices");
          });
      });

      describe('Test error paths', function() {
          it('Accessing an unregistered schema context should throw an error', function() {
              var byPathError = false;
              var byContextError = false;

              try {
                  navElementRegistry.getDefinedNavElementsByPath("/foo/bar", "invalidContext");
              }
              catch (Error) {
                  byPathError = true;
              }

              try {
                  navElementRegistry.getDefinedNavElementsByContext("invalidContext");
              }
              catch (Error) {
                  byContextError = true;
              }
              assert.isTrue(byPathError);
              assert.isTrue(byContextError);
          });
          it('Pass an invalid path to getDefinedNavElementsByPath', function() {
              var navElements = [
                {
                    path: "nav.devices_and_connections/nav.all_devices",
                    context: "context2",
                    filter: activityFilter
                }
              ];

              navElementRegistry.registerContextSchema(schema2, "context2");

              navElements.forEach(function(element) {
                  navElementRegistry.addElement(element);  
              });
              
              var path_nodes;
              var invalidPathError = false;

              try {
                  path_nodes = navElementRegistry.getDefinedNavElementsByPath("/foo/bar", "context2");
              }
              catch (Error) {
                  invalidPathError = true;
              }

              assert.isNull(path_nodes);
              assert.isFalse(invalidPathError);  // invalid paths don't result in exceptions
          });
      });

      describe('Test multiple registrations of same schema', function() {
          it('Re-registering the same schema should be a no-op', function() {
              var registrationFailure = false;

              try {
                  navElementRegistry.registerContextSchema(schema1, "context1");
                  navElementRegistry.registerContextSchema(schema1, "context1");
              }
              catch (Error) {
                  registrationFailure = true;
              }

              assert.isFalse(registrationFailure);
          });
      });
   });

   describe('Test schema imports', function() {
       it("Separate schema imports should be correctly resolved and merged into base schema", function(done) {
           var schemaImportResolver = new SchemaImportResolver("/test/navigation/schemas/");

           schemaImportResolver.resolveImports(baseSchemaWithImports, ["import1.js", "import2.js"], function(resolvedSchema) {
               var monitors = _.findWhere(resolvedSchema, {"name": "nav.monitors"});
               var logAndEvents = _.findWhere(monitors.children, {"name": "nav.log_and_events"});
               var someName = _.findWhere(logAndEvents.children, {"name": "somename"});

               assert.equal(someName.name, "somename");

               var bar = _.findWhere(_.findWhere(monitors.children, {"name": "foo"}).children, {"name":"bar"});
               assert.equal(bar.name, "bar");

               var bazooka = _.findWhere(_.findWhere(resolvedSchema, {"name": "foobar2"}).children, {"name": "bazooka"});
               assert.equal(bazooka.name, "bazooka");
               
               done();
           });
       });
   });
});