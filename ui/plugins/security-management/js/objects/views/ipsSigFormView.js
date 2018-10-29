/**
 * Created by wasima on 7/17/15.
 */


define(
    [
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/form/formValidator',
    'widgets/overlay/overlayWidget',        
    '../../../../ui-common/js/views/apiResourceView.js',
    '../conf/ipsSigFormViewConfiguration.js',
    '../conf/ipsSig.js',
    '../conf/ipsSigContextGridConfiguration.js',
    '../conf/ipsSigAnomalyGridConfiguration.js',
    './ipsSigGridFormView.js',
    './ipsSigOverlayView.js',
    '../models/ipsSigServiceCollection.js',
    'widgets/dropDown/dropDownWidget',
    'widgets/confirmationDialog/confirmationDialogWidget'
],
function(Backbone, Syphon, FormWidget, GridWidget, FormValidator, OverlayWidget,
        ResourceView, IPSSigConfiguration, IPSSigUtility, IPSSigContextGridConf, IPSSigAnomalyGridConf, 
        OverlayGridFormView, IPSSigOverlayView, ServiceCollection,DropDownWidget,ConfirmationDialogWidget) {

    var OVERLAY_TYPE_IPS_SIGNATURES = 'ips_signatures',
        OVERLAY_TYPE_DETECTORS = 'detectors',
        GRID_TYPE_CONTEXT = 'context',
        GRID_TYPE_ANOMALY = 'anomaly',
        PORT_MIN = 0,
        PORT_MAX = 65535;

    var IPSSigFormView = ResourceView.extend({

        events: {
            'click #sd-ipssig-save': "submit",
            'click #sd-ipssig-cancel': "cancel",
            'click #ips_detectors' : "showDetectors"
        },

        /**
         * The constructor for the IPS signature form view using overlay.
         *
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {

            ResourceView.prototype.initialize.call(this, options);

            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.services = new ServiceCollection();
            this.validator = new FormValidator();
            this.formMode = this.model.formMode;

            this.successMessageKey = 'ips_sig_create_success';
            this.editMessageKey = 'ips_sig_edit_success';
            this.fetchErrorKey = 'ips_sig_fetch_error';
            this.fetchCloneErrorKey = 'ips_sig_fetch_clone_error';

            this.contextData = new Backbone.Collection();
            this.anomalyData = new Backbone.Collection();
        },


        /**
         * Renders the form view in a overlay.
         *
         * returns this object
         */
        render: function() {
            var me = this,
                formConfiguration = new IPSSigConfiguration(this.context),
                formElements = formConfiguration.getValues(),
                ipsSigUtility = new IPSSigUtility();


            me.addDynamicFormConfig(formElements);

            me.ipsSigflatValues = ipsSigUtility.toFlatValues(me.model.attributes);

            me.form = new FormWidget(
                {
                    "container": this.el,
                    "elements": formElements,
                    "values": me.ipsSigflatValues
                }
            );

            me.form.build();

            me.detectors = me.ipsSigflatValues['detectors'];

            me.actionDropDown = me.createDropDown(
                'ips-sig-action',
                [{"text": "","id": ""},
                {"text": "Close Client & Server","id": "close"},
                {"text": "Close Client","id": "close_client"},
                {"text": "Close Server","id": "close_server"},
                {"text": "Ignore","id": "ignore"},
                {"text": "Drop","id": "drop"},
                {"text": "Drop Packet","id": "drop_packet"}]);
            me.sigActivityDropDown = me.createDropDown(
                'ips-sig-severity',
                [{"text": "","id": ""},
                {"text": "Critical","id": "Critical"},
                {"text": "Major","id": "Major"},
                {"text": "Minor","id": "Minor"},
                {"text": "Warning","id": "Warning"},
                {"text": "Info","id": "Info"}]);
            me.sigActivityDropDown.setValue("Info");
            me.bindingDropDown = me.createDropDown(
                'ips_sig_binding_type',
                [{"text": "","id": ""},
                {"text": "IP","id": "ip"},
                {"text": "IPv6","id": "ipv6"},
                {"text": "TCP","id": "tcp"},
                {"text": "UDP","id": "udp"},
                {"text": "ICMP","id": "icmp"},
                {"text": "ICMPv6","id": "icmpv6"},
                {"text": "RPC","id": "rpc"},
                {"text": "Service","id": "service"}], "",
                me.bindingChangeHandler);
            me.bindingDropDown.setValue("ip");
            me.timeScopeDropDown = me.createDropDown(
                'ips-time-scope',
                [{"text": "","id": ""},
                {"text":"Source IP","id": "sip" },
                {"text": "Dest IP","id": "dip"},
                {"text": "Peer","id": "peer"}]);
            me.sigMatchDropDown = me.createDropDown(
                'ips-sig-match',
                [{"text": "","id": ""},
                {"text": "High","id": "rarely"},
                {"text": "Medium","id": "occasionally"},
                {"text": "Low","id": "frequently"}]);
            me.sigPerformanceDropDown = me.createDropDown(
                'ips-sig-performance',
                [{"text": "","id": ""},
                {"text": "Low(1)","id": 1},
                {"text": "Low(2)","id": 2},
                {"text": "Low(3)","id": 3},
                {"text": "Medium(4)","id": 4},
                {"text": "Medium(5)","id": 5},
                {"text": "Medium(6)","id": 6},
                {"text": "High(7)","id": 7},
                {"text": "High(8)","id": 8},
                {"text": "High(9)","id": 9}]);
            me.protocolServiceDropDown = me.createDropDown('ips-sig-protocol_service');
            me.sigScopeDropDown = me.createDropDown(
                'ips-sig-scope',
                [{"text": "Session","id": "session"},
                {"text": "Transaction","id": "transaction"}]);

            me.$el.addClass("security-management");

            me.createIPSSigContextGrid();
            me.createIPSSigAnomalyGrid();
            me.populateServiceDropDown();            

            if(me.formMode === me.MODE_EDIT ||
                me.formMode === me.MODE_CLONE) {
                me.handleStaticModify();
            }

            me.bindValidations();
            me.initializelisteners();
            return me;
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

        // listeners
        initializelisteners : function(){
            var self = this;
            //Should not allow to select time scope if time count is set to 0 or 1
            this.$el.find('input[name=ips-sig-count]').change(function(d) {
                if(d.currentTarget.value < 2){
                    self.$el.find(".timescope").hide();
                }
                else{
                    self.$el.find(".timescope").show();
                } 
           });
        },        

        /*
            Hide or show the Authentication fields based on the Authentication Type
        */
        bindingChangeHandler : function(binding, view){
            var servicesvisible, detailvisible,
             protocolitem, serviceitem, anmoalyGriditem,
             servicevalue;

            if(_.isEmpty(binding))
                return;

            servicevalue = binding;
            binding = binding.toLowerCase();

            protocolitem = view.$el.find('.protocol');
            serviceitem = view.$el.find('.service');
            anmoalyGriditem = view.$el.find('.anomalygrid');

            serviceitem.hide();
            protocolitem.hide();
            anmoalyGriditem.hide();
            view.$el.find(".nextheader").hide();
            view.$el.find(".portranges").hide();
            view.$el.find(".programno").hide();

            if(binding === 'ip'){
                protocolitem.show();
            } else if(binding === 'ipv6'){
                view.$el.find(".nextheader").show();
            } else if(binding === 'tcp' || binding === 'udp'){
                view.$el.find(".portranges").show();
            } else if(binding === 'rpc'){
                view.$el.find(".programno").show();
            } else if(binding === 'service'){
                serviceitem.show();
                anmoalyGriditem.show();
                //servicevalue = serviceitem.getValue();
                //serviceitem.allowBlank = false;
                //servicevalue = servicevalue || 'AIM';
            }

            if(binding !== 'service') {
                view.anomalyData = new Backbone.Collection();
                if(!_.isEmpty(view.anomalyGrid))
                view.anomalyGrid.reloadGridData([]); //TODO - Need to remove all grid contents
            }

            /*view.updateIDPCompoundSigMembers({
              bindService: servicesvisiable,
              postfix:postfix
            });

            view.reloadIDPSigContextAndAnormaly({
              type: newV,
              service: servicevalue,
              postfix: postfix
            });*/
        },

        populateServiceDropDown: function() {
            var self = this, optionList=[{"id":"","text":""}];
            self.services.fetch({
                success: function (collection, response, options) {
                    if(response['ips-sig-services'] !== undefined && response['ips-sig-services']['ips-sig-service'] !== undefined) {
                        response["ips-sig-services"]["ips-sig-service"].forEach(function(object) {
                            optionList.push({"text":object,"id":object})
                        });
                        self.protocolServiceDropDown.addData(optionList);
                        if(self.formMode === self.MODE_EDIT ||self.formMode === self.MODE_CLONE ) {
                            self.protocolServiceDropDown.setValue(self.ipsSigflatValues['service']);
                        }
                    }
                },
                error: function (collection, response, options) {
                    console.log('ips sig services collection not fetched');
                }
            });
        },

        bindValidations: function() {
            // bind custom validation for protocol, Next Header, Port Range and Program Number inputs
            // Work around it until the framework adds direct support for supplying a validation callback function
            this.$el.find('#ips-sig-protocol_details').bind('validateNumber', $.proxy(this.validateNumber, this, 'ips-sig-protocol_details'));
            this.$el.find('#ips-sig-next_header').bind('validateNumber', $.proxy(this.validateNumber, this, 'ips-sig-next_header'));
            this.$el.find('#ips-sig-program_number').bind('validateNumber', $.proxy(this.validateNumber, this, 'ips-sig-program_number'));
            this.$el.find('#ips-sig-port_ranges').bind('validatePortRange', $.proxy(this.validatePortRange, this, 'ips-sig-port_ranges'));        
        },

        validateNumber: function(id) {
            // Work around it until the framework adds direct support for supplying a validation callback function
            var comp = this.$el.find('#'+id);
            this.$el.find('label[for='+id+']').parent().removeClass('error');
            comp.parent().removeClass('error');

            comp.attr("data-validation", "validtext");

            // Change the validation pattern according to different binding selected
            var compValue = comp.val();
            var binding = this.bindingDropDown.getValue();

            var re = /^(\d|\d\d|1[0-2]\d|13[0-9])$/;
            var v = compValue;
            if(binding === "ip") {
                var ret = (v !== 1 && v !== 6 && v !== 17) && (v !== '1' && v !== '6' && v !== '17');
                if (v && !(ret && re.test(v))) {
                    this.showErrorMessage(id, this.context.getMessage('ips_sig_protocol_error'));
                    comp.parent().find("small[class*='error']").addClass('elementinput');
                }
            }else if(binding === "ipv6") {
                var ret = (v !== 58 && v !== 6 && v !== 17) && (v !== '58' && v !== '6' && v !== '17');
                if (v && !(ret && re.test(v))) {
                    this.showErrorMessage(id, this.context.getMessage('ips_sig_header_error'));
                    comp.parent().find("small[class*='error']").addClass('elementinput');
                }
            }else if(binding === "tcp" || binding === "udp") {
                //me.$el.find('#ips-sig-port_ranges').val();
            }else if(binding === "rpc") {
                var re = /^(0*(\d{1,9}|[1-3]\d{9}|4([0-1]\d{8}|2([0-8]\d{7}|9([0-3]\d{6}|4([0-8]\d{5}|9([0-5]\d{4}|6([0-6]\d{3}|7([0-1]\d{2}|2([0-8]\d{1}|9[0-5]))))))))))$/;
                if (v && !re.test(v)) {
                    this.showErrorMessage(id, this.context.getMessage('ips_sig_programno_error'));
                    comp.parent().find("small[class*='error']").addClass('elementinput');
                }
            }
        },

        showErrorMessage: function(id, message) {
            var comp = this.$el.find('#'+id);
            var errorTarget = comp[0].id + '-error';
            var errorObj = $('#' + errorTarget);

            comp.attr("data-invalid", "").parent().addClass('error');
            comp.parent().prev().addClass('error');

            if(errorObj.length === 0){
                var html = '<small class="error errorimage" id="'+ errorTarget + '">' + message + '</small>';
                comp.after(html);
            }else{
                errorObj.text(message);
            }

            this.$el.find('label[for='+id+']').parent().addClass('error');
        },

        isValidPortRange: function(v) {
            if(!v) {
                return true;
            }

            if (v.indexOf("-") > 0) {
                var port = v.split("-");

                if(port.length !== 2) {
                    return false;
                }

                if (!port[0] || !port[1]) {
                    return false;
                }
                var re = /^([\-0-9])*$/;
                
                var portFrom = parseInt(port[0], 10);
                var portTo = parseInt(port[1], 10);

                if (port[0] && !re.test(port[0])) {
                    return false;
                }
                if (port[1] && !re.test(port[1])) {
                    return false;
                }
                if(portFrom > portTo) {
                  return false;
                }

                if((portFrom >= PORT_MIN && portFrom <= PORT_MAX) && (portTo >= PORT_MIN && portTo <= PORT_MAX)) {
                  return true;
                }

            } else {
                if(parseInt(v, 10) >= PORT_MIN && parseInt(v, 10) <= PORT_MAX) {
                  return true;
                }
            }

            return false;
        },

        validatePortRange: function(id) {
            // Work around it until the framework adds direct support for supplying a validation callback function
            // So that we don't need to show error manually
            var comp = this.$el.find('#'+id);
            this.$el.find('label[for='+id+']').parent().removeClass('error');
            comp.parent().removeClass('error');

            comp.attr("data-validation", "validtext");

            var portError = this.context.getMessage('ips_sig_portrange_error');

            if (!this.isValidPortRange(comp.val())) {
                this.showErrorMessage(id, portError);
            }
        },

        handleStaticModify:function(){
            var me =this;
            var bindingType = this.ipsSigflatValues['binding-type'];
            if(bindingType != undefined){
                me.bindingDropDown.setValue(bindingType);
            }
            me.$el.find('#ips-sig-name').val(this.ipsSigflatValues['name']);
            me.$el.find('#ips-sig-description').val(this.ipsSigflatValues['description']);

            me.$el.find('#ips-sig-category').val(this.ipsSigflatValues['category']);
            me.sigActivityDropDown.setValue(this.ipsSigflatValues['severity']);
            me.$el.find('#ips-sig-keywords').val(this.ipsSigflatValues['keywords']);
            me.actionDropDown.setValue(this.ipsSigflatValues['recommended-action']);
            
            me.$el.find('#ips-sig-protocol_details').val(this.ipsSigflatValues['protocol']);
            me.$el.find('#ips-sig-next_header').val(this.ipsSigflatValues['next-header']);
            me.$el.find('#ips-sig-port_ranges').val(this.ipsSigflatValues['port-range']);
            me.$el.find('#ips-sig-program_number').val(this.ipsSigflatValues['program-number']);
            me.protocolServiceDropDown.setValue(this.ipsSigflatValues['service']);

            var timeCount = this.ipsSigflatValues['time-binding-count'];
            me.$el.find('#ips-sig-count').val(timeCount);
            me.timeScopeDropDown.setValue(this.ipsSigflatValues['time-binding-scope']);
            if(parseInt(timeCount) < 2) {
                me.$el.find(".timescope").hide();
            }
            me.sigPerformanceDropDown.setValue(this.ipsSigflatValues['performance']);
            me.sigMatchDropDown.setValue(this.ipsSigflatValues['match']);
            if((me.contextData.length + me.anomalyData.length) > 1) {
                this.$el.find(".expression").show();
                this.$el.find(".sigscope").show();
                this.$el.find(".sigreset").show();
                this.$el.find(".sigordered").show();
                me.$el.find("#ips-sig-expression").val(this.ipsSigflatValues['expression']);
                me.sigScopeDropDown.setValue(this.ipsSigflatValues['scope']);
                me.$el.find('#ips-sig-reset-enable').attr("checked", this.ipsSigflatValues['reset']);
                me.$el.find('#ips-sig-ordered-enable').attr("checked", this.ipsSigflatValues['order']);             
            }
        },

        /**
         * @private
         *
         * IPS Signature Context Grid

         * @return none
         * */
        createIPSSigContextGrid: function() {
            var contextGridContainer = this.$el.find('#ips-sig-context-grid'),
                ipsSigContextGridConf = new IPSSigContextGridConf(this.context);

            this.contextGrid = new GridWidget({
                container: contextGridContainer,
                elements: ipsSigContextGridConf.getValues(),
                actionEvents: ipsSigContextGridConf.getEvents()
            }).build();

            //contextGridContainer.find('.grid-widget').unwrap();
            contextGridContainer.find(".grid-widget").addClass("elementinput-long-ips-sig-grid");
            this.bindContextEvents(ipsSigContextGridConf.getEvents());

            if(this.ipsSigflatValues['overlay-grid']) {
                this.contextGrid.addRow(this.ipsSigflatValues['overlay-grid'], 'last');
                this.contextData.add(this.ipsSigflatValues['overlay-grid']);
            }
           
            for(var i in this.ipsSigflatValues['grid-array']){
                this.contextGrid.addRow(this.ipsSigflatValues['grid-array'][i], 'last');
                this.contextData.add(this.ipsSigflatValues['grid-array'][i]);
            }
            
        },

        /**
         * @private
         *
         * This api is registring the event handlers for the ips-sig-protocol-grid events.
         *
         * @param (JSON) definedEvents - Events registered for the grid
         * */
        bindContextEvents: function(definedEvents) {
            // create button for context
            if (definedEvents.createEvent) {
                this.$el.bind(definedEvents.createEvent, $.proxy(this.createContextAction, this));
            }
            // edit button for context
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.updateContextAction, this));
            }
            // delete button for url
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteContextAction, this));
            }                
        },

        /**
         * @private
         *
         * IPS Signature Anomaly Grid

         * @return none
         * */
        createIPSSigAnomalyGrid: function() {
            var anomalyGridContainer = this.$el.find('#ips-sig-anomaly-grid'),
                ipsSigAnomalyGridConf = new IPSSigAnomalyGridConf(this.context);

            this.anomalyGrid = new GridWidget({
                container: anomalyGridContainer,
                elements: ipsSigAnomalyGridConf.getValues(),
                actionEvents: ipsSigAnomalyGridConf.getEvents()
            }).build();

            //anomalyGridContainer.find('.grid-widget').unwrap();
            anomalyGridContainer.find(".grid-widget").addClass("elementinput-long-ips-sig-grid");
            this.bindAnomalyEvents(ipsSigAnomalyGridConf.getEvents());

            if(this.ipsSigflatValues['anomaly-grid']) {
                this.anomalyGrid.addRow(this.ipsSigflatValues['anomaly-grid'], 'last');
                this.anomalyData.add(this.ipsSigflatValues['anomaly-grid']);
            }
            else{
                for(var i in this.ipsSigflatValues['anomaly-grid-array']){
                    this.anomalyGrid.addRow(this.ipsSigflatValues['anomaly-grid-array'][i], 'last');
                    this.anomalyData.add(this.ipsSigflatValues['anomaly-grid-array'][i])
                }
            }
        },

        /**
         * @private
         *
         * This api is registring the event handlers for the ips-sig-protocol-grid events.
         *
         * @param (JSON) definedEvents - Events registered for the grid
         * */
        bindAnomalyEvents: function(definedEvents, type) {
            // create button for context
            if (definedEvents.createEvent) {
                this.$el.bind(definedEvents.createEvent, $.proxy(this.createAnomalyAction, this));
            }
            // edit button for context
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.updateAnomalyAction, this));
            }
            // delete button for url
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAnomalyAction, this));
            }
        },

        /**
         * @private
         *
         * This will popup a form to add Contexts.
         * This is invoked when the user clicks on the create button of the context grid.
         * */
        createContextAction: function() {
            // Form for context create
            var overlayGridForm = new OverlayGridFormView({
                parentView: this,
                params: {
                    type: GRID_TYPE_CONTEXT, 
                    formMode: "create"
                }
            });            
            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },

        updateContextAction: function(e, row) {
            // Form for context update
            row.originalRow["negated"] = (row.originalRow["negated"] === 'true');
            var overlayGridForm = new OverlayGridFormView({
                parentView: this,
                id: row.originalRow.slipstreamGridWidgetRowId,
                params: {
                    type: GRID_TYPE_CONTEXT, 
                    formMode: "edit",
                    flatValues: row.originalRow
                }
            });

            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },

        deleteContextAction : function(e, row) {
            var contextModel = this.contextData.findWhere(                    
                {
                    "context": row.deletedRows[0].context,
                    "direction": row.deletedRows[0].direction,
                    "pattern": row.deletedRows[0].pattern,
                    "number": row.deletedRows[0].number                            
                });                

            this.contextData.remove(contextModel);
            this.updateSignatureAnomalyNumbers(row.deletedRows[0]['number']);

            if((this.contextData.length + this.anomalyData.length) < 2){    
                this.$el.find(".expression").hide();
                this.$el.find(".sigscope").hide();
                this.$el.find(".sigreset").hide();
                this.$el.find(".sigordered").hide();
            }
        },

        /**
         * @private
         *
         * This will popup a form to add Contexts.
         * This is invoked when the user clicks on the create button of the context grid.
         * */
        createAnomalyAction: function(e, row) {
            var overlayGridForm = new OverlayGridFormView({
                parentView: this,
                params: {
                    type: GRID_TYPE_ANOMALY, 
                    formMode: "create"
                }
            });
            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();
        },

        updateAnomalyAction: function(e, row) {
            // Form for context update
            var overlayGridForm = new OverlayGridFormView({
                parentView: this,
                id: row.originalRow.slipstreamGridWidgetRowId,
                params: {
                    type: GRID_TYPE_ANOMALY, 
                    formMode: "edit",
                    flatValues: row.originalRow
                }
            });

            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },

        deleteAnomalyAction : function(e, row) {
            var anomalyModel = this.anomalyData.findWhere(                    
                {
                    "anomaly": row.deletedRows[0]['anomaly'],
                    "anomaly-direction": row.deletedRows[0]['anomaly-direction'],
                    "number": row.deletedRows[0]['number']
                    //"anomaly-id": row.deletedRows[0]['anomaly-id']                     
                });                

            this.anomalyData.remove(anomalyModel);
            this.updateSignatureAnomalyNumbers(row.deletedRows[0]['number']);

            if((this.contextData.length + this.anomalyData.length) < 2){    
                this.$el.find(".expression").hide();
                this.$el.find(".sigscope").hide();
                this.$el.find(".sigreset").hide();
                this.$el.find(".sigordered").hide();
            }
        },

        updateSignatureAnomalyNumbers: function(deletedNo) {
            var deletedNo = parseInt(deletedNo.substring(2));
            var self = this, found = false;

            //Get all Contexts and Anomalies and update the Numbers
            this.contextData.each(function(object) {
                var origNo = object.get('number');
                var no = parseInt(origNo.substring(2));
                if(no > deletedNo) { //Update number
                    no = no-1;
                    object.set('number', "m0" + no);
                    found = true;
                }
            });
            if(found) {
                this.contextGrid.reloadGridData([]);
                this.contextData.each(function(object) {
                    self.contextGrid.addRow(object.toJSON(), 'last');
                });
            }
            //this.contextGrid.reloadGridData(this.contextData);
            found = false;
            this.anomalyData.each(function(object) {
                var no = parseInt(object.get('number').substring(2));
                if(no > deletedNo) { //Update number
                    no = no-1;
                    object.set('number', "m0" + no);
                    found = true;
                }
            });
            if(found) {
                this.anomalyGrid.reloadGridData([]);
                this.anomalyData.each(function(object) {
                    self.anomalyGrid.addRow(object.toJSON(), 'last');
                });
            }
        },

        showDetectors : function() {
            // Overlay Form for Detectors creation
            var self = this, contextArr=[], anomalyIdArr=[];

            //Get all Contexts and Anomalies
            self.contextData.each(function(object) {
                contextArr.push(object.get('context'));
            });
            self.anomalyData.each(function(object) {
                anomalyIdArr.push(object.get('anomaly-id'));
            });
            var view = new IPSSigOverlayView({
                parentView: this,
                params: {'detectors' : self.detectors, 'type': OVERLAY_TYPE_DETECTORS, 'contextArr': contextArr, 'anomalyArr':anomalyIdArr}
            });

            self.overlayView = view;

            self.overlay = new OverlayWidget({
                view: view,
                showScrollbar: true,
                type: 'medium' //large  wide            
            });
            self.overlay.build();
        },            

        /**
         * @private
         *
         * Change the title of the form based on the context.
         *
         * @param (object) formConfiguration - form items configuration
         * */
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('ips_sig_modify_title');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('ips_sig_create_title');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('ips_sig_clone_title');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        /**
         * Called when OK button is clicked on the overlay based form view.
         *
         * @param {Object} event - The event object
         * returns none
         */
        submit: function(event) {
            var self = this;
            event.preventDefault();

            if(this.form.isValidInput(this.$el.find('form')) && !self.checkFieldStatus()) {
                if(this.contextData.length > 0 ||  this.anomalyData.length > 0){
                    this.bindModelEvents();

                    var properties = {};

                    properties['sig-type'] = 'signature';
                    this.handleSigSubmit(properties);

                    this.model.set(properties);
                    this.model.save();
                }
                else {
                    self.form.showFormError(self.context.getMessage("ips_sig_empty_error"));
                    return;
                }
            }
        },

        checkFieldStatus: function() {
            // Work around: Check those fields that are not required
            var sig_count = this.$el.find("#ips-sig-count");
            var protocol = this.$el.find('#ips-sig-protocol_details');
            var keyword = this.$el.find('#ips-sig-keywords');
            var next_header = this.$el.find('#ips-sig-next_header');
            var port_range = this.$el.find('#ips-sig-port_ranges');
            var prog_number = this.$el.find('#ips-sig-program_number');
            var expression = this.$el.find("#ips-sig-expression");

            if(sig_count.is(":visible") && sig_count.parent().hasClass("error")) {
                return true;
            }
            if(protocol.is(":visible") && protocol.parent().hasClass("error")) {
                return true;
            }        
            if(keyword.is(":visible") && keyword.parent().hasClass("error")) {
                return true;
            }
            if(next_header.is(":visible") && next_header.parent().hasClass("error")) {
                return true;
            }
            if(port_range.is(":visible") && port_range.parent().hasClass("error")) {
                return true;
            }
            if(prog_number.is(":visible") && prog_number.parent().hasClass("error")) {
                return true;
            }
            if(expression.is(":visible") && expression.parent().hasClass("error")) {
                return true;
            }
            return false;           
        },

        handleSigSubmit: function(properties) {
           var me= this;
           var data = Syphon.serialize(this);
           properties['sig-type'] = 'signature';
           properties['definition-type'] = 'CUSTOM';
           properties['name'] = me.$el.find('#ips-sig-name').val();
           properties['description']  = me.$el.find('#ips-sig-description').val();
           properties['category'] = me.$el.find('#ips-sig-category').val();
           properties['severity']  = me.sigActivityDropDown.getValue();
           properties['keywords'] = me.$el.find('#ips-sig-keywords').val();
           properties['recommended-action'] = me.actionDropDown.getValue();

           properties['attacks'] = {};
           properties['attacks']['ips-sig-attack'] = {};

          
           //properties['attacks']['ips-sig-attack']['negated'] = me.$el.find('#ips-negated').val();
          // properties['attacks']['ips-sig-attack']['shellcode'] = "false";

           properties['attacks']['ips-sig-attack']['detectors']={};
           if(me.overlayView != undefined){
                properties['attacks']['ips-sig-attack']['detectors']['detector'] = me.overlayView.getDetectors();
           }

           //Signature Details
           properties['attacks']['ips-sig-attack']['performance'] = me.sigPerformanceDropDown.getValue();
           properties['attacks']['ips-sig-attack']['false-positives'] = me.sigMatchDropDown.getValue();
           var binding = me.bindingDropDown.getValue();
           var portValue = "";

           if(binding === "ip") {
                portValue = me.$el.find('#ips-sig-protocol_details').val();
           }else if(binding === "ipv6") {
                portValue = me.$el.find('#ips-sig-next_header').val();
           }else if(binding === "tcp" || binding === "udp") {
                portValue = me.$el.find('#ips-sig-port_ranges').val();
           }else if(binding === "rpc") {
                portValue = me.$el.find('#ips-sig-program_number').val();
           }

           if(binding === "service") {
                properties['attacks']['ips-sig-attack']['service'] =  me.protocolServiceDropDown.getValue();
           }else {
               if(portValue !== "") {
                    properties['attacks']['ips-sig-attack']['port'] =  binding + "/" + portValue;
               }else {
                    properties['attacks']['ips-sig-attack']['port'] =  binding;
               }
            }

           var timeCount = me.$el.find('#ips-sig-count').val(); 
           properties['attacks']['ips-sig-attack']['timebinding'] = {};
           if(parseInt(timeCount) > 1) {
                properties['attacks']['ips-sig-attack']['timebinding']['scope'] = me.timeScopeDropDown.getValue();
           }
           else {
                properties['attacks']['ips-sig-attack']['timebinding']['scope'] = "";
           }
           properties['attacks']['ips-sig-attack']['timebinding']['count'] = timeCount;

           //Sig Type is set as per number of signatures added. It varies from "signature" "anomaly" "chain"
           var totalSig = this.contextData.length + this.anomalyData.length;
           if(this.contextData.length == 1 && this.anomalyData.length == 0) {
                properties['attacks']['ips-sig-attack']['sig-type'] = 'signature';

                this.contextData.each(function(obj){
                  var tempObj = properties['attacks']['ips-sig-attack'];
                  tempObj['context'] = obj.attributes.context;
                  tempObj['direction'] = obj.attributes.direction;
                  tempObj['pattern'] = obj.attributes.pattern;
                  tempObj['regex'] = obj.attributes.regex;
                  tempObj['negated'] = obj.attributes.negated;
                  tempObj['shellcode'] = false;
                });
           }
           if(this.contextData.length == 0 && this.anomalyData.length == 1) {
                properties['attacks']['ips-sig-attack']['sig-type'] = 'anomaly';

                this.anomalyData.each(function(obj){
                  var tempObj = properties['attacks']['ips-sig-attack'];
                  tempObj['test'] = obj.attributes.anomaly;
                  tempObj['direction'] = obj.attributes['anomaly-direction'];
                });                
           }

           //Chain signature members should have more fields
           if(totalSig > 1) {

                properties['attacks']['ips-sig-attack']['sig-type'] = 'chain';
                properties['attacks']['ips-sig-attack']['expression'] = me.$el.find("#ips-sig-expression").val();
                properties['attacks']['ips-sig-attack']['scope'] = me.sigScopeDropDown.getValue();
                properties['attacks']['ips-sig-attack']['reset'] = data['ips-sig-reset-enable'];
                properties['attacks']['ips-sig-attack']['ordered'] = data['ips-sig-ordered-enable'];
                properties['attacks']['ips-sig-attack']['members'] = {};
                properties['attacks']['ips-sig-attack']['members']['ips-sig-attack-member'] =[];

                //Combine signature and anomalies collection and sorted by Signature number
                this.contextData.add(this.anomalyData.models);
                var sortedCollection = this.contextData.sortBy(function(obj){
                    return obj.get("number").toLowerCase();
                });

                for(var i in sortedCollection){
                    var tempObj ={};
                    var item = sortedCollection[i];
                    if(!_.isEmpty(item.get('context'))) {
                        tempObj['context'] = item.get('context');
                        tempObj['direction'] = item.get('direction');
                        tempObj['pattern'] = item.get('pattern');
                        tempObj['regex'] = item.get('regex');
                        tempObj['negated'] = item.get('negated');
                        tempObj['shellcode'] = false;
                        tempObj['sig-type'] = "pattern";
                    } else {
                        tempObj['test'] = item.get('anomaly');
                        tempObj['direction'] = item.get('anomaly-direction');
                        tempObj['sig-type'] = 'anomalypattern';
                    }
                    properties['attacks']['ips-sig-attack']['members']['ips-sig-attack-member'].push(tempObj);
                }
           }
        },
        /**
         * Called when Cancel button is clicked on the overlay based form view.
         *
         * @param {Object} event - The event object
         * returns none
         */
        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }
    });

    return IPSSigFormView;

}
);
