/**
 * A view of a step in the wizard train.  
 * 
 * @module TrainStepView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/shortWizard/templates/shortWizardStep.html'
], function(Marionette,
	        stepTpl) {

    var TrainStepView = Marionette.ItemView.extend({
        initialize: function(options) {
            _.extend(this, options);
        },

        template: stepTpl,
        className: 'trainCircleWrapper',
        attributes: {'tabindex': '0'},

        events: {
            "click": "selectStep"
        },
        selectionHandler: function(step, hasIntroPage) {
            var trainCircle = this.$el.find(".trainCircle"),
                shortWizardText = this.$el.find(".shortWizardTrainText"),
                prevTrainWrapper = this.$el.closest(".shortWizardTrain").find(".trainCircleWrapper"),
                modelStep = this.model.get("step");

            if (step === modelStep) {
                trainCircle.addClass("current");
                trainCircle.removeClass("visited");
                shortWizardText.addClass("current");
                shortWizardText.addClass("visited");
            }
            else {
                if (trainCircle.hasClass("current")) {
                    trainCircle.removeClass("current");
                    trainCircle.addClass("visited");
                    shortWizardText.removeClass("current");
                }

                //Following lines add the 'current' class to the current step and 'latest' to the latest step visited
                if(modelStep < step) {
                    var prevTrainLine;
                    if(hasIntroPage)
                        prevTrainLine = (_.isUndefined(prevTrainWrapper[modelStep-1])) ? undefined : $(prevTrainWrapper[modelStep-1]).find(".trainLine");
                    else
                        prevTrainLine = (_.isUndefined(prevTrainWrapper[modelStep])) ? undefined : $(prevTrainWrapper[modelStep]).find(".trainLine");
                    if((step-1) == modelStep) {
                        if (!_.isUndefined(prevTrainLine)) {
                            prevTrainLine.addClass("latest");
                            prevTrainLine.removeClass("current");
                        }
                    }
                    else if((step-1) > modelStep) {
                        if(!_.isUndefined(prevTrainLine)) {
                            if(!prevTrainLine.hasClass("current")) {
                                prevTrainLine.addClass("current");
                            }
                            prevTrainLine.removeClass("latest");
                        }
                    }
                }
            }
        },
        selectStep: function() {
            this.options.vent.trigger("step:try_selected", this.model.get("step"));
        },
        fixFocus: function(step) {
            if (step === this.model.get("step")) {
                this.$el.find(".trainCircle").focus();
            }
        },
        serializeData: function() {
            return _.extend(this.model.toJSON(), 
                { 
                    step: this.model.get("step"),
                    relStep: this.model.get("relStep") + 1
                });
        }
    });

    return TrainStepView;
});