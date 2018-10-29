/**
 * Module that implements the selected vpn profile view.
 *
 * @module modifyVpnprofileView
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/tabContainer/tabContainerWidget',
    '../conf/vpnProfileFormConf.js',
    '../models/vpnProfileModel.js',
    '../models/vpnProfileCollection.js',
     '../conf/modifyVpnProfileFormConf.js',
     './vpnProfileBaseView.js'
    
], function (
       Backbone,
       Syphon,
       FormWidget,
       OverlayWidget, TabContainerWidget, VPNProfileFormConf, VPNProfileModel, VPNProfileCollection,ModifyVpnProfileFormConfiguration,vpnprofilebaseview
) {

    var ModifyVpnProfileView = vpnprofilebaseview.extend({
        initialize : function(options){
            this.context = options.context;
            this.model =  new VPNProfileModel();
            this.formMode = 'EDIT';
        },

        events: {
            'click #btnOk': "saveSelectedVpnProfile",
            'click #linkCancel': "closeVpnProfileWindow",
            'click #vpn-create-customise-id' : "vpnProfileGetCustomiseData",
            'change #profile-id' : "vpnProfileDropdownChange"
        },
        /* set the customise checkbox to default on change of profile name */
        vpnProfileDropdownChange : function() {
            //this.$el.find("#vpn-create-customise-id").show();
            if(this.$el.find("#vpn-create-customise-id").is(":checked") === true){
                this.$el.find("#vpn-create-customise-id").removeAttr('checked');
                this.destroytabContainerWidget();
            }
        },

         vpnProfileGetCustomiseData : function(event){
         /* show tabs on customise */ 
           if(this.$el.find("#vpn-create-customise-id").is(":checked") === true){
                this.modifyTabWidget();
            }
            else {
                this.destroytabContainerWidget();
            }
        },

        render: function(){
            var self = this;
            var formConfiguration = new ModifyVpnProfileFormConfiguration(this.context);
            var formElements = formConfiguration.getValues();
            var selectedVpnProfileIDList;

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()[this.model.jsonRoot]
            });
            this.form.build();

            this.getVpnProfileData();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "")
                    this.$el.find('#profile-id').val(this.passedRowData["cellData"][0]);

            return this;
        },
        
        modifyTabWidget: function() {

            /* populate the tab data */

            var data = this.getSelectedVpnProfile(),
             profId = this.getProfileIdByName(data),
             customizedProfile =  this.getAuthMethod(profId);

             this.model.set(customizedProfile);

             this.addTabWidget('tab-widget');
            
        },

        getVpnProfileData: function() {
            var self = this;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles',
                type: 'get',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profiles+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    data['vpn-profiles']['vpn-profile'].forEach(function(object) {
                       self.$el.find('#profile-id').append(new Option(object.name,object.name));
                    });
                },
                error: function() {
                    console.log('VPN Profiles not fetched');
                },
                async: false
            });
        },
       

        /* Makes the grid selected rowData available to this view
         * @param {Object} rowData from selected grid row
         */

        setCellViewValues: function(rowData) {
            this.passedRowData = rowData;
        },

        getSelectedVpnProfile: function() {
            var data = this.form.getValues();
            return data[0].value;
        },

        saveSelectedVpnProfile: function(e){
            var  data = this.getSelectedVpnProfile(),
                 vpnTunnelId = this.passedRowData.originalRowData["id"],
                 profId = this.getProfileIdByName(data),
                 customizedProfile =  this.getAuthMethod(profId),
                 selAuthMethod = customizedProfile['phase1-setting']['auth-method'],
                 selGeneralIKEID = customizedProfile['phase1-setting']['general-ikeid'];

            if(this.options.profile.authMethod.toUpperCase()!==selAuthMethod.toUpperCase()) {
                this.form.showFormError(this.context.getMessage('ipsec_vpns_tunnels_column_profile_auth_error'));
                return;
            }
            if(this.options.profile.isGeneralIkeIdProfile!==selGeneralIKEID) {
                this.form.showFormError(this.context.getMessage('ipsec_vpns_tunnels_column_profile_generalike_error'));
                return;
            }

            resultData = this.applyProfiles(vpnTunnelId,profId ,customizedProfile);
           if(!resultData)
           {
                return;
           }
            
            this.options.save(this.options.columnName,data);
           
            this.closeVpnProfileWindow(e);
        },
        
        /* validate the tabs for customised profiles */
        
        applyProfiles: function(tunnelId, vpnProfileId ,customizedProfile) {
            var self = this, results, tabsData,
            requestBody = {"apply-profile-to-tunnel-tunnels": {
                                        "vpn-device-tunnel": {
                                              "id":tunnelId,
                                              "MOID":"net.juniper.space.sd.vpnmanager.jpa.IPSecVPNEndPointEntity:"+ tunnelId
                                        }
                                    } }; ;

            if(this.$el.find("#vpn-create-customise-id").is(":checked") === true){

                tabsData = this.tabContainerWidget.getTabsData();
                    customizedProfile ["phase1-setting"] = tabsData['phase1-setting'],
                    customizedProfile ["phase2-setting"] = tabsData['phase2-setting']
                    

             if(!this.vpnTabValidation (tabsData, self)) {
                        return false;
             }
          
                /* for Customised profile */
                requestBody["apply-profile-to-tunnel-tunnels"]["vpn-profile-new"] = customizedProfile;
                                
            }
            else {
                /* non- customise profile */

                requestBody["apply-profile-to-tunnel-tunnels"]["vpn-profile-moid"] = "net.juniper.space.sd.vpnmanager.jpa.IPSecVPNProfileEntity"+":"+vpnProfileId;
                                                                    
            }
                             
            jsonRequest = JSON.stringify(requestBody);
             $.ajax({
                        url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/apply-profile-to-tunnel?ui-session-id='+ this.context.UUID,

                        type: 'post',
                        dataType: 'json',
                        headers: {
                            'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.apply-profile-to-tunnel+json;version=1;charset=UTF-8',
                            'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-tunnel-details+json;version=1;q=0.01'
                        },
                        data: jsonRequest,
                        success: function(data, status, response) {
                            self.saveVpn();
                            results = response;
                        },
                        async: false,
                        error: function(response) {
                            results = response;
                        }
                    });
            return results;
        },

        saveVpn: function() {

            var saveStatus = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-tunnels?ui-session-id=' + this.context.UUID + '&overwrite-changes=true',
                type: 'get',
                headers: {
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpn.save-tunnels-response+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    saveStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to Save VPN.');
                }
            });

            return saveStatus;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
            this.passedRowData = rowData;
        },

        closeVpnProfileWindow: function (e){
            e && e.preventDefault();
            this.options.close(this.options.columnName,e);

        },

        getAuthMethod : function(profileId) {
             var self = this;
             var authMethod="";
             $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                type: 'get',
                dataType: 'json',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                },
                success: function(data, status) {
                     self.vpnProfileData = data;
                      authMethod = data['vpn-profile'];
                },
                error: function() {
                    console.log('vpn profile data not fetched');
                },
                async: false
           });
           return authMethod;
        },

        getProfileIdByName : function(name) {
            var profileId="";
            this.options.profile.profileObjects.forEach(function(object){
                 if(object.name===name) {
                    profileId=object.id;
                 }
           });
           return profileId;
        }
    });

    return ModifyVpnProfileView;
});
