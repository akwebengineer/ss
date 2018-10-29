define(["../../../../event-viewer/js/eventviewer/views/exportCSVView.js"], 
    function(ExportCSVView) {

    var activity = new Slipstream.SDK.Activity();

    describe("Menu handler unit tests", function() {
        
        it("Export CSV", function(){
            exportCSVView = new ExportCSVView({
                context: new Slipstream.SDK.ActivityContext(), 
                activity: activity,
                filePath : ""
            });
            exportCSVView.render();

            e = {
                preventDefault: sinon.spy()
            };  
            activity.exportCSVWidget = {
                destroy: sinon.spy()
            }
            exportCSVView.destroyOverlay(e);
        });
    });
});