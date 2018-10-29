/**
 * Firewall rule options view 
 *
 * @module FirewallRuleOptionsView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/dropDown/dropDownWidget',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    '../constants/fwRuleGridConstants.js',
    '../../../../../security-management/js/objects/models/schedulerModel.js',
    '../conf/fwRuleOptionsEditorConfig.js',
    './fwRuleProfileEditorView.js'
    ],function(Backbone, FormWidget, OverlayWidget, DropDownWidget, BaseGridCellEditor, PolicyManagementConstants, SchedulerModel, FWRuleOptionsConf, 
        ProfileEditorView) {

        var FirewallRuleOptionsEditorView = BaseGridCellEditor.extend({
            events:{
                 "click #ok": 'updateProfileValuesOnView',
                 'click #linkCancel': 'closeOverlay',
                 "click #profile_overlay": "showProfileOverlay",
                 "click #scheduler_overlay": "showSchedulerOverlay"
//                 "change #scheduler": "updateModelForScheduler"
            },

            initialize: function(){
                var me = this;
                this.context = this.options.context;
                this.policyObj = this.options.policyObj;
                this.setFormConfiguration();
            },

            setFormConfiguration: function() {
                this.formConfiguration = new FWRuleOptionsConf(this.context);
            },

            render: function(){
                var self = this;
                
                this.form = new FormWidget({
                     "elements": self.formConfiguration.getElements(),
                     "container": this.el
                });
                this.form.build();

                var schedulerUrlParams = {
                  acceptHeader : PolicyManagementConstants.SCHEDULER_ACCEPT_HEADER,
                  url : PolicyManagementConstants.SCHEDULER_URL,
                  jsonRoot : "schedulers.scheduler",
                  jsonRecordParam : "schedulers",
                  templateResult : this.formatRemoteResult,
                  templateSelection:this.formatSchedulerRemoteResultSelection
                };

                var schedulerEditor = self.$el.find('#scheduler').parent();
                $(schedulerEditor).empty();
                var $span =  $(schedulerEditor).append('<select class="rulescheduler" style="width: 100%"></select>');
                self.schedulerDropdown = self.createRemoteDropDown('rulescheduler',self.schedulerChangeHandler,schedulerUrlParams);
                
                if (self.model.get("scheduler") && self.model.get("scheduler")["name"]){
                    self.schedulerDropdown.setValue({id:self.model.get("scheduler")["id"],text:self.model.get("scheduler")["name"]});
                }

                this.$el.addClass("security-management");

                var profileTextElem = this.$el.find("#profile");
                $(profileTextElem).append("<div class=formatable-text-div id=profile_txt></div>");
                profileTextElem.add( "span" ).css( "font-size", "12px" );
                
//                var profile_type = this.model.attributes["rule-profile"]["profile-type"];
                // var profile_type = this.model.get("rule-profile")["profile-type"];
                // if (profile_type == "USER_DEFINED") {
                //     profileTextElem.text(this.model.get("rule-profile").name);
                // } else if (profile_type == "INHERITED") {
                //     profileTextElem.text("Inherited");
                // } else if (profile_type == "CUSTOM") {
                //     profileTextElem.text("Custom");
                // } else if (profile_type == "NONE")  {
                //     profileTextElem.text("None");
                // }

                //Creating a clone of model to be used for temporary changes made.
                this.cloneModel = this.model.clone();

                this.setupViewValues();

//                this.setDefaultFormValues();

                this.cloneModel.on('change', function(e) {
                    self.setDefaultFormValues(e);
                });

                return this;
            },

            setDefaultFormValues : function(e){
                this.setupViewValues(e);
            },          

            createRemoteDropDown : function(container,onchange,urlParameters) {
              var self = this;
              return new DropDownWidget({
                        "container": self.$el.find("."+container),
                        "enableSearch": true,
                        "allowClearSelection": true,
                        "placeholder": self.context.getMessage('select_option'),
                        "remoteData": {
                            headers: {
                                "accept" : urlParameters.acceptHeader
                            },
                            "url": urlParameters.url,
                            "numberOfRows": 500,
                            "jsonRoot": urlParameters.jsonRoot,
                            "jsonRecords": function(data) {
                                return data[urlParameters.jsonRecordParam]['total'];
                            },
                            "success": function(data){},
                            "error": function(){console.log("error while fetching data");}
                        },
                        "templateResult": urlParameters.templateResult,
                        "templateSelection": $.proxy(urlParameters.templateSelection,self),
                        "onChange": function(event) {
                            if (onchange) {onchange($(this).val(),self);}
                         }
              }).build();
            }, 

            formatRemoteResult : function(data) {
              return data.name;
            }, 

            formatSchedulerRemoteResultSelection: function (data) {
              if(data.name) {
                this.cloneModel.set({"scheduler" : data});
              }  
              return data.name;
            },

            schedulerChangeHandler : function(value,scope) {
               if(!scope) {
                return;
               }
              var THIS = scope;
              if(_.isEmpty(value)) {
                THIS.cloneModel.set({"scheduler" : value});
              }
            },

            showProfileOverlay : function(){
 
                var profileEditorView = new ProfileEditorView({
                    'policyObj': this.policyObj,
//                    'save': _.bind(this.updateProfileValuesOnView, this),
                    'close': _.bind(this.closeProfileOverlay, this),
                    'context': this.context,
                    "model" : this.cloneModel
                });
                this.profileOverlay = new OverlayWidget({
                    view: profileEditorView,
                    type: 'large',
                    showScrollbar: true
                });

                this.profileOverlay.build();
            },


    //         updateData: function (e) {
    //         // update data on form & save to backend cache
    //             var data = {};
    //             var backendData = {};
    //             var gridData = {};

    //             if (this.form.isValidInput(this.$el.find('form'))) {
    //                 var values = this.form.getValues();
    //                 for (var i = 0; i < values.length; i++) {
    //                     data[values[i].name] = values[i].value;
    //                 }
    //                 var selectedValuesObject = this.getValuesFromEditor();
    //                 if ((selectedValuesObject.valuesForGridCell.length != 0 ) && (selectedValuesObject.valuesForGridCell.length != 0)) {
    //                     // values on grid
    //                     data[this.options.columnName] = selectedValuesObject.valuesForGridCell;
    //                     // Save to cache
    //             //        this.saveEditorValuesToCache(selectedValuesObject.valuesForAPICall);
    //                     // show values on grid

    //                     gridData["profile-type"] = data["ruleProfile.profileType"];
    // //                    backendData["profile-type"] = data["profile_type"];
    //                     backendData = selectedValuesObject.valuesForAPICall;

    //                     data['gridData'] = gridData;
    //                     data['backendData'] = backendData;

    //                     //TODO save the values to the model

    // //                    this.options.save(this.options.columnName, data);
    //                     this.closeOverlay(e);
    //                 } else {
    //                     //show error to user for not selecting values
    //  //                   UtilityClass.showErrorDialogue(this._originalRowData.name, "editorSave", {}, this);
    //                 }
    //             }
    //         },

            // closeProfileOverlay : function (columnName, e) {
            //     if (this.options.columnName) {
            //         this.options.close(this.options.columnName, e);

            setupViewValues : function(e){
                var profileTextElem = this.$el.find("#profile_txt");
 
//                var profileName = this.model.get("rule-profile").name;
                var profileType = this.cloneModel.get("rule-profile")["profile-type"];

                if (profileType == "NONE" || profileType == "") {  // NONE
                    profileTextElem.text("None");
                } else if (profileType == "INHERITED") {
                    profileTextElem.text("Inherited from policy");
                } else if (profileType == "USER_DEFINED") {
                    profileTextElem.text(this.cloneModel.get("rule-profile")["user-defined-profile"].name);
                } else if (profileType == "CUSTOM"){
                    profileTextElem.text("Custom");
                }
            },

            updateProfileValuesOnView : function(e) {
                //Set Actual Model with CloneModel Values
                this.model.set(this.cloneModel.attributes);

                this.setupViewValues();

                this.editCompleted(e,this.model);
            },

//            closeEditorOverlay: function(e) {
//                this.options.close(this.options.columnName, e);
//            },

            closeProfileOverlay : function (e) {
                if (this.profileOverlay) 
                    this.profileOverlay.destroy();
                e && e.preventDefault();
            },

//            updateModelForScheduler: function(e) {
//                var value = $(e.currentTarget).val();
//                this.model.set({"scheduler" : this.schedulerCollection.findWhere({name: value}).toJSON().scheduler});
//            },

            showSchedulerOverlay : function(e) {
                var self = this;
                console.log("scheduler overlay");

                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                    "mime_type": "vnd.juniper.net.schedulers"
                }),
                action;

                self.context.startActivityForResult(intent, function(resultCode, data) {
                    if (data){
                        // set new scheduler as selected by default
                        self.schedulerDropdown.setValue({id:data.id,text:data.name});
                        self.cloneModel.set({"scheduler" : data});
                    }
                });

                return self;
            },

            setCellViewValues: function (rowData) {
                this.model = this.options.ruleCollection.get(rowData.originalRowData[PolicyManagementConstants.JSON_ID]);
            }

        });
        return FirewallRuleOptionsEditorView;

    });
