/**
 * A module that builds the actionBar used in the list builder widget
 *
 * @module ActionBarBuilder
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'widgets/actionBar/actionBarWidget',
    'lib/i18n/i18n'
],  /** @lends ActionBarBuilder */
    function(ActionBarWidget, i18n) {

    /**
     * ActionBarBuilder constructor
     *
     * @constructor
     * @class ActionBarBuilder - Builds the actionBar used in the list builder widget
     * @param {Object} listBuilderWidget instance
     * @param {Object} conf
     * @param {Object} searchObj from listBuilderWidget
     * @returns {Object} Current ActionBarBuilder's object: this
     */
    var ActionBarBuilder = function(listBuilderWidget, conf, searchObj){
        var availableActionBar,
            selectedActionBar,
            clearAllEnabled = false;;

        /**
         * Adds actionBar to the list builder widget
         * @param {Object} $container - the container to build actionBar widget
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @param {Function} filterData - callback function used to filter the data after a filter request
         */
        this.buildActionBar = function($container, isSelectedPanel, filterData){
            var hasSearchMenu = (conf.search && conf.search.optionMenu) ? true : false;

            var actionBarConf = {
                "container": $container,
                "subTitle": "",
                "actions": [{
                    "search_type": true,
                    "key": "search",
                    "searchOnEnter": false
                }]
            };

            if (hasSearchMenu && !(isSelectedPanel && conf.selectedElements && conf.selectedElements.hideSearchOptionMenu)){
                var filterItemConf = {
                    "menu_type": true,
                    "key": "filter",
                    "icon": {
                        "default": {
                            icon_url: "#icon_filter_menu",
                            icon_class: "icon_filter_menu-dims"
                        }
                    },
                    "items": getUpdatedFilterItems(filterData),
                    "events": {
                        show: function(opt) {
                            var subMenuData = $(this).data();
                            if(!_.isEmpty(subMenuData) && clearAllEnabled){
                                $.contextMenu.setInputValues(opt, subMenuData);
                                opt.$menu.find('.clearAll').removeClass("disabledLink").addClass("activeLink");
                            }
                        },
                        hide: function(opt) {
                            var subMenuData = $(this).data();
                            $.contextMenu.getInputValues(opt, subMenuData);
                        }
                    }
                };
                actionBarConf.actions.push(filterItemConf);
            }
            var actionBar = new ActionBarWidget(actionBarConf).build();

            if (isSelectedPanel){
                selectedActionBar = actionBar;
            } else {
                availableActionBar = actionBar;
            }
        };

        /**
         * Bind actionBar event
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @param {Object} gridWidget - current gridWidget instance
         */
        this.bindActionBarEvents = function(isSelectedPanel, gridWidget){
            var actionBar = isSelectedPanel ? selectedActionBar : availableActionBar;

            var searchEvent = function(evt, actionObj){
                searchElements(actionObj.search, gridWidget, isSelectedPanel);
            };

            actionBar.bindEvents({
                "search": {
                    "handler": [searchEvent]
                }
            });
        };

        /**
         * Trigger search callbacks or search items locally
         * @param {String} searchValue - current search value
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @param {Object} gridWidget - current gridWidget instance
         */
        var searchElements = function(searchValue, gridWidget, isSelectedPanel){
            var isLoadRemotely = conf.selectedElements && !_.isUndefined(conf.selectedElements.url) && conf.availableElements && !_.isUndefined(conf.availableElements.url),
                isCollectionBased = conf.availableElements && _.isUndefined(conf.availableElements.data) && _.isUndefined(conf.availableElements.url) && _.isUndefined(conf.availableElements.getData),
                isLocalData = isLoadRemotely && !conf.loadonce? false: true;

            var setSearchValue = function(val){
                if (isSelectedPanel){
                    searchObj.selectedSearchValue = val;
                }else{
                    searchObj.availableSearchValue = val;
                }
            };

            if (isLocalData && !isCollectionBased){
                gridWidget.clearSearch();
                !_.isEmpty(searchValue) && gridWidget.search(searchValue);
            }else if((conf.search && conf.search.url && isLoadRemotely) || isCollectionBased){
                if(_.isEmpty(searchValue)){
                    setSearchValue('', isSelectedPanel);
                    gridWidget.clearSearch();
                }else{
                    setSearchValue(searchValue, isSelectedPanel);
                    gridWidget.search(searchValue);
                }
            }
        };

        /**
         * Extend the filter event for each item
         * @param {Function} filterData - callback function used to filter the data after a filter request
         * @inner
         */
        var getUpdatedFilterItems = function(filterData){
            var updatedOptionMenu = [],
                addClearSearch = false,
                optionMenu = conf.search.optionMenu;

            for (i = 0; i < optionMenu.length; i++){
                if (!addClearSearch && optionMenu[i].type == "radio"){
                    updatedOptionMenu.push({
                        "label": i18n.getMessage('clear_all'),
                        "key":"clearAll",
                        "className": "clearAll disabledLink",
                        "callback": function(key, opt){
                            filterData("");
                            opt.$menu.find('input').removeAttr('checked');
                            clearAllEnabled = false;
                        }
                    });
                    addClearSearch = true;
                }
                optionMenu[i].events = {
                    change: function(e){
                        var value = [];
                        if (this.type === 'checkbox'){
                            var checkboxes = $(this).parents('ul').find( 'input:checkbox');
                            clearAllEnabled = true;
                            for(var i = 0; i < checkboxes.length; i++){
                                if (checkboxes[i].checked){
                                    value.push(checkboxes[i].value);
                                }
                            }
                        }else if (this.type === 'radio'){
                            clearAllEnabled = true;
                            value.push(this.value);
                            var $clearAll = $(this).parents('ul').find( '.clearAll');
                            $clearAll.removeClass("disabledLink").addClass("activeLink");
                        }
                        filterData(value);
                    }
                }
                updatedOptionMenu.push(optionMenu[i]);
            }
            return updatedOptionMenu;
        };
    };

    return ActionBarBuilder;
});
