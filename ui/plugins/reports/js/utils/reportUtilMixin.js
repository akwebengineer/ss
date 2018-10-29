define(['./reportConstants.js',], function(ReportConstants) {

    var ReportUtilityMixin = {

        isEnableRunReport: function(selectedRows){
            enable = false;
            // If POLICY ANALYSIS report is selected, "Run Reports" should be disabled
            if (selectedRows.length === 1 && this.notPolicyAnalysisReport(selectedRows)) {
                enable = true;
            }
            return enable;
        },

        notPolicyAnalysisReport: function(selectedRows){
            enable = true;
            for(var i = 0; i < selectedRows.length; i++) {
                if(selectedRows[i]["report-content-type"] === ReportConstants.ReportTypes.POLICY_ANOMALY){
                    enable=false;
                    break;
                }
            }
            return enable;
        }
	};
	return ReportUtilityMixin;
});