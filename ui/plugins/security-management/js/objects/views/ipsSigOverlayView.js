/**
 * The overlay for detectors and ips sigs
 * 
 * @module IPSSigOverlayView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/ipsSigOverlayFormConf.js',
    '../conf/ipsSigDetectorsGridConf.js',
    '../conf/ipsSigGridConfiguration.js'
], function (Backbone, FormWidget, GridWidget, FormConf, DetectorsGridConf,IPSSigGridConfiguration) {
    var OVERLAY_TYPE_IPS_SIGNATURES = 'ips_signatures',
        OVERLAY_TYPE_DETECTORS = 'detectors';

    var IPSSignatureOverlayView = Backbone.View.extend({

        events: {
            'click #ips-signature-overlay-close': "closeOverlay"
        },

        closeOverlay: function(event) {
            event.preventDefault();
            this.parentView.overlay.destroy();
        },

        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.params = options.params;
            this.detectors = options.params.detectors;
            this.filter = options.params.filterUrl;
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            if(this.params.type === OVERLAY_TYPE_DETECTORS){
                dynamicProperties.title = this.context.getMessage('ips_sig_detector_button_title');
            }else if(this.params.type === OVERLAY_TYPE_IPS_SIGNATURES){
                dynamicProperties.title = this.context.getMessage('ips_sig_ilp_title');
                dynamicProperties['title-help'] ={
                        "content": this.context.getMessage("ips_sig_dynamic_preview_signature_title_info_tip")
                    };
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();
            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.addGridWidget();
            return this;
        },

        setShowHideColumnSelection: function (columnSelection){
            columnSelection['cves'] = false; //hides the CVES column by default
            columnSelection['bugs'] = false; //hides the BUGS column by default
            columnSelection['certs'] = false; //hides CERTS column by default
            columnSelection['confidence'] = false; //hides confidence column by default
            columnSelection['service'] = false; //hides service column by default
            columnSelection['recommended-action'] = false; //hides performance column by default
            columnSelection['direction'] = false; //hides direction column by default
            return columnSelection;
        },

        addGridWidget: function() {
            var config ={id:"ipsSigPreview"};
            var type = this.params.type,
                contextArr = this.params.contextArr,
                anomalyArr = this.params.anomalyArr,
                gridContainer = this.$el.find('#ips-signature-overlay-list');
                gridConf = null;
            gridContainer.empty();
            if(type === OVERLAY_TYPE_DETECTORS){
                gridConf = new DetectorsGridConf(this.context, contextArr, anomalyArr,this.detectors);
            }else if(type === OVERLAY_TYPE_IPS_SIGNATURES){
                gridConf = new IPSSigGridConfiguration(this.context);
            }

            var gridElements = gridConf.getValues(config);
            this.gridConf = gridConf;
            if(type === OVERLAY_TYPE_IPS_SIGNATURES){
                gridElements.filter.columnFilter =false;
                gridElements.title =undefined;
                gridElements.filter.optionMenu ={
                        "showHideColumnsItem": {
                             "setColumnSelection": this.setShowHideColumnSelection
                        },
                        "customItems":[]
                    };

                gridElements.url="/api/juniper/sd/ips-signature-management/ips-signatures?"+this.filter   
            }
            
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements
            });
            this.gridWidget.build();

        },

        getDetectors : function(){
            return this.gridConf.getDetectors();
        }
    });

    return IPSSignatureOverlayView;
});