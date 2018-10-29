define([
    '../views/profileGeneralSettingsFormView.js',
    '../views/profileLdapOptionsFormView.js',
    '../../deviceSelector/views/assignDeviceView.js',
    '../../common/baseUserFwWizardView.js'

], function(
        GeneralSettingsFormView,
        ProfileLdapOptionsFormView,
        AssignDeviceView,
        BaseUseFwWizardView
    ){
    var PolicyWizardView = BaseUseFwWizardView.extend({
        /**
         * @overridden
         */
        getWizardPages: function(){
            this.assignDeviceToolTip = 'access_profile_assign_device';
            var self = this,
                pages = new Array(),
                basicConf = {
                    context: self.context,
                    model: self.model,
                    wizardView: self
                };

            // LDAP Server General setting view
            pages.push({
                title: self.context.getMessage('access_profile_ldap_server_title'),
                view: new GeneralSettingsFormView(basicConf)
            });

            // LDAP Options View
            pages.push({
                title: self.context.getMessage('access_profile_ldap_options_title'),
                view: new ProfileLdapOptionsFormView(basicConf)
            });

            // Assign Device View
            pages.push({
                title: self.context.getMessage('user_firewall_assign_device'),
                view: new AssignDeviceView(basicConf)
            });
            return pages;

        },
        /**
         * @overridden
         */
        updateWizardConf: function(conf){
            var self= this, title,titleToolTip, moreOption;
            if(self.formMode === self.MODE_EDIT){
                title = self.context.getMessage('access_profile_title_edit');
                titleToolTip = self.context.getMessage("access_profile_create_title_tooltip");
                moreOption = self.context.getHelpKey("EDITING_AND_DELETING_ACCESS_PROFILES");
            } else{
                title = self.context.getMessage('access_profile_create_title');
                titleToolTip = self.context.getMessage("access_profile_create_title_tooltip");
                moreOption = self.context.getHelpKey("CREATING_ACCESS_PROFILES");
            }
            _.extend(conf,{
                title: title,
                titleHelp: {
                    "content": titleToolTip,
                    "ua-help-text": self.context.getMessage('more_link'),
                    "ua-help-identifier": moreOption
                }
            })
        },
        /**
         * @overridden
         */
        saveSuccessCallBack: function(options, model){
            var self = this;
            // Invoke the success process of wizard
            if(self.formMode === self.MODE_EDIT){
                options.success(self.context.getMessage("access_profile_modified_success", [model.get("name")]));
                // defined in parent class for displaying job id
                self.createJobOverlay(model);
            }else{
                options.success(self.context.getMessage("access_profile_create_success", [model.get("name")]));
            }
        }

    });

    return PolicyWizardView;
});
