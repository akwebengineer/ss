/**
 * A object for some common methods in UTM Policy features.
 *
 * @module PolicyUtility
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../models/webFilteringCollection.js',
    '../models/antiVirusCollection.js',
    '../models/antispamCollection.js',
    '../models/contentFilteringCollection.js',
    'text!widgets/grid/templates/partialDropdownCell.html',
    'text!../templates/utmCreateButton.html'
], function (Backbone,
        Syphon,
        WebFilteringCollection,
        AntiVirusCollection,
        AntiSpamCollection,
        ContentFilteringCollection,
        OptionsTemplate,
        ButtonTemplate) {

    var PolicyUtility  = {

        /**
         * Used to get data from each page in UTM policy.
         */
        getPageData: function(page) {
            var self = this,
                jsonDataObj = {},
                properties = Syphon.serialize(this),
                profileMap = {},
                protocolMap = {
                    "http-profile": "http",
                    "ftp-download-profile": "ftp_download",
                    "ftp-upload-profile": "ftp_upload",
                    "imap-profile": "imap",
                    "pop3-profile": "pop3",
                    "smtp-profile": "smtp"
                };

            if(page === this.pages.general_information || page === this.pages.all){
                jsonDataObj = {
                    "name" : properties["name"],
                    "description": properties["description"],
                    "sessions-per-client": properties["utm_policy_connection_limit"],
                    "session-over-limit-action": properties["radio_action"]
                };
            }

            if(page === this.pages.web_filtering || page === this.pages.all){
                jsonDataObj["web-filtering-profile"] = properties["dropdown_web_filtering"] ? {"id": properties["dropdown_web_filtering"]} : null;
            }

            if(page === this.pages.anti_spam || page === this.pages.all){
                jsonDataObj["anti-spam-profile"] = properties["dropdown_anti_spam"]? {"id": properties["dropdown_anti_spam"]} : null;
            }

            if(page === this.pages.anti_virus || page === this.pages.all) {
                profileMap["anti-virus-profiles"] = "av";
            }

            if(page === this.pages.content_filtering || page === this.pages.all) {
                profileMap["content-filtering-profiles"] = "cf";
            }

            if(profileMap){
                for(var profile in profileMap){
                    if(profileMap.hasOwnProperty(profile)){
                        var profileFlag = profileMap[profile],
                            applyToAllCheckboxName = "checkbox_apply_to_all_protocol_" + profileFlag,
                            applyToAllFlag = profile + "-apply-to-all-protocols",
                            defaultDropDownName = "dropdown_" + profileFlag + "_protocol_default";
                        if(properties[applyToAllCheckboxName]){
                            jsonDataObj[applyToAllFlag] = true;

                            if(properties[defaultDropDownName]){
                                jsonDataObj[profile] = {};
                                for(var protocol in protocolMap){
                                    if(protocolMap.hasOwnProperty(protocol)){
                                        jsonDataObj[profile][protocol] = {"id": properties[defaultDropDownName]};
                                    }
                                    jsonDataObj[profile]["default-profile"] = {"id": properties[defaultDropDownName]};
                                }
                            }else{
                                jsonDataObj[profile] = null;
                            }
                        }else{
                            jsonDataObj[applyToAllFlag] = false;
                            var isValueExists = false;
                            for(var protocol in protocolMap){
                                if(protocolMap.hasOwnProperty(protocol)){
                                    var protocolFlag = protocolMap[protocol],
                                        dropdownName = "dropdown_" + profileFlag + "_protocol_" + protocolFlag;
                                    if(properties[dropdownName]){
                                        if(!isValueExists){
                                            isValueExists = true;
                                            jsonDataObj[profile] = {};
                                        }
                                        jsonDataObj[profile][protocol] = {"id": properties[dropdownName]};
                                    }
                                }
                            }
                            if(!isValueExists){
                                jsonDataObj[profile] = null;
                            }
                        }
                    }
                }
            }

            return jsonDataObj;
        },

        /**
         * Used to hide/show drop down lists.
         */
        applyToAllPotocolChange: function(checkbox) {
            var section = checkbox.parentsUntil(".form_section").filter(".section_content");
            var isChecked = checkbox.is(':checked');
            if (isChecked)
            {
                section.find(".specific-protocols").hide();
                section.find(".default-protocol").show();
            } else {
                section.find(".specific-protocols").show();
                section.find(".default-protocol").hide();
            }
        },

        /**
         * Used to set data to each page in policy utility.
         */
       setPageData: function(page) {
            var dropdownParamArr = [],
                css = '';

            if ($.isEmptyObject(this.RBAC_HASH)) { // not build yet
                this.RBAC_HASH = this.buildRbacHash({
                    "createWebFiltering": ["createWebFiltering"],
                    "createContentFiltering": ["createContentFiltering"],
                    "createAntiSpam": ["createAntiSpam"],
                    "createAntiVirus": ["createAntiVirus"]
                });
            }
            if(page === this.pages.general_information || page === this.pages.all){
                // Set value for radio box
                if (this.model.get('session-over-limit-action'))
                {
                    this.$el.find('input[type=radio][name=radio_action][value='+ this.model.get('session-over-limit-action')+']').attr("checked",'checked');
                } else {
                    this.$el.find('input[type=radio][name=radio_action][value=NONE]').attr("checked",'checked');
                }
            }

            if(page === this.pages.web_filtering || page === this.pages.all){
                this.webFilteringCollection = new WebFilteringCollection();
                css = '.dropdown-webfiltering';
                dropdownParamArr.push({
                    'collection': this.webFilteringCollection,
                    'css': css,
                    'page': this.pages.web_filtering
                });
            }

            if(page === this.pages.anti_virus || page === this.pages.all){
                if(this.model.get('anti-virus-profiles-apply-to-all-protocols')
                        || (this.model.get('anti-virus-profiles') && !$.isEmptyObject(this.model.get('anti-virus-profiles')["default-profile"]))) {
                    this.$el.find('#checkbox_apply_to_all_protocol_av').prop('checked',true);
                }
                this.antiVirusCollection = new AntiVirusCollection();
                css = '.dropdown-antivirus';
                dropdownParamArr.push({
                    'collection': this.antiVirusCollection,
                    'css': css,
                    'page': this.pages.anti_virus
                });
            }

            if(page === this.pages.anti_spam || page === this.pages.all){
                this.antiSpamCollection = new AntiSpamCollection();
                css = '.dropdown-antispam';
                dropdownParamArr.push({
                    'collection': this.antiSpamCollection,
                    'css': css,
                    'page': this.pages.anti_spam
                });
            }

            if(page === this.pages.content_filtering || page === this.pages.all){
                if(this.model.get('content-filtering-profiles-apply-to-all-protocols')
                        || (this.model.get('content-filtering-profiles') && !$.isEmptyObject(this.model.get('content-filtering-profiles')["default-profile"]))) {
                    this.$el.find('#checkbox_apply_to_all_protocol_cf').prop('checked',true);
                }
                this.contentFilteringCollection = new ContentFilteringCollection();
                css = '.dropdown-contentfiltering';
                dropdownParamArr.push({
                    'collection': this.contentFilteringCollection,
                    'css': css,
                    'page': this.pages.content_filtering
                });
            }

            if(dropdownParamArr.length > 0){
                this.getDropdownListData(dropdownParamArr);
            }
        },

        /**
         * Used to add validation to current page and set other effects.
         */
        decoratePage: function(page, formElements) {
            var createProfileParamArr = [],
                css = '';
            this.$el.addClass("security-management");
            if(page === this.pages.general_information || page === this.pages.all){
                this.$el.find(".elementlabel").addClass("label-long");
                this.addSubsidiaryFunctions(formElements);
            }

            if(page === this.pages.web_filtering || page === this.pages.all){
                css = '.dropdown-webfiltering';
                createProfileParamArr.push({
                    'capability': 'createWebFiltering',
                    'locationid': 'policy_web_filtering_profile_create',
                    'btnid': 'policy_web_filtering_btn_create',
                    'mimetype': 'vnd.juniper.net.web-filtering',
                    'css': css
                });
            }

            if(page === this.pages.anti_virus || page === this.pages.all){
                var checkboxAntivirus = this.$el.find('#checkbox_apply_to_all_protocol_av');
                    css = '.dropdown-antivirus';
                createProfileParamArr.push({
                    'capability': 'createAntiVirus',
                    'locationid': 'policy_anti_virus_profile_create',
                    'btnid': 'policy_anti_virus_btn_create',
                    'mimetype': 'vnd.juniper.net.utm-antivirus',
                    'css': css
                });
                checkboxAntivirus.bind('click', $.proxy(this.applyToAllPotocolChange, this, checkboxAntivirus));
                this.applyToAllPotocolChange(checkboxAntivirus);
            }

            if(page === this.pages.anti_spam || page === this.pages.all){
                css = '.dropdown-antispam';
                createProfileParamArr.push({
                    'capability': 'createAntiSpam',
                    'locationid': 'policy_anti_spam_profile_create',
                    'btnid': 'policy_anti_spam_btn_create',
                    'mimetype': 'vnd.juniper.net.utm-antispam',
                    'css': css
                });
            }

            if(page === this.pages.content_filtering || page === this.pages.all){
                var checkboxContentfiltering = this.$el.find('#checkbox_apply_to_all_protocol_cf');
                    css = '.dropdown-contentfiltering';
                createProfileParamArr.push({
                    'capability': 'createContentFiltering',
                    'locationid': 'policy_content_filtering_profile_create',
                    'btnid': 'policy_content_filtering_btn_create',
                    'mimetype': 'vnd.juniper.net.content-filtering',
                    'css': css
                });
                checkboxContentfiltering.bind('click', $.proxy(this.applyToAllPotocolChange, this, checkboxContentfiltering));
                this.applyToAllPotocolChange(checkboxContentfiltering);
            }

            if(createProfileParamArr.length > 0){
                this.createNewProfileButton(createProfileParamArr);
            }
        },

        /**
         * Used to set data for drop down list.
         */
        setDataForDropdownList: function(page) {
            var protocolArr = ['http','ftp_upload','ftp_download','imap','smtp','pop3'],
                defaultDropdown;
            if(page === this.pages.web_filtering){
                if(this.model.get('web-filtering-profile')) {
                    defaultDropdown = this.$el.find('#dropdown_web_filtering');
                    defaultDropdown.val(this.model.get('web-filtering-profile').id);
                    defaultDropdown.change();
                }
            }

            if(page === this.pages.anti_spam){
                if(this.model.get('anti-spam-profile')) {
                    defaultDropdown = this.$el.find('#dropdown_anti_spam');
                    defaultDropdown.val(this.model.get('anti-spam-profile').id);
                    defaultDropdown.change();
                }
            }

            if(page === this.pages.anti_virus || page === this.pages.content_filtering){
                var catagory = 'anti-virus-profiles',
                    profileFlag = 'av',
                    css = '.dropdown-antivirus',
                    protocol = "",
                    subCatagory = "",
                    applyToAllFlag = "";
                defaultDropdown = this.$el.find('#dropdown_' + profileFlag + '_protocol_default');
                if(page === this.pages.content_filtering) {
                    profileFlag = 'cf'
                    catagory = 'content-filtering-profiles';
                    css = '.dropdown-contentfiltering';
                }
                applyToAllFlag = catagory + '-' + "apply-to-all-protocols";

                if(this.model.get(catagory)) {
                    if(this.model.get(applyToAllFlag)
                            || !$.isEmptyObject(this.model.get(catagory)["default-profile"])){
                        this.$el.find(css).find('select').val(this.model.get(catagory)["default-profile"].id);
                        this.$el.find(css).find('select').change();
                    }else{
                        for(var i = 0; i < protocolArr.length; i++){
                            protocol = protocolArr[i],
                            subCatagory = protocol+'-profile';
                            if(protocol === 'ftp_upload'){
                                subCatagory = 'ftp-upload-profile';
                            }else if(protocol === 'ftp_download'){
                                subCatagory = 'ftp-download-profile';
                            }
                            if(this.model.get(catagory)[subCatagory] && this.model.get(catagory)[subCatagory].id){
                                this.$el.find("#dropdown_" + profileFlag + "_protocol_" + protocol).val(this.model.get(catagory)[subCatagory].id);
                                this.$el.find("#dropdown_" + profileFlag + "_protocol_" + protocol).change();
                            }
                        }
                    }
                }
            }

        },

        /**
         * Used to get data for drop down list.
         */
        getDropdownListData: function (paramArr) {
            var self = this;

            $.each(paramArr, function(index, param) {
                param.collection.fetch({
                    success: function (collection, response, options) {
                        var optionList = [],
                            options = '',
                            jsonRoot = collection.jsonRoot,
                            jsonRootArr = jsonRoot.split('.'),
                            dropdowns = self.$el.find(param.css),
                            profiles = response[jsonRootArr[0]][jsonRootArr[1]];

                        if (profiles) {
                            if (!$.isArray(profiles)) {
                              profiles = [profiles];
                            }

                            profiles.forEach(function(profile) {
                                var nameStr = profile.name + (profile['domain-name'] ? '(' + profile['domain-name'] + ')' : '');
                                optionList.push({
                                    'label': nameStr,
                                    'value': profile.id
                                });
                            });
                            options = Slipstream.SDK.Renderer.render(OptionsTemplate, {'values': optionList});
                            dropdowns.each(function() {
                                var dropdownList =  $(this).find('select');
                                dropdownList.append(options);
                                // Imitate placeholder
                                self.imitatePlaceholderForDropdownList(dropdownList, self.context.getMessage('utm_device_dropdownlist_placeholder'));
                                // Bind change event
                                dropdownList.bind('change', $.proxy(self.changeDropdownOptions, self, dropdownList));
                            });
                            // Set value to dropdown list
                            self.setDataForDropdownList(param.page);
                        }
                    },
                    error: function (collection, response, options) {
                        console.log('collection not fetched');
                    }
                });
            });
        },

        /**
         * Used to add create action to drop down list.
         */
        changeDropdownOptions: function(dropdownList) {
            var parentComp = dropdownList.parent().parent();
                specificDropdowns = parentComp.parent().find(".specific-protocols"),
                checkbox = parentComp.parent().find("input");
            if( "create_new_profile" !== dropdownList.val())
            {
                // Set the values of all drop down lists for special protocols the same as that of drop down list for default protocol
                if(parentComp.hasClass('default-protocol') && checkbox.prop('checked') === true){
                    specificDropdowns.each(function() {
                        $(this).find('select').val(dropdownList.val());
                        $(this).find('select').change();
                    });
                }
                return true;
            }

            var event = {};
            event.data = {};
            event.data.id = dropdownList[0].id;
            if(parentComp.hasClass('dropdown-webfiltering')){
                event.data.mimeType = "vnd.juniper.net.web-filtering";
                event.data.css = '.dropdown-webfiltering';
            }else if(parentComp.hasClass('dropdown-antivirus')){
                event.data.mimeType = "vnd.juniper.net.utm-antivirus";
                event.data.css = '.dropdown-antivirus';
            }else if(parentComp.hasClass('dropdown-antispam')){
                event.data.mimeType = "vnd.juniper.net.utm-antispam";
                event.data.css = '.dropdown-antispam';
            }else if(parentComp.hasClass('dropdown-contentfiltering')){
                event.data.mimeType = "vnd.juniper.net.content-filtering";
                event.data.css = '.dropdown-contentfiltering';
            }else{
                return true;
            }
            event.data.isNewOptionCreated = true;
            this.createAction(event);
            this.formWidget.getInstantiatedWidgets()["dropDown_"+dropdownList[0].id]["instance"].setValue(null);
        },

        /**
         * Used to add create profile button.
         */
        createNewProfileButton: function(paramArr) {
            var self = this;
            $.each(paramArr, function(index, param) {
                var locationID = param.locationid,
                    btnID = param.btnid,
                    mimeType = param.mimetype,
                    css = param.css;

                var addProfileBtn = self.$el.find("#" + locationID);

                var btnData = {
                    id: btnID,
                    value: self.context.getMessage('utm_policy_create_another_profile')
                };

                addProfileBtn.html(Slipstream.SDK.Renderer.render(ButtonTemplate, btnData));

                if (self.RBAC_HASH && self.RBAC_HASH[param.capability]) {
                    addProfileBtn.bind("click", {"mimeType": mimeType, 'css': css}, $.proxy(self.createAction, self));
                } else {
                    addProfileBtn.find("input[type='submit']").addClass("disabled");
                    if (css.match(/webfiltering/i)) {
                        self.$el.find("#dropdown_web_filtering > option:eq(1)").hide();
                    } else if (css.match(/contentfiltering/i)) {
                        self.$el.find("select[id*=dropdown_cf_protocol]").find("option:eq(1)").hide();
                    } else if (css.match(/antispam/i)) {
                        self.$el.find("#dropdown_anti_spam > option:eq(1)").hide();
                    } else if (css.match(/antivirus/i)) {
                        self.$el.find("select[id*=dropdown_av_protocol]").find("option:eq(1)").hide();
                    }
                }
            });
        },

        /**
         * Used to link to profile create views.
         */
        createAction: function(event) {
            var self = this;

            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                    "mime_type": event.data.mimeType
                });

            this.context.startActivityForResult(intent, function(resultCode, data) {
                if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {
                    var nameStr = data.name + (data['domain-name'] ? '(' + data['domain-name'] + ')' : '') + " " + self.context.getMessage('new'),
                        lengthOfNewFlag = self.context.getMessage('new').length + 1; // Length of "New" plus a blank

                    var dropdowns = self.$el.find(event.data.css);
                    dropdowns.each(function() {
                        var dropdownlist = $(this).find('select'),
                            newCreatedItems = dropdownlist.find('option[new="true"]');
                        newCreatedItems.each(function() {
                            var option = $(this),
                                newText = option.text().substr(0, option.text().length - lengthOfNewFlag);
                            option.text(newText);
                            option.removeAttr('new');
                        });

                        dropdownlist.find('option[value="create_new_profile"]').after("<option value='" + data.id + "' class='select-with-placeholder' new='true'>" + nameStr + "</option>");

                        if (event.data.isNewOptionCreated) {
                            if(event.data.id && event.data.id === dropdownlist[0].id){
                                dropdownlist.val(data.id);
                            }
                        }
                    });
                }else if(resultCode === Slipstream.SDK.BaseActivity.RESULT_CANCELLED) {
                    var dropdowns = self.$el.find(event.data.css);
                    dropdowns.each(function() {
                        var dropdownlist = $(this).find('select');
                        if (event.data.isNewOptionCreated) {
                            if(event.data.id && event.data.id === dropdownlist[0].id){
                                dropdownlist.val('');
                            }
                        }
                    });
                }
            });
            return this;
        },

        /**
         * Used to check whether values in mandatory fields exist
         */
        mandatoryFieldsValidation: function(values) {
            if($.isEmptyObject(values['anti-spam-profile'])
                    && $.isEmptyObject(values['anti-virus-profiles'])
                    && $.isEmptyObject(values['content-filtering-profiles'])
                    && $.isEmptyObject(values['web-filtering-profile'])){
                return false;
            }
            return true;
        }
    };

    PolicyUtility.pages = {
        'general_information': '1',
        'web_filtering': '2',
        'anti_virus': '3',
        'anti_spam': '4',
        'content_filtering': '5',
        'all': '0'
    };

    return PolicyUtility;
});
