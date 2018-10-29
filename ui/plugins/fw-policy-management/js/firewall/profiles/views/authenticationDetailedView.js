/**
 * View for Authentication Tab in Policy Profile.
 *
 * @module AuthenticationView
 * @author Damodhar M<mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/authenticationDetailedViewConf.js',
    'widgets/dropDown/dropDownWidget'
], function (Backbone, Syphon, FormWidget, AuthenticationFormConf,DropDownWidget) {

    var AuthenticationView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.customGridData = new Backbone.Collection();
        },

        render : function(){
            var self = this;

            var formConfiguration = new AuthenticationFormConf(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();
            this.modifyForm();
            return this;   
        },

        /*
            Incase of modify and clone fill the form values with the data of the selected profile
        */
        modifyForm : function(data){
            var authType = this.model.get("authentication-type");
            this.authTypeChangeHandler(authType,this);
 
            if(authType === "PASSTHROUGH_AUTHENTICATION"){
                this.$el.find('#client-name').val(this.model.get("pass-thru-auth-client-name"));
                this.$el.find('input[name=web-redirect]').attr("checked", this.model.get("web-redirect"));
                this.$el.find('input[name=web-redirect-https]').attr("checked", this.model.get("web-redirect-to-https"));
                this.$el.find('input[name=web-redirect]').attr("disabled", true);
                this.$el.find('input[name=web-redirect-https]').attr("disabled", true);
                
            } else if(authType === "WEB_AUTHENTICATION"){
                this.$el.find('#web-client-name').val(this.model.get("web-auth-client-name"));
            } else if(authType === "USER_FIREWALL"){
                this.$el.find('#domain-name').val(this.model.get("domain"));
                this.$el.find('#access-profile-name').val(this.model.get("access-profile"));
            } else if(authType === "INFRANET_AUTHENTICATION"){
                var infranetRedirect = this.model.get("infranet-redirect");

                if(infranetRedirect === "NONE") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(0)').attr('checked',true);
                    this.$el.find('input:radio[name=infranet-redirect]:nth(0)').attr("disabled", true);
                } else if(infranetRedirect === "REDIRECT_ALL") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(1)').attr('checked',true);
                    this.$el.find('input:radio[name=infranet-redirect]:nth(1)').attr("disabled", true);
                } else if(infranetRedirect === "REDIRECT_UNAUTHENTICATED") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(2)').attr('checked',true);
                    this.$el.find('input:radio[name=infranet-redirect]:nth(2)').attr("disabled", true);
                }

                this.$el.find('select[id="redirect-url"]').val(this.model.get("redirect-url"));    
            }
        },

        /*
            Hide or show the Authentication fields based on the Authentication Type
        */
        authTypeChangeHandler : function(authType, view){
            view.$el.find(".clientname").hide();
            view.$el.find(".webredirect").hide();
            view.$el.find(".webredirecthttps").hide();
            view.$el.find(".domainname").hide();
            view.$el.find(".accessprofilename").hide();
            view.$el.find(".redirect").hide();
            view.$el.find(".redirecturl").hide(); 
            view.$el.find(".webclientname").hide();           
            if(authType === "PASSTHROUGH_AUTHENTICATION"){
                view.$el.find(".clientname").show();
                view.$el.find(".webredirect").show();
                view.$el.find(".webredirecthttps").show();
            } else if(authType === "WEB_AUTHENTICATION"){
                view.$el.find(".webclientname").show();
            } else if(authType === "USER_FIREWALL"){
                view.$el.find(".domainname").show();
                view.$el.find(".accessprofilename").show(); 
            } else if(authType === "INFRANET_AUTHENTICATION"){
                view.$el.find(".redirect").show();
                view.$el.find(".redirecturl").show();
            }
        }

    });

    return AuthenticationView;
});