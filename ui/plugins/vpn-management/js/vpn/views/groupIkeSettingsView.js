/**
 * Module that implements the VPN endpoint Group IKE settings view.
 *
 * @module GroupIkeSettingsView
 * @author balasaritha<balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/groupIkeFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       GroupIkeFormConfiguration
) {

    var GroupIkeSettingsView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.ikeIdentityType = "DN";
        },

        events: {
            'click #btnOk': "saveGroupIke",
            'click #linkCancel': "closeGroupIke"
        },

        render: function(){
            var self = this;
            self.getVpnProfileData();

            var formConfiguration = new GroupIkeFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {
                   "container":this.container,
                   "wildcard":this.wildcard,
                   "hostname":this.hostname
                }
            });
            this.formWidget.build();

            if(self.ikeIdentityType != undefined && self.ikeIdentityType === "HOSTNAME") {
                this.$el.find('.hostname').show();
                this.$el.find('.container').hide();
                this.$el.find('.wildcard').hide();
            } else if(self.ikeIdentityType != undefined && self.ikeIdentityType === "DN") {
                this.$el.find('.hostname').hide();
                this.$el.find('.container').show();
                this.$el.find('.wildcard').show();
            }
            // This needs to be removed once fix the issue of coming as error fields, even if settings done in conf file as required: false
            this.$el.find('#edit_groupikesettings_form input[id="wildcard"], #edit_groupikesettings_form input[id="container"]').on("blur",function() {
                 self.$el.find('#edit_groupikesettings_form label').css("color", "#444444");
                 self.$el.find('#edit_groupikesettings_form input').css("border", "solid 1px #cccccc");
            });

            return this;
        },

        getVpnProfileData: function() {
            var self = this;
            console.log(this.model);
            if(this.options.fromModify === false){  // only on create time
                this.profileId = this.model.get("generalsettings")["profile-id"];
                $.ajax({
                    url: '/api/juniper/sd/vpn-management/vpn-profiles/'+this.profileId,
                    type: 'get',
                    dataType: 'json',
                    headers: {
                       'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                    },
                    success: function(data, status) {
                        self.ikeIdentityType = data['vpn-profile']['phase1-setting']['ike-id'];
                    },
                    error: function() {
                        console.log('profile detail not fetched');
                    },
                    async: false
                });
            } else {
                self.ikeIdentityType = self.context.ikeIdentityType;
            }

        },

        getSelectedGroupIke: function() {
            var data = this.formWidget.getValues();
            return data;
        },

        setCellViewValues: function(rowData){
            var self = this;
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
            var ikeGroupId = rowData.originalRowData["ike-group-id"];
            this.hostname = (rowData.originalRowData["ike-group-id"]=="" ||rowData.originalRowData["ike-group-id"] == "Click to configure")? "" : rowData.originalRowData["ike-group-id"];
            if(ikeGroupId != undefined) {
                if(self.ikeIdentityType === "DN") {
                        this.container= (rowData.cellData[0]=="" || rowData.cellData[0] == "Click to configure")? "" : rowData.cellData[0].substr(10);
                        this.wildcard = (rowData.cellData[1])? rowData.cellData[1].substr(9):"";rowData.originalRowData["ike-group-id"];
                } else if(self.ikeIdentityType === "HOSTNAME") {
                    this.hostname = ikeGroupId;
                    if(rowData.cellData.length > 0) {
                        this.hostname = (rowData.cellData[0]=="" || rowData.cellData[0] == "Click to configure")? "" : rowData.cellData[0];
                    }
                }
            }
        },
        saveGroupIke: function(e){
            var self = this;
            var data = this.getSelectedGroupIke();
            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "GROUPIKE"
            };
            if(self.ikeIdentityType === "DN") {
                if(!data[1].value && !data[0].value){
                    self.formWidget.showFormError(self.context.getMessage("ipsec_vpns_endpoints_group_ike_error"));
                    return false;
                }
                newData.apiData = "wildcard:"+data[1].value+";"+"container:"+data[0].value;
                var nameList = [];
                nameList.push("container:"+data[0].value);
                nameList.push("wildcard:"+data[1].value);
                newData.cellData = nameList;
            } else if(self.ikeIdentityType === "HOSTNAME") {
                if(!data[2].value) return false;
                newData.apiData = data[2].value;
                newData.cellData = data[2].value;
            }

            this.options.save(this.options.columnName, newData);
            this.closeGroupIke(e);
        },

        closeGroupIke: function (e){
            this.options.close(this.options.columnName, e);
        }
    });

    return GroupIkeSettingsView;
});
