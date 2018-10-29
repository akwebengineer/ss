/**
 * Adds badge to the tab container
 *
 * @module Badge
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
        'widgets/tabContainer/tabContainerWidget',
        'lib/template_renderer/template_renderer'
    ],
    function(TabContainerWidget, render_template) {

        /**
         * Badge constructor
         *
         * @constructor
         * @class Bagde - Adds badge to the tab container
         *
         * @param {Object} conf - Tab configuration object
         * @returns {Object} Current Badge's object: this
         */
        var Badge = function(conf, templates){
            var self = this;

            /**
             * Updates the object required for the badge template to render based on the properties defined in the configuration
             * @param {Object} tab - The tab for which the badge is being rendered
             * @param {Object} templateData - The object that will be sent to the template for rendering
             * @return updated templateData
             */
            this.updateBadgeConfig = function(tab, templateData) {
                var assignBadge = function(tabBadge) {
                    if(tabBadge.content)
                        templateData.badgeContent =tabBadge.content(tab.id);
                    if(tabBadge.class)
                        templateData.badgeClass = tabBadge.class;
                };
                if(tab.badge) {
                    assignBadge(tab.badge(tab.id));
                } else if(conf.badge) {
                    assignBadge(conf.badge(tab.id));
                }
                return templateData;
            };

            /**
             * Updates the object required for the Error badge template to render based on the properties defined in the configuration
             * @param {Object} tab - The tab for which the badge is being rendered
             * @return updated templateData
             */
            this.updateErrorConfig = function(tab) {
                var errorData = conf.error(tab.id);
                var templateData;
                if(errorData && errorData.class) {
                    templateData = {
                        "class": errorData.class
                    }
                }
                return templateData;
            };


            /**
             * Show/Hide the the badge when the close icon shows on tab hover
             * @param {Object} container - link container of which the badge is a sibling inside the list container
             * @param {Boolean} hide - If the badge needs to be hidden then this parameter is set to true
             * @inner
             */
            this.toggleVisibility = function(container, hide) {
                var badgeContainer = container.siblings(".badgeIcon");
                if( badgeContainer.length > 0) {
                    if(hide)
                        badgeContainer.eq(0).addClass("hideBadge");
                    else
                        badgeContainer.eq(0).removeClass("hideBadge");
                }
            };

            /**
             * Shows and Hides Error and Badge Container on tab switching
             * @param {Object} container - Tab container in which the error badge or the badge icon will show
             * @param {Boolean} isValid - The tab validation status
             * @param {Object} tab - The tab config for which the badge is being rendered
             * @inner
             */
            this.showHide = function(container, isValid, tab) {
                var badgeIcon = container.find('.badgeIcon');
                var errorIcon = container.find('.errorIcon');
                if (!isValid && errorIcon.length == 0) { //Executes when the tab is invalid
                    var errorImageObj;
                    if(tab && conf.error) {
                        errorImageObj = self.updateErrorConfig(tab);
                    }
                    appendTemplate(container, templates.errorImage, errorImageObj, true);
                } else if(errorIcon.length == 0 && badgeIcon.length == 0){ //Executes when the tab is valid
                    var badgeObj = {};
                    badgeObj = self.updateBadgeConfig(tab, badgeObj);
                    appendTemplate(container, templates.badgeContainer, badgeObj);
                }
            };

            /**
             * Appends template to the tab container
             * @param {Object} container - Tab container in which the error badge or the badge icon will show
             * @param {Object} template - template to be rendered
             * @param {Object} config - the data that would be used to render the badge on the container
             * @param {Boolean} isError - if the error icon needs to be shown
             * @inner
             */
            var appendTemplate = function(container, template, config, isError) {
                if(isError) {
                    var badgeIcon = container.find('.badgeIcon');
                    self.removeBadge(badgeIcon);
                }
                container.append(render_template(template, config));
            };

            /**
             * Removes Badge if it exists
             * @param {Object} container - Tab container from which the badge needs to be removed
             * @inner
             */
            this.removeBadge = function(container) {
                var badgeIcon = container.find('.badgeIcon');
                if (badgeIcon.length > 0) {
                    badgeIcon.remove();
                }
            };
        };

        return Badge;
    });