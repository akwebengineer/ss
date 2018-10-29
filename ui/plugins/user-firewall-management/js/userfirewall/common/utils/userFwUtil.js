/**
 * Utility Class for Common usage
 * This class will be used across User FW Managment
 * @module userFwUtil
 * @author Vinay<vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['widgets/overlay/overlayWidget',
        '../../../../../sd-common/js/common/widgets/jobInformationForm.js',
        '../views/deleteConfirmationView.js'
    ],
    function (OverlayWidget, JobInformationForm, DeleteConfirmationView) {

    var UserFwUtils = function () {
        this.showDeleteConfirmation = function(objType, context, callBack){
            var viewObj = {};
            if(objType === 'ACTIVE_DIRECTORY'){
                viewObj = {
                    context : context,
                    title: context.getMessage('active_directory_delete_title'),
                    question: context.getMessage('active_directory_delete_msg'),
                    callBack: callBack,
                    activity: this
                }
            } else {
                viewObj = {
                    context : context,
                    title: context.getMessage("access_profile_delete_title"),
                    question: context.getMessage("access_profile_delete_message"),
                    callBack: callBack,
                    activity: this
                }
            }
            this.deleteOverlay = this.showOverlay(new DeleteConfirmationView(viewObj),'xsmall');
            var overlayContainer = this.deleteOverlay.getOverlayContainer();
            if(!overlayContainer.hasClass(context["ctx_name"])){
                overlayContainer.addClass(context["ctx_name"]);
            }
        };

        this.showJobInformation = function (jobId, context, callback) {
            var self = this;
            var jobInformation = new JobInformationForm({
                context: context,
                jobId: jobId,
                beforeJumpCallback: callback,
                okButtonCallback: function () {
                    self.overlay.destroy();
                }
            });

            self.overlay = self.showOverlay(jobInformation, 'xsmall');
        };
        this.showOverlay= function(view, size) {
            this.overlay = new OverlayWidget({
                view: view,
                type: size || 'medium',
                showScrollbar: true
            });
            return this.overlay.build();
        };
    }
    return UserFwUtils;
});