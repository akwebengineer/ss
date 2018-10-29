define([
	'widgets/tabContainer/tests/view/zonePolicyView',
    'widgets/tabContainer/tests/view/utmPolicyView',
    'widgets/tabContainer/tests/view/addressView',
    'widgets/tabContainer/tests/view/addView',
    'text!widgets/tabContainer/templates/tabContainer.html',
	'widgets/tabContainer/tabContainerWidget'
	],function(ZonePolicy, UTMPolicy, AddressView, CreateView, TabContainer, TabContainerWidget) {

		describe('Tab Container Widget - Unit tests:', function() {
            var $el = $('#test_widget'),
                        containerId = 0,
                        zonePolicyView = new ZonePolicy(),
                        utmPolicyView = new UTMPolicy(),
                        tabs = [{
                            id:"zone",
                            name:"Zone Policy",
                            isDefault: true,
                            content: zonePolicyView
                        },{
                            id:"utm",
                            name:"UTM Policiy",
                            content: utmPolicyView
                        }];

            var createContainer = function () {
                var tabContainerId = "tab-container-id" + containerId++;
                $el.append("<div id = " + tabContainerId + "></div>");
                return $el.find("#"+tabContainerId);
            };

            var cleanUp = function (thisObj) {
                thisObj.tabContainerWidget.destroy();
                thisObj.$tabContainer.remove();
            };

			describe('Widget Interface', function() {
                before(function(){
                    this.$tabContainer = createContainer();
                    this.tabContainerWidget = new TabContainerWidget({
                        "container": this.$tabContainer[0],
                        "tabs": tabs
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('should exist', function() {
					this.tabContainerWidget.should.exist;
				});
				it('build() should exist', function() {
                    assert.isFunction(this.tabContainerWidget.build, 'The tab widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.tabContainerWidget.destroy, 'The tab widget must have a function named destroy.');
                });
			});

            describe('TabContainer Widget Elements', function() {
                before(function(){
                    var _tabs = [{
                            id:"utm",
                            name: '<span><div class="icon_add_blue_14x14 icon_add_blue_14x14-dims" style="display:inline-block"></div><span style="display:inline-block; margin-left: 5px">Create</span></span>',
                            content: new UTMPolicy()
                        },
                        {
                            id:"zone",
                            name:"Zone Policy",
                            isDefault: true,
                            content: new ZonePolicy()
                        }];
                    this.$tabContainer = createContainer();
                    this.tabContainerWidget = new TabContainerWidget({
                        "container": this.$tabContainer[0],
                        "tabs": _tabs
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('should contain a tab container', function() {
                    assert.isTrue(this.$tabContainer.find('.ui-tabs').length > 0, "the tab container has been created and the container with ui-tabs class should has children");
                });
                it('should contain the titles of the tabs', function() {
                    assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matched the tabs parameter configuration");
                });
                it('should render tab label when html input is provided', function() {                    
                    assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').first().find('.icon_add_blue_14x14').length == 1, "HTML tab label has been added");
                });
                it('should render tab label when text input is provided', function() {                                              
                    assert.equal(this.$tabContainer.find('.ui-tabs-nav li:eq(1)').find('a').text().trim(), "Zone Policy", "Text tab label has been added");
                });                            
                it('should contain the content of the tabs', function() {
                    assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                });
            });

            describe('TabContainer Widget Layouts', function() {
                describe('Navigation Layout', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "navigation": true
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain a tab container', function() {
                        assert.isTrue(this.$tabContainer.hasClass('tabContainer-navigation'), "the tab container has been created and the container with tabContainer-navigation class has been added");
                    });
                    it('should contain the titles of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matches the tabs parameter configuration");
                    });
                    it('should contain the content of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                    });
                    it('marker should exist under the active tab', function(done){
                        var tabThree = this.$tabContainer.find("#ui-id-3");
                        tabThree.on("click", function(e){
                            var markerLeft = this.$tabContainer.find('.navigation-marker').offset().left;
                            var tabSetContainer = this.$tabContainer.find('.tabContainer-widget_tabLink');
                            var tabPos = this.$tabContainer.find('.ui-tabs-active a').offset().left - tabSetContainer.offset().left;
                            assert.isEqual(markerLeft,tabPos,"Marker left should be on the correct position");
                            done();
                        });
                        tabThree.trigger("click");
                        done();
                    });
                });
                describe('Vertical Layout', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "orientation": "vertical"
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain a tab container', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs').hasClass('ui-tabs-vertical'), "the tab container has been created and the container with ui-tabs-vertical class has been added");
                    });
                    it('should contain the titles of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matches the tabs parameter configuration");
                    });
                    it('should contain the content of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                    });
                });
                describe('Toggle Layout', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "toggle": true
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain a tab container', function() {
                        assert.isTrue(this.$tabContainer.hasClass('tabContainer-toggle'), "the tab container has been created and the container with tabContainer-toggle class has been added");
                    });
                    it('should contain the titles of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matches the tabs parameter configuration");
                    });
                    it('should contain the content of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                    });
                });
                describe('Small Tab Layout', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "small": true
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain a tab container', function() {
                        assert.isTrue(this.$tabContainer.hasClass('tabContainer-small'), "the tab container has been created and the container with tabContainer-small class has been added");
                    });
                });
            });

            describe('TabContainer Widget Controls', function() {
                describe('Controls', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "toggle": true,
                            "controls": {
                                add: true,
                                edit: true,
                                remove: true
                            }

                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain controls container', function() {
                        assert.isTrue(this.$tabContainer.find('.tabContainer-widget_tabLink .controls').length == 1, "controls container is available");
                    });
                    it('should contain create element for tab creation', function() {
                        assert.isTrue(this.$tabContainer.find('.controls .addTab').length == 1, "create tab ui element is available");
                    });
                    it('should contain input element for editing tab name', function() {
                        this.$tabContainer.find('.ui-tabs-anchor').click();
                        assert.isTrue(this.$tabContainer.find('.tabName_InputEl').length == 1, "default tab can be edited when single clicked");
                    });
                    it('should allow spaces in input element when editing tab name', function () {
                        var tabNameWithSpace = "New Tab";
                        var $anchorEl = this.$tabContainer.find('.ui-tabs-anchor').first().click();
                        var $inputEl = this.$tabContainer.find('.tabName_InputEl').val(tabNameWithSpace);
                        $inputEl.blur();
                        assert.isTrue($anchorEl.text() == tabNameWithSpace, "tab label can be edited with space");
                    });
                    it('should contain remove element for removing tab on hover', function() {
                        this.$tabContainer.find('.ui-tabs-anchor').trigger("mouseover");
                        assert.isTrue(this.$tabContainer.find('.removeTab').length == tabs.length, "tabs can be removed on hover");
                    });
                    it('should not contain remove element when user does not hover over any tab', function() {
                        this.$tabContainer.find('.ui-tabs-anchor').trigger("mouseover");
                        this.$tabContainer.find('.ui-tabs-anchor').trigger("mouseleave");
                        assert.isTrue(this.$tabContainer.find('.removeTab:visible').length == 0, "tabs cannot be removed on mouseleave");
                    });
                    it('should remove tab after user clicks "Yes" in confirmation dialog', function() {
                        var removedTabId = null;
                        var firstTabAnchorEle = this.$tabContainer.find('.ui-tabs-anchor').first();
                        firstTabAnchorEle.trigger("mouseover");
                        removedTabId = firstTabAnchorEle.attr('data-tabid');
                        firstTabAnchorEle.find('.removeTab').first().click();
                        $('.yesButton').click();
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-anchor').first().attr('data-tabid') != removedTabId, "tab can be removed after user confirms Yes");
                    });
                    it('should not remove tab after user clicks "No" in confirmation dialog', function() {
                        var removedTabId = null;
                        var firstTabAnchorEle = this.$tabContainer.find('.ui-tabs-anchor').first();
                        firstTabAnchorEle.trigger("mouseover");
                        removedTabId = firstTabAnchorEle.attr('data-tabid');
                        firstTabAnchorEle.find('.removeTab').first().click();
                        $('.noButton').click();
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-anchor').first().attr('data-tabid') == removedTabId, "tab cannot be removed after user confirms No");
                    });
                });
            });

            describe('TabContainer Widget Methods', function() {
                var tab = {
                        id:"address",
                        name:"Address",
                        content: new AddressView()
                    },
                    newTabs = [{
                        id:"create",
                        name:"Create",
                        content: new CreateView()
                    },{
                        id:"address",
                        name:"Address",
                        content: new AddressView()
                    }];

                var mockJaxID = $.mockjax({
                    url: /^\/form-test\/remote-validation\/callback\/developer-generation\/([a-zA-Z0-9\-\_]*)$/,
                    urlParams: ["client"],
                    response: function(settings) {
                        var client = settings.urlParams.client,
                            clients = ["Sujatha","Andrew","Miriam","Vidushi","Eva","Sanket","Arvind","Viswesh","Swena", "testRemote"];
                        this.responseText = "true";
                        if ($.inArray(client, clients) !== -1) {
                            this.responseText = "false";
                        }
                    },
                    responseTime: 1
                });
                var remoteValidate = function (el, callback){
                    var url = "/form-test/remote-validation/callback/developer-generation/";
                    url += el.value;
                    $.ajax({
                        url: url,
                        complete: function (e, xhr, settings) {
                            var errorMsg = "Developer's name is invalid, try some other name!";
                            var isValid = e.responseText;
                            isValid = _.isEqual(isValid,"true");
                            callback(isValid, errorMsg);
                        }
                    });
                };

                var getBadgeContent = function(id) {
                    if(id == "zone"){
                        return "5";
                    } else if(id == "utm") {
                        return "2";
                    }
                };

                beforeEach(function(){
                    this.$tabContainer = createContainer();
                    this.tabContainerWidget = new TabContainerWidget({
                        "container": this.$tabContainer[0],
                        "tabs": tabs,
                        badge: function (tabId) {
                            return {
                                "class": tabId + "-badge all-bagdes",
                                "content": getBadgeContent
                            }
                        }
                    }).build();
                });
                afterEach(function(){
                    $.mockjax.clear([mockJaxID]);
                    cleanUp(this);
                });
                it('add a new tab dynamically', function() {
                    this.tabContainerWidget.addTab(tab);
                    assert(this.$tabContainer.find("#tabContainer-widget_tabLink_address").length === 1, "add a new tab dynamically");
                });
                it('remove the existing tab dynamically', function() {
                    this.tabContainerWidget.addTab(tab);
                    this.tabContainerWidget.removeTab('address');
                    assert(this.$tabContainer.find("#tabContainer-widget_tabLink_address").length === 0, 'remove the existing tab dynamically');
                });
                it('add mulitple tabs dynamically', function() {
                    var tabNum = tabs.length + newTabs.length;

                    this.tabContainerWidget.addTab(newTabs);
                    assert(this.$tabContainer.find("li").length === tabNum, "add mulitple tabs dynamically");
                });
                it('remove mulitple tabs dynamically', function() {
                    this.tabContainerWidget.addTab(newTabs);
                    this.tabContainerWidget.removeTab(['create', 'address']);
                    assert(this.$tabContainer.find("li").length === tabs.length, "remove mulitple tabs dynamically");
                });
                it('can not add duplicate tab multiple times', function() {
                    var self = this,
                        duplicateErrorFn = function () {
                            self.tabContainerWidget.addTab(tab);
                            self.tabContainerWidget.addTab(tab);
                        };

                    assert.throws(duplicateErrorFn, Error, "The ID is duplicated");
                });
                it('at least one tab exists', function() {
                    var self = this,
                        tabErrorFn = function () {
                            self.tabContainerWidget.removeTab(['zone', 'address', 'utm']);
                        };

                    assert.throws(tabErrorFn, Error, "The Tab Container widget must contain at least 1 tab");
                });
                it('verify if active tab is set properly', function() {
                    var self = this;
                    //trigger the click event so that jquery tabs activate() function is getting called.
                    self.$tabContainer.find("a[data-tabid='utm']").trigger('click');
                    //verify if the activetab has been set to utm, through the widget's getActiveTab() method
                    assert(self.tabContainerWidget.getActiveTab() === "utm", "utm tab has been set as active tab");
                    //trigger the click event so that jquery tabs activate() function is getting called.
                    self.$tabContainer.find("a[data-tabid='zone']").trigger('click');
                    //verify if the active tab has been set to zone, through the widget's getActiveTab() method
                    assert(self.tabContainerWidget.getActiveTab() === "zone", "zone tab has been set as active tab");
                });
                it('verify private functions', function() {
                    var self = this;
                    //trigger the click event so that jquery tabs activate() function is getting called.
                    self.$tabContainer.find("a[data-tabid='utm']").trigger('click');

                    var $activeTabElement = self.tabContainerWidget._getActiveTabElement();
                    assert($activeTabElement.find('a[data-tabid=utm]').length === 1, "The active tab element gets returned");

                    var $tabElements = self.tabContainerWidget._getTabElements();
                    assert($tabElements.length === self.tabContainerWidget.getAllTabs().length, "All of the tabs are returned");
                });
                it('verify if error icon shows when isValidInput for an inactive tab is false', function() {
                    var self = this;
                    var utmli = self.$tabContainer.find("li[data-id='utm']");
                    var zoneli = self.$tabContainer.find("li[data-id='zone']");
                    var utmTab =  self.$tabContainer.find("a[data-tabid='utm']");
                    var zoneTab = self.$tabContainer.find("a[data-tabid='zone']");

                    // Initially, UTM will have icons with respective text and not error icons but Zone tab won't have any of them as its the active tab
                    assert.isFalse(utmli.find(".errorIcon").length > 0, "Initially, no Error Icon exists");
                    assert.isFalse(zoneli.find(".errorIcon").length > 0, "Intially, Error Icon exists");
                    var utmActionIcon = utmli.find(".badgeIcon");
                    assert.isTrue(utmActionIcon.length == 1, "Initially, utm tab has an action icon");
                    assert.isTrue(utmActionIcon.text() == '2', "Initially, utm tab has an action icon with number 2");
                    assert.isFalse(zoneli.find(".badgeIcon").length > 0, "Initially, zone tab has no badge icon");

                    utmTab.trigger('click');

                    // After UTM tab is clicked, UTM tab has niether action icon nor error icon, but after validation zone tab has error so zone tab shows error icon and not the icon with text
                    var zoneErrorIcon = zoneli.find(".errorIcon");
                    assert.isTrue(zoneErrorIcon.length > 0, "Error Icon exists");
                    assert.isFalse(zoneErrorIcon.text() == '10', "Initially, zone tab no more has 10 value");
                    assert.isFalse(utmli.find(".errorIcon").length > 0, "Error icon does not exist");
                    assert.isFalse(utmli.find(".badgeIcon").length > 0, "Badge icon does not exist");

                    zoneTab.trigger('click');

                    // After Zone tab is clicked, UTM after validation has error and so shows error icon and not icon with text
                    assert.isFalse(zoneli.find(".errorIcon").length > 0, "Error icon does not exist");
                    assert.isFalse(zoneli.find(".badgeIcon").length > 0, "Badge icon does not exist");
                    assert.isTrue(utmli.find(".errorIcon").length > 0, "Error icon exists");
                });
                it('validate the inactive tab with visible form section', function() {
                    assert.isFalse(zonePolicyView.form.isValidInput());
                    var utmTab =  this.$tabContainer.find("a[data-tabid='utm']");
                    utmTab.click();
                    assert.isFalse(zonePolicyView.form.isValidInput());
                });
                it('validate the inactive tab with hidden form section', function() {
                    this.$tabContainer.find("#section_id .toggle_section input").click();
                    assert.isTrue(zonePolicyView.form.isValidInput());
                    var utmTab =  this.$tabContainer.find("a[data-tabid='utm']");
                    utmTab.click();
                    assert.isTrue(zonePolicyView.form.isValidInput());
                });
            });

		});

	});
