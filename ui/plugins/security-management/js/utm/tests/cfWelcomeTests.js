define([
    '../../../../security-management/js/utm/views/contentFilteringWelcomeView.js'
], function(
        contentFilteringWelcomeView
) {

    describe("contentFilteringWelcomeView unit-tests", function() {
                var view = null, intent, model = null;
                var context = new Slipstream.SDK.ActivityContext();
                var activity = new Slipstream.SDK.Activity();

                before(function() {
                    view = new contentFilteringWelcomeView({
                        activity: activity,
                        context:context,
                        title:''
                    });
                });

                after(function() {
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
