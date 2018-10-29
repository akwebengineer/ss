define([
	'widgets/dashboard/dashboard',
	'backbone',
	'marionette'
], function(
	Dashboard,
	Backbone,
	Marionette
) {
	describe('Dashboard - Unit tests:', function() {

        var BBView = Backbone.View.extend({
            initialize: function(options) {
                _.extend(this, options);
            },
            render: function() {
                this.$el.html(this.template);
                return this;
            }
        });

        var BBViewClass = Backbone.View.extend({
            initialize: function(options) {
                _.extend(this, options);
            },
            render: function() {
                this.$el.html(this.template);
                return this;
            },
            template: '<div>Some thumbnail content</div>'
        });

        var GenericView = function() {
            this.$el = null;
            var self = this;
            this.render = function() {
                self.$el = '<div>Some content</div>';
                return self;
            }
        };

        var MarionetteView = Marionette.ItemView.extend({
            initialize: function(options) {
                _.extend(this, options);
            },
            render: function() {
                this.$el.html(this.template);
                return this;
            },
            template: '<div>Some thumbnail content</div>'
        });

		var activityContext = new Slipstream.SDK.ActivityContext('', '');

        var dashboardWidgets = [{
            title: "Some title 1",
            size: "double",
            details: "Some details",
            image: new BBView({
                template: '<div>Some thumbnail content</div>'
            }),
            view: BBViewClass,
            context: activityContext
        }, {
            title: "Some title 2",
            size: "double",
            details: "Some details",
            image: new BBView({
                template: '<div>Some thumbnail content</div>'
            }),
            view: GenericView,
            context: activityContext
        }, {
            title: "Some title 3",
            size: "double",
            details: "Some details",
            image: new BBView({
                template: '<div>Some thumbnail content</div>'
            }),
            view: MarionetteView,
            context: activityContext
        }];

        var cleanUp = function (thisObj) {
            thisObj.myDashboard.destroy();
            thisObj.myDashboard = null;
        };

		describe('Dashboard', function() {

			before(function() {
				this.myDashboard = new Dashboard();

				for (var i = 0; i < dashboardWidgets.length; i++) {
					this.myDashboard.addDashboardWidget(dashboardWidgets[i]);
				}

				this.myDashboard.build({
                	onDone: _.bind(function() {
                    	console.log('called onDone back');
                	}, this)
                });
			});

			after(function() {
                cleanUp(this);
			});

			it('After initialization, Dashboard should exist', function() {
				this.myDashboard.should.exist;
			});

			it('build must be a function on the Dashboard', function() {
				assert.isFunction(this.myDashboard.build, 'The dashboard must have a function named build');
			});

			it('addDashboardWidget must be a function on the Dashboard', function() {
				assert.isFunction(this.myDashboard.addDashboardWidget, 'The dashboard must have a function named addDashboardWidget');
			});

			it('zeroDashletsState must be hidden when dashlets are present on the Dashboard', function() {
				var zeroDashletsState = $(this.myDashboard.el[0]).find('.zero-state');
				$(zeroDashletsState).is(':visible').should.be.false;
			});

			it('destroy must be a function on the Dashboard', function() {
				assert.isFunction(this.myDashboard.destroy, 'The dashboard must have a function named destroy');
			});

            it('All thumbnails must be present on the dashboard when capabilities are not specified', function() {
                var numThumbnails = $(this.myDashboard.el[0]).find('.dashboardThumbnail').length;
                assert.isTrue(numThumbnails == dashboardWidgets.length, "thumbnails added match the number of dashboard widgets provided in the configuration");
            });

		});

        describe('Dashboard Widget invokes dashlet method - close', function() {
            var old_verifyaccess;

            before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    return true;
                };
                Slipstream.commands.execute("provider:start", "topics");

                this.myDashboard = new Dashboard();
                this.myDashboard.closeMethodInvoked = false;
                var self = this;
                self.deferred = $.Deferred();

                var baseDashlet = dashboardWidgets[0].view;
                var dashlet = baseDashlet.extend({
                    close: function () {
                        self.myDashboard.closeMethodInvoked = true;
                        self.deferred.resolve();
                    }
                });

                dashboardWidgets[0].view = dashlet;

                for (var i = 0; i < dashboardWidgets.length; i++) {
                    this.myDashboard.addDashboardWidget(dashboardWidgets[i]);
                }

                this.myDashboard.build({
                    onDone: _.bind(function () {
                        console.log('called onDone back');
                    }, this)
                });
            });

            after(function() {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
            });

            it('dashboard must invoke close method in dashlets on navigateAway event', function(done) {
                var dashletMdl = dashboardWidgets[0];
                this.myDashboard._addDashletToContainer(dashletMdl, "default");

                Slipstream.commands.execute('navigation:request',{success: function(){}, fail:function(){}});

                this.deferred.done($.proxy(function () {
                    assert.isTrue(this.myDashboard.closeMethodInvoked, 'close method invoked');
                    cleanUp(this);
                    done();
                }, this));
            });

        });

        describe('Dashboard Widget invokes dashlet method - getFilters', function() {
            var old_verifyaccess;

            before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    return true;
                };

                this.myDashboard = new Dashboard();
                this.myDashboard.getFiltersMethodInvoked = false;
                var self = this;
                self.deferred = $.Deferred();

                var baseDashlet = dashboardWidgets[0].view;
                var dashlet = baseDashlet.extend({
                    getFilters: function () {
                        self.myDashboard.getFiltersMethodInvoked = true;
                        self.deferred.resolve();
                    }
                });

                dashboardWidgets[0].view = dashlet;

                for (var i = 0; i < dashboardWidgets.length; i++) {
                    this.myDashboard.addDashboardWidget(dashboardWidgets[i]);
                }

                this.myDashboard.build({
                    onDone: _.bind(function () {
                        console.log('called onDone back');
                    }, this)
                });
            });

            after(function() {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
            });

            it('dashboard must invoke getFilters method', function(done) {
                var dashletMdl = dashboardWidgets[0];
                this.myDashboard._addDashletToContainer(dashletMdl, "default");

                this.deferred.done($.proxy(function () {
                    assert.isTrue(this.myDashboard.getFiltersMethodInvoked, 'getFilters method invoked');
                    cleanUp(this);
                    done();
                }, this));
            });

        });

        describe('Dashboard checks for widget capabilities', function() {
            var old_verifyaccess;

            before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    if (!capabilities) return true;
                    if (capabilities[0] == "blockAccess") {
                        return false;
                    }
                };

                Slipstream.commands.execute("provider:start", "topics");

                var capabilities = [
                    {
                        'name': 'blockAccess'
                    }
                ];

                this.myDashboardWidgets = [{
                    title: "Some title 1",
                    size: "double",
                    details: "Some details",
                    capabilities: capabilities,
                    image: new BBView({
                        template: '<div>Some thumbnail content</div>'
                    }),
                    view: BBViewClass,
                    context: activityContext
                }, {
                    title: "Some title 2",
                    size: "double",
                    details: "Some details",
                    capabilities: capabilities,
                    image: new BBView({
                        template: '<div>Some thumbnail content</div>'
                    }),
                    view: MarionetteView,
                    context: activityContext
                }];

                this.myDashboard = new Dashboard();
                this.myDashboard.closeMethodInvoked = false;
                var self = this;
                self.deferred = $.Deferred();

                var baseDashlet = this.myDashboardWidgets[0].view;
                var dashlet = baseDashlet.extend({
                    close: function () {
                        self.myDashboard.closeMethodInvoked = true;
                        self.deferred.resolve();
                    }
                });

                this.myDashboardWidgets[0].view = dashlet;

                for (var i = 0; i < this.myDashboardWidgets.length; i++) {
                    this.myDashboard.addDashboardWidget(this.myDashboardWidgets[i]);
                }

                this.myDashboard.build({
                    onDone: _.bind(function () {
                        console.log('called onDone back');
                    }, this)
                });
            });

            after(function() {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
            });

            it('No thumbnails should be visible for a user who does not have the required capabilities', function() {
                var numThumbnails = $(this.myDashboard.el[0]).find('.dashboardThumbnail').length;
                assert.isTrue(numThumbnails == 0, "thumbnails are not added based on the capabilities provided in the configuration");
            });
        });

        describe('Default Dashboard Tests', function() {
            var old_verifyaccess;

            before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    return true;
                };

                this.myDashboardContainers = [{
                        id: "Tab1",
                        label: "Tab 1"
                    },
                    {
                        id: "Tab2",
                        label: "Tab 2"
                    },
                    {
                        id: "Tab3",
                        label: "Tab 3"
                }];

                this.myDashboardWidgets = [{
                    title: "Title 1",
                    size: "single",
                    details: "Details 1",
                    image: new BBView({
                        template: '<div>Content 1</div>'
                    }),
                    default: {
                        "containers": ["Tab1"]
                    },
                    view: BBViewClass,
                    context: activityContext
                },
                {
                    title: "Title 2",
                    size: "single",
                    details: "Details 2",
                    image: new BBView({
                        template: '<div>Content 2</div>'
                    }),
                    default: {
                        "containers": ["Tab1", "Tab2"]
                    },
                    view: BBViewClass,
                    context: activityContext
                }];

                this.myDashboard = new Dashboard();
                var self = this;
                self.deferred = $.Deferred();

                var containers = this.myDashboardContainers;

                for (var i = 0; i < this.myDashboardContainers.length; i++) {
                    this.myDashboard.addDefaultDashboardContainer(this.myDashboardContainers[i]);
                }

                for (var i = 0; i < this.myDashboardWidgets.length; i++) {
                    this.myDashboard.addDashboardWidget(this.myDashboardWidgets[i]);
                }

                this.myDashboard.build({
                    onDone: _.bind(function () {
                        console.log('called onDone back');
                    }, this)
                });

                this.myDashboard._setupDashboardContainers(containers);
                var dashletMdl1 = this.myDashboardWidgets[0];
                var dashletMdl2 = this.myDashboardWidgets[1];
                this.myDashboard._addDashletToContainer(dashletMdl1, dashletMdl1.default.containers[0]);
                this.myDashboard._addDashletToContainer(dashletMdl2, dashletMdl2.default.containers[0]);
                this.myDashboard._addDashletToContainer(dashletMdl2, dashletMdl2.default.containers[1]);
            });

            after(function() {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
            });

            it('Default containers should be visible when specified in the configuration', function() {
                var numDefaultContainers = $(this.myDashboardContainers).length;
                var numAddedContainers = $(this.myDashboard.el[0]).find('.tabContainer-widget_tabLink').find("li").length;
                assert.isTrue(numDefaultContainers == numAddedContainers, "default containers have been added to the dashboard container");
            });

            it('Dashlet should be added to the container when specified in the default configuration', function() {
                var numDashlets = this.myDashboard._getNumDashletsInContainer(this.myDashboardContainers[1].id);
                assert.isTrue(numDashlets == 1, "default dashlet has been added to the right container");
            });

            it('Dashlets should be added to multiple containers when specified in the default configuration', function() {
                var numDashlets = 0;
                numDashlets = this.myDashboard._getNumDashletsInContainer(this.myDashboardContainers[0].id);
                assert.isTrue(numDashlets == 2, "default dashlet has been added to multiple containers");
            });

            it('Dashlets should not be added to a container that is not specified in the default configuration', function() {
                var numDashlets = this.myDashboard._getNumDashletsInContainer(this.myDashboardContainers[2].id);
                assert.isTrue(numDashlets == 0, "default dashlet has not been added to the container");
            });

        });

        describe('Dashboard Validation Tests', function() {
            var old_verifyaccess;

            before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    return true;
                };

                this.myDashboardContainers = [{
                        id: "Tab1",
                        label: "Tab 1"
                }];

                this.myDashboardWidgets = [{
                    title: "Title 1",
                    size: "single",
                    details: "Details 1",
                    image: new BBView({
                        template: '<div>Content 1</div>'
                    }),
                    view: BBViewClass,
                    context: activityContext
                },
                {
                    title: "Title 2",
                    size: "single",
                    details: "Details 2",
                    image: new BBView({
                        template: '<div>Content 2</div>'
                    }),
                    view: BBViewClass,
                    context: activityContext
                }];

                this.myDashboard = new Dashboard();

                var containers = this.myDashboardContainers;

                for (var i = 0; i < this.myDashboardWidgets.length; i++) {
                    this.myDashboard.addDashboardWidget(this.myDashboardWidgets[i]);
                }

                this.myDashboard.build({
                    onDone: _.bind(function () {
                        console.log('called onDone back');
                    }, this)
                });

                this.myDashboard._setupDashboardContainers(containers);
                var dashletMdl1 = this.myDashboardWidgets[0];
                var dashletMdl2 = this.myDashboardWidgets[1];

                // Update one of the dashlet's model to contain an invalid thumbnailId
                // This dashlet should not be added to the dashboard
                dashletMdl1.thumbnailId = "thumbnail_invalid";

                this.myDashboard._addDashletToContainer(dashletMdl1, this.myDashboardContainers[0].id);
                this.myDashboard._addDashletToContainer(dashletMdl2, this.myDashboardContainers[0].id);
            });

            after(function() {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
            });

            it('Only Dashlet with valid thumbnailId should be added to the container', function() {
                var numDashlets = this.myDashboard._getNumDashletsInContainer(this.myDashboardContainers[0].id);
                assert.isTrue(numDashlets == 1, "only the valid dashlet has been added to the container");
            });

        });

        describe('Dashboard Categories Tests', function() {
            var old_verifyaccess;

            before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    return true;
                };


                this.myDashboardWidgets = [{
                    title: "Title 1",
                    size: "single",
                    details: "Details 1",
                    image: new BBView({
                        template: '<div>Content 1</div>'
                    }),
                    categories: ["category_events"],
                    view: BBViewClass,
                    context: activityContext
                },
                {
                    title: "Title 2",
                    size: "single",
                    details: "Details 2",
                    image: new BBView({
                        template: '<div>Content 2</div>'
                    }),
                    categories: ["category_events", "category_ip"],
                    view: BBViewClass,
                    context: activityContext
                },
                {
                    title: "Title 3",
                    size: "single",
                    details: "Details 3",
                    image: new BBView({
                        template: '<div>Content 3</div>'
                    }),
                    categories: ["category_invalid"],
                    view: BBViewClass,
                    context: activityContext
                }];

                this.myDashboard = new Dashboard();
                var self = this;
                self.deferred = $.Deferred();

                for (var i = 0; i < this.myDashboardWidgets.length; i++) {
                    this.myDashboard.addDashboardWidget(this.myDashboardWidgets[i]);
                }

                this.myDashboard.build({
                    onDone: _.bind(function () {
                        console.log('called onDone back');
                    }, this)
                });

            });

            after(function() {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
            });

            it('Dashboard framework must have pre-defined categories', function() {
                var numCategories = _.size(this.myDashboard._getCategories());
                assert.isTrue(numCategories > 0, 'Categories are defined by the dashboard framework');
            });

            it('Thumbnail should be added to the categories object when specified in the configuration', function() {
                var categoriesObj = this.myDashboard._getCategories();
                var thumbnailIdsArr = categoriesObj[this.myDashboardWidgets[0].categories[0]].thumbnails;
                assert.isTrue(_.contains(thumbnailIdsArr, this.myDashboardWidgets[0].thumbnailId), "thumbnail has been added to the right category");
            });

            it('Multiple thumbnails should be added to a category when specified in the configuration', function() {
                var categoriesObj = this.myDashboard._getCategories();
                var thumbnailIdsArr = categoriesObj['category_events'].thumbnails;
                assert.isTrue((thumbnailIdsArr.length == 2), "multiple thumbnails have been added to the same category");
            });

            it('Thumbnail should be not added to the categories object when an invalid category is specified in the configuration', function() {
                var categoriesObj = this.myDashboard._getCategories();
                var thumbnailIdsArr = categoriesObj[this.myDashboardWidgets[2].categories[0]]; //category_invalid
                assert.isTrue((thumbnailIdsArr == undefined), "thumbnail has been not added to the categories object");
            });

            it('All Widgets category should be the first visible option', function() {
                var categoriesDropdown = $(this.myDashboard.el[0]).find('.dashboardThumbnailFilters');
                var firstOption = categoriesDropdown.find('option')[0].value;
                assert.equal(firstOption == 'category_all', true, "All Widgets dropdown is present inside the thumbnail container");
            });

            it('Categories specified in the widget configuration should be visible', function() {
                var categoriesDropdown = $(this.myDashboard.el[0]).find('.dashboardThumbnailFilters');

                var categoryEvents = this.myDashboardWidgets[1].categories[0];
                var eventsDropdown = categoriesDropdown.find("option[value=" + categoryEvents + "]");
                assert.isTrue(eventsDropdown.length == 1, "category_events dropdown is present inside the thumbnail container");

                var categoryIP = this.myDashboardWidgets[1].categories[1];
                var ipDropdown = categoriesDropdown.find("option[value=" + categoryIP + "]");
                assert.isTrue(ipDropdown.length == 1, "category_ip dropdown is present inside the thumbnail container");
            });

            it('The updated category thumbnail should be visible', function() {
                var selectedCategory = this.myDashboardWidgets[0].categories[0];
                this.myDashboard._updateSelectedCategory(selectedCategory);
                var filteredThumbnails = this.myDashboard._filterThumbnails(selectedCategory, '')[0];
                assert.equal(filteredThumbnails.categoryIds[0] == selectedCategory, true, "Filtered thumbnail matches with the selected category");
            });

            it('Search control should be visible and functioning', function() {
                var $searchIcon = $(this.myDashboard.el[0]).find('.search_icon');
                assert.isTrue($searchIcon.length > 0, "search control is present inside the thumbnail container");

                var categoryToFilter = this.myDashboardWidgets[0].categories[0];
                var searchTextToFilter = this.myDashboardWidgets[0].title;
                var filteredThumbnails = this.myDashboard._filterThumbnails(categoryToFilter, searchTextToFilter)[0];
                assert.equal(filteredThumbnails.categoryIds[0] == categoryToFilter, true, "Filtered thumbnail matches with the category");
                assert.equal(filteredThumbnails.title == searchTextToFilter, true, "Filtered thumbnail matches with the title");
            });
        });

        describe('Dashboard Static ID Tests', function() {
            var old_verifyaccess;

            before(function () {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                    return true;
                };

                this.myDashboardContainers = [{
                        id: "Tab1",
                        label: "Tab 1"
                }];

                this.myDashboardWidgets = [{
                    title: "Title 1",
                    size: "single",
                    details: "Details 1",
                    image: new BBView({
                        template: '<div>Content 1</div>'
                    }),
                    sid: "s1",
                    view: BBViewClass,
                    context: activityContext
                },
                {
                    title: "Title 2",
                    size: "single",
                    details: "Details 2",
                    image: new BBView({
                        template: '<div>Content 2</div>'
                    }),
                    view: BBViewClass,
                    context: activityContext
                }];

                this.myDashboard = new Dashboard();

                var containers = this.myDashboardContainers;

                for (var i = 0; i < this.myDashboardWidgets.length; i++) {
                    this.myDashboard.addDashboardWidget(this.myDashboardWidgets[i]);
                }

                this.myDashboard.build({
                    onDone: _.bind(function () {
                        console.log('called onDone back');
                    }, this)
                });

                this.myDashboard._setupDashboardContainers(containers);
                var dashletMdl1 = this.myDashboardWidgets[0];
                var dashletMdl2 = this.myDashboardWidgets[1];

                this.myDashboard._addDashletToContainer(dashletMdl1, this.myDashboardContainers[0].id);
                this.myDashboard._addDashletToContainer(dashletMdl2, this.myDashboardContainers[0].id);
            });

            after(function() {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
            });

            it('All thumbnails must be present on the dashboard whether sid is specified or not specified', function() {
                var numThumbnails = $(this.myDashboard.el[0]).find('.dashboardThumbnail').length;
                assert.isTrue(numThumbnails == this.myDashboardWidgets.length, "thumbnails added match the number of dashboard widgets provided in the configuration");
            });

            it('Thumbnail ID should match the specified sid, when a dashlet is added', function() {
                var numDashlets = this.myDashboard._getNumDashletsInContainer(this.myDashboardContainers[0].id);
                var thumbnailId = "thumbnail_" + this.myDashboardWidgets[0].sid;
                assert.equal(this.myDashboardWidgets[0].thumbnailId == thumbnailId, true, "Dashlet thumbnailId matches the sid string");
            });

        });

	});
});