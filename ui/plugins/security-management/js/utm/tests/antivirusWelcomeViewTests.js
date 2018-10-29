/**
 * Created by honglijin on 7/25/16.
 * AntiVirus Welcome View Unit Test
 */
define([
    '../views/antiVirusWelcomeView.js'
], function (
    atVirusWelcomeView
) {
    describe('AntiVirus Welcome View Unit Tests',function(){
        var activity, context, view = null;
        before(function () {
            activity = new Slipstream.SDK.Activity();
            context = new Slipstream.SDK.ActivityContext();
        });
        after(function(){
        });
        beforeEach(function() {
            view = new atVirusWelcomeView({
                activity: activity,
                context:context,
                title:'for test'
            });
        });
        afterEach(function(){
            view = null;
        });
        
        it('Welcome view should exist', function(){
            view.should.exist;
        });
        
        it('Render welcome View', function(){
            view.render();
            var htmlStr = view.$el.find('.wizard_intro_page_content').html();
            htmlStr.should.include('[utm_antivirus_profile_welcome_text]');
            htmlStr.should.include('[utm_antivirus_profile_welcome_purpose]');
            htmlStr.should.include('[utm_antivirus_profile_welcome_usage]');
        });

        it('Get the title of welcome view', function(){
            var title = view.getTitle();
            title.should.equal('for test');
        });

        it('Get the description of welcome view', function(){
            var desp = view.getDescription();
            desp.should.equal('');
        });
    });
});