/**
* Reusable Recipients Widget, displays 3 form fields to edit.
*
* @module Common (Recipients Widget)
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
    './conf/editRecipientsFormConfig.js',
    './models/spaceUsersCollection.js',
    './models/recipientsModel.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js'
    ],
    function(Syphon, FormWidget, DropDownWidget, FormConfig, UsersCollection, RecipientsModel, ValidationUtility){

        var RecipientWidget = Backbone.View.extend({
            events: {
                 'click #save_recipient': 'saveRecipient',
                 'click #cancel_recipient' : 'cancelRecipient'
            },
            initialize: function(options){
                var me = this;
                me.options = options;
                me.context = options.context;
                me.model = options.model;
                //Backbone.View.prototype.initialize.call(me, options);
                me.users = new UsersCollection();
                me.setTitle = true;
                me.showSubject = true;
            },

            render: function(){
                var me = this;
                me.emailIdIsValid;
                 _.extend(this, ValidationUtility);
                formConfig = new FormConfig(me.context);
                formElements = formConfig.getValues();

                me.addDynamicFormConfig(formElements);
                me.formWidget = new FormWidget({
                    container: me.el,
                    elements: formElements,
                    model: me.model,
                    values: me.model.attributes
                });

                me.formWidget.build();
                if(this.showSubject !== true) {
                	me.$el.find('.email-subject').hide();
                }
                me.createEmailDropDownWidget();
                return me;
            },

            setFormTitle: function(title) {
                if(title) {
                    return title;
                }
            },

            // Set form title dynamically
            addDynamicFormConfig: function(formConfiguration) {
                var dynamicProperties = {}, title = this.setFormTitle();

                if(this.setTitle === true) {
                    dynamicProperties['title-help'] = {
                        "content" : this.context.getMessage("reports_form_recipients_tooltip"),
                        "ua-help-text": this.context.getMessage("more_link"),
                        "ua-help-identifier": this.context.getHelpKey("REPORT_DIFFERENT_ACTION_PERFORMING")
                    };
                    dynamicProperties.title = this.context.getMessage('reports_form_recipients_caption');
                } else {
                    dynamicProperties.title = title;
                    dynamicProperties['on_overlay'] = false;
                }

                if(this.options.onOverlay){
                    dynamicProperties['buttons'] = [{id:'save_recipient',name:'save_recipient', value:'Save'}]
                    dynamicProperties['buttonsAlignedRight'] = true
                    dynamicProperties['cancel_link'] = {id:'cancel_recipient',name:'cancel_recipient', value:'Cancel'}
                }
                _.extend(formConfiguration, dynamicProperties);
            },
            saveRecipient : function(event) {
                event.preventDefault();

                if(!this.formWidget.isValidInput()) {
                  return false;
                }
                if(!this.emailIdIsValid) {
                    this.formWidget.showFormError(this.context.getMessage("reports_form_recipients_validation_error"));
                    return false;
                }
                var recipientsModel = this.getValues(),
                    additionalEmails = this.model.get('additional-emails'),
                    emailSubject = this.model.get('email-subject'),
                    comments    = this.model.get('comments');

                this.options.activity.displayRecipientsDetails(additionalEmails, emailSubject, comments);
                this.cancelRecipient(event);
            },
            cancelRecipient : function(event) {
                event.preventDefault();
                this.options.activity.overlayWidgetObj.destroy();
            },

            /** Returns a jQuery promise*/
            getUsers: function(){
                var me=this,
                    onSuccess,
                    onFailure,
                    def = $.Deferred();
                me.users = new UsersCollection();

                onSuccess = function (collection, response, options) {
                    def.resolve(collection, response);
                };
                onFailure = function (collection, response, options) {
                    if(response.status == 403){
                        def.resolve(collection, response);
                    }
                    else {
                        console.log('Users collection not fetched');
                        def.reject();
                    }
                };
                me.users.fetch({
                    success: onSuccess,
                    error: onFailure
                });

                return def.promise();
            },

            /**
            * This populates users in drop down by fetching values from server
            * URL: /api/space/user-management/users
            **/
            createEmailDropDownWidget: function() {
                var me = this,
                    dropDownContainer = this.$el.find('#additional-emails').append('<select class="recipient-form-email-field" style="width: 100%"></select>'),
                    additionalEmails = me.model.get('additional-emails') || "";

                $.when(me.getUsers()).done(function(collection) {
                    var emailsData = [],
                        emailsDataNotSpaceUsers = [],
                        emailsFromInput = additionalEmails ? additionalEmails.split(",") : ''; // Use split correctly

                    collection.each(function(model, index){
                        if(model.get('primaryEmail')) { // Add only if gets email id
                            emailsData.push({
                                "id": model.get('primaryEmail'),
                                "text": model.get('primaryEmail'),
                                "selected": additionalEmails.indexOf(model.get('primaryEmail')) > -1 ? true : false
                            });
                        }
                    });

                    for(var i = 0; i < emailsFromInput.length; i++) {
                        emailsDataNotSpaceUsers.push({
                            "id": emailsFromInput[i],
                            "text": emailsFromInput[i],
                            "selected": true
                        });
                    }

                    emailsData = _.uniq(emailsData.concat(emailsDataNotSpaceUsers), function(x) {
                        return x.id;
                    });

                    me.dropDown = new DropDownWidget({
                        "container": me.$el.find('.recipient-form-email-field'),
                        "data": JSON.stringify(emailsData),
                        "multipleSelection": {
                            maximumSelectionLength: 10,
                            createTags: true,
                            allowClearSelection: true
                        },
                        "placeholder": "Enter/Select valid emails",
                    }).build();

                    $("#recipients_form").keyup(function (e) {
                        var keyCode = (e.keyCode ? e.keyCode : e.which);
                        if(keyCode == 13) {
                            e.preventDefault();
                            return false;
                        }
                    });
                    $("#additional-emails").change(function(e){
                        e.preventDefault();
                        var arrValues = me.dropDown.getValue(),
                            comp = me.$el.find("#additional-emails"), errorMsg;
                        if(arrValues) {
                            for(var i = 0 ; i < arrValues.length; i++) {
                                var email = arrValues [i] ,
                                    isValid = me.isValidEmail(email);
                                    me.emailIdIsValid = true;

                                if(!isValid) {
                                    comp.attr("data-invalid", "").parent().addClass('error');
                                    comp.parent().prev().addClass('error');
                                    errorMsg = me.context.getMessage("reports_form_recipients_validation_error");
                                    me.emailIdIsValid = false;
                                }
                            }
                        } else {
                            errorMsg = me.context.getMessage("reports_form_recipients_required_error");
                        }
                        if(errorMsg) {
                            comp.parent().find("small[class*='error']").html(errorMsg);
                        }
                    });
                });
            },

            /**
            On form submit, update RecipientsModel
            Return updated RecipientsModel to caller activity
            */
            getValues: function(){
                var me = this;
                // Set form values
                var properties = Syphon.serialize(this),
                    recipientEmailIds = me.dropDown.getValue();
                me.model.set("additional-emails", recipientEmailIds.toString());
                me.model.set("email-subject", properties['email-subject']);
                me.model.set("comments", properties['comments']);

                return me.model;
            }

        });
        return RecipientWidget;
});
