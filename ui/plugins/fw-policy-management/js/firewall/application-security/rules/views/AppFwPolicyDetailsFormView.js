/**
 * View to create a AppSecure Profile Details Form
 *
 */
define([
    'widgets/form/formWidget',
    '../conf/AppFwProfileDetailsFormConf.js',
    '../model/AppFwPolicyDetailsModel.js'
], function (FormWidget, AppFwProfileDetailsFormConf, AppFwProfileModel) {

    var AppFwProfileDetailsFormView = Backbone.View.extend({


        /**
         * Initialize view
         * @param options
         */
        initialize: function (options) {
            var me = this;
            me.context = options.context;
            me.container = options.container;
            me.policyObj = options.policyObj;
            me.profileModel = new AppFwProfileModel();
            me.parentView = options.parentView;
        },


        /**
         * Creates the form
         */
        createform: function () {
            var me = this,
                formConf = new AppFwProfileDetailsFormConf(me.context),
                formElements = formConf.getValues(),
                messageTextBox,
                urlBox;

            // construct the conf view form
            me.form = new FormWidget({
                "elements": formElements,
                "container": me.container
            });


            me.form.build();

            // bind validation events
            messageTextBox = me.container.find('#app_secure_block_message_type_text_value');
            urlBox = me.container.find('#app_secure_block_message_type_url_value');

            messageTextBox.bind('validateBlockMessage', $.proxy(me.validateForm, me));
            urlBox.bind('validateBlockMessage', $.proxy(me.validateForm, me));

            // set the containers based on create form
            me.hideBlockMessageOption();
            me.setMessageTypeContainers('NONE', null, true);


            me.container.find('#appfw-default-rule-type').change(
                function () {
                    var newValue = this.value;
                    if (newValue === 'permit') {
                        me.hideBlockMessageOption();
                    } else {
                        me.showBlockMessageOption();
                    }
                    me.updateProfile();
                }
            );


            // add event listener on the default action type dropdown
            me.container.find('input[name="radio_button"]:radio').change(
                function () {
                    me.updateProfile();
                }
            );


            /**
             * Add event listeners on the block message type dropdown
             */
            me.container.find('#appfw_policy_default_block_action').change(
                function () {
                    me.setMessageTypeContainers(this.value);
                    if (this.value === 'NONE') {
                        me.updateProfile();
                    }
                }
            );
            // initial load, set detault form with the initial value
             me.setPageData();
            // set the page data based on the json data received from serer on Edit action
            me.parentView.$el.bind('after-discard-policy', $.proxy(me.fetchPolicyObjectOnDiscard, me));
           
        },
        /**
         * [fetchPolicyObjectOnDiscard fetch the policy data and relaod the default form]
         * @return {[type]} [description]
         */
        fetchPolicyObjectOnDiscard: function(){
            var me = this, newPolicyObj;
             me.parentView.ruleCollection.getPolicy(function(data) {
                newPolicyObj = me.getPolicyObject(data);
                me.policyObj = newPolicyObj || me.policyObj;
                me.setPageData();
            });
        },
        /**
         * @Override for app fw policy
         * [getPolicyObject description]
         * @param  {object} data [description]
         * @return {object}      [appfwPolicy]
         */
        getPolicyObject : function(data){
          return data && data['app-fw-policy'] && data['app-fw-policy'].id? data['app-fw-policy'] : undefined;
        },
        /**
         * hide block message radio button
         */
        hideBlockMessageOption: function () {
            var me = this, blockOption;
            blockOption = me.container.find('input[name="radio_button"]:radio');
            blockOption.closest('.row').hide();
            blockOption.filter('[value=NO]').prop('checked', true);
        },
        /**
         * show block message radio button
         */
        showBlockMessageOption: function () {
            var me = this, blockOption, blockType;
            blockOption = me.container.find('input[name="radio_button"]:radio');
            blockOption.closest('.row').show();
        },
        /**
         * Sets message type containers according to the block message type
         * @param messageType
         * @param retainValue
         */
        setMessageTypeContainers: function (messageType, value, skipValidation) {
            var me = this, messageTextBox, urlBox, el;

            messageTextBox = me.container.find('#app_secure_block_message_type_text_value');
            urlBox = me.container.find('#app_secure_block_message_type_url_value');


            // hide and show boxes based on message type
            if (messageType === 'TEXT') {
                el = messageTextBox.closest('.row');
                el.show();
                urlBox.closest('.row').hide();
                if (value) {
                    messageTextBox.val(_.unescape(value));
                }

            } else if (messageType === 'REDIRECT_URL') {
                el = urlBox.closest('.row');
                el.show();
                messageTextBox.closest('.row').hide();
                if (value) {
                    urlBox.val(value);
                }
            } else {
                messageTextBox.closest('.row').hide();
                urlBox.closest('.row').hide();
            }
            // skip validation for the initial load..
            if(!skipValidation){
                // validate form
                me.form.isValidInput();
            }
            
        },

        /**
         * Sets data from the model
         * @param jsonData
         * @returns {boolean}
         */
        setPageData: function () {
            var me = this, blockAction, defaultRule, defaultRuleAction, defaultRuleBlockAction, jsonData, rbacResolver,
                formWidgets = me.form.getInstantiatedWidgets();

            jsonData = me.policyObj;

            if ($.isEmptyObject(jsonData)) {
                return false;
            }

            if (jsonData['default-rule']) {


                defaultRule = jsonData['default-rule'].split(';');

                defaultRuleAction = defaultRule[0].split('=')[1];
                formWidgets['dropDown_appfw-default-rule-type']['instance'].setValue([defaultRuleAction.toLowerCase()]);
                // set default rule action drop option and block message radio button
                defaultRuleBlockAction = defaultRule[1] ? defaultRule[1].split('=')[1] : '';
                // set message type based on defaultRuleBlockAction
                blockAction = defaultRuleBlockAction === 'true' ? 'YES' : 'NO';
                me.container.find('input[name="radio_button"]:radio').filter('[value=' + blockAction + ']').prop('checked', true);
                if (defaultRuleAction !== 'permit') {
                    me.showBlockMessageOption();
                } else {
                    me.hideBlockMessageOption();
                }
                // set mesage type text box based on the message type
                if (jsonData['block-message-type'] === undefined || jsonData['block-message-type'] === 'NONE') {
                    me.setMessageTypeContainers('NONE',null, true);
                } else {
                    me.setMessageTypeContainers(jsonData['block-message-type'], jsonData['block-message'], true);
                }
                formWidgets['dropDown_appfw_policy_default_block_action']['instance'].setValue([jsonData['block-message-type'] || "NONE"]);


            }
            //me.parentView.ruleCollection.setCollectionDirty(false);

            /**
             * [if id no RBAC  create and edit capability then disable the default rule fields..]
             */
            if (Slipstream && Slipstream.SDK && Slipstream.SDK.RBACResolver) {
                    rbacResolver = new Slipstream.SDK.RBACResolver();

                    if (!rbacResolver.verifyAccess(["modifyAppFwPolicy"])) {
                        console.log('no access to edit app fw rules..')
                        me.container.find('#appfw-default-rule-type').prop('disabled', true);
                        me.container.find('input[name="radio_button"]').prop('disabled', true);
                        me.container.find('#appfw_policy_default_block_action').prop('disabled', true);
                        if(me.container.find('#app_secure_block_message_type_text_value')){
                            me.container.find('#app_secure_block_message_type_text_value').prop('disabled', true);
                        }
                        if(me.container.find('#app_secure_block_message_type_url_value')){
                            me.container.find('#app_secure_block_message_type_url_value').prop('disabled', true);
                        }
                    }
                }
        },


        /**
         * Validates form on block action change
         * @param event
         */
        validateForm: function (event) {
            var me = this, el, value = event.target.value, name, isValid = true, formError;

            // get target name
            name = event.target.name;

            // get the element
            if (name === 'app_secure_block_message_type_text_value') {
                el = me.container.find('#app_secure_block_message_type_text_value');
                formError = me.context.getMessage('app_secure_block_message_text_form_error');
            } else if (name === 'app_secure_block_message_type_url_value') {
                el = me.container.find('#app_secure_block_message_type_url_value');
                formError = me.context.getMessage('app_secure_block_message_url_form_error');
            }

            if (!el.is(':visible')) {
                return;
            } else if (!el.parent().hasClass('error')) {
                me.updateProfile();
            } else {
                me.formError = formError;
                // on form error disable the save and set the collection dirty false..
                me.parentView.ruleCollection.setCollectionDirty(false);
                me.parentView.$el.trigger('policy-validate', formError);
            }

        },


        /**
         * Returns if there is any form error
         * @returns {*}
         */
        isFormValid: function () {
            var me = this;
            return me.formError;
        },

        /**
         * Handles submit action
         * @param eventto update on
         * Will be called everytime change in profile
         */
        updateProfile: function () {
            var me = this, jsonData = {}, blockMessageType, blockMessage, isValid = true, defaultRuleAction, defaultRuleBlockAction, blockAction;

            // get json data to be post on the server
            defaultRuleAction = me.container.find('#appfw-default-rule-type').val();
            blockAction = me.container.find('input[name="radio_button"]:checked').val() === 'NO' ? false : true;
            defaultRuleBlockAction = 'Block Message=' + blockAction;

            blockMessageType = me.container.find('#appfw_policy_default_block_action').val();

            if (blockMessageType === 'NONE') {
                blockMessage = '';
            } else {
                blockMessage = blockMessageType === 'TEXT' ? _.escape(me.container.find('#app_secure_block_message_type_text_value').val()) :
                    me.container.find('#app_secure_block_message_type_url_value').val();
            }

            me.formError = null;
            me.parentView.$el.find('#appfw_error_message_text').text('');

            jsonData = {
                'default-rule': 'Action=' + defaultRuleAction + ';' + defaultRuleBlockAction,
                'block-message-type': blockMessageType,
                'block-message': blockMessage,
                'id': Number(me.policyObj.id)
            };

            // update model
            me.profileModel.set(_.extend({}, me.policyObj, jsonData));

            // save on the model
            me.profileModel.save(null, {
                // handles save option. On success enable save button
                cuid: me.parentView.cuid,
                success: function (model) {

                    var json = model.toJSON();
                    json = json[model.jsonRoot]['app-fw-policies'];

                    me.parentView.ruleCollection.setCollectionDirty(true);
                }
            });


        }

    });
    return AppFwProfileDetailsFormView;
});