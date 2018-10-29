module.exports = function(options) {
    
    this.topURLs = function(userId, params, callback) {
        var response = [
           {
               "url": "foo/bar",
               "timeSpent": 40
           },
           {
               "url": "barney/rubble",
               "timeSpent": 1000
           }
        ];
        
    	  callback(false, response);
    }

    this.process = function() {
    }
}