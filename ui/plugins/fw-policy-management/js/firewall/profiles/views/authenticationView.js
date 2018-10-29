/**
 * View for Authentication Tab in Policy Profile.
 *
 * @module AuthenticationView
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/authenticationFormConf.js',
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
                'Select Translation',
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
            var authType = this.model.get("authentication-type");
            this.authDropDown.setValue(authType);
 
            if(authType === "PASSTHROUGH_AUTHENTICATION"){
                this.$el.find('#client-name').val(this.model.get("pass-thru-auth-client-name"));
                this.$el.find('input[name=web-redirect]').attr("checked", this.model.get("web-redirect"));
                this.$el.find('input[name=web-redirect-https]').attr("checked", this.model.get("web-redirect-to-https"));
            } else if(authType === "WEB_AUTHENTICATION"){
                this.$el.find('#web-client-name').val(this.model.get("web-auth-client-name"));
            } else if(authType === "USER_FIREWALL"){
                var selectedDomain = this.model.get("domain"),
                    activeDirectoryDomains = this.form.getInstantiatedWidgets()['dropDown_domain-name'].instance,
                    selectedAccessProfile = this.model.get("access-profile"),
                    accessProfile = this.form.getInstantiatedWidgets()['dropDown_access-profile-name'].instance;

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
                var infranetRedirect = this.model.get("infranet-redirect");

                if(infranetRedirect === "NONE") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(0)').attr('checked',true);
                } else if(infranetRedirect === "REDIRECT_ALL") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(1)').attr('checked',true);
                } else if(infranetRedirect === "REDIRECT_UNAUTHENTICATED") {
                    this.$el.find('input:radio[name=infranet-redirect]:nth(2)').attr('checked',true);
                }

                this.$el.find('select[id="redirect-url"]').val(this.model.get("redirect-url"));    
            }
        },

        //set the defaults for the fields
        setDefaults : function(){

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
        },

        getViewData : function(){
            if (this.form && this.form.isValidInput()) {
                var data = Syphon.serialize(this);

                // as dropdown returns the value as array, set the access-profile-name and domain-name to the data obj
                if(data['access-profile-name'] && data['access-profile-name'].length >0){
                    data['access-profile-name'] = data['access-profile-name'][0];
                } else {
                    data['access-profile-name'] = "";
                }
                if(data['domain-name'] && data['domain-name'].length >0){
                    data['domain-name'] = data['domain-name'][0];
                } else {
                    data['domain-name'] = "";
                }

                console.log("Authentication data");
                console.log(data);
                return data;
            }
        }
    });

    return AuthenticationView;
});