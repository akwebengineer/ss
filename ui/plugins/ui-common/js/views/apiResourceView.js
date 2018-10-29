/**
 * A view superclass for resource create and modify forms
 *
 * @module APIResourceView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    '../common/restApiConstants.js',
    'widgets/confirmationDialog/confirmationDialogWidget'
], function (Backbone, RestApiConstants, ConfirmationDialog) {

    var APIResourceView = Backbone.View.extend({

        MODE_CREATE: 'CREATE',
        MODE_EDIT: 'EDIT',
        MODE_CLONE: 'CLONE',
        MODE_CREATE_GROUP: 'CREATE_GROUP',
        MODE_VIEW : 'VIEW',
        MODE_VIEW_GROUP : 'VIEWGROUP',
        MODE_SAVE_AS:'SAVE_AS',
        MODE_PROMOTE_TO_GROUP:'PROMOTE_TO_GROUP',
        closeOverlayOnActivityFinish : true,
        nameValidationTotalProperty : RestApiConstants.TOTAL_PROPERTY,


        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.setFormMode();
        },

      /**
       * Used to determine and set the CRUD context in which the form is being used
       */
        setFormMode : function() {
          var view =this;
          switch(view.activity.getIntent().action) {
            case 'slipstream.intent.action.ACTION_CREATE':
              view.formMode = view.MODE_CREATE;
              break;
            case 'slipstream.intent.action.ACTION_EDIT':
              view.formMode = view.MODE_EDIT;
              break;
            case 'slipstream.intent.action.ACTION_CLONE':
              view.formMode = view.MODE_CLONE;
              break;
            case 'sd.intent.action.ACTION_SHOW_DETAIL_VIEW':
              view.formMode = view.MODE_VIEW;
              break;
          }
        },

        finishActivity : function(model) {
          var json = model.toJSON(), activity = this.activity;
          json = json[model.jsonRoot];

          activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, json);
          activity.finish();
          if(this.closeOverlayOnActivityFinish) {
            activity.overlay.destroy();
          }
        },

        cancelActivity : function() {
          var activity = this.activity;
          activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
          activity.finish();
          if(this.closeOverlayOnActivityFinish) {
            activity.overlay.destroy();
          }
        },

        /**
         * Function to override when you need to provide dynamic form elements
         */
        addDynamicFormConfig: function(formConfiguration) {
            this.addRemoteNameValidation(formConfiguration);
        },

        /**
         * Add remote validation to name
         */
        addRemoteNameValidation: function(formConfiguration) {
            var self = this,
                sections = formConfiguration.sections,
                flag = formConfiguration.add_remote_name_validation,
                collection = self.activity.collection;

            // In case collection doesn't exist
            if(!flag || !collection) return true;

            var headerAccept = collection.requestHeaders.accept,
                jsonRoot = collection.jsonRoot,
                jsonRootArr = jsonRoot.split('.'),
                originalValue = self.model.get('name'),
                errorMessage = self.context.getMessage('name_duplicate_error');

            var buildNameUrl = function (inputvalue){
                var urlFilter = {
                    property: 'name',
                    modifier: 'eq',
                    value: inputvalue
                };
                return collection.url(urlFilter);
            };

            var processResponse = function (state, responseText) {
                var namefield = $('#' + flag),
                    value = namefield.val();

                // For edit overlay, if name isn't changed, it's valid.
                if(originalValue && value && value === originalValue.toString()) return true;
                if(responseText){
                    try {
                        var profiles = $.parseJSON(responseText);
                        if(profiles && profiles[jsonRootArr[0]] &&
                                (profiles[jsonRootArr[0]][self.nameValidationTotalProperty])) {
                            var members = profiles[jsonRootArr[0]][jsonRootArr[1]];
                            if(!_.isArray(members)) {
                              //Also the response members may not be array for Space REST calls. Handle it
                              members = [members];  
                            }
                            for (var i=0; i<members.length; i++) {
                                if (Juniper.sm.DomainProvider.isCurrentDomain(members[i]["domain-id"])) {
                                    return false;
                                }
                            }
                        }
                    } catch (e) {
                        return true;
                    }
                }
                return true;
            };

            for (var i=0; i<sections.length; i++) {
                for (var j=0; j<sections[i].elements.length; j++) {
                    var element = sections[i].elements[j];
                    // If add_remote_name_validation flag exists, add remote validation for it.
                    if(element.id === flag){
                        element.remote = {
                            "url": buildNameUrl,
                            "type": "GET",
                            "headers": {
                                "Accept": headerAccept
                            },
                            "error": errorMessage,
                            "response": processResponse
                        };
                        return;
                    }
                }
            }
        },

        /**
         * Binds events based on the CRUD context to ensuse proper messaging happens
         */
        bindModelEvents: function() {
            // off/on calls used to ensure events won't get bound more than once
            this.model.off('sync', this.onSync, this)
                      .on('sync', this.onSync, this);
            this.model.off('error', this.onError, this)
                      .on('error', this.onError, this);
        },

        cancel: function(event) {
            event.preventDefault();
            if (this.listBuilder)
                this.listBuilder.destroy();
            this.cancelActivity();
        },

        close: function() {
            if (this.currentView && this.currentView.listBuilder) {
                this.currentView.listBuilder.destroy();
            }
        },

        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
            message = _.escape(message);
            new Slipstream.SDK.Notification()
                .setText(message)
                .setType(type)
                .notify();
        },

        /**
         * Provides consistent error messaging behavior
         */
        onError: function(model, response) {
            var self = this,
                message;

            try {
                message = JSON.parse(response.responseText);

                // concurrent edit error handling
                if (message.title === "CONCURRENT_EDIT" || message.title === "CONCURRENT_DELETE") {
                    var title = self.context.getMessage('concurrent_error_title'), question = '';
                    if(message.title === "CONCURRENT_EDIT"){
                        var lastEditTime = new Date(parseInt(message.lastEditTime, 10));
                        question = self.context.getMessage('concurrent_error', [model.get("name"), message.user, lastEditTime.toLocaleString()]);
                    }else if(message.title === "CONCURRENT_DELETE"){
                        question = self.context.getMessage('concurrent_delete_error', [model.get("name")]);
                    }
                    var conf = {
                            title: title,
                            question: question,
                            yesEvent: function() {
                                // Remove unrelated data and keep related data
                                model.unset("created-time");
                                model.unset('created-by-user-name');
                                model.unset("last-modified-time");
                                model.unset("last-modified-by-user-name");
                                model.unset("edit-version");
                                model.unset("href");
                                model.unset("uri");
                                model.unset("id");

                                var data = {
                                    action: Slipstream.SDK.Intent.action.ACTION_CREATE
                                };
                                data.model = new self.activity.model();
                                data.model.attributes = model.attributes;
                                // Pass related data to activity
                                self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED, data);
                                self.activity.finish();
                                self.activity.overlay.destroy();
                            },
                            noEvent: function() {
                                // Stay at the edit form
                                return;
                            }
                    };

                    this.createConfirmationDialog(conf);
                    return;
                }

                message = (message.title) ? message.title + ': ' + message.message : message.message;
            } catch (e) {
                message = response.responseText || response;
            }

            this.form.showFormError(message);
        },

        onSync: function(model, response) {
            this.finishActivity(model);

            // Remove bindings
            this.model.off('sync', this.onSync);
            this.model.off('error', this.onError);

            if (this.formMode == this.MODE_EDIT) {
                this.notify('success', this.context.getMessage(this.editMessageKey, [ model.get("name") ]));
            } else {
                this.notify('success', this.context.getMessage(this.successMessageKey, [ model.get("name") ]));
            }
        },

        createConfirmationDialog: function(option) {
            var self = this;

            this.confirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: self.context.getMessage('yes'),
                noButtonLabel: self.context.getMessage('no'),
                yesButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                noButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                xIcon: false
            });

            this.bindConfirmationDialogEvents(option);
            this.confirmationDialogWidget.build();
        },

        bindConfirmationDialogEvents: function(option) {
            this.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (option.yesEvent) {
                    option.yesEvent();
                }
            });

            this.confirmationDialogWidget.vent.on('noEventTriggered', function() {
                if (option.noEvent) {
                    option.noEvent();
                }
            });
        }
    });

    return APIResourceView;
});
