define([
	'widgets/form/formWidget',
	'../conf/policyDiffFormConfig.js',
    '../../../../base-policy-management/js/policy-management/manage-version/views/compareSnapshotVersionView.js'
], function (FormWidget, FormConfig, ComparePolicyView) {

	var PolicyVersionCompareView = ComparePolicyView.extend({
        doCompare: function () {
        	var me = this;
        	me.subscribeNotifications();
        	this.startCompareJob();
        	return me;
        },
        handleParse : function (str) {
          return str;
        }
    });
    return PolicyVersionCompareView;
});