/**
 * Created by wasima on 7/10/15.
 */


define(
[
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',       
    '../../../../ui-common/js/views/apiResourceView.js',
    '../conf/ipsSig.js',
    '../conf/ipsSigDynamicGroupDetailConfiguration.js'    
],

function(Backbone, Syphon, FormWidget, OverlayWidget, ResourceView,IPSSigJSON, IPSSigDynamicConf) {

    var IpsSigDynamicGroupDetailFormView = ResourceView.extend({

        events: {
            'click #ips-sig-dynamic-group-save': "submit"
        },

       
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.formMode = this.model.formMode;
        },

        render: function() {
            var me = this,
                formConfiguration = new IPSSigDynamicConf(this.context),
                formElements = formConfiguration.getValues();
 
            me.retrieveData();
            me.form = new FormWidget({
                "container": this.el,
                "elements": formElements,
                "values": me.ipsSigflatValues
            });

            me.form.build();

            return me;
        },

        retrieveData : function(){
            var me = this;
            me.ipsSigDataModel = new IPSSigJSON();

            me.ipsSigflatValues = this.ipsSigDataModel.toFlatValues(me.model.attributes);
            if (me.ipsSigflatValues['dynRecommended'] !==undefined && me.ipsSigflatValues['dynRecommended'] !==null){
                if(me.ipsSigflatValues['dynRecommended'].trim() =="false"){
                    me.ipsSigflatValues['detailsRecommended'] = "No";
                }else if(me.ipsSigflatValues['dynRecommended'].trim() =="true"){
                    me.ipsSigflatValues['detailsRecommended'] = "Yes";
                }

            }

            if (me.ipsSigflatValues['dynDirection'] !== undefined && me.ipsSigflatValues['dynDirection'] !== null) {
                var tempDirection = [];
                $.each(me.ipsSigflatValues['dynDirection'].split(','), function(index, value) {
                    if (value) {
                        if (value.trim().indexOf('any') > -1) {
                            tempDirection.push('Any');
                        } else if (value.trim().indexOf('cts') > -1) {
                            tempDirection.push('Client-to-Server');
                        } else if (value.trim().indexOf('stc') > -1) {
                           
                           tempDirection.push('Server-to-Client');
                        }
                    }
                });

                me.ipsSigflatValues['detailsDirection'] = tempDirection.toString();
            }

            if (this.ipsSigflatValues['dynObjectType'] !== undefined && this.ipsSigflatValues['dynObjectType'] !== null) {
                var tempObjType = [];
                $.each(this.ipsSigflatValues['dynObjectType'].split(','), function(index, value) {
                    if (value) {
                        if (value.trim().indexOf('signature') > -1) {
                            tempObjType.push('Signature');
                        } else if (value.trim().indexOf('anomaly') > -1) {
                            tempObjType.push('Protocol Anomaly');
                        }
                    }
                });
                this.ipsSigflatValues['detailsObjectType'] = tempObjType.toString();
            }
        },
        
        submit: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }
    });

    return IpsSigDynamicGroupDetailFormView;
});