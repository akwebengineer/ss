/** TEST Module that defines the topology example acitivty
* @copyright Juniper Networks, Inc. 2017
*/
define([
    './views/fsTopoView.js'
], function(TopoView) {
    
    
require.config({
    urlArgs: "v=2" 
});

    var TopoRendererActivity = function() {
        this.onCreate = function() {
            console.info("Started....")
        };

        this.onStart = function() {            
            var view = new TopoView(this);
            this.setContentView(view);
        };
    };
        
    TopoRendererActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    
    return TopoRendererActivity;
});