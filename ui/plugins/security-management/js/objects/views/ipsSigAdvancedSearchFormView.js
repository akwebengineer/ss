/**
 * Created by avyaw on 9/18/15.
 */


define(
[
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../conf/ipsSigAdvancedFilterConf.js',
    'widgets/dropDown/dropDownWidget',
    '../models/ipsSigDynServiceSetCollection.js',
    '../constants/ipsSigConstants.js'
],

function(Backbone, Syphon, FormWidget, ResourceView, IpsSigAdvancedFilterConf, DropDownWidget, Collection,IpsSigConstants) {

    var IpsSigAdvancedSearchFormView = ResourceView.extend({

        collection: new Collection(),

        events: {
            'click #ipsSig-advance-search-submit': "submit",
            'click #ipsSig-advanced-search-cancel': "cancel"
        },


        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
        },

        render: function() {
            var me = this,
            formConfiguration = new IpsSigAdvancedFilterConf(this.context),
            formElements = formConfiguration.getValues();
            me.form = new FormWidget({
                "container": this.el,
                "elements": formElements
            });

            me.form.build();

            this.createServiceMultipleSelectDropDown();
            this.createMathAssMultipleSelectDropDown();
            this.createPerfImpactMultipleSelectDropDown();
            this.buildServiceList(me.collection);
            this.createPlatformMultipleSelectDropDown();
            this.createActionMultipleSelectDropDown();
            this.createVersionChangeMultipleSelectDropDown();

            this.createDropDown('direction-any',this.getDirectionValues());
            this.createDropDown('direction-cts',this.getDirectionValues());
            this.createDropDown('direction-stc',this.getDirectionValues());
            return me;
        },
        createDropDown: function(container,data,onchange){
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
        getDirectionValues : function(){
          return  [{"text": "None","id": ""},{"text": "Default","id": "DEFAULT"}, {"text": "Yes","id": "yes"}, {"text": "No", "id": "no"}] ;
        },
        /**
         * Edit items in the list for display
         */

        createServiceMultipleSelectDropDown: function(){
          var self = this,
              serviceConatainer = self.$el.find('.service-container');
              self.serviceData = "";

          self.serviceDropDown = new DropDownWidget({
              "container": serviceConatainer,
              "data": self.serviceData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
        },
        buildServiceList: function(collection) {
            var self = this;
            var list = [];
            collection.fetch({
                success: function (collection, response, options) {
                  if(response && response['ips-sig-services']['ips-sig-service']) {
                    for(var i=0;response['ips-sig-services']['ips-sig-service'].length >i ;i++){
                        list.push({
                            'id': response['ips-sig-services']['ips-sig-service'][i],
                            'text': response['ips-sig-services']['ips-sig-service'][i]
                        })
                    }
                     self.serviceDropDown.conf.data = list;
                      self.serviceDropDown.build();
                  }
                },
                error: function (collection, response, options) {
                    self.serviceDropDown.conf.data = list;
                     self.serviceDropDown.build();
                }
             });          
        },

         createMathAssMultipleSelectDropDown: function(){
          var self = this,
              mathAssConatainer = self.$el.find('.math-ass-container');
              self.mathAssData = [{
                  "id": "rarely",
                  "text": IpsSigConstants.HIGH
                },
                {
                  "id": "occasionally",
                  "text": IpsSigConstants.MEDIUM
                },
                {
                  "id": "frequently",
                  "text": IpsSigConstants.LOW
                },
                {
                  "id": "none",
                  "text": IpsSigConstants.UNKNOWN
                }];

          self.mathAssDropDown = new DropDownWidget({
              "container": mathAssConatainer,
              "data": self.mathAssData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": "Select Match Assurance"
          });
          self.mathAssDropDown.build();
  
        },

        createPlatformMultipleSelectDropDown: function(){
          var self = this,
              platformConatainer = self.$el.find('.platform-container');
              self.platformData = [{
                  "id": "idp",
                  "text": IpsSigConstants.IPD
                },
                {
                  "id": "isg",
                  "text": IpsSigConstants.ISG
                },
                {
                  "id": "mx",
                  "text": IpsSigConstants.MX
                },
                {
                  "id": "srx",
                  "text": IpsSigConstants.SRX_HIGH
                },
                {
                  "id": "srx-branch",
                  "text": IpsSigConstants.SRX_BRANCH
                },
                {
                  "id": "j-series",
                  "text": IpsSigConstants.J_SERIES
                }];

          self.platformDropDown = new DropDownWidget({
              "container": platformConatainer,
              "data": self.platformData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.platformDropDown.build();
  
        },
        createActionMultipleSelectDropDown: function(){
          var self = this,
              actionConatainer = self.$el.find('.action-container');
              self.actionData = [{
                  "id": "none",
                  "text": IpsSigConstants.NO_ACTION
                },
                {
                  "id": "close",
                  "text": IpsSigConstants.CLOSE_CLIENT_SERVER
                },
                {
                  "id": "close_client",
                  "text": IpsSigConstants.CLOSE_CLIENT
                },
                {
                  "id": "close_server",
                  "text": IpsSigConstants.CLOSE_SERVER
                },
                {
                  "id": "ignore",
                  "text": IpsSigConstants.IGNORE
                },
                {
                  "id": "drop",
                  "text": IpsSigConstants.DROP
                },
                {
                  "id": "drop_packet",
                  "text": IpsSigConstants.DROP_PACKET
                }];

          self.actionDropDown = new DropDownWidget({
              "container": actionConatainer,
              "data": self.actionData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.actionDropDown.build();
        },

        createPerfImpactMultipleSelectDropDown: function(){

          var self = this,
              perfImpactConatainer = self.$el.find('.perf-impact-container');
              self.perfImpactData = [{
                  "id": "9",
                  "text": IpsSigConstants.HIGH
                },
                {
                  "id": "5",
                  "text": IpsSigConstants.MEDIUM
                },
                {
                  "id": "1",
                  "text": IpsSigConstants.LOW
                },
                {
                  "id": "0",
                  "text": IpsSigConstants.UNKNOWN
                }];

          self.perfImpactDropDown = new DropDownWidget({
              "container": perfImpactConatainer,
              "data": self.perfImpactData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.perfImpactDropDown.build();
  
        },

        createVersionChangeMultipleSelectDropDown: function(){
          var self = this,
              versionChangeContainer = self.$el.find('.version-change-container');
              self.versionChangeData = [{
                  "id": "update",
                  "text": IpsSigConstants.UPDATED
                },
                {
                  "id": "add",
                  "text": IpsSigConstants.NEW_ADD
                }];

          self.versionChangeDropDown = new DropDownWidget({
              "container": versionChangeContainer,
              "data": self.versionChangeData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.versionChangeDropDown.build();
  
        },


       submit: function(event) {
        //TBD
          this.cancel(event);
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

    return IpsSigAdvancedSearchFormView;
});