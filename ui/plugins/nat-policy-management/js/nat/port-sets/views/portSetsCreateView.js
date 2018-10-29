/**
 * View to create a port set
 * 
 * @module PortSetView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/form/formValidator',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../models/portSetsCollection.js',
    '../conf/portSetCreateFormConfiguration.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js'
], function (Backbone, FormWidget, FormValidator, ResourceView, Collection, PortSetForm, ValidationUtility) {
    // the limit of source port
    var PORT_MIN = 0;
    var PORT_MAX = 65535;
    var PORT_ERROR;

    var PortsetView = ResourceView.extend({

        events: {
            'click #portset-save': "submit",
            'click #portset-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();
            var self = this,
                members = [],
                properties = {},
                ele = '';
            
            // Check is form valid
            if (! this.form.isValidInput() || !this.isTextareaValid()) {
                console.log('form is invalid');
                return;
            }
           
            // Check if list builder is populated, not needed after listBuilder form integration
            
            properties['name'] = this.$el.find('#portset-name').val();
            properties['description'] = this.$el.find('#portset-description').val();
            properties['ports'] = this.$el.find('#portset-ports').val();

            this.bindModelEvents();
            this.model.set(properties);
            this.model.save();
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            _.extend(this, ValidationUtility);

            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.validator = new FormValidator();
            this.collection = new Collection;

            this.successMessageKey = 'portset_create_success';
            this.editMessageKey = 'portset_edit_success';
            this.fetchErrorKey = 'portset_fetch_error';
            this.fetchCloneErrorKey = 'portset_fetch_clone_error';
        },
        
        render: function() {
            var self = this,
                formConfiguration = new PortSetForm(this.context),
                formElements = formConfiguration.getValues(); 

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            this.addSubsidiaryFunctions(formElements);   
            
            this.$el.addClass("security-management");

            this.afterBuild();
            this.$el.find('#portset-ports').keypress(function(event) {
              if (event.which == 13) {
                event.preventDefault();
                this.value = this.value + "\n";
              }
            });
            return this;
        },
        afterBuild: function() {
            this.bindValidation();
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('portset_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('portset_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('portset_clone');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },
        bindValidation: function() {
            // Work around it until the framework adds direct support for supplying a validation callback function
            this.$el.find('#portset-ports').bind('validatePortRange', $.proxy(this.validatePorts, this, "portset-ports"));
        },
         isValidPort : function(obj){
            if (typeof obj === 'string'){
              if (+obj > PORT_MAX || +obj < PORT_MIN) {
                return false;
              } 
              return true;
            }
            //its an array
            if(obj.length > 2)
                return false;

            if (+obj[0]< PORT_MIN || +obj[0] > PORT_MAX || +obj[1] < PORT_MIN ||
                +obj[1] > PORT_MAX || +obj[0] >= +obj[1]) {
              return false;
            }
            return true;
        },
        isValidPortRanges : function(v) {
            if(!v) {
                return true;
            }
            if (v.indexOf(",") === -1 && v.indexOf("\n")===-1) {
                if (v.indexOf("-") === -1) {
                    PORT_ERROR = this.context.getMessage('portset_create_ports_portBoundError');
                    return this.isValidPort(v);
                }
                 rangeArray = v.split("-");
                 PORT_ERROR = this.context.getMessage('portset_create_ports_error');
                 return this.isValidPort(rangeArray);
            }  
            var rangeArray = [], split, i;

            // input string is comma-separated
            split = v.split(/[\n,]+/);
            //check for maximum limit 
            if(split.length >8 ) {
                 PORT_ERROR = this.context.getMessage('portset_create_ports_maxerror');
                 return false;
            }
             //ports value ends with comma
            if(split[split.length -1] === "") {
                PORT_ERROR = this.context.getMessage('portset_create_ports_commaError');
                return false;
            }
             //check for duplicates
            if(this.isDuplicate(split)){
                PORT_ERROR =  this.context.getMessage('portset_create_ports_duplicateError');
                return false;
            }

            for (i = 0; i < split.length; ++i) {
                if (split[i].indexOf("-") !== -1) {
                    rangeArray = split[i].split("-");
                    if (this.isValidPort(rangeArray) === false) {
                        PORT_ERROR = this.context.getMessage('portset_create_ports_error');
                        return false;
                    }
                } else {
                    if (this.isValidPort(split[i]) === false) {
                        PORT_ERROR = this.context.getMessage('portset_create_ports_portBoundError');
                        return false;
                    }
                }
            }

            return true;
        },
        isDuplicate : function(arr) {
            var sorted_arr = arr.sort(), i;
            for (i = 0; i < arr.length - 1; i++) {
                if (sorted_arr[i + 1] === sorted_arr[i]) {
                    return true;
                }
            }
            return false;
        },
        validatePorts: function(id) {
            // Work around it until the framework adds direct support for supplying a validation callback function
            var comp = this.$el.find('#'+id);
            PORT_ERROR = this.context.getMessage('portset_create_ports_error');

            if (comp.attr("data-invalid") === undefined) {
                if (!this.isValidPortRanges(comp.val())) {
                    this.showErrorMessage(id, PORT_ERROR);
                }
            } else {
                this.showErrorMessage(id, PORT_ERROR);
            }
        },
        showErrorMessage: function(id, message) {
            this.$el.find('#'+id).attr("data-invalid", "").parent().addClass('error');
            this.$el.find('label[for='+id+']').parent().addClass('error');
            this.$el.find('#'+id).parent().find("small[class*='error']").html(message);
        }
    });

    return PortsetView;
});
