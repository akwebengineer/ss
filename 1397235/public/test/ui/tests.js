define(function() {
    describe("Test the ability to get/set the visibility of the secondary nav", function() {
    	 it('set/get the secondary nav visibility', function(done) {
    	 	 Slipstream.vent.on("ui:afterShow", function() {
    	 	 	 // Attempt to make the secondary nav visible
                 Slipstream.SDK.UI.setSecondaryNavigationVisibility(true);
                 /**
                  * Since there are no plugins available there are no secondary nav elements
                  * available and so the secondary nav will not become visible.
                  */
                 assert.isFalse(Slipstream.SDK.UI.getSecondaryNavigationVisibility());

                 // hide the secondary nav
                 Slipstream.SDK.UI.setSecondaryNavigationVisibility(false);
                 /**
                  * The nav is already hidden and it should stay hidden.
                  */
                 assert.isFalse(Slipstream.SDK.UI.getSecondaryNavigationVisibility());

                 done();
    	 	 });

    	 	 Slipstream.UI.render(false);
    	 })
    })	
})