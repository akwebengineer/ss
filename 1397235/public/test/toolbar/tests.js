define(function() {
	describe('Set the logo in the toolbar', function() {
		before(function() {
			var logo_area = '<a class="slipstream-product-logo" href="#"><img src="foo.jpg" style="height: 10px; width:10px;"></a>';

			var main_content = $("#main_content");
			main_content.append(logo_area);
		});

		after(function() {
			$("#main_content .slipstream-product-logo").remove();
		});

		it('View should be rendered into logo section of toolbar', function() {
            var logoViewClass = Backbone.View.extend({
            	className: "logo_template",
            	render: function() {
            		var template = "<span>My Company Logo</span>"
            		this.$el.append(template);
            	}
            });

            Slipstream.commands.execute("ui:logo:set", new logoViewClass());
            var logo = $(".slipstream-product-logo").children()[0];
            
            assert.isTrue($(logo).hasClass("logo_template"));
		})
	});
});