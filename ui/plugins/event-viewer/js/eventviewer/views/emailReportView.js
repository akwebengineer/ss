/**
 *  A view implementing email form workflow for Create Report Wizard
 *
 *  @module CreateReport - EventViewer
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
	'backbone',
	'backbone.syphon',
	'../conf/reportConfigs.js',
	'widgets/form/formWidget',
	'../../../../sd-common/js/common/widgets/recipients/recipientsWidget.js'
	], function(
		Backbone,
	    Syphon,
		ReportConfigs,
		FormWidget,
		RecipientsWidget
	){

	var EmailReportView = RecipientsWidget.extend({

		initialize:function(options){
			console.log(options);
			var me = this;
			me.options = options;
			me.context = options.context;
			me.model = options.model;
			me.setTitle = false;
			me.showSubject = true;
		},
		//
		getTitle: function () {
	        return this.setFormTitle(this.context.getMessage('ev_create_alert_email_page_summary'));
	    },
	    //
	    getSummary: function() {
            return this.generateSummary('ev_create_report_email_page_summary');
        },
        //
        beforePageChange: function() {

            if (! this.formWidget.isValidInput()) {
                 console.log('form is invalid');
                 return false;
            }

            this.getValues();
            return true;
        },
        //
        getEmailInfo: function() {

        },
        //
        setEmailInfo: function(properties) {
            var jsonDataObj = {};

            jsonDataObj = {
               "additional-emails" : properties['additional-emails'].toString(),
               "email-subject": properties['email-subject'],
               "comments": properties['comments']
            };
            return jsonDataObj;
        },
        //
        getFormData: function() {
            var self = this,
                reg = /[\f\n\r\t]/g; // Match characters such as form feed character, line break, tab character.
            this.formData = {};
            this.formLabel = {};
            this.$el.find('form label').each( function(i, ele) {
                self.formLabel[ele.getAttribute('for')] = this.textContent.replace(reg, '').trim();
            });

            this.$el.find('form :input').each( function(i, ele) {
                if( ele.type!="submit" ) {
                    if (ele.type !="radio" && ele.type != "checkbox") {
                        if(ele.type === 'select-one') {
                            // For dropdown list, get the select option text as value
                            if($(ele).val()) {
                                self.formData[ele.id] = $(ele).find("option:selected").text().replace(reg, '').trim();
                            }
                        }else if(ele.type === 'select-multiple' && $(ele).val() != null) {
                            self.formData["additional-emails"] = $(ele).val().toString();
                        }else {
                            self.formData[ele.id] = $(ele).val();
                        }
                    } else if (ele.checked) {
                        self.formData[ele.id] = $(ele).val();
                    }
                }
            });
            return this.formData;
        },
        //
        generateSummary: function(title_tag) {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage(title_tag),
                value: ' '
            });
            this.getFormData();

            var formLabelHashmap = this.formLabel;
            var formDataHashmap = this.formData;

            for(key in formDataHashmap){
                var value = '',
                    label = '';

                label = formLabelHashmap[key];
                value = formDataHashmap[key];

                summary.push({
                    label: label,
                    value: value
                });
            }

            return summary;
        }

	});

	return EmailReportView;
});