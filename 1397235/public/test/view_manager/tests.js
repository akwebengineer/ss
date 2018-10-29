define(['marionette'], function(Marionette) {
	describe('View Adapter Unit Tests', function() {
		it("callbacks must be called in correct order", function() {
	    	var close_called,
	            before_render_called,
	            after_render_called,
	            before_close_called,
	            after_close_called,
	            render_called;

	    	function initFlags() {
                close_called = false;
		        before_render_called = false;
		        after_render_called = false;
		        before_close_called = false;
		        after_close_called = false;
		        render_called = false;
	    	}

	        var MyView = function() {
	        	this.$el = $("<div>");
	        	this.el = this.$el[0];

	        	this.render = function() {
	        		assert(before_render_called == true, 'before_render must be called before render');
	        	    render_called = true;
                    this.$el.append("<span id='foo'></span>");
	        	}

	        	this.close = function() {
	        		assert(before_close_called == true, 'before_close must be called before close');
                    close_called = true;
	        	}

	        	this.beforeRender = function() {
	        		before_render_called = true;
	        	}

	        	this.afterRender = function() {
	        		assert(before_render_called == true, "beforeRender must be called before afterRender");
	        		assert(render_called == true, "render must be called before afterRender");
	        		after_render_called = true;
	        	}

	        	this.beforeClose = function() {
	        		assert(close_called == false, "beforeClose must be called before close");
	        		assert(after_close_called == false, "beforeClose must be called before afterClose");
	        		before_close_called = true;
	        	}

	        	this.afterClose = function() {
	        		assert(before_close_called == true, "beforeClose must be called before afterClose");
	        		after_close_called = true;
	        	}
	        }

	        initFlags();

            var myView = new MyView();
            var myView2 = new MyView();

            Slipstream.vent.trigger("view:render", myView);
            assert(render_called == true, "render must be called");
            assert(before_render_called == true, "beforeRender must be called");
            assert(after_render_called == true, "afterRender must be called");

            initFlags();

            Slipstream.vent.trigger("view:render", myView2); // re-render to test close callbacks
            assert(after_close_called == true, "afterClose must be called");
            assert(before_close_called == true, "beforeClose must be called");
            assert(close_called == true, "close must be called");

            initFlags();
		});	
        
        it('Test that content pane titles are correctly set', function() {
            var container = $("<div id='title-test-div'></div>");
        	container.append("<div id='slipstream-content-title-region'></div>");
        	container.append("<div id='slipstream_ui'><section class='slipstream-logo-section'><a class='slipstream-product-logo'></a><span class='slipstream-title-bar-title'></span></section></div>");
        	$('body').append(container);

            Slipstream.addRegions({"contentTitleRegion": "#slipstream-content-title-region"});

        	Slipstream.vent.trigger("view:render", new Marionette.ItemView({
        		template: "<div></div>"
        	}));
        	var titleDiv = $("#slipstream-content-title-region .slipstream-page-title");

        	assert.isUndefined(titleDiv[0]);

        	Slipstream.vent.trigger("view:render", new Marionette.ItemView({
        		template: "<div></div>",
        	}), 
        	{
        		"title": {
        		    "content": "A Page Title",
	        		"help": {
	        			"content": "some title help content",
	        			"ua-help-text": "some link text",
	        			"ua-help-identifier": "some_help_id"
	        		}
	        	}
        	});

        	titleDiv = $("#slipstream-content-title-region .slipstream-page-title");
        	assert.isDefined(titleDiv[0]);
        	assert.equal($.trim(titleDiv.text()), "A Page Title");

            titleHelp = titleDiv.find(".ua-field-help");
        	assert.isDefined(titleHelp[0]);
        	assert.equal(titleHelp.attr("data-ua-id"), "some_help_id");

            // no title bar title has been provided
        	titleBarTitle = $(".slipstream-title-bar-title");
        	assert.equal(titleBarTitle.html(), "");

        	// logo should be visible
        	logo = $(".slipstream-product-logo");
        	assert.notEqual(logo.css("display"), "none");

            // Render a view without a title, title region should be cleared.
        	Slipstream.vent.trigger("view:render", new Marionette.ItemView({
        		template: "<div></div>",
        	}));

        	titleDiv = $("#slipstream-content-title-region .slipstream-page-title");
        	assert.isUndefined(titleDiv[0]);

        	// Render a view without a page title but with a title bar title
        	Slipstream.vent.trigger("view:render", new Marionette.ItemView({
        		template: "<div></div>",
        	}), 
        	{
        		"title": {
        		    "titlebar": "Some title"
	        	}
        	});

        	// title bar title should be set
        	titleBarTitle = $(".slipstream-title-bar-title");
        	assert.equal(titleBarTitle.html(), "Some title");

        	// logo should be hidden
        	assert.equal(logo.css("display"), "none");

            container.remove();
        });

        it('Test that right header view is correctly set', function() {
            var container = $("<div id='title-test-div'></div>");
            container.append("<div id='slipstream-content-title1-region'></div>");
            container.append("<div id='slipstream-content-right-header1-region'></div>");
            
            $('body').append(container);

            Slipstream.addRegions({"contentTitleRegion": "#slipstream-content-title1-region", "rightHeaderContentRegion": "#slipstream-content-right-header1-region"});

            // If content-title-region is not there, right header shouldn't be set
            Slipstream.vent.trigger("view:render", new Marionette.ItemView({
                template: "<div></div>"
            }));

            Slipstream.vent.trigger("rightHeader:content:set", 'Right Header Title');

            var headerDiv = $("#slipstream-content-right-header1-region .slipstream-page-right-header");
            assert.isUndefined(headerDiv[0]);

            // Set content-title-region
            Slipstream.vent.trigger("view:render", new Marionette.ItemView({
                template: "<div></div>",
            }), 
            {
                "title": {
                    "content": "A Page Title",
                    "help": {
                        "content": "some title help content",
                    }
                }
            });

            // Set right header
            Slipstream.vent.trigger("rightHeader:content:set", 'Right Header Title');

            headerDiv = $("#slipstream-content-right-header1-region .slipstream-page-right-header");

            assert.isDefined(headerDiv[0]);

            assert.equal($.trim(headerDiv.text()), "Right Header Title");

            container.remove();
        });
	});
});