/**
 * Created by wasima on 8/24/15.
 */


define(
[
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',    
    '../../../../ui-common/js/views/apiResourceView.js',
    '../views/ipsSigStaticFormView.js',
    '../conf/ipsSig.js',
    '../conf/ipsSigStaticDetailFormConfiguration.js',
    '../conf/ipsSigStaticDetailGridConfiguration.js',
    './ipsSigSelectedListGridView.js'    
],

function(Backbone, Syphon, FormWidget, GridWidget, OverlayWidget, ResourceView, StaticFormView,
         IPSSigJSON, IPSSigStaticConf, IPSSigStaticGridConf,IPSSigSelectedListGridView) {

    var IpsSigStaticGroupFormView = ResourceView.extend({

        events: {
            'click #ips-sig-static-group-save': "ok",
        },

        /**
         * The constructor for the ips signature form view using overlay.
         *
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.formMode = this.model.formMode;
            this.ipssigData = new Backbone.Collection();
            if(this.model.type==='staticgroup'){
                this.selectedRows = this.model.selectedRows;
            }
        },

        render: function() {
            var me = this,
            formConfiguration = new IPSSigStaticConf(this.context),
            formElements = formConfiguration.getValues(),
            ipsSigDataModel = new IPSSigJSON();

            me.ipsSigflatValues = ipsSigDataModel.toFlatValues(me.model.attributes);

            if(this.selectedRows){
                me.ipsSigflatValues['members'] = this.selectedRows;
            }

            me.form = new FormWidget({
                "container": this.el,
                "elements": formElements,
                "values": me.ipsSigflatValues
            });

            me.form.build();
            me.$el.addClass("security-management");

           if(me.model != undefined){
                    var membersData,attackData = me.model.attributes;// self.model.get('attacks');
                    if(attackData != undefined && attackData.members != undefined){
                       membersData = attackData.members['ips-signature'];
                    }
                    else {
                        membersData = this.activity.view.gridWidget.getSelectedRows(true);
                    }
                }

                self.gridWidget = new IPSSigSelectedListGridView({"parentView" : me ,"selectedSig" : membersData,"isDefined":true});
           
            this.$el.find(".ips-sig-static-grid").addClass("elementinput-long");  
            this.$el.find(".ips-sig-static-grid").show();

            return me;
        },

        ok: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }
    });

    return IpsSigStaticGroupFormView;
});