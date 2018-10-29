/**
 * The source identity view to create a specific source identity
 * 
 * @module SourceIdenityView
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/fwRuleSourceIdentityFormConf.js',
    '../models/sourceIdentityCollection.js',
    '../models/sourceIdentityModel.js'
], function (Backbone, Syphon, FormWidget, Configuration, Collection, Model) {

    var SourceIdentityView = Backbone.View.extend({
         events: {
             'click #source-id-save': "addSourceId",
             'click #source-id-cancel': "closeFormOverlay"
         },

        initialize: function(options) {
            this.context = this.options.context;
            this.model = this.options.model;

            this.formConfiguration = new Configuration(this.context);
//            this.collection = new Collection();

        },

        render: function() {
            var self = this;
            var formConfiguration = new Configuration(this.context);
            var formElements = formConfiguration.getValues();

            // this.formNode = this.MODE_CREATE;
            // this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.form.build();

            this.$el.addClass("security-management");

            return this;
        },

       //  addSourceId: function(e) {
       //      e.preventDefault();
       //      // Check is form valid
       //      if (! this.form.isValidInput()) {
       //          console.log('form is invalid');
       //          return;
       //      }

       //      console.log('ready to save');

       //      var srcId = this.$el.find("#source-id-name").val();
       //      this.model.url = "/api/juniper/sd/policy-management/firewall/src-identity";
       //      this.model.requestHeaders.type = "POST";
       //      this.model.requestHeaders.contentType = "application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;charset=UTF-8";
       //      this.model.requestHeaders.accept = "application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;q=0.01";
       // //     this.model.set(srcId);
       //      this.model.set({
       //          "srcIdentity": {
       //              "name": srcId
       //          }
       //      });

       //      this.model.save();

       //      this.options.save(e);
       //  },

        addSourceId: function(e) {
            var self = this;
            e.preventDefault();
            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            console.log('ready to save');

            var srcId = this.$el.find("#source-id-name").val();

            var modifiedData = {
                "srcIdentity": {
                    "name": srcId
                }
            };

            $.ajax({
                url : "/api/juniper/sd/policy-management/firewall/src-identity",
                type:'POST',
                contentType: 'application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;charset=UTF-8',
                data: JSON.stringify(modifiedData), 

                beforeSend:function(request){
                    request.setRequestHeader('Accept', "application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;q=0.01");
                },
                success :function(data){
                    console.log("update src identity list builder");
                    self.model.set({
                        "srcIdentity": {
                            "name": srcId 
                        }
                    });
                    self.options.save(e);
                },
                error: function() {
                    console.log('source identity is not fetched successfully');
                }
            });
        },

        closeFormOverlay: function (e) {
            //this.options.close(this.options.columnName, e);
            this.options.close(e);
        },

    });

    return SourceIdentityView;
});