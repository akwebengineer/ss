/**
 * The overlay for detectors and ips sigs
 * 
 * @module IPSSigGridFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',    
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../conf/ipsSigContextFormViewConfiguration.js',
    '../conf/ipsSigAnomalyFormViewConfiguration.js',    
    '../models/ipsSigContextCollection.js',  
    'widgets/dropDown/dropDownWidget'
], function (Backbone, Syphon, FormWidget, GridWidget, ResourceView, 
    ContextFormConfig, AnomalyFormConfig, ContextsCollection,DropDownWidget) {

    var GRID_TYPE_CONTEXT = 'context',
        GRID_TYPE_ANOMALY = 'anomaly',
        MODE_CREATE = 'create',
        MODE_EDIT = 'edit';        

    var IPSSigGridFormView = ResourceView.extend({

        events: {
            'click #ips-sig-context-save': "submitContext",
            'click #ips-sig-anomaly-save': "submitAnomaly",            
            'click #ips-sig-grid-cancel': "cancel"         
        },

        cancel: function(event) {
            event.preventDefault();
            this.parentView.overlay.destroy();
        },

        initialize: function(options) {
            var self = this;
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.params = options.params;
            this.contexts = new ContextsCollection();
            this.map = {};

            if (this.params.formMode == MODE_EDIT) {
                this.ipsSigFlatValues = this.params.flatValues;
                if(this.params.type === GRID_TYPE_CONTEXT){
                    this.model = this.parentView.contextData.findWhere(
                    {
                        "context": self.ipsSigFlatValues['context'], 
                        "direction": self.ipsSigFlatValues['direction'],
                        "pattern": self.ipsSigFlatValues['pattern'],
                        "regex": self.ipsSigFlatValues['regex'],
                        "negated": self.ipsSigFlatValues['negated'],
                        "number": self.ipsSigFlatValues['number']
                    });
                } else if(this.params.type === GRID_TYPE_ANOMALY){
                    this.model = this.parentView.anomalyData.findWhere(
                    {
                        "anomaly": self.ipsSigFlatValues['anomaly'], 
                        "anomaly-direction": self.ipsSigFlatValues['anomaly-direction'], //Need to fix this part
                        "number": self.ipsSigFlatValues['number']
                        //"anomaly-id": self.ipsSigFlatValues['anomaly-id']
                    });
                }
                this.rowId = options.id;
            } else {                    
                this.ipsSigFlatValues = {};
                //Setting available Signature number
                this.nextSigNo = this.parentView.contextData.length + this.parentView.anomalyData.length + 1;
                this.ipsSigFlatValues['number'] =  "m0" + this.nextSigNo; 
            }
        },

        render: function() {
            var formConfiguration;

            if(this.params.type === GRID_TYPE_CONTEXT){
                formConfiguration = new ContextFormConfig(this.context);
            } else if(this.params.type === GRID_TYPE_ANOMALY){
                formConfiguration = new AnomalyFormConfig(this.context);
            }
            var formElements = formConfiguration.getValues();
            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.ipsSigFlatValues
            });

            this.form.build();

            if(this.params.type === GRID_TYPE_CONTEXT){
                
                this.sigContextDropDown =this.createDropDown('ips-sig-context',"", "", this.contextChangeHandler);
                this.sigDirectionDropDown = this.createDropDown('ips-sig-direction',[{"text": "Any","id": "any"}, 
                                        {"text": "Client to Server","id": "cts"},
                                        {"text": "Server to Client","id": "stc"}]);                
                //Populate Contexts
                this.populateContextsDropDown();
                if(this.params.formMode === MODE_EDIT) {
                    this.$el.find('#ips-sig-no').val(this.ipsSigFlatValues['number']);
                    this.sigDirectionDropDown.setValue(this.ipsSigFlatValues['direction']);
                    this.$el.find('#ips-sig-pattern').val(this.ipsSigFlatValues['pattern']);
                    this.$el.find('#ips-sig-regex').val(this.ipsSigFlatValues['regex']);
                    this.$el.find('#ips-sig-negated-enable').attr("checked", this.ipsSigFlatValues['negated']);
                } 
            } else if(this.params.type === GRID_TYPE_ANOMALY){

                this.sigAnomalyDropDown =this.createDropDown('ips-sig-anomaly');
                this.sigAnomalyDirectionDropDown = this.createDropDown('ips-sig-anomaly-direction',[{"text": "Any","id": "any"}, 
                                        {"text": "Client to Server","id": "cts"},
                                        {"text": "Server to Client","id": "stc"}]);       
                //Populate Anomalies
                this.populateAnomalyDropDown();
                if(this.params.formMode === MODE_EDIT) {
                    this.$el.find('#ips-sig-no').val(this.ipsSigFlatValues['number']);
                    this.sigAnomalyDirectionDropDown.setValue(this.ipsSigFlatValues['anomaly-direction']);
                }                 
            }

            return this;
        },
        createDropDown: function(container,data,placeholder,onchange){
              var self = this;
              this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
              return new DropDownWidget({
                  "container": this.$el.find("."+container),
                  "data": JSON.stringify(data),
                  "placeholder": this.context.getMessage('select_option'),
                  "enableSearch": true,
                  "onChange": function(event) {
                      if (onchange) {onchange($(this).val(),self);}
                   }
              }).build();
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            switch (this.params.formMode) {
                case MODE_EDIT:
                    if(this.params.type === GRID_TYPE_CONTEXT){
                        dynamicProperties.title = this.context.getMessage('ips_sig_context_modify_title');
                    }else if(this.params.type === GRID_TYPE_ANOMALY){
                        dynamicProperties.title = this.context.getMessage('ips_sig_anomaly_modify_title');
                    }
                    break;
                case MODE_CREATE:
                    if(this.params.type === GRID_TYPE_CONTEXT){
                        dynamicProperties.title = this.context.getMessage('ips_sig_context_create_title');
                    }else if(this.params.type === GRID_TYPE_ANOMALY){
                        dynamicProperties.title = this.context.getMessage('ips_sig_anomaly_create_title');
                    }
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        populateContextsDropDown: function() {
            var self = this,optionList=[{"text":"","id":""}];
            var serviceValue = self.parentView.protocolServiceDropDown.getValue();

            $.ajax({
               url: '/api/juniper/sd/ips-signature-management/ips-signature-contexts?service='+serviceValue,
                method:'GET',
                dataType:'json',
                headers: {
                    'accept': 'application/vnd.juniper.sd.ips-signature-management.ips-sig-contexts+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    if(data && data['ips-sig-contexts'] && data["ips-sig-contexts"]["ips-sig-context"]) {
                        data["ips-sig-contexts"]["ips-sig-context"].forEach(function(object) {
                            optionList.push({"text":object,"id":object});
                        });
                        self.sigContextDropDown.addData(optionList);
                        self.sigContextDropDown.setValue("stream");
                        if(self.params.formMode == MODE_EDIT){
                            self.sigContextDropDown.setValue(self.ipsSigFlatValues['context']);  
                        }                            
                    }
                },
                error: function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                }
            });
        },

        populateAnomalyDropDown: function() {
            var self = this,optionList=[{"text":"","id":""}];
            var serviceValue = self.parentView.protocolServiceDropDown.getValue();

            $.ajax({
               url: '/api/juniper/sd/ips-signature-management/ips-signature-anomalies?service='+serviceValue,
                method:'GET',
                dataType:'json',
                headers: {
                    'accept': 'application/vnd.juniper.sd.ips-signature-management.ips-anomalies+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    if(data && data['ips-anomalies'] && data['ips-anomalies']['reference']) {
                        var anomalyMap = {};
                        data['ips-anomalies']['reference'].forEach(function(object) {
                            optionList.push({"text":object.name,"id":object.id});
                            self.map[object.id] = object;
                            anomalyMap[object.name] = object;
                        });
                        self.sigAnomalyDropDown.addData(optionList);
                        if(self.params.formMode == MODE_EDIT){
                            var anomalyName = self.ipsSigFlatValues['anomaly'];
                            var anomalyObj = anomalyMap[anomalyName];
                            self.sigAnomalyDropDown.setValue(anomalyObj.id); 
                        }    
                    }
                },
                error: function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                }
            });
        },

        /*
            Enable or Disable Negated based on the Context
        */
        contextChangeHandler : function(contextValue, view){
            var negated = view.$el.find('#ips-negated');

            if(view.checkStreamContext(contextValue)){
                //negated.setValue(false);
                negated.prop('disabled', true);
            }else{
                negated.prop('disabled', false);
            }            
        },

        checkStreamContext : function(sigcontext) {
            return 'stream' === sigcontext || 'stream256' === sigcontext || 'stream1k' === sigcontext || 'stream8k' === sigcontext || 'normalized-stream' === sigcontext || 'normalized-stream256' === sigcontext || 'normalized-stream1k' === sigcontext || 'normalized-stream8k' === sigcontext;
        },

        submitContext: function(event) {

            event.preventDefault();
            var properties = Syphon.serialize(this);
            properties['context'] = this.sigContextDropDown.getValue();
            properties['direction'] = this.sigDirectionDropDown.getValue();
            properties['negated'] = properties['ips-sig-negated-enable'];
            if (this.params.formMode == MODE_EDIT) {    
                //this.model.set(properties);
                properties['number'] = this.model.get('number');
                this.parentView.contextData.remove(this.model);
                this.parentView.contextData.add(properties);
                properties.detail = "update";
                this.model.id = this.rowId;  
                // update the column of detail in grid
                this.parentView.contextGrid.editRow(this.model, properties);
            }
            else {
                properties['number'] =  "m0" + this.nextSigNo;                 
                this.parentView.contextData.add(properties);
                this.parentView.contextGrid.addRow(properties, 'last');
            }

            if((this.parentView.contextData.length + this.parentView.anomalyData.length) > 1){
                this.parentView.$el.find(".expression").show();
                this.parentView.$el.find(".sigscope").show();
                this.parentView.$el.find(".sigreset").show();
                this.parentView.$el.find(".sigordered").show();
            }
            this.parentView.overlay.destroy();
        },

        submitAnomaly: function(event) {

            event.preventDefault();
            var properties = {};
            var anomalyID = this.sigAnomalyDropDown.getValue();
            if(!_.isEmpty(anomalyID)) {
                var anomalyObj = this.map[anomalyID];
                if(!_.isEmpty(anomalyObj)) {
                    properties['anomaly'] = anomalyObj.name;
                    properties['anomaly-id'] = anomalyObj.id;
                }
                properties['anomaly-direction'] = this.sigAnomalyDirectionDropDown.getValue();
                if (this.params.formMode == MODE_EDIT) {
                    properties['number'] = this.model.get('number');    
                    this.parentView.anomalyData.remove(this.model);
                    this.parentView.anomalyData.add(properties);
                    properties.detail = "update";
                    this.model.id = this.rowId;  
                    // update the column of detail in grid
                    this.parentView.anomalyGrid.editRow(this.model, properties);
                } else {
                    properties['number'] =  "m0" + this.nextSigNo;
                    this.parentView.anomalyData.add(properties);
                    this.parentView.anomalyGrid.addRow(properties, 'last');
                }

                if((this.parentView.contextData.length + this.parentView.anomalyData.length) > 1){
                    this.parentView.$el.find(".expression").show();
                    this.parentView.$el.find(".sigscope").show();
                    this.parentView.$el.find(".sigreset").show();
                    this.parentView.$el.find(".sigordered").show();
                }
                this.parentView.overlay.destroy();
            } else {
                this.form.showFormError(this.context.getMessage("ips_sig_anomaly_form_error"));
            }
        }                        
    }); 

    return IPSSigGridFormView;
});
