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
    '../conf/ipsSigDetailContextGridConfiguration.js',
    '../conf/ipsSigDetailAnomalyGridConfiguration.js',
    './ipsSigGridFormView.js',
    './ipsSigOverlayView.js',
    '../models/ipsSigServiceCollection.js',
    '../conf/ipsSigDetailFormViewConfiguration.js',
    'text!../../../../security-management/js/objects/templates/ipsSigReference.html'
],

function(Backbone, Syphon, FormWidget, GridWidget, FormValidator, OverlayWidget,
        ResourceView, IPSSigConfiguration, IPSSigJSON, IPSSigContextGridConf, IPSSigAnomalyGridConf, 
        OverlayGridFormView, IPSSigOverlayView, ServiceCollection,IPSSigDetailConf, referenceTpl) {

    var OVERLAY_TYPE_IPS_SIGNATURES = 'ips_signatures',
        OVERLAY_TYPE_DETECTORS = 'detectors',
        GRID_TYPE_CONTEXT = 'context',
        GRID_TYPE_ANOMALY = 'anomaly';

    var IPSSigFormView = ResourceView.extend({

        events: {
            'click #sd-ipssig-save': "ok",
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

            this.contextData = new Backbone.Collection();
            this.anomalyData = new Backbone.Collection();
            this.actionMap =  {
                "close": "Close Client & Server",
                "close_client": "Close Client",
                "close_server":"Close Server",
                "ignore": "Ignore",
                "drop":  "Drop",
                "drop_packet" : "Drop Packet" };
            
            this.bindingMap =  {
                "ip" :  "IP",
                "ipv6" : "IPv6",
                "tcp" : "TCP",
                "udp" : "UDP",
                "icmp" : "ICMP",
                "icmpv6" : "ICMPv6",
                "rpc":  "RPC",
                "service": "Service" };
            
            this.timeScopeMap =  {
                "sip" : "Source IP",
                "dip" : "Dest IP",
                "peer": "Peer" };
            this.matchMap =  {
                    "rarely": "High",
                    "occasionally" :"Medium",
                    "frequently":"Low"};
            this.performanceMap =  {
                1 :   "Low(1)",
                2 :   "Low(2)" ,
                3 :   "Low(3)" ,
                4 :   "Medium(4)",
                5 :   "Medium(5)",
                6 :   "Medium(6)",
                7 :   "High(7)" ,
                8 :   "High(8)" ,
                9 :   "High(9)" };

            this.sigScopeMap =  {
                "session" : "Session",
                "transaction" : "Transaction" };
          },


        /**
         * Renders the form view in a overlay.
         *
         * returns this object
         */
        render: function() {
            var me = this,
                formConfiguration = new IPSSigDetailConf(this.context),
                formElements = formConfiguration.getValues(),
                ipsSigDataModel = new IPSSigJSON();
 
            me.addDynamicFormConfig(formElements);
            me.ipsSigflatValues = ipsSigDataModel.toFlatValues(me.model.attributes);
            me.updateIpsSigFlatValues();
            me.form = new FormWidget(
                {
                    "container": this.el,
                    "elements": formElements,
                    "values": me.ipsSigflatValues
                }
            );
            me.form.build();

            if(me.ipsSigflatValues['bugs'] !=""){
                me.addReferenceLink(me.$el.find('#ips-sig-bugs'), "BUGS");
            }
            if (me.ipsSigflatValues['cert'] !=""){
                me.addReferenceLink(me.$el.find('#ips-sig-certs'), "CERT");    
            }
            if (me.ipsSigflatValues['cves'] !=""){
                me.addReferenceLink(me.$el.find('#ips-sig-cves'), "CVES"); 
            }
            if (me.ipsSigflatValues['details-reference-url'] !=""){   
                me.addReferenceLink(me.$el.find('#ips-sig-url'), "URL");   
            }
            me.createIPSSigContextGrid();
            me.createIPSSigAnomalyGrid();
            me.showHideElements();
            
            me.detectors = me.ipsSigflatValues['detectors'];
            return me;
        },

        buildReferncelink : function(value,type){
            if(type=="BUGS"){
                 return "http://online.securityfocus.com/bid/" + value +"/discuss";
            }else if (type=="CERT"){
                return "http://www.cert.org/advisories/" + value + ".html";
            }else if (type=="CVES"){
                return "http://cve.mitre.org/cgi-bin/cvename.cgi?name=" + value;
            }else if (type=="URL"){
                return value;
            }
        },

        addReferenceLink: function(target, type) {
            var type =type;
            var me =this;
            var valueArray =[];
            if(type=="BUGS"){
                valueArray = me.ipsSigflatValues['bugs'].split(",");
            }else if (type == "CERT"){
                valueArray = me.ipsSigflatValues['certs'].split(",");
            }else if (type == "CVES"){
                valueArray = me.ipsSigflatValues['cves'].split(",");
            }else if (type == "URL"){
                valueArray = me.ipsSigflatValues['details-reference-url'];
            }
            for (var i = 0; i<valueArray.length ; i++) {
                var reference_url = me.buildReferncelink(valueArray[i],type) ;
                var data = {'reference': {
                    'href': reference_url,
                    'text': valueArray[i]
                }
            }

            target.parent().append(Slipstream.SDK.Renderer.render(referenceTpl, data));  
                
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

            contextGridContainer.find(".grid-widget").addClass("elementinput-long");
        
            if(this.ipsSigflatValues['overlay-grid']) {
                this.contextGrid.addRow(this.ipsSigflatValues['overlay-grid']);
            }
            else{
                for(var i in this.ipsSigflatValues['grid-array']){
                    this.contextGrid.addRow(this.ipsSigflatValues['grid-array'][i]);
                }
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
            anomalyGridContainer.find('.grid-widget').addClass("elementinput-long");

            if(this.ipsSigflatValues['anomaly-grid']) {
                this.anomalyGrid.addRow(this.ipsSigflatValues['anomaly-grid']);
            }
            else{
                for(var i in this.ipsSigflatValues['anomaly-grid-array']){
                    this.anomalyGrid.addRow(this.ipsSigflatValues['anomaly-grid-array'][i]);
                }
            }
        },

        /**
         * @private
         *
         * This api is registring the event handlers for the ips-sig-protocol-grid events.
         *
         * @param (JSON) definedEvents - Events registered for the grid
        **/

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

        showHideElements : function(){
            var self = this;
            var binding = this.ipsSigflatValues['binding-type'];
            var servicesvisible;
            binding = binding.toLowerCase();
            var bindingDynField= self.$el.find('#ips-sig-bindingdynamicField');
            if(binding === 'ip' || binding === 'ipv6' || binding === 'tcp' || binding === 'udp' || binding === 'rpc' || binding === 'service' ){
                self.$el.find(".dynamicFieldClass").show();
            } else {
                self.$el.find(".dynamicFieldClass").hide();
            } 
            if(binding === 'service'){
                self.$el.find('.ips-anomaly-grid').show();
            }else{
                self.$el.find('.ips-anomaly-grid').hide();
            }
            var contextGridDataLength = self.contextGrid.getNumberOfRows();
            var anomalyGridDataLength = self.anomalyGrid.getNumberOfRows();
            if((contextGridDataLength +anomalyGridDataLength) < 2){ 
                self.$el.find('.ips-expression').hide();
                self.$el.find('.ips-sigscope').hide();
                self.$el.find('.ips-sigreset').hide();
                self.$el.find('.ips-sigordered').hide();
            }
            var timeCount = self.ipsSigflatValues['time-binding-count'];
            if(parseInt(timeCount) < 2) {
                self.$el.find(".ips-timescope").hide();
            }
        },

        updateIpsSigFlatValues :function(){
            var me =this;
            me.ipsSigflatValues['details-recommended'] = "";
            if(me.ipsSigflatValues['recommended'] == true){
               me.ipsSigflatValues['details-recommended'] = "Yes";
            }else if(me.ipsSigflatValues['recommended'] == false){
                me.ipsSigflatValues['details-recommended'] = "No";
            }
            me.ipsSigflatValues['details-recommended-action'] = me.actionMap[me.ipsSigflatValues['recommended-action']] ;
            me.ipsSigflatValues['details-binding-type'] = me.bindingMap[me.ipsSigflatValues['binding-type']] ;
            me.ipsSigflatValues['details-match'] = me.matchMap[me.ipsSigflatValues['match']] ;
            me.ipsSigflatValues['details-performance'] = me.performanceMap[me.ipsSigflatValues['performance']] ;
            me.ipsSigflatValues['details-scope'] = me.sigScopeMap[me.ipsSigflatValues['scope']] ;
            me.ipsSigflatValues['details-time-binding-scope'] = me.timeScopeMap[me.ipsSigflatValues['time-binding-scope']] ;
            if(me.ipsSigflatValues['reset']== true){
                me.ipsSigflatValues['details-reset'] ='Enabled';
            }else{
                me.ipsSigflatValues['details-reset'] ='Disabled';
            }

            if(me.ipsSigflatValues['order']==true){
               me.ipsSigflatValues['details-ordered'] ='Enabled';
            }else{
               me.ipsSigflatValues['details-ordered'] ='Disabled';
            }

            var binding = this.ipsSigflatValues['binding-type'];
            if(_.isEmpty(binding))
               return;

            binding = binding.toLowerCase();
            if(binding === 'ip'){
                me.ipsSigflatValues['details-dynamicField-label'] = me.context.getMessage("ips_sig_form_protocol");
                me.ipsSigflatValues['details-dynamicField-value'] = me.ipsSigflatValues['protocol'] ;
            } else if(binding === 'ipv6'){
                me.ipsSigflatValues['details-dynamicField-label'] = me.context.getMessage("ips_sig_form_header");
                me.ipsSigflatValues['details-dynamicField-value'] = me.ipsSigflatValues['next-header'] ; 
            } else if(binding === 'tcp' || binding === 'udp'){
                me.ipsSigflatValues['details-dynamicField-label'] = me.context.getMessage("ips_sig_form_portrange");
                me.ipsSigflatValues['details-dynamicField-value'] = me.ipsSigflatValues['port-range'] ;
            } else if(binding === 'rpc'){
                me.ipsSigflatValues['details-dynamicField-label'] = me.context.getMessage("ips_sig_form_programno");
                me.ipsSigflatValues['details-dynamicField-value'] = me.ipsSigflatValues['program-number'] ;
            } else if(binding === 'service'){
                me.ipsSigflatValues['details-dynamicField-label'] = me.context.getMessage("ips_sig_form_service");
                me.ipsSigflatValues['details-dynamicField-value'] = me.ipsSigflatValues['service'] ;
            }
            me.ipsSigflatValues['details-reference-url'] = [];
            if(me.model.attributes!== undefined && me.model.attributes!== undefined && me.model.attributes.references!== undefined && me.model.attributes.references.urls && me.model.attributes.references.urls.url){
                me.ipsSigflatValues['details-reference-url'] = me.model.attributes.references.urls.url;
            }

            
  
        },

        ok: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }



    });

    return IPSSigFormView;

}
);
