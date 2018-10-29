/**
 * A module that builds a tab container widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the configuration required by the third party library: jQuery UI Tabs.
 *
 * @module TabContainerWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jqueryui',
    'jqueryVerticalTabs',
    'jquery.resize',
    'widgets/tabContainer/lib/tabTemplates',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'widgets/tabContainer/lib/confirmationDialogBuilder',
    'widgets/tabContainer/lib/badge'
], /** @lends TabContainerWidget*/
function (tabs, verticalTabs, resize, TabTemplates, render_template, i18n, ConfirmationDialogBuilder, Badge) {

    var TabContainerWidget = function (conf) {
        /**
         * TabContainerWidget constructor
         *
         * @constructor
         * @class TabContainerWidget- Builds a tab container widget from a configuration object.
         * @param {Object} conf - It requires the following parameters:
         * container: define the container where the widget will be rendered
         * tabs: define the name and the content that will be showed in the tab container. It should be an array with objects that have the following parameters:
         * - id: id of the tab and represented by a string primitive data type. The id should be unique in the page.
         * - name: name of the tab and represented by a string primitive data type.
         * - content: content of the tab and represented by a Slipstream view object data type.
         * - isDefault: tab that will be showed by default when the tab is rendered and represented by a boolean data type. If it is set to true if it will indicate the default. If it is absent or all isDefault parameters are set to false, then the first tab will be the default tab.
         * orientation: String that defines the layout of the tab. If it is set to "vertical", the tabs will be displayed vertically. If it is absent, or if it is set to "horizontal", the tabs will be displayed horizontally..
         * rightAlignment: Boolean that defines the default alignment of the tabs. If it is set to "true", tabs will be aligned on right. If it is absent, or set to false, the tabs will be aligned towards left.
         * height: defines the height of the container that holds the tab content. It could be represented as a string composed by the number of units and the type of unit (for example: 540px) or it could be represented by a number data type in which case, the height is assumed in pixels. If it absent, the height of the tab will be calculated independently and will be long enough to hold the content of each of them.
         * toggle: Boolean that defines the tab container as a set of toggle buttons
         * controls: Object that defines if tabs can be added, edited.
         * - add: Boolean
         * - edit: Boolean
         *  submit: defines the button that will be used to retrieve the data holded by each of the tabs. It includes the parameters:
         * - id: id of the button
         * - name: name of the button
         * - value: label of the button
         * @returns {Object} Current TabContainerWidget's object: this
         */

        var $container = $(conf.container),
            templates = new TabTemplates().getTemplates(),
            defaultTab = 0,
            errorMessages = {
                'noTab': 'The Tab Container widget has not been built',
                'containTab': 'The Tab Container widget must contain at least 1 tab',
                'duplicateID': 'The ID is duplicated'
            },
            tabCreated = false,
            tabsObj,
            tabsArr = _.clone(conf.tabs),
            tabIdentifierPrefix = 'tabContainer-widget_tabLink_',
            confirmationDialogBuilder = null,
            badge = new Badge(conf, templates),
            cacheContainers = {};

        var self = this;

        /**
         * Builds the TabContainer widget in the specified container
         * @returns {Object} "this" of the DropDownWidget
         */
        this.build = function () {
            $container.addClass('tabContainer-widget');
            if (conf.toggle) {
                $container.addClass('tabContainer-toggle');
            } else if (conf.navigation) {
                $container.addClass('tabContainer-navigation');
                conf.orientation = 'horizontal';
            }
            if(!conf.toggle && conf.small) {
                $container.addClass('tabContainer-small');
            }
            conf.rightAlignment && $container.addClass('ui-tabs-float-right');

            if (conf.controls) {
                confirmationDialogBuilder = new ConfirmationDialogBuilder(conf.controls);
            }

            var submit = conf.submit ? {
                submit: conf.submit,
                id: conf.submit.id,
                name: conf.submit.name,
                value: conf.submit.value
            } : {};
            $container.append(render_template(templates.tabContainer, submit));
            $container = $container.find('.tabContainer-widget_allTabs');

            $container.on("tabscreate create", function () {
                tabCreated = true;
            });

            // Set up the tab library holder and generic parameters
            $container.tabs({
                heightStyle: getHeight(),
                orientation: conf.orientation == 'vertical' ? "vertical" : "horizontal"
            });

            if (conf.orientation == 'vertical') {
                $container.addClass('ui-tabs-vertical');
            }
            cacheContainers.tabLinkContainer = $container.find(".tabContainer-widget_tabLink");
            tabsObj = addTabs();

            // Set up the tab library with function callback when a tab is clicked
            var tabs = $container.tabs({
                create: function () {
                    tabCreated = true;
                },
                active: defaultTab,
                activate: function (event, ui) {
                    var hasContent = ui.newPanel.text() ? true : false;
                    var tabId = ui.newPanel.attr('id');
                    if (!hasContent) {
                        var tab = tabsObj[tabId];
                        tab.content.render && ui.newPanel.append(tab.content.render().el);
                    }
                    var currentTab = $container.tabs("option", "active");
                    switchTab(currentTab);
                    if (tabId) {
                        var activeTabObj = {
                            id: currentTab,
                            tabView: tabsObj[tabId].content
                        };
                        if (conf.actionEvents && conf.actionEvents.tabClickEvent) {
                            triggerActionEvent(conf.actionEvents.tabClickEvent, activeTabObj);
                        }
                        positionTabMarker();
                    }
                }
            });

            $container.resize(function () {
                var $tabContainer = $(this),
                    tabContainerMaxHeight = ~$tabContainer.css("max-height").indexOf("px") ? $tabContainer.css("max-height").slice(0, -2) : 0,
                    tabContainerTabTitlesHeight;

                if (tabContainerMaxHeight) {
                    tabContainerTabTitlesHeight = $tabContainer.find(".tabContainer-widget_tabLink").outerHeight(true);
                    $tabContainer.find(".tabContainer-widget_content.ui-widget-content > div").css("max-height", tabContainerMaxHeight - tabContainerTabTitlesHeight);
                }
                tabs.tabs('refresh');
            });

            if (conf.actionEvents && conf.actionEvents.tabSwitchEvent) {
                $container.on("click", '.ui-tabs-anchor', function (event, ui) {
                    var $tabElement = $(event.target);
                    if (!$tabElement.attr("data-switchtabs")) return;
                    $tabElement = $tabElement.hasClass("ui-tabs-anchor") ? $tabElement : $tabElement.closest(".ui-tabs-anchor");
                    var activeTabObj = {
                        id: $tabElement.attr('data-tabid')
                    };
                    triggerActionEvent(conf.actionEvents.tabSwitchEvent, activeTabObj);
                });
            }

            if (conf.controls) {
                if (conf.controls.add && !conf.navigation) {
                    addControlHandler();
                }

                if (conf.controls.remove) {
                    removeControlHandler();
                }

                if (conf.controls.edit) {
                    editControlHandler();
                }
            }

            conf.navigation && appendNavigationContainers();
            positionTabMarker();
            cacheContainers.controls = cacheContainers.tabLinkContainer.find(".controls");
            cacheContainers.navigationEnd = cacheContainers.tabLinkContainer.find(".navigationEnd");
            return this;
        };

        /* Positions tab marker */
        var positionTabMarker = function () {
            var activeTabContainer = $container.find('.ui-tabs-active a');
            var tabSetContainer = $container.find('.tabContainer-widget_tabLink');
            var tabSetPadding = parseInt($container.eq(0).css("padding-left"));
            if (activeTabContainer.length > 0) {
                var leftpos = activeTabContainer.offset().left + tabSetPadding - tabSetContainer.offset().left;
                $container.find('.navigation-marker').animate({
                    "width": activeTabContainer.css("width"),
                    "left": leftpos + "px"
                }, 300);
            }
        };

        /* Defines a Tab class */
        var Tab = function (tab) {
            this.id = tab.id;
            this.name = tab.name;
            this.content = tab.content;
        };

        /* Iterates through the tabs array configuration and sets the default tab */
        var addTabs = function () {
            var tabs = {};

            for (var i = 0; i < conf.tabs.length; i++) {
                var tab = conf.tabs[i];
                var tabIdentifier = tabIdentifierPrefix + tab.id;
                tabs[tabIdentifier] = new Tab(tab);
                if (tab.isDefault)
                    defaultTab = i;
                addTab(tab);
            }

            conf.tabs.length && addDefaultContentView(tabs, tabIdentifierPrefix + conf.tabs[defaultTab].id);
            return tabs;
        };

        /* Triggers the event for Tab Container */
        var triggerActionEvent = function (event, defaultObj) {
            $container.trigger(event, defaultObj);
        };

        /**
                  * Transforms the provided input element back to anchor element with the updated tab name.
                  * @param {Object} inputTab - input element which will be used for transformation.
                  * @inner
                  */
        var editTabName = function ($inputTab) {
            var newval = $inputTab.val(),
                $tabParent = $inputTab.closest('.tabContainer-widget_tabLink'),
                $activeTab = $tabParent.find('.ui-tabs-active .ui-tabs-anchor');
            if (_.isEmpty(newval)) {
                newval = i18n.getMessage('tabcontainer_untitled');
            }

            $activeTab.text(newval);

            if (conf.actionEvents && conf.actionEvents.tabNameEditEvent) {
                var activeTabObj = {
                    id: $activeTab.attr('data-tabId'),
                    name: newval
                };
                triggerActionEvent(conf.actionEvents.tabNameEditEvent, activeTabObj);
            }

            $inputTab.hide();
        };

        /**
         * Creates a tab and passes id, name, content to the optionally provided callback.
         * @inner
         */
        var addControlHandler = function () {
            var $tabHeaderContainer = $container.find(".tabContainer-widget_tabLink");

            if (conf.rightAlignment) {
                $tabHeaderContainer.addClass('align_rtl');
            }
            $tabHeaderContainer.append(render_template(templates.tabAddElement));

            $tabHeaderContainer.on('click', '.addTab', function (event) {
                var tab = {
                    id: _.uniqueId('slipstream_tabContainer_widget_'),
                    name: i18n.getMessage('tabcontainer_untitled'),
                    content: new Backbone.View()
                };

                self.addTab(tab);
                tabCreated = true; //Work around to resolve intermittent issue with jQUery UI Tabs 'create' event.
                self.setActiveTab(tab.id);
                tab.content = tab.content.el;

                if (conf.actionEvents && conf.actionEvents.tabAddEvent) {
                    triggerActionEvent(conf.actionEvents.tabAddEvent, tab);
                }
                var $anchorTab = $(event.delegateTarget).find('a[data-tabid=' + tab.id + ']').click().click(); //Clicking twice to take the newly created tab into edit mode.
            });
        };

        /**
         * Generates a remove control when user hovers on a tab.
         * Removes the tab after getting users confirmation and passes id to the optionally provided callback.
         * @inner
         */
        var removeControlHandler = function () {
            var tabId = null;
            var confirmDialogConfig = (conf.controls.remove.confirmDialogConfig && _.isObject(conf.controls.remove.confirmDialogConfig)) ? conf.controls.remove.confirmDialogConfig : {};

            $container.on('click', '.removeTab', function (event) {
                tabId = $(event.target).closest('li').find('.ui-tabs-anchor').attr('data-tabid');
                event.stopPropagation();
                if (confirmDialogConfig) {
                    confirmationDialogBuilder.deleteTabWithConfirmDialog(removeTabUserCallbackYes, removeTabUserCallbackNo);
                }
            });

            $container.on('mouseenter', 'li a.ui-tabs-anchor', function (event) {
                var $tabLink = $(event.target);
                if (!$tabLink.hasClass('ui-tabs-anchor') || tabsArr.length == 1) return;
                var $controls = $tabLink.find('.tab_controls');
                if ($controls.length == 0) {
                    $(render_template(templates.tabControls))
                        .hide()
                        .appendTo($tabLink)
                        .fadeIn();
                    $controls = $tabLink.find('.tab_controls');
                } else {
                    $controls.fadeIn();
                }
                if($controls.length > 0) {
                    badge.toggleVisibility($tabLink, true);
                }
            }).on('mouseleave', 'li', function (event) {
                var $controls = $(this).find('.tab_controls');
                var $tabLink = $(this).find('a.ui-tabs-anchor');
                $controls.fadeOut(0);
                if($controls.length > 0) {
                    badge.toggleVisibility($tabLink);
                }
            });

            var removeTabUserCallbackYes = function (doNotShowAgain) {
                self.removeTab(tabId);
                if (confirmDialogConfig && confirmDialogConfig.yesButtonCallback) {
                    confirmDialogConfig.yesButtonCallback(doNotShowAgain, tabId);
                }
            };

            var removeTabUserCallbackNo = function () {
                if (confirmDialogConfig && confirmDialogConfig.noButtonCallback) {
                    confirmDialogConfig.noButtonCallback();
                }
            };
        };

        /**
         * Displays an input element when user clicks an active tab header.
         * @inner
         */
        var editControlHandler = function () {
            var defaultTabRendered = false;
            $container.on('click', '.ui-tabs-anchor', function (e) {
                var $anchorTab = $(this),
                    $tabLink = $anchorTab.closest('li'),
                    tabLinkPosition = $tabLink.position(),
                    $tabParent = $tabLink.parent(),
                    defaultTabId = tabIdentifierPrefix + tabsArr[defaultTab]['id'],
                    isdefaultTabRendered = !defaultTabRendered && $tabLink.attr('aria-controls') == defaultTabId;
                defaultTabRendered = true; //If this block has been run, defaultTab must have been already rendered.
                if ($tabLink.hasClass(tabIdentifierPrefix + "activeTab") || isdefaultTabRendered) {
                    if ($tabParent.find('.tabName_InputEl').length == 0) {
                        $tabLink.after(templates.tabNameInput);
                    }
                    var $inputEle = $tabParent.find('.tabName_InputEl')
                        .val($anchorTab.text())
                        .css({
                            'width': $tabLink.width() + 'px',
                            'left': tabLinkPosition.left + 'px',
                            'top': tabLinkPosition.top + 'px'
                        })
                        .attr('tabId', $anchorTab.attr('data-tabid'))
                        .show();

                    if (conf.orientation == 'vertical') {
                        $inputEle.css({top: tabLinkPosition.top + 'px'})
                    }
                    focusTabInputEle($inputEle);
                } else {
                    var $container = $(e.delegateTarget);
                    $container.find('li').removeClass(tabIdentifierPrefix + "activeTab");
                    $tabLink.addClass(tabIdentifierPrefix + "activeTab");
                }
            });

            $container.on('keyup blur input propertychange', '.tabContainer-widget_tabLink .tabName_InputEl', function (e) {
                var $inputTab = $(this);

                if (e.keyCode == 13 || e.keyCode == 27) {
                    editTabName($inputTab);
                }
            });

            $container.on('blur', '.tabContainer-widget_tabLink .tabName_InputEl', function (e) {
                var $inputTab = $(this);

                editTabName($inputTab);
            });
        };

        /**
         * sets focus and places the cursor at the end of tab element's input field.
         * @param {Object} $inputEle - input element to set focus on.
         * @inner
         */
        var focusTabInputEle = function ($inputEle) {
            var inputEleOriginalVal = $inputEle.val().trim();
            $inputEle.focus().val('').val(inputEleOriginalVal); //clearing inputEle and then setting original value as a cross browser fix to ensure cursor is at the end.
        };


        /* adds a tab by adding the tab link and the actual content */
        var addTab = function (tab) {
            $container.append(render_template(templates.contentContainer, {id: tab.id}));
            var templateData = {
                id: tab.id,
                name: tab.name,
                description: tab.description
            };
            if(!tab.isDefault) {
                templateData = badge.updateBadgeConfig(tab, templateData);
            }
            var renderTabLink = render_template(templates.tabLink, templateData, templates);
            if (!cacheContainers.controls || !cacheContainers.controls.length > 0) {
                if(cacheContainers.navigationEnd && cacheContainers.navigationEnd.length > 0)
                    $(renderTabLink).insertBefore(cacheContainers.navigationEnd);
                else
                    cacheContainers.tabLinkContainer.append(renderTabLink);
            } else {
                $(renderTabLink).insertBefore(cacheContainers.controls);
            }
            $container.tabs("refresh");
        };

        /* adds the content view to the default tab container */
        var addDefaultContentView = function (tabs, tabIdentifier) {
            var tab = tabs[tabIdentifier],
                tabMaxHeight = $container.css("max-height");

            if (~tabMaxHeight.indexOf("px")) {
                tab.content.$el.css("max-height", tabMaxHeight.slice(0, -2) - 50);
            }

            $container
                .find("#" + tabIdentifier)
                .append(tab.content.render().el);
        };

        /*gets the height for the tab container which is the one that will have the view of the tab rendered */
        var getHeight = function () {
            var height = "auto";
            if (conf.height) {
                var maxHeight = $container.height() ?  $container.height() : $container.css("max-height").indexOf("px") ? parseInt($container.css("max-height").slice(0, -2)) : 0;
                if (~conf.height.indexOf("%") && maxHeight) {
                    maxHeight *= conf.height.slice(0, -1)/100;
                    $container.css("max-height", maxHeight);
                } else {
                    $container.height(conf.height);
                }
                height = "fill";
            }
            return height;
        };

        /**
         *  Adds error indication image on the tab if there is an error.
         *  @param {Object} currentTab - It requires the active tab
         */
        var switchTab = function (currentTab) {
            var length = conf.tabs.length; //Get total number of tabs
            var arrayOfTabs = conf.tabs;  //Declare an array of all tabs
            var ulClass = $container.find('.ui-tabs-nav');   //Get the ul class which contains all tabs
            for (var index = 0; index < length; index++) {
                var liClass = ulClass.find("[aria-controls=tabContainer-widget_tabLink_" + arrayOfTabs[index].id + "]");    //Get the <li> element of the current tab, to add error image
                if (index == currentTab) { //--------For Active Tab-------------
                    badge.removeBadge(liClass);
                } else {  //-------For other tabs------------
                    var view = arrayOfTabs[index].content;
                    if (view && !_.isEmpty(view.el.children) && view.isValidTabInput) {
                        try {
                            badge.showHide(liClass, view.isValidTabInput(), conf.tabs[index]);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        };

        /**
         * Append elements required for the navigation mode of the tab container widget
         * @inner
         */
        var appendNavigationContainers = function () {
            var $tabsTitleContainer = $container.find('>.ui-tabs-nav');
            $tabsTitleContainer.append(render_template(templates.navigationEnd));
            $tabsTitleContainer.append(render_template(templates.navigationMarker));
        };

        /**
         * Add a new tab dynamically
         * @param {Object/Array} tab - tab configuration
         */
        this.addTab = function (tabs) {
            if (tabs) {
                var addTabFun = function (tab) {
                    if (!tabsObj[tabIdentifierPrefix + tab.id]) {
                        addTab(tab);
                        tabsObj[tabIdentifierPrefix + tab.id] = tab;
                        tabsArr.push(tab);
                    } else {
                        throw new Error(errorMessages.duplicateID);
                    }
                };

                if ($.isArray(tabs)) {
                    $.each(tabs, function (key, val) {
                        addTabFun(val);
                    })
                } else {
                    addTabFun(tabs);
                }
            } else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Remove an existing tab dynamically
         * @param {String/Array} id - the tab id in the configuration
         */
        this.removeTab = function (ids) {
            if (ids) {
                var removeTabFun = function (id) {
                    if (tabsArr.length > 1) {
                        var tabId = tabIdentifierPrefix + id,
                            ulClass = $container.find('.ui-tabs-nav'),
                            liClass = ulClass.find("[aria-controls=" + tabId + "]");

                        if (liClass.length > 0) {
                            liClass.remove();
                            $container.find("#" + tabId).remove();
                            for (var i = 0; i < tabsArr.length; i++) {
                                if (tabsArr[i].id == id) {
                                    tabsArr.splice(i, 1);
                                    break;
                                }
                            }
                            delete tabsObj[tabId];
                            $container.tabs("refresh");
                        }
                    } else {
                        throw new Error(errorMessages.containTab);
                    }
                };

                if ($.isArray(ids)) {
                    $.each(ids, function (key, val) {
                        removeTabFun(val);
                    })
                } else {
                    removeTabFun(ids);
                }
            } else {
                throw new Error(errorMessages.containTab);
            }
        };

        /**
         * Gets the data that each tab has collected from the user input. The data is collected by calling the getViewData from each view in the tabs parameter.
         * @returns {Object} Object will all data collected for each of the views.
         */
        this.getTabsData = function () {
            if (tabCreated) {
                var tabsData = {};
                for (var tab in tabsObj) {
                    var tabObj = tabsObj[tab];
                    var view = tabObj.content;
                    if (view && !_.isEmpty(view.el.children) && view.getViewData) {
                        try {
                            var tabData = view.getViewData();
                            tabData && (tabsData[tabObj.id] = tabData);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
                return tabsData;
            } else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Gets the data that each tab has collected from the user input. The data is collected by calling the getViewData from each view in the tabs parameter.
         * The data is collected from all tabs, including the ones not visited
         * @returns {Object} Object will all data collected for each of the views.
         */
        this.getAllTabsData = function () {
            if (tabCreated) {
                var tabsData = {};
                for (var tab in tabsObj) {
                    var tabObj = tabsObj[tab];
                    var view = tabObj.content;
                    if (view && view.getViewData) {
                        try {
                            _.isEmpty(view.el.children) && view.render();
                            var tabData = view.getViewData();
                            tabData && (tabsData[tabObj.id] = tabData);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            } else {
                throw new Error(errorMessages.noTab);
            }
            return tabsData;
        };

        /**
         * Provides the id of the active tab
         * @returns {string} id of the active tab
         */
        this.getActiveTab = function () {
            if (tabCreated) {
                var tabId = $container.tabs("option", "active");
                return tabsArr[tabId].id;
            } else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Provides the index of the active tab as it is defined in the tabs array parameter
         * @returns {integer} index of the active tab
         */
        this.getActiveTabByIndex = function () {
            if (tabCreated) {
                return $container.tabs("option", "active");
            } else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Sets the active tab
         * @param {string} id - id of the tabs
         */
        this.setActiveTab = function (id) {
            if (tabCreated) {
                for (var i = 0; i < tabsArr.length; i++) {
                    if (tabsArr[i].id == id) {
                        id = i;
                        break;
                    }
                }
                $container.tabs("option", "active", id);
            } else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Destroys all elements created by the TabContainer widget in the specified container
         * @returns {Object} Current TabContainer object
         */
        this.destroy = function () {
            if (tabCreated) {
                $container.tabs("destroy");
                $container = $(conf.container);
                $container.find('.tabContainer-widget_allTabs').remove();
                $container.find('.tabContainer-widget_allButtons').remove();
                return this;
            } else {
                throw new Error(errorMessages.noTab);
            }
        };
        /**
         *  Get all tabs and check if there is any error or not
         */
        this.getValidInput = function () {
            if (tabCreated) {
                var tabsData = {};
                for (var tab in tabsObj) {
                    var tabObj = tabsObj[tab];
                    var view = tabObj.content;
                    if (view && !_.isEmpty(view.el.children) && view.isValidTabInput) {
                        try {
                            if (!view.isValidTabInput()) {
                                this.setActiveTab(tabObj.id);
                                return false;
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
                return true;
            } else {
                throw new Error(errorMessages.noTab);
            }
        };
        /**
         *  Get all tabs
         */
        this.getAllTabs = function () {
            return tabsArr;
        };
        /**
         * Get all the tab DOM elements.
         * @returns {Object} tab elements with role="tab"
         * @private
         */
        this._getTabElements = function() {
            return  $container.find('.ui-tabs-nav').children();
        };
        /**
         * Get active tab DOM element.
         * @returns {Object} active tab elements with role="tab"
         * @private
         */
        this._getActiveTabElement = function() {
            return $container.find('.ui-tabs-active');
        };

    };

    return TabContainerWidget;
});