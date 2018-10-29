# Writing Slipstream Middleware Providers

Slipstream middleware provider can decorate Express middleware's request and response object and pass it to the other middlewares/routes. 


# Workflow

The providers will be loaded in the provider_cache when the app starts. The Slipstream's resolver middleware will check the cache for the corresponding provider. If available, it will pass the context to the provider.

For example, the whoAmIResolver middleware will check if the whoAmIProvider is available in the provider cache or not. If available, it will pass the context to the whoAmIProvider. The provider will interact with backend server and get the user information from session/token and attach the username to response object. It will then pass the execution control to next middleware.

# Requirements:

1. The middlware provider should always be of same name as corresponding resolver in order to be resolved correctly. For example, the provider for the whoAmIResolver should always be named as whoAmIProvider.

2. All providers should be in slipstream/appProvider directory.

3. The provider should always have these three parameters:

```

* @param {Object} request - The request
* @param {Object} response - The response                           
* @param {Function} next - The function to pass the execution control to next middleware

```

4. The provider should either throw an error in response or execute the next function to pass the execution control to next middleware.


# whoAmIProvider
Bellow is a sample of whoAmIProvider to get the user information.

```

var whoAmIProvider = function WhoAmIProvider(req, res, next) {

	var http = require('https');
	var request = require('request');
	var host = req.headers.host

	request({
			url: 'https://'+host,
			method: 'GET',
		},  function(error, response, data) {
				if(error) {
					res.status(401);
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					return res.send(JSON.stringify({
						status: error.toString()
					}));
				}
				else {
					res.locals.username = data.user;
					next();
			}
		});

	}

```

# preferencesProvider
By default Slipstream uses the redis database to persist user interface related preferences. The data is then provided through RESTful interfaces. Since redis is the default database, the preferencesProvider implementation uses redis client/adapter to fetch data. This can be swapped with desired database adapters. If the default provider is swapped with a new provider, it should return a constructor with getUserPreferences, putUserPreferences, deleteUserPreferences, getSessionPreferences, putSessionPreferences and deleteSessionPreferences as instance methods. Also, please note that the provider is a node module. 

PreferencesProvider employ two ways to persist and retrieve data through unique keys; username and sessionToken.

**User Name**
GET, PUT and DELETE operations invoke callback functions 'getUserPreferences', 'putUserPreferences' and 'deleteUserPreferences' respectively. The functions are provided with parameters such as username, body, done and fail.
      
- *username*: user name which can be used as the key.
- *body*: This parameter is provided for update / PUT REST calls. The data provided can be used for persistence.
- *done*: Callback function to invoke when data operation is successful.
- *fail*: Callback function to invoke when data operation is not successful.

```
var preferencesProvider = function PreferencesProvider() {
    this.getUserPreferences = function (username, done, fail) {
        redisClient.get(username, function (err, reply) {
            ..
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(reply);               
            }
         });
    });
         
    this.putUserPreferences = function (username, body, done, fail) {
        redisClient.set(username, JSON.stringify(body), function (err) {
            ..
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }))
            } else {
                done(JSON.stringify({
                    status: 'Success - Updated preferences for user'
                }));
            }
        });
    });
    
    this.deleteUserPreferences = function (username, done, fail) {
        ..
        redisClient.del(username, function (err) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(JSON.stringify({
                    status: 'Success - Deleted preferences for user'
                }));
            }
        });
    });
}
```

**Session Token**
GET, PUT and DELETE operations invoke callback functions 'getSessionPreferences', 'putSessionPreferences' and 'deleteSessionPreferences' respectively. The functions are provided with parameters such as username, body, done and fail.

- *sessionToken*: session token which can be used as the key.
- *body*: This parameter is provided for update / PUT REST calls. The data provided can be used for persistence.
- *done*: Callback function to invoke when data operation is successful.
- *fail*: Callback function to invoke when data operation is not successful.

```
var preferencesProvider = function PreferencesProvider() {
    this.getSessionPreferences = function (sessionToken, done, fail) {
        ..
        redisClient.get(sessionToken, function (err, reply) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(reply);                
            }
         }
    });
         
    this.putSessionPreferences = function (sessionToken, body, done, fail) {
        redisClient.set(sessionToken, JSON.stringify(body), function (err) {
            ..
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(JSON.stringify({
                    status: 'Success - Updated preferences for session'
                }));
            }             
        }
    });
    
    this.deleteSessionPreferences = function (sessionToken, done, fail) {        
        redisClient.del(sessionToken, function (err) {
            ..
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(JSON.stringify({
                    status: 'Success - Deleted preferences for session'
                }));
            }               
        }
    });
}
```