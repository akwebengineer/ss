/** 
 * A module that implements a client-side inverted search index
 *
 * @module 
 * @name SearchIndex
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */ 
define(["elasticlunr"], function(Elasticlunr) {
	function SearchIndex() {
		var id = 1;

		var index = Elasticlunr(function() {
        this.addField("body"); // only index the body field
		});

     /**
      * Add a document to the search index
      *
      * @param {Object} doc - The document to be added.
      */
		this.addDoc = function(doc) {
		    doc.id = id++;
        index.addDoc(doc);	
		}

     /**
      * Search the index
      *
      * @param {String} query - The query to submit against the index
      * @param {Object} options - An options hash to control query execution.  The options hash can 
      * contain the following keys:
      *
      * success - A callback to be called if execution of the query is successful.  This callback takes
      * a single argument that is an object containing the query results. 
      *
      * fail - A callback to be called if execution of the query is unsuccessful. This callback takes a 
      * single argument that is an object containing the error response.
      */
		this.search = function(query, options) {
			var results = index.search(query, {
			    fields: {
			        body: {boost: 1}
			    }
			});

			if (options.success) {
				  options.success(results);
			}
		}
	}

	return SearchIndex;
});