/**
 * Profile detail editor view that is used to view the information of the policy profile.
 * @module InheritProfileView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'text!../../../../../sd-common/js/templates/policyProfileSummaryValues.html',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    '../conf/fwRuleProfileDetailFormConfiguration.js',
    '../../profiles/models/policyProfileCollection.js',
    '../../rules/constants/fwRuleGridConstants.js',
    'lib/template_renderer/template_renderer'
 //   '../../profiles/models/policyProfileModel.js'
], function (Backbone, FormWidget, multipleValueTemplate, CellEditorView, ProfileDetailFormConfiguration, PolicyProfileCollection, FWRuleGridConstants, render_template) {

    var policyProfileDetailEditorView = Backbone.View.extend({

         events: {
                'click #okProfileDetail': 'closeOverlay'
         },

        initialize: function () {
            var self = this;
            this.context = this.options.context;
            this.policyObj = this.options.policyObj;
            this.profileId = this.options.profileId;

            // this.policyProfileCollection = new PolicyProfileCollection({
            //     url: FWRuleGridConstants.POLICY_PROFILES + '/' + this.policyObj["policy-profile"].id
            // });

            this.formWidget = new FormWidget({
                "elements": ProfileDetailFormConfiguration.list,
                "container": this.el
            });

            return this;
        },

        render: function() {
            var self = this;

            $.ajax({
                url: FWRuleGridConstants.POLICY_PROFILES + '/' + this.profileId,
                type: 'GET',
                headers: {
                    accept: 'application/vnd.juniper.sd.fwpolicy-management.policy-profile+json;version=1',
                    contentType: 'application/vnd.juniper.sd.fwpolicy-management.policy-profile+json;version=1;charset=UTF-8' 
                },
                success: function(data) {
                    var detailElements = [];
                    var details = [];
                    var summary = [];

                    details.push({
                        label: self.context.getMessage('name'),
                        value: data["policy-profile"].name  
                    });

                    details.push({
                        label: self.context.getMessage('description'),
                        value: data["policy-profile"].description
                    });

                    // for summary
                    //   - Log: Enabled
                    //   - Log Count: Enabled  (enable-count: false)
                    //   - Packet REdirection: none (redirect: "NONE")
                    //   - Service offload: false (service-offload: false)
                    //   - Destination Translation Action: NONE (destination-address-translation: NONE)

                    summary.push({
                        label: 'Log: ' + 'Enabled',
                        value: ""
                    });

                    // summary.push({
                    //     label: 'Log Count: ' + data["policy-profile"]["enable-count"],
                    //     value: ""
                    // });

                    summary.push({
                        label: 'Log Count: ' + data["policy-profile"]["enable-count"],
                        value: ""
                    });

                    summary.push({
                        label: 'Packet Redirection: ' + data["policy-profile"]["redirect"],
                        value: ""
                    });

                    summary.push({
                        label: 'Service offload: ' + data["policy-profile"]["service-offload"],
                        value: ""
                    });

                    summary.push({
                        label: 'Destination Translation Action: ' + data["policy-profile"]["destination-address-translation"],
                        value: ""
                    });
   
                    details.push({
                        label: 'Profile summary',  
                        value: summary
                    });

                    details.push({
                        label: 'Created by',  
                        value: data["policy-profile"]["created-by-user-name"] 
                    });

                    details.push({
                        label: 'Last Modified By', 
                        value: ""    
                    });

                    var isFirstEntry = true;

                    for (var j = 0; j < details.length; j++) {
                        var detail = details[j];
                        if (typeof detail == 'object' &&
                            detail.label && detail.value) {
                            if (isFirstEntry) {
                           //     detail.id = i.toString();
                                isFirstEntry = false;
                            }
                            if (Array.isArray(detail.value)) {
                                var stringValue = "";
                                for (var k = 0; k < detail.value.length; k++) {
                                    stringValue += render_template(multipleValueTemplate, detail.value[k]);
                                }
                                detail.value = stringValue;
                            }
                            detailElements.push(detail);
                        }
                    }

                    self.formatDetailList(detailElements);
                    var formWidgetObject = self.formWidget.build();
        //            this.addEditLink(this.$el);

                    return self;
                    
                },
                error: function() {
                    console.log('Unable to retrieve')
                }
            });

            return self;
        },

        formatDetailList: function (detailList) {
            for (var i = 0; i < detailList.length; i++) {
                detailList[i]["element_description"]="true";
            };

            this.formWidget.insertElementsFromJson('0', JSON.stringify(detailList));
            return this;
        },

        closeOverlay: function (e) {
            this.options.close(e);
        },

        editCompleted :function(e, model){
              this.closeOverlay(e);
        }
    });

    return policyProfileDetailEditorView;
});