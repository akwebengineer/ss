/**
 * View to create a AppSecure Policy
 *
 */
define([
    'widgets/form/formWidget',
    '../conf/AppFwRuleFormConf.js',
    '../model/AppFwNewRuleModel.js',
    'widgets/grid/gridWidget',
    '../conf/AppFwRuleAppSigGridConf.js',
    '../../../../../../security-management/js/objects/views/appsigGroupFormView.js',
    'widgets/overlay/overlayWidget'
], function (FormWidget, AppFwRuleFormConfiguration, AppFwRuleModel, GridWidget, AppSigGridConf, GroupFormView, OverlayWidget) {

    var AppFwCreateRuleForm = Backbone.View.extend({

        // events to be handled
        events: {
            'click #appfw_policy_rule_save': "submit",
            'click #appfw_policy_rule_cancel': "cancel",
            'validTextarea #appfw_policy_rule_form': 'validateForm'
        },
        // defining form modes
        MODE_CREATE: 'CREATE',
        MODE_EDIT: 'EDIT',


        /**
         * Initialize resource view
         * @param options
         */
        initialize: function (options) {
            var me = this;
            me.context = options.context;
            me.parentView = options.parentView;
            me.policyObj = options.policyObj;
            me.model = new AppFwRuleModel();
            // set row object
            me.rowObject = options.rowObject;

            // set form mode
            me.formMode = options.formMode;
            me.appsigData = new Backbone.Collection();


            // make new rule query.
            if (me.formMode === me.MODE_CREATE) {
                // fetch new rule info and store in the rule model
                me.model.fetch({
                    policyID: me.policyObj.id,
                    initialTemplate: true,
                    cuid:this.options.cuid,
                    error: function () {
                        console.log('AppFwCreateRule: Not able to retrieve new rule info');
                    }

                });
            } else {
                // in case of edit, set model data from row object
                me.model.set(me.rowObject.originalData);
            }
        },


        /**
         * Handles Form rendering
         * @returns {AppSecureFormView}
         */
        render: function () {
            var me = this, title, formConf, formElements
            if(this.formMode === me.MODE_CREATE){
                title = 'appfw_policy_create_rule';
            } else if(this.formMode === me.MODE_EDIT){
                title = 'appfw_policy_edit_rule';
            } else {
                title = 'appfw_policy_clone_rule';
            }

            formConf = new AppFwRuleFormConfiguration(me.context, title);
            formElements = formConf.getValues();


            // construct the conf view form
            me.form = new FormWidget({
                elements: formElements,
                container: me.el
            });


            me.form.build();

            me.createAppSigGrid();

            // add event listener on the default action type dropdown
            me.$el.find('#appfw-policy-rule-default-rule-type').change(
                function () {
                    var newValue = this.value;
                    if (newValue === 'PERMIT') {
                        me.hideBlockMessageOption();
                    } else {
                        me.showBlockMessageOption();
                    }
                }
            );

            // add the base class
            me.$el.addClass("security-management");

            // add model data on the form in case of edit
            if (me.formMode === me.MODE_EDIT) {
                me.populateFormData();
            }

            return me;
        },

        /**
         * Creates Application signature grid
         */
        createAppSigGrid: function () {
            var appSigGridContainer = this.$el.find('#appfw-sig-grid').empty(),
                appSigGridConf = new AppSigGridConf(this.context);


            this.appsigGrid = new GridWidget({
                container: appSigGridContainer,
                elements: appSigGridConf.getValues(),
                actionEvents: appSigGridConf.getEvents()
            }).build();

           // appSigGridContainer.find('.grid-widget').unwrap();
            appSigGridContainer.find(".grid-widget").addClass("elementinput-long-app-fw-signature-grid");
            this.bindEvents(appSigGridConf.getEvents());

            this.$el.find(".create").attr("title","Add");
            this.$el.find(".delete").attr("title","Remove");
        },


        /**
         * Binding events to the grid
         * @param definedEvents
         */
        bindEvents: function (definedEvents) {
            if (definedEvents.createEvent) {
                this.$el.bind(definedEvents.createEvent, $.proxy(this.addAction, this));
            }
        },

        /**
         * Handling add action on the application signature grid
         * @returns {AppFwCreateRuleForm}
         */
        addAction: function () {
            var selectedRowIds = [], visible, appsigGroupForm;
            visible = this.appsigGrid.getAllVisibleRows();
            for (i = 0; i < visible.length; i++) {
                selectedRowIds.push(visible[i].id);
            }

            appsigGroupForm = new GroupFormView({"parentView": this, "formMode": "create", "selectedRows": selectedRowIds});
            this.overlay = new OverlayWidget({
                view: appsigGroupForm,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();
            return this;
        },
        /**
         * hide block message radio button
         */
        hideBlockMessageOption: function () {
            var me = this;
            me.$el.find('input[name="radio_button"]:radio').closest('.row').hide();
        },

        /**
         * show block message radio button
         */
        showBlockMessageOption: function () {
            var me = this, blockOption;
            blockOption = me.$el.find('input[name="radio_button"]:radio');
            blockOption.closest('.row').show();
            blockOption.filter('[value=NO]').prop('checked', true);
        },

        /**
         * Populate edit rule form data
         */
        populateFormData: function () {
            var me = this, jsonData, blockOption, blockVal;

            jsonData = me.rowObject.originalData;

            // set name
            me.$el.find('#appfw-policy-rule-name').val(jsonData.name);

            // set name
            me.$el.find('#appfw-policy-rule-description').val(jsonData.description);

            // set application signatures
            me.populateAppSigGroup(jsonData['app-sigs']);

            // set encryption
            me.$el.find('[name="appfw_policy_rule_encryption"]').val(jsonData.encryption);

            // set block action
            me.$el.find('#appfw-policy-rule-default-rule-type').val(jsonData.action);

            // set block message action
            blockOption = me.$el.find('input[name="radio_button"]:radio');
            if (jsonData.action === 'PERMIT') {
                blockOption.closest('.row').hide();
            } else {
                blockVal = jsonData['block-message'] === true ? 'YES' : 'NO';
                blockOption.filter('[value=' + blockVal + ']').prop('checked', true);
            }
        },

        /**
         * Populate selected application signature on edit action
         */
        populateAppSigGroup: function (appSigMembers) {
            var me = this, i, members, idList = [], appSigMemberData;
            if (appSigMembers && appSigMembers.reference) {
                members = appSigMembers.reference;

                members = $.isArray(members) ? members: [members];
                for (i = 0; i < members.length; i++) {
                    idList.push(members[i].id);
                }

                // set app signature data
                appSigMemberData = {
                    'id-list': {
                        ids: idList
                    }
                };

                $.ajax({
                    url: '/api/juniper/sd/app-sig-management/app-sigs-by-ids',
                    type: 'POST',
                    headers: {
                        'Accept': 'application/vnd.juniper.sd.app-sig-management.application-signatures+json;version=2;q=0.02',
                        'Content-Type': 'application/vnd.juniper.sd.app-sig-management.id-list+json;version=2;charset=UTF-8'
                    },
                    data: JSON.stringify(appSigMemberData),
                    processData: false,
                    success: function (data) {
                        //update list builder with appsigs already assigned
                        members = data['application-signatures']['application-signature'];
                        members = $.isArray(members) ? members: [members];
                        for (i = 0; i < members.length; i++) {
                            me.appsigGrid.addRow(members[i]);
                        }
                    }

                });

            }
        },


        /**
         * Handles submit action
         * @param event
         */
        submit: function (event) {
            event.preventDefault();
            var me = this, jsonData, appSigRows, appSigMembers = [], successCallback, errorCallback;

            // get app sig rows
            appSigRows = me.appsigGrid.getAllVisibleRows();

            // Check if the form  is valid or not
            if (!me.form.isValidInput() || this.$el.find('form').find("#appfw-policy-rule-description").val().trim().length >225) {
                console.log('The form is invalid');
                return;
            }

            // show form error in case no app sig selected. Required
            if (appSigRows.length < 1) {
                me.form.showFormError(me.context.getMessage('appfw_app_sig_required_error'));
                return false;
            }

            // update app signature
            appSigRows.forEach(function (object) {
                appSigMembers.push(
                    {
                        'id': object.id,
                        "name": object.name,
                        "domain-id": object['domain-id']
                    });
            });


            // set data to be send to the server
            jsonData = {
                'name': me.$el.find('#appfw-policy-rule-name').val(),
                'action': me.$el.find('#appfw-policy-rule-default-rule-type').val(),
                'encryption': me.$el.find('[name="appfw_policy_rule_encryption"]').val(),
                'description': me.$el.find('[name="description"]').val(),
                'app-sigs': {
                    'reference': appSigMembers
                },
                'block-message': me.$el.find('input[name="radio_button"]:checked').val() === 'YES' ? true : false
            };

            // setting rule order as -1 in case of create
            if (me.formMode === me.MODE_CREATE) {
                jsonData['rule-order'] = -1;
            }

            //set the data to model
            _.extend(me.model.attributes, jsonData);

            successCallback = function (model, response) {
                me.parentView.ruleCollection.setCollectionDirty(true);
                // me.parentView.$el.trigger("closeRuleWizard");
                me.parentView.ruleCollection.trigger("closeRuleWizard");
            };

            errorCallback = function (model, response) {
                var message;

                try {
                    message = JSON.parse(response.responseText);
                    message = (message.title) ? message.title + ': ' + message.message : message.message;
                } catch (e) {
                    message = response.responseText || response;
                }
            };

            if (me.formMode === me.MODE_CREATE) {
                me.parentView.ruleCollection.addNewRule(me.model, successCallback, errorCallback);
              
            } else {
                // calling rule collection - modify rule
                me.parentView.ruleCollection.modifyRule(me.model, successCallback, errorCallback);
            }

        },

        /**
         * On cancel,  destroy the overlay
         * @param event
         */
        cancel: function (event) {
            event.preventDefault();
            //this.parentView.$el.trigger("closeRuleWizard");
            this.parentView.ruleCollection.trigger("closeRuleWizard");
        },

        /**
         * Validates form details
         * @param event
         */
        validateForm: function (event) {
            
            var me = this, el, value = event.target.value, allowBlank = true,
                blankErrorText, removeError = false;

            el = me.$el.find('#appfw-policy-rule-description');

            if (el) {
                if (value && value.trim()) {
                    if (value.trim().length > 255) {
                        el.closest('.row').addClass('error');
                        el.siblings('.error').show().text(me.context.getMessage("maximum_length_error", [255]));

                    } else {
                        removeError = true;
                    }
                } else if (allowBlank) {
                    removeError = true;
                } else {
                    el.closest('.row').addClass('error');
                    el.siblings('.error').show().text(blankErrorText);
                }

                if (removeError) {
                    el.closest('.row').removeClass('error');
                    el.siblings('.error').hide().text('');
                }
            }
            return !removeError;
        }
    });
    return AppFwCreateRuleForm;
});