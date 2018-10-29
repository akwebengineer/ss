define([
    'widgets/actionBar/actionBarWidget',
    'widgets/actionBar/conf/configurationSample',
    'widgets/actionBar/tests/data/rbacSample'
], function (ActionBarWidget, actionBarConfiguration, rbacSample) {

    describe('ActionBarWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
                var $container = $("<div id = action-bar-container-id" + containerId++ + "></div>");
                $el.append($container);
                return $container;
            },
            cleanUp = function (thisObj) {
                thisObj.actionBarWidgetObj.destroy();
                thisObj.$actionBarContainer.remove();
                thisObj = null;
            },
            filterList = function (actionList, actionType) {
                var filteredList = _.filter(actionList, function (action) {
                    if (action[actionType]) {
                        return action;
                    }
                });
                return filteredList;
            };

        describe('Widget Interface', function () {
            before(function () {
                this.$actionBarContainer = createContainer();
                this.actionBarWidgetObj = new ActionBarWidget({
                    "container": this.$actionBarContainer[0],
                    "subTitle": "Test subtitle",
                    "actions": actionBarConfiguration.button
                }).build();
            });
            after(function () {
                cleanUp(this);
            });
            it('should exist', function () {
                this.actionBarWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.actionBarWidgetObj.build, 'The action bar widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.actionBarWidgetObj.destroy, 'The action bar widget must have a function named destroy.');
            });
        });

        describe('Template', function () {
            describe('Default Style - Button', function () {
                before(function () {
                    this.$actionBarContainer = createContainer();
                    this.actionBarWidgetObj = new ActionBarWidget({
                        "container": this.$actionBarContainer[0],
                        "subTitle": {
                            "content": "Test subtitle",
                            "help": {
                                "content": "Tooltip for the subtitle of the Action Bar widget",
                                "ua-help-text": "More..",
                                "ua-help-identifier": "alias_for_ua_event_binding"
                            }
                        },
                        "actions": actionBarConfiguration.button
                    }).build();
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain the card-layout-widget class for actionBar container', function () {
                    assert.isTrue(this.$actionBarContainer.find('.action-bar-widget').length == 1, "the action bar widget container is available");
                });
                it('should contain a subtitle with help icon', function () {
                    assert.isTrue(this.$actionBarContainer.find(".subTitle").length == 1, "a subtitle is available");
                    assert.isTrue(this.$actionBarContainer.find(".subTitle .help-widget").length == 1, "help icon and tooltip from the help widget is available");
                });
                it('should contain menu actions', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionMenu').length > 0, "menu action is available");
                });
                it('should contain icon actions', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionIcon').length > 0, "icon action is available");
                });
                it('should contain button actions', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionButton').length > 0, "button action is available");
                });
                it('should contain a separator between action', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionSeparator').length > 0, "separator is available");
                });
            });
            describe('Alternative Style - Grid', function () {
                before(function () {
                    this.$actionBarContainer = createContainer();
                    this.actionBarWidgetObj = new ActionBarWidget({
                        "container": this.$actionBarContainer[0],
                        "subTitle": "Test subtitle",
                        "actions": actionBarConfiguration.button,
                        "layout": "grid"
                    }).build();
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain the card-layout-widget class for actionBar container', function () {
                    assert.isTrue(this.$actionBarContainer.find('.action-bar-widget .grid-layout').length == 1, "the action bar widget container is available with grid-layout style");
                });
                it('should contain a card title with help icon', function () {
                    assert.isTrue(this.$actionBarContainer.find(".subTitle").length == 1, "a subtitle is available");
                });
                it('should contain menu actions', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionMenu').length > 0, "menu action is available");
                });
                it('should contain icon actions', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionIcon').length > 0, "icon action is available");
                });
                it('should contain button actions', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionButton').length > 0, "button action is available");
                });
                it('should contain a separator between action', function () {
                    assert.isTrue(this.$actionBarContainer.find('.actionSeparator').length > 0, "separator is available");
                });
            });
        });

        describe('Button Action', function () {
            before(function () {
                var self = this;
                this.$actionBarContainer = createContainer();
                this.actionBarActions = filterList(actionBarConfiguration.button, "button_type");
                this.actionBarHandlers = {
                    "downloadJims": function () {
                        self.downloadJimsClicked = true;
                    },
                    "publishGrid": function () {
                        self.publishGridClicked = true;
                    }
                };
                this.actionBarWidgetObj = new ActionBarWidget({
                    "container": this.$actionBarContainer[0],
                    "actions": this.actionBarActions,
                    "events": {
                        "downloadJims": {
                            "handler": [this.actionBarHandlers.downloadJims]
                        }
                    }
                }).build();
            });
            after(function () {
                this.actionBarWidgetObj.destroy();
            });
            it('should contain an enabled button action', function () {
                var $buttonActionInput = this.$actionBarContainer.find(".downloadJims input");
                assert.isTrue(_.isUndefined($buttonActionInput.attr("disabled")), "The button action is enabled");
            });
            it('should invoke a callback when button action is clicked', function () {
                var $buttonAction = this.$actionBarContainer.find(".downloadJims");
                //resets variable to be tested in callback
                this.downloadJimsClicked = false;
                $buttonAction.trigger("click");
                assert.isTrue(this.downloadJimsClicked, "the callback associated with the button action is invoked");
            });
            it('should contain a disabled button action', function () {
                var $buttonActionInput = this.$actionBarContainer.find(".publishGrid input");
                assert.isFalse(_.isUndefined($buttonActionInput.attr("disabled")), "The button action is disabled");
            });
            it('should enable a button action by the updateDisabledStatus method and assign handler by the bindEvents method', function () {
                var $buttonAction = this.$actionBarContainer.find(".publishGrid"),
                $buttonActionInput = $buttonAction.find("input");
                //enables a button action
                assert.isFalse(_.isUndefined($buttonActionInput.attr("disabled")), "The button action is disabled");
                this.actionBarWidgetObj.updateDisabledStatus({
                    "publishGrid": false, //enables publishGrid action
                });
                assert.isTrue(_.isUndefined($buttonActionInput.attr("disabled")), "The button action is enabled");
                //bind an action to a handler
                this.actionBarWidgetObj.bindEvents({
                    "publishGrid": {
                        "handler": [this.actionBarHandlers.publishGrid]
                    }
                });
                //resets variable to be tested in callback
                this.publishGridClicked = false;
                $buttonAction.trigger("click");
                assert.isTrue(this.publishGridClicked, "the callback associated with the button action is invoked")
            });
        });

        describe('Icon Action', function () {
            before(function () {
                var self = this;
                this.$actionBarContainer = createContainer();
                this.actionBarActions = filterList(actionBarConfiguration.button, "icon_type");
                this.actionBarHandlers = {
                    "expandAll": function () {
                        self.expandAllClicked = true;
                    },
                    "collapseAll": function () {
                        self.collapseAllClicked = true;
                    }
                };
                this.actionBarWidgetObj = new ActionBarWidget({
                    "container": this.$actionBarContainer[0],
                    "actions": this.actionBarActions,
                    "events": {
                        "expandAll": {
                            "handler": [this.actionBarHandlers.expandAll]
                        }
                    }
                }).build();
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain an enabled icon action', function () {
                var $iconActionImg = this.$actionBarContainer.find(".expandAll .iconImg");
                assert.isTrue(_.isUndefined($iconActionImg.attr("disabled")), "The icon action is enabled");
            });
            it('should invoke a callback when icon action is clicked', function () {
                var $iconAction = this.$actionBarContainer.find(".expandAll");
                //resets variable to be tested in callback
                this.expandAllClicked = false;
                $iconAction.trigger("click");
                assert.isTrue(this.expandAllClicked, "the callback associated with the icon action is invoked");
            });
            it('should contain a disabled icon action', function () {
                var $iconActionImg = this.$actionBarContainer.find(".collapseAll .iconImg");
                assert.isFalse(_.isUndefined($iconActionImg.attr("disabled")), "The icon action is disabled");
            });
            it('should enable a icon action by the updateDisabledStatus method and assign handler by the bindEvents method', function () {
                var $iconAction = this.$actionBarContainer.find(".collapseAll"),
                    $iconActionImg = $iconAction.find(".iconImg");
                //enables an icon action
                assert.isFalse(_.isUndefined($iconActionImg.attr("disabled")), "The icon action is disabled");
                this.actionBarWidgetObj.updateDisabledStatus({
                    "collapseAll": false, //enables collapseAll action
                });
                assert.isTrue(_.isUndefined($iconActionImg.attr("disabled")), "The icon action is enabled");
                //bind an action to a handler
                this.actionBarWidgetObj.bindEvents({
                    "collapseAll": {
                        "handler": [this.actionBarHandlers.collapseAll]
                    }
                });
                //resets variable to be tested in callback
                this.collapseAllClicked = false;
                $iconAction.trigger("click");
                assert.isTrue(this.collapseAllClicked, "the callback associated with the icon action is invoked")
            });
        });

        describe('Menu Action', function () {
            before(function () {
                var self = this;
                this.$actionBarContainer = createContainer();
                this.actionBarActions = filterList(actionBarConfiguration.button, "menu_type");
                this.actionBarHandlers = {
                    "barMoreEdit": function () {
                        self.barMoreEditClicked = true;
                    },
                    "restrictedSubMenu1": function () {
                        self.restrictedSubMenu1Clicked = true;
                    },
                    "subMenu1": function () {
                        self.subMenu1Clicked = true;
                    }
                };
                this.actionBarWidgetObj = new ActionBarWidget({
                    "container": this.$actionBarContainer[0],
                    "actions": this.actionBarActions,
                    "events": {
                        "barMoreEdit": {
                            "handler": [this.actionBarHandlers.barMoreEdit]
                        },
                        "restrictedSubMenu1": {
                            "handler": [this.actionBarHandlers.restrictedSubMenu1]
                        }
                    }
                }).build();
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain an enabled icon menu action', function () {
                var $menuActionImg = this.$actionBarContainer.find(".barMore .iconImg");
                assert.isTrue(_.isUndefined($menuActionImg.attr("disabled")), "The icon menu action is enabled");
            });
            it('should open a menu when icon menu action is clicked and should invoke callback when an item of the icon menu is clicked', function () {
                var $menuAction = this.$actionBarContainer.find(".barMore");
                //resets variable to be tested in callback
                this.barMoreEditClicked = false;
                //opens the menu
                $menuAction.trigger("click");
                var $contextMenu = $(".context-menu-list:not('.context-menu-scroll')").eq(0),
                    $menuItems = $contextMenu.find(".context-menu-item"),
                    $menuItem0 = $menuItems.eq(0), //barMoreEdit
                    $menuItem1 = $menuItems.eq(1); //barMoreDuplicate
                assert.isTrue($menuItems.length > 0, "menu action has some menu items");
                assert.isFalse($menuItem0.hasClass("context-menu-disabled"), "the first item on the icon menu action is enabled");
                assert.isTrue($menuItem1.hasClass("context-menu-disabled"), "the second item on the icon menu action is disabled");
                //selects one item in the menu
                $menuItems.eq(0).find("span").trigger("mouseup");
                assert.isTrue(this.barMoreEditClicked, "the callback associated with the icon menu action is invoked");
                //closes the menu and cleanup
                $contextMenu.trigger('contextmenu:hide');
                $("#context-menu-layer").remove();
            });
            it('should contain an enabled menu action', function () {
                var $menuActionLabel = this.$actionBarContainer.find(".restrictedSubMenu .menu-label");
                assert.isTrue(_.isUndefined($menuActionLabel.attr("disabled")), "The menu action is enabled");
            });
            it('should invoke a callback when menu action is clicked and should invoke callback when an item of the icon menu is clicked', function () {
                var $menuAction = this.$actionBarContainer.find(".restrictedSubMenu");
                //resets variable to be tested in callback
                this.restrictedSubMenu1Clicked = false;
                //opens the menu
                $menuAction.trigger("click");
                var $contextMenu = $(".context-menu-list:last"),
                    $menuItems = $contextMenu.find(".context-menu-item"),
                    $menuItem0 = $menuItems.eq(0), //restrictedSubMenu1
                    $menuItem1 = $menuItems.eq(1); //restrictedSubMenu2
                assert.isTrue($menuItems.length > 0, "menu action has some menu items");
                assert.isFalse($menuItem0.hasClass("context-menu-disabled"), "the first item on the icon menu action is enabled");
                assert.isTrue($menuItem1.hasClass("context-menu-disabled"), "the second item on the icon menu action is disabled");
                //selects one item in the menu
                $menuItems.eq(0).find("span").trigger("mouseup");
                assert.isTrue(this.restrictedSubMenu1Clicked, "the callback associated with the menu action is invoked");
                //closes the menu and cleanup
                $contextMenu.trigger('contextmenu:hide');
                $("#context-menu-layer").remove();
            });
            it('should contain a disabled icon menu action', function () {
                var $menuActionImg = this.$actionBarContainer.find(".restrictedSubMenuIcon .iconImg");
                assert.isFalse(_.isUndefined($menuActionImg.attr("disabled")), "The icon menu action is disabled");
            });
            it('should enable an icon menu action by the updateDisabledStatus method', function () {
                var $menuAction = this.$actionBarContainer.find(".restrictedSubMenuIcon"),
                    $menuActionImg = $menuAction.find(".iconImg");
                //enables a menu action
                assert.isFalse(_.isUndefined($menuActionImg.attr("disabled")), "The icon menu action is disabled");
                this.actionBarWidgetObj.updateDisabledStatus({
                    "restrictedSubMenuIcon": false, //enables restrictedSubMenuIcon menu item
                });
                assert.isTrue(_.isUndefined($menuActionImg.attr("disabled")), "The icon menu action is enabled");
                //opens the menu
                $menuAction.trigger("click");
                var $contextMenu = $(".context-menu-list:last"),
                    $menuItems = $contextMenu.find(".context-menu-item");
                assert.isTrue($menuItems.length > 0, "menu action has some menu items");
                //closes the menu and cleanup
                $contextMenu.trigger('contextmenu:hide');
                $("#context-menu-layer").remove();
            });
            it('should contain a disabled menu action', function () {
                var $menuActionLabel = this.$actionBarContainer.find(".subMenu .menu-label");
                assert.isFalse(_.isUndefined($menuActionLabel.attr("disabled")), "The icon menu action is disabled");
            });
            it('should enable a menu item by the updateDisabledStatus method and assign handler by the bindEvents method', function () {
                var $menuAction = this.$actionBarContainer.find(".subMenu"),
                    $menuActionLabel = $menuAction.find(".menu-label");
                //enables a menu action
                assert.isFalse(_.isUndefined($menuActionLabel.attr("disabled")), "The icon menu action is disabled");
                this.actionBarWidgetObj.updateDisabledStatus({
                    "subMenu": false, //enables restrictedSubMenuIcon menu action
                });
                assert.isTrue(_.isUndefined($menuActionLabel.attr("disabled")), "The icon menu action is enabled");
                //bind an action to a handler
                this.actionBarWidgetObj.bindEvents({
                    "subMenu1": {
                        "handler": [this.actionBarHandlers.subMenu1]
                    }
                });
                //resets variable to be tested in callback
                this.subMenu1Clicked = false;
                //opens the menu
                $menuAction.trigger("click");
                var $contextMenu = $(".context-menu-list:last"),
                    $menuItems = $contextMenu.find(".context-menu-item"),
                    $menuItem0 = $menuItems.eq(0), //subMenu1
                    $menuItem1 = $menuItems.eq(1); //subMenu2
                assert.isTrue($menuItems.length > 0, "menu action has some menu items");
                assert.isFalse($menuItem0.hasClass("context-menu-disabled"), "the first item on the icon menu action is enabled");
                assert.isTrue($menuItem1.hasClass("context-menu-disabled"), "the second item on the icon menu action is disabled");
                //selects one item in the menu
                $menuItems.eq(0).find("span").trigger("mouseup");
                assert.isTrue(this.subMenu1Clicked, "the callback associated with the item menu is invoked");
                //closes the menu and cleanup
                $contextMenu.trigger('contextmenu:hide');
                $("#context-menu-layer").remove();
            });
            it('should open context menu on click in rowMore action menu item', function() {
                var $menuAction = this.$actionBarContainer.find(".actionMenu.rowMore");
                $(".context-menu-list").trigger('contextmenu:hide');
                assert.isFalse($menuAction.hasClass("context-menu-active"), "context-menu-active class is not present when the menu item is not clicked");
                $menuAction.trigger("click");
                var $contextMenu = $(".context-menu-list:last");
                assert.isTrue($menuAction.hasClass("context-menu-active"), "context-menu-active class is present when the menu item is clicked");
                assert.isTrue($contextMenu.length == 1, "context menu is present");
                //closes the menu and cleanup
                $contextMenu.trigger('contextmenu:hide');
                $("#context-menu-layer").remove();
            });
            it('should open context menu on hover in rowMore action menu item', function() {
                var $menuAction = this.$actionBarContainer.find(".actionMenu.rowMoreHover");
                $(".context-menu-list").trigger('contextmenu:hide');
                assert.isFalse($menuAction.hasClass("context-menu-active"), "context-menu-active class is not present when the menu item is not hovered");
                $menuAction.trigger("mouseover");
                var $contextMenu = $(".context-menu-list:last");
                assert.isTrue($menuAction.hasClass("context-menu-active"), "context-menu-active class is present when the menu item is hovered");
                assert.isTrue($contextMenu.length == 1, "context menu is present");
                // //closes the menu and cleanup
                $contextMenu.trigger('contextmenu:hide');
                $("#context-menu-layer").remove();
            });
        });

        describe('Search Action', function() {
            before(function(){
                this.$actionBarContainer = createContainer();
                this.actionBarWidgetObj = new ActionBarWidget({
                    "container": this.$actionBarContainer[0],
                    "actions": actionBarConfiguration.button
                }).build();
            });
            after(function(){
                cleanUp(this);
            });
            it('search should display when search_type is enabled', function() {
                var $search = $el.find(".filter_container"),
                    $searchIcon = $search.find(".search_icon");

                //By default, only search-icon is displayed
                assert.isTrue($search.hasClass("collapse_search"), 'The search is in the actionBar.');
                assert.isTrue($el.find(".search_icon").css('display') != 'none', 'The search is visible.');
                assert.isTrue($el.find(".filter_input").css('display') == 'none', 'The filter input is hidden.');

                $searchIcon.click();
                //After clicking the search icon, the input field shows.
                assert.isFalse($search.hasClass("collapse_search"), 'The search is NOT in the actionBar.');

                $searchIcon.click();
                assert.isTrue($search.hasClass("collapse_search"), 'The search is in the actionBar.');
                assert.isTrue($el.find(".search_icon").css('display') != 'none', 'The search is visible.');
                assert.isTrue($el.find(".filter_input").css('display') == 'none', 'The filter input is hidden.');
            });
        });

        describe('RBAC', function () {
            var old_verifyaccess;
            before(function () {
                //temporal overwrite verifyAccess
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function () {
                    return false;
                };
                this.$actionBarContainer = createContainer();
                this.actionBarWidgetObj = new ActionBarWidget({
                    "container": this.$actionBarContainer[0],
                    "actions": actionBarConfiguration.button,
                    "rbac": rbacSample
                }).build();
            });
            after(function () {
                //restore verifyAccess
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
                cleanUp(this);
            });
            it('should not contain a restricted button action', function () {
                var $iconAction = this.$actionBarContainer.find(".downloadJims");
                assert.isFalse($iconAction.length == 0, "The button action is available");
            });
            it('should contain a restricted icon action', function () {
                var $menuAction = this.$actionBarContainer.find(".expandAllRestricted");
                assert.isTrue($menuAction.length == 0, "The restricted icon action is not available");
            });
            it('should contain a restricted menu action', function () {
                var $menuAction = this.$actionBarContainer.find(".restrictedSubMenu");
                assert.isTrue($menuAction.length == 0, "The restricted menu action is not available");
            });
        });
    });
});
