/**
 * @module Alert Definition
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(["backbone", '../../../sd-common/js/common/widgets/recipients/models/spaceUsersCollection.js'],
function(Backbone, UsersCollection){

	var AlertDefinitionService = function(){
		var me = this;
		//console.log(options);

        me.fetchFilterData = function(id, onSuccess){
            $.ajax({
                url: '/api/juniper/seci/filter-management/filters/' + id,
                method:"GET",
                dataType:"json",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Accept", "application/vnd.juniper.seci.filter-management.event-filter+json;version=1;q=0.01");
                },
                complete: function(data, status){
                    onSuccess(data);
                }
            });
        };

         /**returns a jquery promise*/
        me.getUsers = function(){
            var me = this,
                onSuccess,
                onFailure,
                def  = $.Deferred();
            me.users = new UsersCollection();
            //
            onSuccess = function (collection, response, options) {
                def.resolve(collection, response);
            };
            //
            onFailure = function (collection, response, options) {
                if(response.status == 403){
                    def.resolve(collection, response);
                }
                else {
                    console.log('Users collection not fetched');
                    def.reject();
                }
            };
            //
            me.users.fetch({
                success: onSuccess,
                error: onFailure
            });
            //
            return def.promise();
        };
	}
	//
	return AlertDefinitionService;
});