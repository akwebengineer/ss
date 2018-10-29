define([
    'widgets/shortWizard/shortWizard',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../common/utils/userFwUtil.js'
], function(
    ShortWizard,
    ResourceView,
    UserFwUtil
    ){
    var BaseUseFwWizardView = ResourceView.extend({
        /**
         * Initialize Backbone view
         * @param options
         */
        initialize: function (options) {
            var self = this, wizardConf, pages;
            self.userFwUtil = new UserFwUtil();
            ResourceView.prototype.initialize.call(this, options);

            //override this method in child class
            pages = self.getWizardPages();
            wizardConf = {
                container: self.el,
                pages: pages,
                    // saveModel from parent class
                    save: $.proxy(self.saveModel, self),
                // wizardOnDone from parent class
                onCancel: _.bind(self.wizardOnDone, self),
                // overlayDestroy from parent class
                onDone: _.bind(self.overlayDestroy, self)
            };
            self.updateWizardConf(wizardConf);
            self.wizard = new ShortWizard(wizardConf);

            return self;
        },
        updateWizardConf: function(){

        },
        /**
         * @overridden mandatory
         */
        getWizardPages: function(){
            return [];
        },
        /**
         * @overridden mandatory
         */
        saveSuccessCallBack: function(){

        },
        /**
         * Destory overlay on Done with finsihing activity..
         */
        wizardOnDone: function() {
            var self = this;
            self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
            self.activity.finish();
            self.overlayDestroy();
        },
        /**
         * distory overlay
         */
        overlayDestroy: function() {
            this.activity.overlay.destroy();
        },
        /**
         * distory overlay
         */
        overlayDestroyAll: function() {
            this.activity.overlay.destroyAll();
        },
        createJobOverlay: function(model){
            var self = this;
            if(model.get("job-id") > 0){
                self.userFwUtil.showJobInformation(model.get("job-id"), self.context, $.proxy(self.overlayDestroyAll,self));
            }
        },
        /**
         *  Save Wizard model
         * @param options
         */
        saveModel: function(options) {
            var self= this;
            self.model.save(null,{
                /**
                 * When the object is successfully saved
                 * @param model
                 * @param response
                 */
                success: function(model, response) {
                    var json = model.toJSON();
                    json = json[model.jsonRoot];

                    // Set result to the grid
                    self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, json);
                    self.activity.finish();
                    $.proxy(self.saveSuccessCallBack, self)(options, model);
                },
                /**
                 * handles error on saving
                 * @param model
                 * @param response
                 */
                error: function(model, response) {
                    var message;

                    try {
                        message = JSON.parse(response.responseText);
                        message = (message.title) ? message.title + ': ' + message.message : message.message;
                    } catch (e) {
                        message = response.responseText || response;
                    }
                    // Invoke the error process of wizard
                    options.error(message);
                }
            });
        },
        /**
         * build Wizard
         * @returns {PolicyWizardView}
         */
        render: function() {
            this.wizard.build();
            return this;
        }
    });

    return BaseUseFwWizardView;
});
