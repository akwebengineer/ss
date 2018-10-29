/** 
 * A module that implements a Slipstream Authentication Provider.
 * This module uses the Space authentication service for authenticating/
 * unauthenticating users.
 *
 * @module Slipstream/AuthenticationProvider
 * @copyright Juniper Networks, Inc. 2014
 */
define(['./authUserNotificationManager.js'],function( AuthUserNotificationManager) {
    // key for storing user data in localstorage
    var auth_user = "slipstream:auth_user";
    var auth_userid = "slipstream:auth_userid";
    
    // session idle timeout
    var auth_idle_timeout;
    var auth_mode;
    var USER_SETTINGS_URL = "/api/space/application-management/platform/settings/user";
    var USER_SETTINGS_ACCEPT = 'application/vnd.net.juniper.space.application-management.platform.settings.user+json;version="1"';
    var AUTHMODE_URL = "/api/space/application-management/auth-mode";
    var AUTHMODE_ACCEPT_TYPE = 'application/vnd.net.juniper.space.application-management.auth-mode-response+json;version=3;q=0.03';

    /**
     * Get the cached authentication data 
     */
    var getAuthUser = function() {
        return window.localStorage[auth_user];
    }

    /**
     * Set the authentication data in the cache 
     */
    var setAuthUser = function(user) {
        window.localStorage[auth_user] = user;
    }

    /**
     * Get the id of the authenticated user
     */
    var getAuthUserid = function() {
        return window.localStorage[auth_userid];
    }

     /**
     * Set the id of the authenticated user
     */
    var setAuthUserid = function(userid) {
        window.localStorage[auth_userid] = userid;
    }
    
    /**
     * Get the session idle timeout
     */
    var getAuthIdleTimeout = function() {
        return auth_idle_timeout;
    }
    
    /**
     * Set the session idle timeout 
     */
    var setAuthIdleTimeout = function(timeout) {
        auth_idle_timeout = timeout;
    }
    
    /**
     * get auth mode of the server
     */
    var getAuthMode = function() {
      return auth_mode;
    }
  
    /**
     * set auth mode of the server
     */
    var setAuthMode = function(authmode) {
      auth_mode = authmode;
    }
    
    function AuthenticationProvider() {
        Slipstream.SDK.AuthenticationProvider.call(this);
        
        this.onCreate = function() {
    	    console.log("creating an authentication provider");
        };
        
        this.onStart = function() {
            console.log("starting an authentication provider");
            AuthUserNotificationManager.subscribeNotifications(this.isUserAuthenticated);
        };
    }

    AuthenticationProvider.prototype = Object.create(Slipstream.SDK.AuthenticationProvider.prototype);
    AuthenticationProvider.prototype.constructor = AuthenticationProvider;

    /**
     * Overrides the implementation in the AuthenticationProvider class.
     */
    AuthenticationProvider.prototype.isUserAuthenticated = function(options) {
        var ACCEPT_TYPE = "application/vnd.net.juniper.space.user-management.user-ref+json;version=1;"
        var status_url = "/api/space/user-management/login-status";

        options = options || {};
         
        var ajax_options = {
            url: status_url,
            headers: {
                Accept: ACCEPT_TYPE
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (options.fail) {
                    options.fail((jqXHR.responseText)?jqXHR.responseText:textStatus);
                }
            }
        };

        $.ajax(ajax_options).then(function(data) {
            var user_deferred = $.Deferred();

            if(getAuthIdleTimeout() == undefined) {
                var usersettings_promise = $.ajax({
                    url: USER_SETTINGS_URL,
                    headers: {
                        Accept: USER_SETTINGS_ACCEPT
                    }
                });
                usersettings_promise.then( function( usersettings ) {
                    if(usersettings && usersettings["user"]) {
                        var idleTimeoutMins = usersettings ["user"] ["auto-logout"];
                        setAuthIdleTimeout(idleTimeoutMins);
                    }
                    user_deferred.resolve(data);
                    
                }).fail(function(){
                    console.log("Failure in loading idle timeout");
                    user_deferred.resolve(data);
                });
            } else {
                user_deferred.resolve(data);
            }

            return user_deferred;
        }).then(function(data) {
            if (data.user && data.user.name) {
                setAuthUser(data.user.name);
            }
            if (data.user && data.user.id) {
                setAuthUserid(data.user.id);
            }

            if (options.success) {
                options.success();
            }    
        });
    }
    

    /**
     * Overrides the implementation in the AuthenticationProvider class.
     */
    AuthenticationProvider.prototype.authenticate = function(user, credentials, options) {
        var auth_url = "/api/space/user-management/login";
        var ACCEPT_TYPE = 'application/vnd.net.juniper.space.user-management.user-ref+json;version=1;';
        var self = this;

        options = options || {};

        var ajax_options = {
            url: auth_url,
            method: "POST",

            headers: {
                'Accept': ACCEPT_TYPE,
                'Authorization': "Basic " + btoa(user + ":" + credentials)
            }
        };

        ajax_options.error = function(jqXHR, textStatus, errorThrown) {
            if (options.fail) {
                var errorText = self.getContext().getMessage("unknown_authentication_failure");

                if (jqXHR.responseJSON) {
                    switch(jqXHR.responseJSON.status_code) {
                        case 1:
                            errorText = self.getContext().getMessage("incorrect_username_or_password");
                            break;
                        case 2:
                            errorText = self.getContext().getMessage("account_disabled");
                            break;
                        case 3:
                            errorText = self.getContext().getMessage("no_user_roles_assigned");
                            break;
                        case 4:
                            errorText = self.getContext().getMessage("account_locked");
                            break;
                        case 5:
                            errorText = self.getContext().getMessage("exceeded_user_sessions", [user]);
                            break;    
                        case 6:
                            errorText = self.getContext().getMessage("password_expired");
                            break; 
                    }
                }
                options.fail(errorText);
            }
        }        

        $.ajax(ajax_options).then(function(data) {
            var user_deferred = $.Deferred();
            var usersettings_promise = $.ajax({
                url: USER_SETTINGS_URL,
                headers: {
                    Accept: USER_SETTINGS_ACCEPT
                }
            });
            usersettings_promise.then( function( usersettings ) {
                if(usersettings && usersettings["user"]) {
                      var idleTimeoutMins = usersettings ["user"] ["auto-logout"];
                      setAuthIdleTimeout(idleTimeoutMins);
                }
                user_deferred.resolve(data);
            }).fail(function(){
                  console.log("Failure in loading idle timeout");
                  user_deferred.resolve(data);
            });
            return user_deferred;
        }).then(function(data) {
            if (data.user && data.user.name) {
                setAuthUser(data.user.name);
            }
            if (data.user && data.user.id) {
              setAuthUserid(data.user.id);
            }

            if (options.success) {
                options.success();
            }
        });
        
    }

    /**
     * Overrides the implementation in the AuthenticationProvider class.
     */
    AuthenticationProvider.prototype.unauthenticate = function(options) {
        var logout_url = "/api/space/user-management/logout";

        options = options || {};
        AuthUserNotificationManager.unSubscribeNotifications();
        var ajax_options = {
            url: logout_url,
            method: "POST",
        };
 
        ajax_options.success = function() {
            window.localStorage.removeItem(auth_user);
            window.localStorage.removeItem(auth_userid);
            
            if (options.success) {   
                options.success();
            }
        }
       
        ajax_options.error = function(jqXHR, textStatus, errorThrown) {
            if (options.fail) {
                options.fail(textStatus);
            }
        }
        
        $.ajax(ajax_options);
    }

    /**
     * Overrides the implementation in the AuthenticationProvider class.
     */
    AuthenticationProvider.prototype.getUserName = function() {
        return getAuthUser();
    }

    /**
     * Overrides the implementation in the AuthenticationProvider class.
     */
    AuthenticationProvider.prototype.getUserid = function() {
        return getAuthUserid();
    }
    
    /**
     * Overrides the implementation in the AuthenticationProvider class.
     */
    AuthenticationProvider.prototype.getIdleTimeout = function() {
        return getAuthIdleTimeout();
    }
    
    /**
     * Overrides the implementation in the AuthenticationProvider class.
     */
    AuthenticationProvider.prototype.getAuthenticationMode = function(options) {

        options = options || {};

        var authmode_ajax_options = {
                                     url: AUTHMODE_URL,
                                     method: "GET",
                                     headers: {
                                       'Accept': AUTHMODE_ACCEPT_TYPE
                                     }
        };
        authmode_ajax_options.error = function(jqXHR, textStatus, errorThrown) {
          if (options.fail) {
            options.fail();
          }
        }
        $.ajax(authmode_ajax_options).then(function(data) {
          if(data['auth-mode-response'] != null && data['auth-mode-response']['value'] != null){
            setAuthMode( data['auth-mode-response']['value'] );
          }
          if(options && options.success){
              options.success(getAuthMode());
          }
        });
    }

    return AuthenticationProvider;
});
