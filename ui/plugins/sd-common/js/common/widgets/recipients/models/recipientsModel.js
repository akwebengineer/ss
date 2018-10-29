/**
* Model for Recipients Widget.
*
* @module Common (Recipients Widget)
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define(['backbone'], function(Backbone){
	var RecipientsModel = Backbone.Model.extend({
		defaults:{
			"additional-emails":"",
			"email-subject":"",
			"comments":""
		}
	})
	return RecipientsModel;
});