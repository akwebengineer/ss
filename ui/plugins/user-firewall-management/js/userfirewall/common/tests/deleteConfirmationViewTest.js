/**
 * UT for delete Confirmation view
 *
 * @module deleteConfirmationViewTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../views/deleteConfirmationView.js'
], function (View) {

    var view, getMessage, context = new Slipstream.SDK.ActivityContext();
    describe('Base Profile Wizard view UT', function () {

        before(function () {

            view = new View({
                context: context,
                question: "",
                title: "",
                activity: {deleteOverlay: { destroy: function(){}}},
                callBack: function(){}
            });

            getMessage = sinon.stub(context, 'getMessage', function (value) {
                return value;
            });

        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the delete confiramtion view object is created properly', function () {
            view.should.exist;
        });
        it('Checks render', function () {
            view.render();
            view.form.should.exist;
        });
        it('Checks submit', function () {
            var createConfirmationDialog =  sinon.stub(view, 'createConfirmationDialog');
            view.submit();
            createConfirmationDialog.called.should.be.equal(true);
            createConfirmationDialog.restore();
        });

        it('Checks closeView', function () {
            var destroy =  sinon.stub(view.conf.activity.deleteOverlay, 'destroy');
            view.closeView({preventDefault:function(){}});
            destroy.called.should.be.equal(true);
            destroy.restore();
        });

        it('Checks createConfirmationDialog 0', function () {
            view.createConfirmationDialog(true);
            view.confirmationDialogWidget.should.exist;
        });
        it('Checks createConfirmationDialog 1', function () {
            view.createConfirmationDialog(false);
            view.confirmationDialogWidget.should.exist;
        });
    });
});