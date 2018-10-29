/**
 * Utility Class for Sm Progress bar
 * This class will be used across SM
 * @module SmProgressBar
 * @author Vinay<vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/progressBar/progressBarWidget',
    'widgets/spinner/spinnerWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    'lib/template_renderer/template_renderer',
    'text!widgets/spinner/templates/loadingBackground.html'
    ], function (ProgressBarWidget, SpinnerWidget, ConfirmationDialogWidget, render_template, 
LoadingBackgroundTemplate) {

    var SmProgressBar = function(conf) {

        var progressBar;
        /**
         * Insilize progress bar
         * conf object should contain 
         * {
                "container": "",(mandatory)
                "hasPercentRate":"" ,
                "statusText": conf."", (mandatory)
                "isSpinner": false, (default value)
                "progressBarTimeOutCallBack": callbackFunction,
                "progressbarTimeout" : 600000 (default value 10min)
            }
         */
        var progressbarConf = {
            "container": conf.container,
            "hasPercentRate": conf.hasPercentRate,
            "statusText": conf.statusText
        };

        if(conf.isSpinner){
            this.isSpinner = true;
            progressBar =  new SpinnerWidget(progressbarConf);
        } else{
            progressBar = new ProgressBarWidget(progressbarConf);
        }
         /**
         *  @Overridden 
         * build progress bar
         */
        this.build= function(){
            console.log("Create progressbar - "+conf.statusText);
            progressBar.build();
            if(conf.handleMask){
                this.showMask();
            }
            this.updateTimer();
        };
         /**
         * @Overridden 
         * Destroy progress bar
         */
        this.destroy= function(){
            if(conf.handleMask){
                this.hideMask();
            }
            this.clearProgressTimerout();
            if(progressBar){
                console.log("destroy progressbar - "+conf.statusText);
                progressBar.setStatusText("");
                progressBar.destroy();
                progressBar =  null;
            }
        };
        
         /**
          * clear progressbar time out
          */
         this.clearProgressTimerout= function(){
            if(this.progressTimerout) {
                clearTimeout(this.progressTimerout);
                console.log("Import Test :: clearing " + this.progressTimerout);
                console.log("Import Test :: clearing " + conf.statusText);
                this.progressTimerout = null;
            }
         };
         /**
          * [updateTimer description]
          * @return {[type]} [description]
          */
         this.updateTimer= function(){
            //console.log("update progressbar before clear timeout - "+conf.statusText);
            this.clearProgressTimerout();
            var self = this;
            /*
            * set ptogressTimeout progress bar
            * on time our pop out error msg
            */
             this.progressTimerout = setTimeout(function(){
                if(progressBar){
                    // default
                    self.confirmationDialogWidget = new ConfirmationDialogWidget({
                        title: 'Error',
                        question: conf.customErrorMsg || 'Error please re-try..',
                        yesButtonLabel: 'OK',
                        yesButtonCallback: function() {
                            self.confirmationDialogWidget.destroy();
                            self.destroy();
                            // if custom call back 
                            if(conf.progressBarTimeOutCallBack){
                                conf.progressBarTimeOutCallBack();
                            }
                        },
                        xIcon: true
                    }).build();
                }
             }, conf.progressbarTimeout || 600000);
             console.log('Import Test :: creating ' + this.progressTimerout);
             console.log('Import Test :: creating ' + conf.statusText);
         };

        /**
         * @Overridden (custom)
         * Sets progress instantly without animation.
         * @param Number: how much percent the progress bar should display. range from 0.0-1.0
         */
        this.setProgressBar =  function (progress) {
            if(this.isSpinner){
                progressBar.setSpinnerProgress(progress);
            } else{
                progressBar.setProgressBar(progress);
            }
        };

        /**
         * @Overridden 
         * Hides time remaining.
         */
        this.hideTimeRemaining =  function () {
            progressBar.hideTimeRemaining();
        };

        /**
         * @Overridden 
         * Sets time remaining.
         * @param Millionseconds: how long the file will be loaded completely.
         */
        this.setTimeRemaining =  function (millionseconds) {
            this.updateTimer();
            progressBar.setTimeRemaining(millionseconds);
        };

        /**
         * @Overridden 
         * Sets spinner text.
         * @param String: the text.
         */
        this.setStatusText =  function (text) {
            this.updateTimer();
            progressBar.setStatusText(text);
        };

        this.showMask = function(){
            conf.container.append(progressBar).append(render_template(LoadingBackgroundTemplate));
        };

        this.hideMask = function(){
            $('div').remove('.slipstream-indicator-background');
        };

        
        /**
         *  @Overridden 
         * It's mainly used for showing form or overlay loading mask
         * Build progress bar without timer
         * Use slipstream-indicator-background class to set up the default spinner background
         * If there are furthur requirement to use different background, expand this as needed
         */
        this.showLoadingMask = function(){
            progressBar.build();
            this.showMask();
        };
        
        /**
         * @Overridden 
         * It's mainly used for hiding form or overlay loading mask
         * Destroy progress bar without timer
         * Remove slipstream-indicator-background class
         */
        this.hideLoadingMask = function(){
            this.hideMask();
            progressBar.destroy();
        };
    };
        
    return SmProgressBar;
});