/**
 * View for Authentication Tab in Policy Rule Profile.
 *
 * @module AuthenticationView
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../../profiles/conf/authenticationFormConf.js',
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
            this.authDropDown = this.createDropDown('auth-type',
                [{"text": "None","id": "NONE"},
                {"text": "Pass Through", "id": "PASSTHROUGH_AUTHENTICATION"},
                {"text": "Web", "id": "WEB_AUTHENTICATION"},
                {"text": "User Firewall","id": "USER_FIREWALL"},
                {"text": "Infranet","id": "INFRANET_AUTHENTICATION"}],
                this.context.getMessage('select_option'),
                this.authTypeChangeHandler);
            if(Object.keys(this.model.toJSON()).length !== 0){
                this.modifyForm();
            }   
            else{
                //set defaults for fields
                this.setDefaults();
            }

            return this;
               
        },
        createDropDown: function(container,data,placeholder,onchange){
              var self = this;
              this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
              return new DropDownWidget({
                  "container": this.$el.find("."+container),
                  "data": JSON.stringify(data),
                  "placeholder": placeholder,
                  "enableSearch": true,
                  "onChange": function(event) {
                      if (onchange) {onchange($(this).val(),self);}
                   }
              }).build();
        },

        /*
            Incase of modify and clone fill the form values with the data of the selected profile
        */
        modifyForm : function(data){
            var authType = "NONE";
            var customProfile = this.model.get("rule-profile")["custom-profile"];
            if (customProfile && customProfile["authentication-type"])
                authType = customProfile["authentication-type"] || authType;

            this.authDropDown.setValue(authType);
            if(authType === "PASSTHROUGH_AUTHENTICATION"){
                if (customProfile && customProfile["web-auth-client-name"])
                    this.$el.find('#client-name').val(customProfile["web-auth-client-name"]);
                if (customProfile && customProfile["web-redirect"])
                    this.$el.find('input[name=web-redirect]').attr("checked", customProfile["web-redirect"]);
                if (customProfile && customProfile["web-redirect-to-https"])
                    this.$el.find('input[name=web-redirect-https]').attr("checked", customProfile["web-redirect-to-https"]);                    
            } else if(authType === "WEB_AUTHENTICATION"){
                if (customProfile && customProfile["web-auth-client-name"])
                    this.$el.find('#web-client-name').val(customProfile["web-auth-client-name"]);
            } else if(authType === "USER_FIREWALL"){
                // get the user firewall management AD and AP related dropdowns and set the value
                var selectedDomain = customProfile["user-firewall-domain"],
                    formDropDowns = this.form.getInstantiatedWidgets(),
                    activeDirectoryDomains = formDropDowns['dropDown_domain-name'].instance,
                    selectedAccessProfile = customProfile["access-profile-name"],
                    accessProfile = formDropDowns['dropDown_access-profile-name'].instance;

                // add the data to the dropdown list and then set it to the dropdown for AP and AD
                if(!_.isEmpty(selectedDomain)){
                    activeDirectoryDomains.addData({id:selectedDomain,  name: selectedDomain}, false);
                    activeDirectoryDomains.setValue({id:selectedDomain,  text: selectedDomain});
                }
                if(!_.isEmpty(selectedAccessProfile)){
                    accessProfile.addData({id:selectedAccessProfile,  name: selectedAccessProfile}, false);
                    accessProfile.setValue({id:selectedAccessProfile,  text: selectedAccessProfile});
                }
            } else if(authType === "INFRANET_AUTHENTICATION"){
                var infranetRedirect = "";
                if (customProfile && customProfile["infranet-redirect"])
                    infranetRedirect = customProfile["infranet-redirect"];

                if(infranetRedirect === "NONE") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(0)').attr('checked',true);
                } else if(infranetRedirect === "REDIRECT_ALL") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(1)').attr('checked',true);
                } else if(infranetRedirect === "REDIRECT_UNAUTHENTICATED") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(2)').attr('checked',true);
                }

                if (customProfile && customProfile["redirect-url"])
                    this.$el.find('#redirect-url').val(customProfile["redirect-url"]);    
            }
        },

        //set the defaults for the fields
        setDefaults : function(){

        },

        /*
            Hide or show the Authentication fields based on the Authentication Type
        */
        authTypeChangeHandler : function(authType,view){
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
        },

        getViewData : function(){
            if (this.form && this.form.isValidInput()) {
                var data = Syphon.serialize(this);
                console.log("Authentication data");
                console.log(data);
                return data;
            }
        }
    });

    return AuthenticationView;
});