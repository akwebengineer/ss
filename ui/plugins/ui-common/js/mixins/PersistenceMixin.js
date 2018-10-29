/**
 * Config persistence mix in
 * @module ColumnPersistenceMixIn
 * @author Dharma <adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], function() {
	var PersistenceMixIn = {

		getPath: function(){
			var path = this.preferencesPath;
			if(!path){
				path = this.conf.tableId  + ":" + this.conf.url;
			};
			return path;
		},

		persistConfig: function(updatedConf){
			var me=this;
			Slipstream.SDK.Preferences.save(me.getPath(), updatedConf);
		},

		getPersistedConfig: function(){
			var me=this;
			return Slipstream.SDK.Preferences.fetch(me.getPath());
		}
	};
	return PersistenceMixIn;
});
