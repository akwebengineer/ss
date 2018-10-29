/**
 * Model for listBuilder operation
 * @module IPSSigListBuilderModel
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {
	var IPSSigListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/ips-signature-management/item-selector/',
        availableUrl: '/available-sigs',//+'?rows=20&page=1&sidx=&sord=asc&paging=(start+eq+0%2C+limit+eq+20)',
        selectedUrl: '/selected-sigs',
        availableAccept:"application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.ips-signature-management.item-selector.select-signatures+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.ips-signature-management.item-selector.de-select-signatures+json;version=1;charset=UTF-8"
    });

	return IPSSigListBuilderModel;
});


