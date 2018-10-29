/**
 * A module that builds a layout widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the configuration required by the third party library: jQuery golden-layout.
 *
 * @module LayoutWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'goldenLayout',
    'jquery.resize'
],  /** @lends LayoutWidget*/
    function(GoldenLayout, resize) {

    var LayoutWidget= function(conf){
        /**
         * LayoutWidget constructor
         *
         * @constructor
         * @class LayoutWidget- Builds a layout widget from a configuration object.
         * @param {Object} conf - It requires the container and the panels parameters.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered.
         * @param {Array} conf.panels - It defines the panels that will be rendered and that is part of a layout. It should be an array with objects with the following parameters:
         * @param {string} conf.panels.id - It defines the id of the panel and it is represented by a string primitive data type. The id should be unique in the layout configuration.
         * @param {Object} conf.panels.content - It defines the content of the panel and represented by a Slipstream view object data type or an array of Objects if the content of the panel is expected to be another sets of panels.
         * @param {number} conf.panels.height - It defines the height of a panel. The height of this item is relative to the other children of its parent in percent.
         * @param {number} conf.panels.width - It defines the width of a panel. The width of this item is relative to the other children of its parent in percent.
         * @param {boolean} conf.panels.isClosable - It determines if the panel is closable. If false, the close icon on the items tab will be hidden . Default value is false.
         * @param {string} conf.panels.type - It defines the type of the panel. Possible values are 'row', 'column', or 'component'. row and column should be used when content is an array of other panels. component should be used when the content is a Slipstream view, it is the default value.
         * @param {Object} conf.events - It defines the callbacks that will be invoked when an event in the layout widget is triggered; for example, when a panel is closed.
         * @returns {Object} Current LayoutWidget's object: this
         */

        var $container = $(conf.container),
            confPanels = conf.panels,
            views = {},
            layout,
            lastPanel = {},
            HEIGHT_OFFSET = 5,
            errorMessages = {
                'noConf': 'The configuration object for the layout widget is missing',
                'noPanels': 'The configuration for the layout widget must include the panels parameter',
                'noBuilt': 'The layout widget was not built'
            };

        /**
         * Throws error messages if some required properties of the configuration are not available.
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            else if (!_.isArray(conf.panels))
                throw new Error(errorMessages.noPanels);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };

        /**
         * Defines the configuration for a panel or item
         * @param {Object} item - Configuration of the panel that the user of the widget has defined
         * @inner
         */
        var getItemConfiguration = function (item) {
            //cache the view of the item and delete before passing it to the layout library to avoid call stack error
            views[item.id] = item.content;
            delete item.content;

            //sets layout exposed variables
            var isClosable = _.isBoolean(item.isClosable)? item.isClosable : true;
            delete item.isClosable;
            var isExpandable = _.isBoolean(item.isExpandable)? item.isExpandable : true;
            delete item.isExpandable;

            return {
                type: 'component',
                componentName: 'view',
                id: item.id,
                componentState: {
                    id: item.id,
                    width: item.width,
                    height: item.height,
                    expand: isExpandable,
                    close: isClosable
                }
            }
        };

        /**
         * Defines the layout configuration required by golden-layout library
         * @inner
         */
        var getLayoutConfiguration = function () {
            //loops recursively through the content parameter
            var getContent = function (items) {
                var content = [];
                for (var i=0; i<items.length; i++){
                    var item = items[i];
                    if (_.isArray(item.content)) {
                        content.push({
                            type: item.type,
                            id: item.id,
                            content: getContent(item.content),
                            width: item.width,
                            height: item.height
                        });
                    } else {
                        var itemConfiguration = _.extend(getItemConfiguration(item), item);
                        content.push(itemConfiguration);
                    }
                }
                //keeps one panel always opened
                if (items.length) {
                    content[0].isClosable = false;
                }
                return content;
            };
            return {
                settings:{
                    reorderEnabled: false, //removes drag and drop of panels
                    showPopoutIcon: false,
                    showMaximiseIcon: true,
                    showCloseIcon: true
                },
                dimensions: {
                    borderWidth: 1
                },
                labels: {
                    close: '',
                    maximise: '',
                    minimise: ''
                },
                content: getContent(confPanels)
            };
        };

        /**
         * Register layout events like when a panel is created, destroyed or updated
         * @inner
         */
        var registerLayoutEvents = function () {
            layout.on('tabCreated', function(tab) {
                if (!tab.contentItem.config.componentState.close && !tab.contentItem.config.componentState.expand){
                    tab.contentItem.parent.element.find(".lm_header").hide();
                } else {
                    if (!tab.contentItem.config.componentState.close){
                        tab.contentItem.parent.element.find(".lm_close").hide();
                    }
                    if (!tab.contentItem.config.componentState.expand){
                        tab.contentItem.parent.element.find(".lm_maximise").hide();
                    }
                }
            });

            layout.on('stateChanged', function (event) {
                layout.container.find('.lm_item_container').each(function(){
                    var $parentContent = $(this),
                        $panelContent = $parentContent.find('> .lm_content > div'),
                        panelContentHeight = $parentContent.height() - HEIGHT_OFFSET; //offset for margin
                    $panelContent.css({
                        'max-height': panelContentHeight, //content should be set with a maximum height
                        'height': panelContentHeight //needed to force the resize of content if the resize library is added like in the grid widget
                    });
                });
            });

            layout.on('itemDestroyed', function (panel) {
                var panelId = panel.config.id;
                if (panelId && conf.events && _.isFunction(conf.events.onPanelClosed)) {
                    conf.events.onPanelClosed(panelId, views[panelId]);
                }
            });
        };

        /**
         * Sets the size of a panel that is added using the updatePanel method. The panel can be sized properly only when the layout is available; therefore, while the layout is not available a temporal variable (lastPanel.parentPanel) is kept and removed once the layout is available.
         * @param {Object} parentPanel - Parent of the panel as defined by the layout library
         * @inner
         */
        var setPanelSize = function (parentPanel) {
            if (parentPanel.element.width() != 0 || parentPanel.element.height() !=0) {
                var panelElementWidth = parentPanel.element.width()*lastPanel.lastContainer._config.width/100, //divided by 100 since width is defined as a percentage
                    panelElementHeight = parentPanel.element.height()*lastPanel.lastContainer._config.height/100; //divided by 100 since height is defined as a percentage
                lastPanel.lastContainer.setSize(panelElementWidth, panelElementHeight);
                delete lastPanel.parentPanel;
            } else {
                lastPanel.parentPanel = parentPanel;
            }
        };

        /**
         * Builds the Layout widget in the specified container
         * @returns {Object} returns the instance of the layout widget that was built
         */
        this.build = function () {
            if (conf && !_.isEmpty(conf.panels)) {
                $container.addClass('slipstream-layout-widget');
                layout = new GoldenLayout( getLayoutConfiguration(), $container );

                layout.registerComponent('view', function(container, state){
                    container.setTitle('');
                    container.getElement().append(views[state.id].render().el);
                    lastPanel.lastContainer = container; //container cached to be used when a new panel is added
                });

                registerLayoutEvents();

                layout.init();

                //since the layout is not a direct child of the body we need to tell it when to resize
                var containerHeight;
                $container.resize(function(){
                    if (_.isUndefined(containerHeight)) {
                        containerHeight = 'calc(100vh - '+$container.offset().top+'px)'; //force the container to take available height since the layout library can't adjust height when the layout is built inside a container
                        $container.css({'height': containerHeight});
                    }
                    layout.updateSize();
                    if (lastPanel.parentPanel) { //used for resizing a panel added by using updatePanel and that can be resized only when the layout is available in the DOM
                        setPanelSize(lastPanel.parentPanel);
                    }
                });
            }  else {
                showError();
            }
            return this;
        };

        /**
         * Updates the content of a panel by creating the new panel or updating a existing one
         * @param {Object} itemConf - Configuration of the panel to add/update
         * @param {Object} location - object with parentId parameter that defines the id of the parent panel
         */
        this.updatePanel = function (itemConf, location) {
            if (layout) {
                var itemConfiguration = _.extend(getItemConfiguration(itemConf), itemConf),
                    oldElement = layout.root.getItemsById(itemConfiguration.id),
                    parentElement;

                restoreMazimizedPanels();
                if (_.isEmpty(oldElement)) { //create the panel
                    if (location) { //create the panel at the location
                        parentElement = layout.root.getItemsById(location.parentId)[0];
                    } else { //create the panel at the end of the layout
                        parentElement = layout.root.contentItems[0];
                    }

                    //patch to skip wrong resize that libraries does with:
                    //parentElement.addChild(itemConfiguration);
                    parentElement.addChild(itemConfiguration, undefined, true);
                    layout.updateSize();

                    //sets the width and height of the new panel
                    if (lastPanel.lastContainer._config.id == itemConf.id) {
                        setPanelSize(parentElement);
                    }

                } else { //replace the panel
                    oldElement[0].container._element.find('.lm_content').empty().append(views[itemConf.id].render().el);
                }

            }  else {
                showError();
            }
        };

        /**
         * Restores the size of panels that were maximized so that a new panel could be added with its default size
         * @inner
         */
        var restoreMazimizedPanels = function () {
            layout.root.element.find(".lm_maximised").each(function() {
               $(this).find(".lm_maximise").trigger("click");
            });
        };

        /**
         * Toggles a panel from regular size to maximum size. When the panel is maximized, then all panel controls are hidden (for example, remove icon, maximize icon, etc), When the panel is toggled to the regular size, then the panel controls are available.
         * @param {String} panelId - Required parameter, it represents the id of the panel
         * @param {boolean} isMaximized - Optional parameter, it indicates if a panel should be maximised (true) or set to a regular size (false)
         */
        this.toggleMaximizePanel = function (panelId, isMaximized) {
            if (layout && !_.isUndefined(panelId)) {
                var panel = layout.root.getItemsById(panelId);
                if (panel) { //create the panel
                    var isPanelMaximized = panel[0].isMaximised;
                    if (_.isBoolean(isMaximized) ) {
                        if (isMaximized && !isPanelMaximized || !isMaximized && isPanelMaximized) {
                            panel[0].toggleMaximise();
                        }
                    } else {
                        panel[0].toggleMaximise();
                    }
                } else { //panel is not available
                    console.log("a panel with the provided id is not available")
                }
            }  else {
                showError();
            }
        };

        /**
         * Destroys a panel by removing all its elements (configuration, DOM, events) from the layout widget
         * @param {String} panelId - Required parameter, it represents the id of the panel
         */
        this.destroyPanel = function (panelId) {
            if (layout && !_.isUndefined(panelId)) {
                var contentItem = layout.root.getItemsById(panelId);
                if (contentItem.length) { //destroy the panel
                    contentItem[0].parent.removeChild(contentItem[0]);
                } else { //panel is not available
                    console.log("a panel with the provided id is not available")
                }
            }  else {
                showError();
            }
        };

        /**
         * Destroys all elements created by the Layout widget in the specified container
         * @returns {Object} returns the instance of the layout widget
         */
        this.destroy =  function () {
            if (layout) {
                $container.removeResize();
                layout.destroy();
            }  else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    return LayoutWidget;
});