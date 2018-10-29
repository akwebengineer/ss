/**
 *
 * @author avyaw
 * @copyright Juniper Networks, Inc. 2015
 */


define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
    '../conf/pasteRuleMessageConfiguration.js'
],function(Backbone, FormWidget, DropDownWidget, PasteFormConfiguration){

    var PasteMessageView = Backbone.View.extend({

        events: {
            'click #btnPasteOk': 'handleOkbutton'
        },

        initialize: function(options){
            this.context = options.context;
            this.parentView = options.params.parentView;
            this.msgString = options.params.message;
            this.isZoneMsgRequire = options.params.isZoneMsgRequire;
        },
        render :function(){
            var self = this,pasteMsg,warningBox,messageBox,formConfiguration = new PasteFormConfiguration(this.context).getConfig();
            this.form = new FormWidget({
                "elements": formConfiguration,
                "container": self.el
            });

            this.form.build();
            this.$el.addClass('security-management');
            var alertBox = $(this.form.formTemplateHtml.find('form')).find('.alert-box');
            var messageBox = $("<div id='messageBox' style='font-size: 12px;'>"+ this.msgString +"</div>");
            //If message include error message the no need to static paste message
            if(this.isZoneMsgRequire){
                 pasteMsg = this.context.getMessage("paste_message");
                 warningBox = $("<div id='warningBox' class='warning-box alert-box warning'><div style='padding-left:20px;'>"+pasteMsg+"</div></div>");
                 warningBox.insertAfter($(alertBox));             
                 messageBox.insertAfter($(warningBox));           
            }else{
                messageBox.insertAfter($(alertBox));
            }
            var msgEditor = this.$el.find('#message_editor').parent();
            $(msgEditor).empty();            
            self.showPasteMsg();           
            return this;
        },

        showPasteMsg : function() {
            var warningBox = this.$el.find("#warningBox");
            warningBox.show();
        },

        handleOkbutton : function(e) {
            e.preventDefault();
            this.parentView.overlay.destroy();
        }
    });
    return PasteMessageView;

});