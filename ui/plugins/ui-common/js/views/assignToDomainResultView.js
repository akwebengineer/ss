/**
 * Module that renders the operation result
 *
 * @module AssignToDomainResultView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/assignToDomainResultFormConf.js'
], function(Backbone, FormWidget, ResultFormConf){
    var AssignToDomainResultView = Backbone.View.extend({

        events: {
            'click #result-close': 'closeView',
            'click #assign-to-domain-result-view-audit-log > a': 'viewAuditLog'
        },

        closeView: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.parentView.resultViewOverlay.destroy();
        },

        close: function() {
            var currentView = this.views ? this.views.contentView.view : this;
            currentView.parentView.activity.finish();
            // Reload landing page
            var currentMimeType = currentView.parentView.activity.intent.data.mime_type;
            var newIntent = new Slipstream.SDK.Intent("slipstream.intent.action.ACTION_LIST", {
                mime_type: currentMimeType
            });
            Slipstream.vent.trigger("activity:start", newIntent);
        },

        viewAuditLog: function(event) {
            console.log('audit log');
            // Launch audit log activity for associated audit log
            this.parentView.resultViewOverlay.destroy();
            var intent = new Slipstream.SDK.Intent("slipstream.intent.action.ACTION_LIST", {
                mime_type: 'vnd.juniper.net.auditlog'
            });
            var data = {
                id: this.data.response['auditlog-id']
            };
            intent.putExtras({data: data});
            Slipstream.vent.trigger("activity:start", intent);
        },

        initialize: function(conf) {
            this.parentView = conf.parentView;
            this.context = this.parentView.context;
            this.data = conf.data;
            return this;
        },
        render: function(){
            var resultMessageKey = 'assign_to_domain_result_message';
            var formConfiguration = new ResultFormConf({
                context: this.context,
                objectTypeText: this.data.objectTypeText,
                domainTrack: this.data.domainTrack,
                resultMessageKey: resultMessageKey
            });
            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.data.response
            });

            this.form.build();
            this.$el.addClass("security-management");
            this.$el.find(".elementlabel").addClass("assign-to-domain-result-label-long");
            this.$el.find('#assign-to-domain-result-view-audit-log').html('<a href="#">' + this.context.getMessage("assign_to_domain_result_view_audit_log_text") + '</a>');
            return this;
        }
    });
    return AssignToDomainResultView;
});