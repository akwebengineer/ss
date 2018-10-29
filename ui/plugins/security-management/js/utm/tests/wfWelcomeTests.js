define([
    '../../../../security-management/js/utm/views/webFilteringWelcomeView.js'
], function(
		webFilteringWelcomeView
) {

    var activity = new Slipstream.SDK.Activity();

    describe("webFilteringWelcomeView unit-tests", function() {

        describe("View tests", function() {
                var view = null, intent, model = null;
                var context = new Slipstream.SDK.ActivityContext();

                beforeEach(function() {
                    view = new webFilteringWelcomeView({
                        activity: activity,
                        context:context,
                        title:''
                    });
                });

                afterEach(function() {
                });

                it("view should exist", function() {
                    view.should.exist;
                });

                it("view can be rendered successfully", function() {
                    var getMessage = sinon.stub(context, "getMessage", function(msg) {return msg; })
                    view.render();

                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    expect($("div.wizard_intro_page_content")).to.have.lengthOf(1);
                    getMessage.restore();
                });

                it("view getTitle function works fine", function() {
                    var title = view.getTitle();
                    title.should.be.equal('');
                });
                
                it("view getDescription function works fine", function() {
                	var description = view.getDescription();
                	description.should.be.equal('');
                });

            });
    });
});