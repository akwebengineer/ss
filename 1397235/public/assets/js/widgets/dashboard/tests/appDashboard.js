/**
 * A view that uses the Dashboard widget to display widgets
 *
 * @module Dashboard View
 * @author Kiran Kashalkar
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/dashboard/dashboard',
    'widgets/form/formWidget',
    'widgets/dashboard/tests/testEditFormConf',
    'text!widgets/dashboard/tests/templates/dashboardExample.html',
    'lib/template_renderer/template_renderer'
], function(Backbone, Dashboard, FormWidget, formConf,example, render_template){

    // Always return true for verifyAccess.
    // This is a workaround to get the dashboard test page to load without having to login
    Slipstream.SDK.RBACResolver.prototype.verifyAccess = function(capabilities) {
        return true;
    }

    var BBView = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });

    var MyTestView1 = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        template: '<div class="sample-dashlet">Sample Widget<br><img src="/assets/images/icon_dashboard_zero_state.svg"><div>',
        moreDetails: function () {
            console.log('More details link for Test 1 clicked');
        },
        refresh: function (done, proposedModel) {
            setTimeout(function() {
                done();
            }, 2000);
        },
        getCustomInitData: function () {
            console.log('MyTestView1 getCustomInitData called');            
        },
        getData: function (done) {
            console.log('MyTestView1 getData called');
            done();
        },
        close: function () {
            console.log('MyTestView1 close called');
            //abort xhr request if pending.
        }

    });

    var MyTestView2 = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        template: '<div class="sample-dashlet">Sample Widget<br><img src="/assets/images/icon_dashboard_zero_state.svg"></div>',
        refresh: function(done, proposedModel) {
            setTimeout(function() {
                done();
            }, 2000);
        },
        moreDetails: function () {
            console.log('More details link for Test 2 clicked');
        },
        getData: function (done) {
            console.log('MyTestView2 getData called');
            done();
        },
        close: function () {
            console.log('MyTestView2 close called');
            //abort xhr request if pending.
        }
    });

    var MyTestView3 = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        template: '<div class="sample-dashlet">Sample Widget<br><img src="/assets/images/icon_dashboard_zero_state.svg"></div>',
        refresh: function(done, proposedModel) {
            setTimeout(function() {
                done(new Error('Error refreshing MyTestView3'));
            }, 2000);
        },
        moreDetails: function () {
            console.log('More details link for Test 3 clicked');
            window.location.href = 'http://google.com';
        },
        getData: function (done) {
            console.log('MyTestView3 getData called');
            done();
        },
        close: function () {
            console.log('MyTestView3 close called');
            //abort xhr request if pending.
        }
    });

    var TestEditView = Backbone.View.extend({
        initialize: function() {
            this.size = this.options.size;
            this.customInitData = this.options.customInitData;
            this.formWidget = new FormWidget({
                'elements': formConf.formSections,
                'container': this.el
            });
            return this;
        },

        render: function(settings) {
            this.formWidget.build();

            // set form elements to match stored settings
            this.toggleSelection(this.$el, this.customInitData, 'chartType');
            this.toggleSelection(this.$el, this.customInitData, 'auto_refresh');
            this.toggleSelection(this.$el, this.customInitData, 'show_top');

            return this;
        },

        /**
         * Set dropdown box to stored selection
         */
        toggleSelection: function(el, data, id) {
            if (data && data.hasOwnProperty(id)) {
                el.find('#' + id).val(data[id]);
            }
        },

        /**
         * Serialize data for consumption by framework edit-view
         */
        serialize: function() {
            var type = 'BAR',
                showTop = 10,
                autoRefresh = 30,
                size = 'double',
                values = this.formWidget.getValues();

            for (var ii = 0; ii < values.length; ii++) {
                switch (values[ii].name) {
                    case 'chartType':
                        type = values[ii].value;
                        size = formConf.chartTypeSizeMapping[type];
                        break;
                    case 'auto_refresh':
                        autoRefresh = values[ii].value;
                        break;
                    case 'show_top':
                        showTop = values[ii].value;
                        break;
                    default:
                        break;
                }
            }
            return {
                'size': size,
                'customInitData': {
                    'chartType': type,
                    'show_top': showTop,
                    'auto_refresh': autoRefresh
                }
            };
        }
    });

    var DashboardView = Backbone.View.extend({

        initialize: function () {
            //this.addContent(this.$el, example);
            this.dashboard = new Dashboard({
                container: '#dashboard_test_content'
            });

            var pluginContext = {
                ctx_name: '',
                ctx_root: ''
            };

            var self = this;
            self.dashboard.addDashboardWidget({
                title: 'Test 1',
                size: 'single',
                details: 'Test',
                categories: ["category_events"],
                image: new BBView({
                    template: '<div><img src="/assets/images/dashboard/testApp/thumbnail1.svg"></div>'
                }),
                view: MyTestView1,
                context: pluginContext,
                customEditView: TestEditView
            });

            self.dashboard.addDashboardWidget({
                title: 'Test 2',
                size: 'double',
                details: 'Test',
                categories: ["category_ip"],
                image: new BBView({
                    template: '<div><img src="/assets/images/dashboard/testApp/thumbnail2.svg"></div>'
                }),
                view: MyTestView2,
                context: pluginContext,
                customEditView: TestEditView
            });


            self.dashboard.addDashboardWidget({
                title: 'Test 3',
                size: 'single',
                details: 'Test',
                categories: ["category_events"],
                image: new BBView({
                    template: '<div><img src="/assets/images/dashboard/testApp/thumbnail3.svg"></div>'
                }),
                view: MyTestView3,
                context: pluginContext,
                customEditView: TestEditView
            });

            self.render();
        },

        render: function () {
            var self = this;
            self.dashboard.build({
                dashboard_title: '',
                onDone: _.bind(function() {
                    console.log('called onDone back');
                }, this)
            });

            return this;
        },

        close: function() {
            this.dashboard.destroy();
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        }
    });

    return DashboardView;
});
