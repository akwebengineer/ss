/**
 * Port editor view that extends from base cellEditor & is used to select portsets & add new portsets for Source & Destination editors
 *
 * @module PortSetsEditorView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/multiSelectCellEditorNewListBuilderView.js',
    '../conf/portSetsEditorFormConfiguration.js',
    '../../../nat/widgets/PortSetsListBuilder.js'
], function (MultiSelectCellEditorView, PortSetsEditorFormConfiguration, PortSetsListBuilder) {
        var PORT_MIN = 0;
        var PORT_MAX = 65535;
        var PORT_ERROR;

    var PortSetsEditorView = MultiSelectCellEditorView.extend({

        initialize: function () {
            this.context = this.options.context;

            this.portSetsEditorFormConfiguration = new PortSetsEditorFormConfiguration(this.context);

            this.options.editorListBuilder = {
                'listBuilderObject': PortSetsListBuilder.extend({showDefaultObjects: true}),
                'addNewObject_mimeType': 'vnd.juniper.net.nat.portsets'
            };

            this.options.editorForm = {
                'editorFormConfig': this.portSetsEditorFormConfiguration.getConfig(),
                'editorFormElements': {
                    'addNewButtonElementID': 'add-new-button',
                    'listBuilderElementID': 'list-builder-element',
                    'cancelButtonID': 'cancel',
                    'okButtonID': 'save'
                },
                'editorFormMsgBundle': {
                    'title': this.getTitle(),
                    'heading_text': this.getHeadingText()
                }
            };
            MultiSelectCellEditorView.prototype.initialize.apply(this);
        },
        bindValidation: function() {
            // Work around it until the framework adds direct support for supplying a validation callback function
            this.$el.find('#natrules-ports').bind('validatePortRange', $.proxy(this.validatePorts, this, "natrules-ports"));
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
            if (v.indexOf(",") === -1) {
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
            split = v.split(","); 
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
            PORT_ERROR = this.context.getMessage('nat_rules_editor_ports_error');

            if (comp.attr("data-invalid") === undefined) {
                if (!this.isValidPortRanges(comp.val())) {
                    this.showErrorMessage(id, PORT_ERROR);
                }
            } else {
                this.showErrorMessage(id, PORT_ERROR);
            }
        },

        bindEventHandlers: function () {
            this.bindValidation();
            this.$el.find('#' + this.editorFormElements.addNewButtonElementID).unbind('click').bind('click', $.proxy(this.createNewValueInListBuilder, this));
            MultiSelectCellEditorView.prototype.bindEventHandlers.apply(this);
        },    
        updateFormValuesForEditor: function () {
            if(this.model){
                var servicesArr = this.getPortSets();
                this._cellViewValues = this.getNameArray(servicesArr);
                var ports = this.getPorts();
                this.$el.find('#natrules-ports').val(ports);
            }

            MultiSelectCellEditorView.prototype.updateFormValuesForEditor.apply(this);
        },
        addNewButtonFormatClass : function(buttonElement) {

        },
        updateNewValueInList: function (resultCode, data) {
            var self = this;

            // Based on result inject the newly created value in list builder
            if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {

                if (this.$el.find('#' + this.editorFormElements.anyCheckboxElementID).is(":checked")) {
                    this.hideListBuilder(true);
                } else {
                    self.listBuilder.addAvailableItems([data]);
                    self.listBuilder.selectItems([data]);
                }
            }
        },
        getNameArray : function(objectArr){
            var nameArr = [];
            if(objectArr == undefined || objectArr == null)
                return nameArr;
            var len  = objectArr.length ;
            if(len){
                for(var i=0;i<len;i++){
                    nameArr.push(objectArr[i].name);
                }
            }else{
                nameArr.push(objectArr.name);
            }

            return nameArr;
        },
        checkFieldStatus: function() {
            var port = this.$el.find("#natrules-ports");
            
            if (port.is(":visible") && port.parent().hasClass("error")) {
                return true;
            }
            var allPorts = port.val();
            var selectedPortSets = this.listBuilder.getSelectedItems();
            if (selectedPortSets) {
                if (!$.isArray(selectedPortSets)){
                    selectedPortSets = [selectedPortSets];
                }
                if(selectedPortSets.length > 0) {
                    for(i=0; i< selectedPortSets.length ; i++){
                        allPorts = allPorts + ","+ selectedPortSets[i].ports;
                    }
                }
                if(allPorts.charAt(0) === ',') {
                    allPorts = allPorts.substring(1,allPorts.length);
                }
                portsArr = allPorts.split(',');
                if (portsArr.length > 8) {
                    this.form.showFormError(this.context.getMessage('nat_rules_editor_ports_count_error'));
                   // this.showErrorMessage("natrules-ports", this.context.getMessage('nat_rules_editor_ports_count_error'));  
                    return true;
                }
            }            
            return false;
        },
        updateModel: function (e) {
            if (this.checkFieldStatus()) {
                return;
            }

            this.getValuesFromEditor();
            MultiSelectCellEditorView.prototype.updateModel.apply(this,[e]);
        },

        getValuesFromEditor: function () {
            var self = this;
            self.valuesForAPICall = [];
            // get the user selected values as 'Any' OR from list builder
            var valuesForAPICall = [];
            var selectedItems = this.listBuilder.getSelectedItems();
           if (selectedItems) {
                        if (!$.isArray(selectedItems)){
                            selectedItems = [selectedItems];
                        }
                        for (var index = 0; index < selectedItems.length; index++) {
                            var apiCallObject = self.formatDataForAPICall(selectedItems[index]);
                            self.valuesForAPICall.push(apiCallObject);
                        }
                        if (self.valuesForAPICall.length > 0) {
                            self.setPortSets(self.valuesForAPICall);
                        }
                        else {
                            self.setPortSets(null);
                        }
            }
            else {
                self.setPortSets(null);
            } 
            self.setPorts(self.$el.find('#natrules-ports').val());       
        },

        formatDataForAPICall: function (selectedValueData) {
            // get the necessary values that need to be sent to backend API for saving to cache
            var apiCallObject =
            {
                "@href": selectedValueData["@href"],
                "id": selectedValueData["id"],
                "domain-id": selectedValueData["domain-id"],
                "domain-name": selectedValueData["domain-name"],
                "name": selectedValueData["name"],
                "port-type": selectedValueData["port-type"]
            };
            return apiCallObject;
        },
        getSelectedIds : function(){
            var idArr = [],
                portSetArr = this.getPortSets();

            if(!portSetArr)
                return idArr;
             var len  = portSetArr.length;

            if (len) {
                for (var i=0; i<len; i++) {
                    if (portSetArr[i].name !== "Any") {
                        idArr.push({"id":portSetArr[i].id,"name":portSetArr[i].name});
                    }
                }
            } else {
                if (portSetArr.name !== "Any" && portSetArr.name !== undefined) {
                    idArr.push({"id":portSetArr.id,"name":portSetArr.name});
                }
            }

            return idArr;
        },
        showErrorMessage: function(id, message) {
            this.$el.find('#'+id).attr("data-invalid", "").parent().addClass('error');
            this.$el.find('label[for='+id+']').parent().addClass('error');
            this.$el.find('#'+id).parent().find("small[class*='error']").html(message);
        }
    });

    return PortSetsEditorView;
});
