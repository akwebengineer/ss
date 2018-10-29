/** 
 * A module that serves as an entry point to load app-defined routes.
 * @module appRouter
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
  
  var fs = require('fs');
  var validExt  = ['js'];
  var path = require('path');
  var route_file_name = "routes.js";
  
  /**
   * Require application defined route file.
   *
   * @param {Object} app - the express app object
   * @param {String} route_directory - absolute path of app-specific route directory
   */
  var requireRoutes = function (app, route_directory) {

      var path_to_route = path.join(route_directory, route_file_name);

      if (fs.existsSync(path_to_route)) {
        require(path_to_route)(app);
      }

  };

  /**
   * Find conflicts within the routes registered with Express application.
   *
   * @param {Object} app - the express app object
   */
  var findConflicts = function (app) {

    var routerObj = {};
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path && r.route.stack[0].method){
    
        var method = r.route.stack[0].method.toUpperCase();
        var path = r.route.path;

        if(!Array.isArray(routerObj[method])) {
           routerObj[method] = new Array();
        }
        else {

          if(routerObj[method].indexOf(path) != -1) {
            // To display warning in different color
            console.warn('\x1b[33m%s\x1b[0m ', "WARNING: " + path + " conflicts with an existing route using the method " + method + " and may be ignored");
            return;
          }
        }
        routerObj[method].push(path);
      }
    });
  };

exports.load = function (app) {
  var route_directory = path.join(appRoot, app.get("route directory"));
  requireRoutes(app, route_directory);
  findConflicts(app);
};
