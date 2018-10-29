# App specific routes in Slipstream

Slipstream supports application defined routes which are compatible with Express 3.X standard. 

# Workflow

When framework boots up, it will load all the routes defined in 'slipstream/appRoutes/routes.js' file. This file will be considered as the main route module. Framework also has a capability to find route conflicts and generate a warning message for the same.

NOTE: Framework route handlers will always get precedence over the routes handlers defined by app.

# Requirements:

 - Routes added by application should be compatible with Express 3.X standard. (https://expressjs.com/en/3x/api.html#app.routes)
 - 'routes.js' file is considered as the main routing file and should be placed in 'slipstream/appRoutes' folder. If this file is not present, all other files in 'slipstream/appRoutes' will be ignored.
 - The routes defined in routes.js will be registered in the order in which they appear.

# Example: Sample folder structure

```
slipstream/
	appRoutes/
		routes.js
		appRoute1.js
		keystoneRoute.js
	
```

# Example: sample routes.js file

```
var appRouterIndex = function(app) {
		
		var keystoneRoutes = require('./keystoneRoute.js');

        app.get('/sample2', function(req, res) {

                res.status(200);
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.send(JSON.stringify({
                        status: 'appRoute2 works'
                }));
        });
};

module.exports = appRouterIndex;

```
