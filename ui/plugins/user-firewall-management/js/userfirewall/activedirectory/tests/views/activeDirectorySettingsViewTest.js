/**
 * UT for active Directory Settings View
 *
 * @module activeDirectorySettingsViewTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/activeDirectorySettingsView.js'
], function (View, Constants, GridWidgetUtils) {


    describe('Domain settings  View UT', function () {
        var view, getMessage, values, context = new Slipstream.SDK.ActivityContext();
        before(function () {
            view = new View({
                context: context,
                model: new Backbone.Model(),
                wizardView : {}
            });
            view.model.set({'domains':{domain:[{id:123}]}});
            getMessage = sinon.stub(context, 'getMessage', function (value) {
                return value;
            });
        });
        after(function(){
            getMessage.restore();
        });

        it('Checks if the view is created properly', function () {
            view.should.exist;
        });

        it('Checks for updateDomainSettingCollection', function () {
            view.updateDomainSettingCollection();
            view.domainCollection.should.exist;
            view.domainCollection.length.should.be.equal(1);
            view.domainCollection.models[0].attributes.id.should.be.equal(123);
        });

        describe('Render Check',function(){
            var updateDomainSettingCollection, bindGridEvents, addGridData;
            before(function(){
                updateDomainSettingCollection = sinon.stub(view,'updateDomainSettingCollection');
                bindGridEvents= sinon.stub(view,'bindGridEvents');
                addGridData = sinon.stub(view, 'addGridData');
            });
            after(function(){
                updateDomainSettingCollection.restore();
                bindGridEvents.restore();
                addGridData.restore();
            });
            it('Checks for render', function () {
                view.render();
                updateDomainSettingCollection.called.should.be.equal(true);
                bindGridEvents.called.should.be.equal(true);
                addGridData.called.should.be.equal(true);
                var gridContainer = view.$el.find('#active_directory_domain_settings').find(".grid-widget");
                gridContainer.hasClass("elementinput-ldap-server-grid").should.be.equal(true);
            });
        });

        describe('bindGridEvents Check',function() {
            var bind;
            before(function () {
                bind = sinon.stub(view.$el, 'bind');
            });
            after(function () {
                bind.restore();
            });
            it('Checks for bindGridEvents', function () {
                view.bindGridEvents();
                bind.called.should.be.equal(true);
                bind.args[0][0].should.be.equal('addEvent');
                bind.args[1][0].should.be.equal('editEvent');
                bind.args[2][0].should.be.equal('deleteAction');
            });
        });

        describe('onAddDomainSettings Check',function() {
            var buildDomainSettingsOverlay;
            before(function () {
                buildDomainSettingsOverlay = sinon.stub(view, 'buildDomainSettingsOverlay');
            });
            after(function () {
                buildDomainSettingsOverlay.restore();
            });
            it('Checks for onAddDomainSettings', function () {
                view.onAddDomainSettings();
                buildDomainSettingsOverlay.called.should.be.equal(true);
            });
        });

        describe('onEditDomainSettings Check',function() {
            var buildDomainSettingsOverlay;
            before(function () {
                buildDomainSettingsOverlay = sinon.stub(view, 'buildDomainSettingsOverlay');
            });
            after(function () {
                buildDomainSettingsOverlay.restore();
            });
            it('Checks for onEditDomainSettings', function () {
                view.onEditDomainSettings({},'test');
                buildDomainSettingsOverlay.calledWith('test').should.be.equal(true);
            });
        });

        describe('getAllVisibleRows Check',function() {
            var remove, where;
            before(function () {
                view.domainCollection = {remove: function(){},where: function(){}}
                remove = sinon.stub(view.domainCollection, 'remove');
                where = sinon.stub(view.domainCollection, 'where');
            });
            after(function () {
                remove.restore();
                where.restore();
            });
            it('Checks for onDeleteDomainSettings', function () {
                view.onDeleteDomainSettings({}, {deletedRows: [
                    {test: 'test'}
                ]});
                remove.called.should.be.equal(true);
                where.called.should.be.equal(true);
            });
        });

        it('Checks for buildDomainSettingsOverlay', function () {
            var updateOverlayClass = sinon.stub(view, 'updateOverlayClass');
            view.buildDomainSettingsOverlay();
            view.overlay.should.exist;
            updateOverlayClass.called.should.be.equal(true);
            updateOverlayClass.restore();
        });
        it('Checks for updateOverlayClass', function () {
            view.overlay = {getOverlayContainer :function(){ return $("<div></div>")}};
            var getOverlayContainer = sinon.stub(view.overlay, 'getOverlayContainer',function(){ return $("<div></div>")})
            view.updateOverlayClass();
            getOverlayContainer.called.should.be.equal(true);
            getOverlayContainer.restore();

        });

        describe('getAllVisibleRows Check',function() {
            var getAllVisibleRows;
            before(function () {
                getAllVisibleRows = sinon.stub(view.gridWidget, 'getAllVisibleRows');
            });
            after(function () {
                getAllVisibleRows.restore();
            });
            it('Checks for getAllVisibleRows', function () {
                view.getAllVisibleRows();
                getAllVisibleRows.called.should.be.equal(true);
            });
        });

        describe('addGridData Check',function() {
            var addRow;
            before(function () {
                addRow = sinon.stub(view.gridWidget, 'addRow');
            });
            after(function () {
                addRow.restore();
            });
            it('Checks for addGridData', function () {
                view.addGridData([{test:'test'}]);
                addRow.called.should.be.equal(true);
            });
        });

        describe('Checks for getSummary', function(){

            it('Checks getSummary', function () {
                view.model.set({'domains': {'domain':[{'domain-name': "test"}]}});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('grid_column_domain');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('domains');
                resp[1].value.should.be.equal('test');

            });
            it('Checks getSummary', function () {
                view.model.set({'domains': {'domain':[{'domain-name': "test"},{'domain-name':"test1"}]}});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('grid_column_domain');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('domains');
                resp[1].value.should.be.equal('test (+1)');
            });

        })

        it('Checks for getTitle', function () {
            view.getTitle();
            getMessage.calledWith('grid_column_domain').should.be.equal(true);
        });

        describe('beforePageChange Check',function() {
            var getPageData, setdata;
            beforeEach(function () {
                getPageData = sinon.stub(view, 'getPageData', function(){
                    return 'test';
                });
                setdata = sinon.stub(view.model, 'set');
            });
            afterEach(function () {
                getPageData.restore();
                setdata.restore();
            });
            it('Checks for beforePageChange 0', function () {
                view.beforePageChange(2,1).should.be.equal(true);
                getPageData.called.should.be.equal(true);
                setdata.called.should.be.equal(true);
            });
            it('Checks for beforePageChange 1', function () {
                view.domainCollection = {models:[{}]};
                view.beforePageChange().should.be.equal(true);
                getPageData.called.should.be.equal(true);
                setdata.called.should.be.equal(true);
            });
            it('Checks for beforePageChange 2', function () {
                view.domainCollection = {models:[]};
                view.beforePageChange().should.be.equal(false);
                getPageData.called.should.be.equal(true);
                setdata.called.should.be.equal(true);
            });
        });

        it('Checks for getPageData', function () {
            view.domainCollection = {models:[{attributes:'test'}]}
            view.getPageData().domains.domain[0].should.be.equal('test');
        });

    });

});