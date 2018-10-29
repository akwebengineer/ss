define(["modules/plugin_discoverer"], function(PluginDiscoverer) {
    describe("Test support for autostart activities", function() {
       var original_plugin_entities_handler;

       before(function() {
           original_plugin_entities_handler = Slipstream.reqres.getHandler("plugin:entities");
           // remove all existing plugin discovery listeners
           Slipstream.vent.off("plugins:afterDiscovery");

           Slipstream.reqres.setHandler("plugin:entities", function() {
           	   var defer = new $.Deferred();
			         var promise = defer.promise();

               var plugins = new Backbone.Collection().add([
                   new Backbone.Model({
               	        name: "p1",
               	        "publisher": "Juniper Networks, Inc.",
                        "version": "0.0.1",
                        "release_date": "02.24.2015",
                        "min_platform_version": "0.0.1",
                        "dashboard": {
		                	  widgets: []
		                },
               	        activities: [{
               	        	"autostart": true,
               	        	"module": "path/to/module1",
        					        "filters": [
        					            {
        					                 "id": "obj1.list",
        					                 "action": "slipstream.intent.action.ACTION_LIST",
        					                 "data": {
        					                     "mime_type": "vnd.juniper.net.obj1"
        					                 }   
        					            }
        					        ]
               	        }]
                   }),
                   new Backbone.Model({
                   	    name: "p2", 
                   	    "publisher": "Juniper Networks, Inc.",
          					    "version": "0.0.1",
          					    "release_date": "02.24.2015",
          					    "min_platform_version": "0.0.1",
          					    "dashboard": {
		                	      widgets: []
		                    },
                   	    activities: [{
                   	      "autostart": true,
               	        	"module": "path/to/module2",
        					        "filters": [
        					            {
        					                 "id": "obj2.list",
        					                 "action": "slipstream.intent.action.ACTION_LIST",
        					                 "data": {
        					                     "mime_type": "vnd.juniper.net.obj2"
        					                 }   
        					            }
        					        ]
                   	    }]
                   })
               ]);

               defer.resolve(plugins);

               return defer;
           })
       });

       after(function() {
           Slipstream.reqres.setHandler("plugin:entities", original_plugin_entities_handler);	
       })

       it("Ensure that multiple autostart activities are recognized", function(done) {
       	   Slipstream.vent.on("plugins:afterDiscovery", function(autostart_activities) {
       	   	   assert.equal(autostart_activities.length, 2);
               done();
       	   });

           Slipstream.trigger("plugin:discover");
       });
    });
});