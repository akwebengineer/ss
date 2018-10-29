/**
 * UT for Access Profile LDAP Server Grid View
 *
 * @module ldapGridViewTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/ldapServerFormView.js'
], function (View ) {

    var view,  getMessage, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();


    describe('Access Profile LDAP Server Form view UT', function () {

        before(function () {

            activity.context = context;
            view = new View({
                activity: activity,
                rowData:{'name':'test'}

            });
            getMessage = sinon.stub(context, 'getMessage');
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access Profile LDPA Server Form view object is created properly', function () {
            view.should.exist;
        });
        describe('Access Profile LDAP Server Form view UT', function () {
            var addDynamicFormConfig;
            before(function () {
                view = new View({
                    activity: activity

                });
                addDynamicFormConfig = sinon.stub(view, 'addDynamicFormConfig');
            });

            after(function () {
                addDynamicFormConfig.restore();
            });
            it('Checks render with add mode', function () {
                view.render();
                addDynamicFormConfig.called.should.be.equal(true);
            });
            it('Checks render with edit mode', function () {
                view.rowData = {'name':'test'};
                view.render();
                addDynamicFormConfig.called.should.be.equal(true);
            });
        });

        describe('Access Profile LDAP Server Form view UT ', function () {
            var conf = {title:'Test'};
            it('Checks addDynamicFormConfig with add mode', function () {
                view.formMode = undefined;
                view.addDynamicFormConfig(conf);
            });
            it('Checks addDynamicFormConfig with edit mode', function () {
                view.formMode = 'EDIT';
                view.addDynamicFormConfig(conf);
            });
        });
        describe('Access Profile LDAP Server Form view UT ', function () {
            var destroy;
            before(function () {
                view['activity']['overlay']= {
                    destroy:function(){}
                };
                destroy = sinon.stub(view.activity.overlay, 'destroy')
            });

            after(function () {
                destroy.restore();
            });
            it('Checks cancel', function () {
                view.cancel();
                destroy.called.should.be.equal(true);
            });

        });
        describe('Access Profile LDAP Server Form view UT with validForm', function () {
            var cancel, isValidInput, addRow, editRow;
            before(function () {
                view['activity']['gridWidget'] ={
                    editRow: function(){
                    },
                    addRow: function(){

                    },
                    getAllVisibleRows: function(){
                        return {length:0};
                    }
                };
                cancel = sinon.stub(view, 'cancel');
                editRow = sinon.stub(view.activity.gridWidget, 'editRow');
                addRow = sinon.stub(view.activity.gridWidget, 'addRow');
                isValidInput = sinon.stub(view.form, 'isValidInput', function(){return true;});

            });

            after(function () {
                cancel.restore();
                isValidInput.restore();
            });
            it('Checks submit add mode', function () {
                view.formMode = undefined;

                view.submit();
                isValidInput.called.should.be.equal(true);
                addRow.called.should.be.equal(true);
                cancel.called.should.be.equal(true);
            });
            it('Checks submit edit mode', function () {
                view.formMode = 'EDIT';
                view.submit();
                isValidInput.called.should.be.equal(true);
                editRow.called.should.be.equal(true);
                cancel.called.should.be.equal(true);
            });

        });
        describe('Access Profile LDAP Server Form view UT with inValidForm', function () {
            var cancel, isValidInput;
            before(function () {
                cancel = sinon.stub(view, 'cancel');
                isValidInput = sinon.stub(view.form, 'isValidInput', function(){return false;});

            });

            after(function () {
                cancel.restore();
                isValidInput.restore();
            });
            it('Checks submit', function () {
                view.submit();
                isValidInput.called.should.be.equal(true);
                cancel.called.should.be.equal(false);
            });

        });

        describe('Access Profile LDAP Server Form view UT with validForm : 1 ', function () {
            var cancel, isValidInput, addRow, editRow, syphon;
            before(function () {
                view['activity']['gridWidget'] = {
                    editRow: function () {
                    },
                    addRow: function () {

                    },
                    getAllVisibleRows: function () {
                        return [
                            {address: 'test'}
                        ];
                    }
                };
                cancel = sinon.stub(view, 'cancel');
                editRow = sinon.stub(view.activity.gridWidget, 'editRow');
                addRow = sinon.stub(view.activity.gridWidget, 'addRow');
                isValidInput = sinon.stub(view.form, 'isValidInput', function () {
                    return true;
                });
                syphon = sinon.stub(view.syphon, 'serialize', function () {
                    return {address: 'test'};
                });

            });

            after(function () {
                cancel.restore();
                isValidInput.restore();
                syphon.restore();
            });
            it('Checks submit add mode', function () {
                view.formMode = undefined;

                view.submit();
                isValidInput.called.should.be.equal(true);
                addRow.called.should.be.equal(false);
                cancel.called.should.be.equal(false);
            });
        });
        describe('Access Profile LDAP Server Form view UT with validForm : 1 ', function () {
            var cancel, isValidInput, addRow, editRow, syphon;
            before(function () {
                view['activity']['gridWidget'] ={
                    editRow: function(){
                    },
                    addRow: function(){

                    },
                    getAllVisibleRows: function(){
                        return [{address:'test'},{address:'test'}];
                    }
                };
                cancel = sinon.stub(view, 'cancel');
                editRow = sinon.stub(view.activity.gridWidget, 'editRow');
                addRow = sinon.stub(view.activity.gridWidget, 'addRow');
                isValidInput = sinon.stub(view.form, 'isValidInput', function () {
                    return true;
                });
                syphon = sinon.stub(view.syphon, 'serialize', function () {
                    return {address: 'test'};
                });

            });

            after(function () {
                cancel.restore();
                isValidInput.restore();
                syphon.restore();
            });

            it('Checks submit edit mode', function () {
                view.formMode = 'EDIT';

                view.submit();
                isValidInput.called.should.be.equal(true);
                editRow.called.should.be.equal(false);
                cancel.called.should.be.equal(false);
            });

        });

    });
});