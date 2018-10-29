/** 
 * Tests for AppRouter
 *
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

var app = require('../../app').app;
var fs = require('fs');
var path = require('path');
var appRouter = require('../../modules/appRouter');
var sampleRouteFile = "routes.js";
var sampleRouteCode = "module.exports=function(app){ app.get('/slipstream/test/route',function(req,res){})};";

var cleanup = function(fileLocation) {
	fs.exists(fileLocation, function(exists) {
		if(exists){
			fs.unlink(fileLocation);
		}
	});
}

describe("appRouter tests", function() {

	var sampleRoutePath = path.join(appRoot, app.get("route directory"), sampleRouteFile);

    before(function (done) {
        fs.writeFileSync(sampleRoutePath, sampleRouteCode);
        appRouter.load(app);
        done();
    });

    after(function (done) {
       	cleanup(sampleRoutePath);
        done();
    });

    it('Application route is added', function(done) {     
    	app._router.stack.forEach(function(r){
	  		if (r.route && r.route.path){
	    		if(r.route.path == "/slipstream/test/route"){
	    			done();
	    		}
	  		}
		});
    });

});
