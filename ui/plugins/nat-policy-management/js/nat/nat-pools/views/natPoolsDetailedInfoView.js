/**
 * A module that works with nat-pools.
 *
 * @module NatPoolDetailedInfoFormView
 * @author Damodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/


define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/form/formValidator',
        '../../../../../ui-common/js/views/apiResourceView.js',
        '../conf/natPoolDetailedInfoFormConfiguration.js'
    ],

    function(Backbone, Syphon, FormWidget, FormValidator, ResourceView, NatPoolDetailedInfoFormConfiguration) {
        var NatPoolDetailedInfoView = ResourceView.extend({
            events: {
                'click #natpool-cancel': "cancel"
            },

            /**
             * The constructor for the nat pool form view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context
             */
            initialize: function(options) {
                ResourceView.prototype.initialize.call(this, options);
                this.activity = options.activity;
                this.context = options.activity.getContext();
                this.model=options.model;
            },

            /**
             * Renders the form view in a overlay.
             *
             * returns this object
             */
            render: function() {
                var self = this,
                    formConfiguration = new NatPoolDetailedInfoFormConfiguration(this.context),
                    formElements = formConfiguration.getValues(),
                    options = this.activity.getIntent().getExtras();
                this.model.set('pool-type',this.model.get('pool-type')===0?'SOURCE':'DESTINATION');
                if(this.model.get('pool-type')==='SOURCE'){
                    this.model.set('disable-port-translation',!this.model.get('disable-port-translation'));
                    if(this.model.get('disable-port-translation')){
                        this.model.set('port-range',this.model.get('port-range').length===0?"ANY":this.model.get('port-range'));
                    }
                    this.model.set('port-overloading-factor',this.model.get('port-overloading-factor')!=-1?this.model.get('port-overloading-factor'):'');
                    if(this.model.get('port-overloading-factor')!==''){
                        this.model.set('port-range','');    
                    }                    
                }
                this.form = new FormWidget(
                    {
                        "container": this.el,
                        "elements": formElements,
                        "values": this.model.attributes
                    }
                );
                this.form.build();
                this.natPoolTypeChangeHandler(this.model.get('pool-type'));
                return this;
            },
            cancel: function(event) {
                event.preventDefault();
                this.activity.overlay.destroy();
            },
            natPoolTypeChangeHandler: function(value) {
                if (value == 'SOURCE') {
                    this.$el.find('#natpool-port-form').hide();
                    this.$el.find('#natpool-advanced-form').show();
                } else if(value == 'DESTINATION') {
                    this.$el.find('#natpool-port-form').show();
                    this.$el.find('#natpool-advanced-form').hide();
                }
            }
        });
        return NatPoolDetailedInfoView;
    }
);
