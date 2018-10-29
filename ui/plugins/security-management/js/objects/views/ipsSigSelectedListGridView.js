/**
 * The overlay for detectors and ips sigs
 *
 * @module IPSSigGridFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    '../../../../sd-common/js/signatures/views/baseSelectedListGridView.js',
    '../conf/ipsSigStaticGridConfiguration.js',
    './ipsSigAvailableListGridView.js'
], function (Backbone, Syphon, BaseSelectedListGridViewRHS, IpsSigStaticGridConfiguration, ipsSigAvailableListGridViewLHS) {

    var IPSSigGridFormView = BaseSelectedListGridViewRHS.extend({
        initialize: function (options) {
            BaseSelectedListGridViewRHS.prototype.initialize.call(this, options);
            this.gridContainerId = 'ips-sig-static-grid';
            this.sigGroupGridConf = new IpsSigStaticGridConfiguration(this.parentView.context);
            this.sigSelectorView = new ipsSigAvailableListGridViewLHS({"parentView": this.parentView, "formTitleMsgs": this.formTitleMsgs, "uuid":this.uuid, "currentView" :this});
            /* create the grid */
            
           BaseSelectedListGridViewRHS.prototype.createSigGroupGrid.call(this);

        },
        /* Method to update the grid elements with specific data */
        updateGridConf : function(gridElements){
            gridElements.url= '/api/juniper/sd/ips-signature-management/item-selector/'+ this.uuid + '/selected-sigs';
            gridElements.ajaxOptions = {
                headers: {
                    'Accept': 'application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01'
                }
            };
            gridElements.jsonRoot= "ips-signatures.ips-signature",
            gridElements.jsonRecords= function(data) {
               
                return data["ips-signatures"]["total"];
            };      
             return gridElements;
        },
        /*Method to delete the selected records and updated the deleted records in the api */
        deleteRecords :function(uuid, selectedRowId) {          

                var url = '/api/juniper/sd/ips-signature-management/item-selector/'+ uuid ;
                var selectData = {
                "id-list" :{
                    "ids":selectedRowId
                    }
                 };
            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(selectData),
                headers: {
                  'Content-Type': 'application/vnd.juniper.sd.ips-signature-management.item-selector.de-select-signatures+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01'
                },
                error: function() {
                    console.log('Unable to get Data');
                }
            });

        },
        /* Method to update the selected signatures */
        updateDataRHS :function(uuid) {
            var datReq, url= '/api/juniper/sd/ips-signature-management/item-selector/'+ uuid  +'/selected-ids/select-all';
            $.ajax({
                url: url,
                type: 'get',
                async:false,
                headers: {
                    'Content-Type': 'application/vnd.juniper.sd.select-all-ids+json;version=1;q=0.01',
                   'accept': 'application/vnd.juniper.sd.select-all-ids+json;version=1;q=0.01'
                },
                success : function(data) {
                     datReq = data['select-ids']['select-id'];
                    
                   },
                error: function() {
                    console.log('Unable to get Data');
                }
            });

            return datReq;
        }
    });

    return IPSSigGridFormView;
});