/**
 * UT for Access Profile LDAP Server Grid View
 *
 * @module ldapGridViewTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/ldapGridView.js'
], function (LdapGridView ) {

    var view, parentView, getMessage, context = new Slipstream.SDK.ActivityContext();


    describe('Access Profile LDAP Server Grid view UT', function () {

        before(function () {

            parentView = {
                $el:{
                    find: function(){
                        return {
                            empty: function(){
                                return $('<span id="access_profile_ldap_server"></span>')
                            }
                        };
                    },
                    bind: function(){

                    }
                }
            };
            view = new LdapGridView({
                context: context,
                parentView: parentView

            });
            getMessage = sinon.stub(context, 'getMessage');
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access Profile LDPA Server grid view object is created properly', function () {
            view.should.exist;
        });
        describe('Access Profile LDAP Server', function () {
            var bindGridEvents;
            before(function () {
                bindGridEvents = sinon.stub(view, 'bindGridEvents');
            });

            after(function () {
                bindGridEvents.restore();
            });
            it('Checks buildGrid', function () {
                view.buildGrid();
                bindGridEvents.called.should.be.equal(true);
            });
        });

        describe('Access Profile LDAP Server', function () {
            var bind;
            before(function () {
                bind = sinon.stub(parentView.$el, 'bind');
            });

            after(function () {
                bind.restore();
            });
            it('Checks bindGridEvents', function () {
                view.bindGridEvents();
                bind.called.should.be.equal(true);
            });
        });

        describe('Access Profile LDAP Server', function () {
            var buildLdapServerOverlay;
            before(function () {
                buildLdapServerOverlay = sinon.stub(view, 'buildLdapServerOverlay');
            });

            after(function () {
                buildLdapServerOverlay.restore();
            });

            it('Checks onAddLdapServer', function () {
                view.onAddLdapServer();
                buildLdapServerOverlay.called.should.be.equal(true);
            });
        });

        describe('Access Profile LDAP Server', function () {
            var buildLdapServerOverlay;
            before(function () {
                buildLdapServerOverlay = sinon.stub(view, 'buildLdapServerOverlay');
            });

            after(function () {
                buildLdapServerOverlay.restore();
            });
            it('Checks onEditLdapServer', function () {
                view.onEditLdapServer();
                buildLdapServerOverlay.called.should.be.equal(true);
            });
        });

         describe('Access Profile LDAP Server', function () {

             it('Checks buildLdapServerOverlay', function () {
                view.buildLdapServerOverlay();
                 view.overlay.should.exist;
             });
         });

        describe('Access Profile LDAP Server', function () {
            var getAllVisibleRows;
            before(function () {
                view.gridWidget = {
                    getAllVisibleRows: function(){

                    }
                };
                getAllVisibleRows = sinon.stub(view.gridWidget, 'getAllVisibleRows');
            });

            after(function () {
                getAllVisibleRows.restore();
            });
            it('Checks getAllVisibleRows', function () {
                view.getAllVisibleRows();
                getAllVisibleRows.called.should.be.equal(true);
            });
        });

        describe('Access Profile LDAP Server', function () {

            var addRow;
            before(function () {
                view.gridWidget = {
                    addRow: function(){

                    }
                };
                addRow = sinon.stub(view.gridWidget, 'addRow');
            });

            after(function () {
                addRow.restore();
            });
            it('Checks addGridData with data', function () {
                view.addGridData({'name':'test'});
                addRow.called.should.be.equal(true);
            });
            it('Checks addGridData without data', function () {
                view.addGridData();
                addRow.called.should.be.equal(true);
            });

        });

    });
});