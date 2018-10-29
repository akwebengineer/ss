
define(['backbone',
	'widgets/form/formWidget',
	'../conf/changePasswordFormConfig.js',
    '../service/logService.js'], 
	function(Backbone,
		FormWidget,
		ChangePasswordFormConfig,
        LogService){

	var ChangePasswordView = Backbone.View.extend({
		
		events: {
           'click #change-password-save': 'changePassword',
           'click #change-password-cancel': 'cancel'

        },
        initialize: function(options){
    		this.activity = options.activity;
            this.context = options.activity.context;
    	},
		render: function(){

    		changePasswordFormConfig = new ChangePasswordFormConfig(this.context);
    		this.formWidget = new FormWidget({
                "elements" : changePasswordFormConfig.getValues(),
                "container" : this.el
            });
            this.formWidget.build();

            //this.$el.find(".elementinput span")[0].remove();


            return this;
    	},

        changePassword : function(){
            var me = this,service = new LogService();
            if (!me.formWidget.isValidInput()) {
                 console.log('form is invalid');
                 return false;
            };

            onChangePasswordSuccess = function(data){

                me.activity.overlay.destroy();
                new Slipstream.SDK.Notification()
               .setText("Password Change Successfull")
               .setType("success")
               .notify();


            };

            onChangePasswordError = function(error){

                new Slipstream.SDK.Notification()
               .setText(error.responseText)
               .setType("error")
               .notify()

            };  
            var newPassword = me.$el.find("#new_password").val();
            service.changePassword(newPassword, onChangePasswordSuccess, onChangePasswordError)

        },

        cancel: function(event) {
            
            event.preventDefault();
            this.activity.overlay.destroy();
        }

	});

	return ChangePasswordView;
})