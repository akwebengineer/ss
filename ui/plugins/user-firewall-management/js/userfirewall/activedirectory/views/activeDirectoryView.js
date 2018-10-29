/**
 * A module that launches create active directory wizard.
 *
 * @module activeDirectoryView
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    './activeDirectoryGeneralInformationView.js',
    './activeDirectorySettingsView.js',
    '../../deviceSelector/views/assignDeviceView.js',
    '../../common/baseUserFwWizardView.js'
], function (
    GeneralInfoView,
    SettingsView,
    AssignDeviceView,
    BaseUseFwWizardView
    ) {

    var ActiveDirectoryCreateWizardView = BaseUseFwWizardView.extend({

        /**
         * @overridden
         */
        getWizardPages: function(){
            this.assignDeviceToolTip = 'active_directory_assign_device';
            var self = this,
                pages = new Array(),
                basicConf = {
                    context: self.context,
                    model: self.model,
                    wizardView: self
                };

            // General Info view
            pages.push({
                title: self.context.getMessage('active_directory_general_title'),
                view: new GeneralInfoView(basicConf)
            });

            // Settings view
            pages.push({
                title: self.context.getMessage('active_directory_domain_settings'),
                view: new SettingsView(basicConf)
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
            if (self.formMode === self.MODE_CREATE) {
                title = self.context.getMessage('active_directory_create_title');
                titleToolTip = self.context.getMessage('active_directory_create_wizard_tooltip');
                moreOption = self.context.getHelpKey("CREATING_ACTIVE_DIRECTORY_PROFILES");
            } else {
                title = self.context.getMessage('active_directory_edit_title');
                titleToolTip = self.context.getMessage('active_directory_edit_wizard_tooltip');
                moreOption = self.context.getHelpKey("EDITING_AND_DELETING_ACTIVE_DIRECTORY_PROFILES");
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
                options.success(self.context.getMessage("active_directory_edit_success", [model.get("name")]));
                // defined in parent class for displaying job id
                self.createJobOverlay(model);
            }else{
                options.success(self.context.getMessage("active_directory_create_success", [model.get("name")]));
            }
        }

    });

    return ActiveDirectoryCreateWizardView;
});
