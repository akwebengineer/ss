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
    '../../../../sd-common/js/signatures/views/baseSigAvailableListGridView.js',
    '../conf/ipsSigGridConfiguration.js'
], function (Backbone, Syphon, baseSigAvailableListGridView, IpsSigGridConfiguration) {

    var IPSSigSelectormView = baseSigAvailableListGridView.extend({
        initialize: function (options) {
            baseSigAvailableListGridView.prototype.initialize.call(this, options);
            this.gridConf = new IpsSigGridConfiguration(options.parentView.context);
            this.config ={id:'ips_static_sig'};
            this.context.type = "static";
           // baseSigAvailableListGridView.prototype.render.call(this);
        },
        /* To add title and tooltip for title for the available ips signatures */
        updateSigFormLabel :function(formElements) {
            formElements.title = this.context.getMessage('ips_sig_static_group_form_title');
            formElements['title-help'].content = this.context.getMessage('ips_sig_static_group_add_title_tooltip');
            return formElements;
        },
         /* To update and over-write the grid element for url, header */
        updateSelectorGridConf : function(gridElements){
            gridElements.url= '/api/juniper/sd/ips-signature-management/item-selector/'+ this.options.uuid + '/available-sigs';
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
          /*update the selected Rows by passing  selected rowId 
            @param - uuid - store id , selectedrowId - int , currentview- RHS grid object */
        updatesigData :function(uuid, selectedRowId,currentview) {
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
                    'Content-Type': 'application/vnd.juniper.sd.ips-signature-management.item-selector.select-signatures+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01'
                },
                success : function() {
                    /* reload the grid in the RHS overlay window */
                        currentview.sigGroupGrid.reloadGrid({resetSelection:true});
                },
                error: function() {
                    console.log('Unable to get Data');
                }
            });

        }
    });

    return IPSSigSelectormView;
});