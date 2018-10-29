/**
 * UT for active Directory Settings View
 *
 * @module activeDirectorySettingsViewTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/activeDirectoryDomainSettingFormView.js',
    'backbone.syphon'
], function (View, Syphon) {


    describe('Domain settings Form View UT', function () {
        var view, getMessage, values, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();
        before(function () {
            activity.context = context;
            activity.domainCollection = {where: function () {
                return [new Backbone.Model()]
            }};
            view = new View({
                activity: activity,
                context: context,
                rowData: {originalRow: {}},
                model: new Backbone.Model(),
                wizardView: {}
            });
            getMessage = sinon.stub(context, 'getMessage', function (value) {
                return value;
            });
        });
        after(function () {
            getMessage.restore();
        });

        it('Checks if the view is created properly', function () {
            view.should.exist;
        });
        describe('Handle render', function () {
            var addRemoteNameValidation, addDynamicFormConfig, addSubsidiaryFunctions, updateFormElements, bindValidationHandler, setModelAttributes;
            before(function () {
                addRemoteNameValidation = sinon.stub(view, 'addRemoteNameValidation');
                addDynamicFormConfig = sinon.stub(view, 'addDynamicFormConfig');
                addSubsidiaryFunctions = sinon.stub(view, 'addSubsidiaryFunctions');
                updateFormElements = sinon.stub(view, 'updateFormElements');
                bindValidationHandler = sinon.stub(view, 'bindValidationHandler');
                setModelAttributes = sinon.stub(view, 'setModelAttributes');
            });
            after(function () {
                addRemoteNameValidation.restore()
                addDynamicFormConfig.restore()
                addSubsidiaryFunctions.restore()
                updateFormElements.restore()
                bindValidationHandler.restore()
                setModelAttributes.restore()
            });
            it('Checks if the view is created properly 1', function () {
                view.rowData = undefined;
                view.render();
                addRemoteNameValidation.called.should.be.equal(true);
                addDynamicFormConfig.called.should.be.equal(true);
                addSubsidiaryFunctions.called.should.be.equal(true);
                updateFormElements.called.should.be.equal(true);
                bindValidationHandler.called.should.be.equal(true);
                setModelAttributes.called.should.be.equal(true);
            });
            it('Checks if the view is created properly 2', function () {
                view.rowData = {originalRow: {}};
                view.render();
                addRemoteNameValidation.called.should.be.equal(true);
                addDynamicFormConfig.called.should.be.equal(true);
                addSubsidiaryFunctions.called.should.be.equal(true);
                updateFormElements.called.should.be.equal(true);
                bindValidationHandler.called.should.be.equal(true);
                setModelAttributes.called.should.be.equal(true);
            });

        });

        describe('Handle addDynamicFormConfig', function () {

            it('Checks for addDynamicFormConfig 1', function () {
                view.addDynamicFormConfig({});
                getMessage.calledWith('active_directory_domain_settings_modify').should.be.equal(true);
            });
            it('Checks for addDynamicFormConfig 2', function () {
                view.formMode = view.MODE_CREATE;
                view.addDynamicFormConfig({});
                getMessage.calledWith('active_directory_domain_settings_add').should.be.equal(true);
            });

        });

        describe('Handle bindValidationHandler', function () {

            it('Checks for bindValidationHandler 1', function () {
                view.bindValidationHandler();
            });

        });
        describe('Handle setModelAttributes', function () {
            var addRow1, addRow2;
            beforeEach(function(){
                addRow1 = sinon.stub(view.domainControllerGridView.gridWidget, 'addRow');
                addRow2 = sinon.stub(view.domainLDAPGridView.gridWidget, 'addRow');
            });
            afterEach(function(){
                addRow1.restore();
                addRow2.restore();
            });
            it('Checks for setModelAttributes 0', function () {
                view.rowData = undefined;
                view.setModelAttributes();
                addRow1.called.should.be.equal(false);
                addRow2.called.should.be.equal(false);
            });
            it('Checks for setModelAttributes 1', function () {
                view.rowData = {
                    originalRow : {}
                };
                view.setModelAttributes();
                addRow1.called.should.be.equal(false);
                addRow2.called.should.be.equal(false);
            });
            it('Checks for setModelAttributes 2', function () {
                view.rowData = {
                    originalRow : {
                        'use-ssl': true,
                        'authentication-algorithm': true,
                        'domain-controllers': {
                            'domain-controller': [
                                {}
                            ]
                        },
                        'ldap-addresses': {
                            'ldap-address': [
                                {}
                            ]
                        }
                    }
                };
                view.setModelAttributes();
                addRow1.called.should.be.equal(true);
                addRow2.called.should.be.equal(true);

            });

        });
        describe('Handle closeOverlay', function () {
            var destroy;
            before(function () {
                view.activity.overlay = {destroy: function () {
                }};
                destroy = sinon.stub(view.activity.overlay, 'destroy');
            });
            after(function () {
                destroy.restore();
            });
            it('Checks for closeOverlay', function () {
                view.closeOverlay();
                destroy.called.should.be.equal(true);
            });

        });
        describe('Handle submit', function () {
            var closeOverlay, removeErrorInfo, getAllVisibleRows, isDomainContollerAndLdapGridInvalid;
            beforeEach(function () {
                closeOverlay = sinon.stub(view, 'closeOverlay');
                removeErrorInfo = sinon.stub(view, 'removeErrorInfo');
                view.activity.gridWidget = {
                    editRow: function () {
                    },
                    addRow: function () {
                    }
                };
                getAllVisibleRows = sinon.stub(view.domainLDAPGridView.gridWidget, 'getAllVisibleRows', function(){
                    return [{}];
                });

            });
            afterEach(function () {
                closeOverlay.restore();
                removeErrorInfo.restore();
                getAllVisibleRows.restore();
                isDomainContollerAndLdapGridInvalid.restore();
            });
            it('Checks for submit 0', function () {
                view.activity.domainCollection.where = function () {
                    return {length: 3};
                };
                view.formMode = view.MODE_CREATE;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return false})
                view.submit();
                closeOverlay.called.should.be.equal(false);
            });
            it('Checks for submit 0/1', function () {
                view.activity.domainCollection.where = function () {
                    return {length: 3};
                };
                view.formMode = view.MODE_EDIT;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return true})
                view.submit();
                closeOverlay.called.should.be.equal(false);
            });

            it('Checks for submit 1', function () {
                view.activity.domainCollection.where = function () {
                    return {length: 3};
                };
                view.formMode = view.MODE_EDIT;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return false})
                var find = sinon.stub(view.$el, 'find', function () {
                        return {
                            closest: function(){ return {addClass:function(){}}},
                            siblings: function(){ return {show:function(){ return {text: function(){}}}}},
                            find: function () {
                                return {
                                    length: 3
                                }
                            }
                        }
                    }),
                    getPageData = sinon.stub(view, 'getPageData', function () {
                        return{'base-dn':""}
                    }),
                    isValidInput = sinon.stub(view.formWidget, 'isValidInput');
                view.submit();
                getPageData.called.should.be.equal(true);
                isValidInput.called.should.be.equal(true);
                closeOverlay.called.should.be.equal(false);
                isValidInput.restore();
                find.restore();
                getPageData.restore();
            });
            it('Checks for submit 2', function () {
                view.activity.domainCollection.where = function () {
                    return {length: 3};
                };
                view.formMode = view.MODE_EDIT;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return false})
                var find = sinon.stub(view.$el, 'find', function (val) {
                        return {
                            closest: function(){ return {addClass:function(){}}},
                            siblings: function(){ return {show:function(){ return {text: function(){}}}}},
                            prop: function () {
                                if (val === '#event_log_scanning') {
                                    return true;
                                }
                            },
                            val: function () {
                                return {}
                            },

                            find: function () {
                                return {

                                    length: 0
                                }
                            }

                        }
                    }),
                    getPageData = sinon.stub(view, 'getPageData', function () {
                        return{}
                    }),
                    isValidInput = sinon.stub(view.formWidget, 'isValidInput');

                view.submit();

                getPageData.called.should.be.equal(true);
                isValidInput.called.should.be.equal(true);
                closeOverlay.called.should.be.equal(false);
                isValidInput.restore();
                find.restore();
                getPageData.restore();
            });
            it('Checks for submit 3', function () {
                view.activity.domainCollection.where = function () {
                    return {length: 3};
                };
                view.formMode = view.MODE_EDIT;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return false})
                var find = sinon.stub(view.$el, 'find', function (val) {
                        return {
                            closest: function(){ return {addClass:function(){}}},
                            siblings: function(){ return {show:function(){ return {text: function(){}}}}},
                            prop: function () {
                                if (val === '#initial_event_log_timestamp') {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            },
                            val: function () {
                            },

                            find: function () {
                                return {
                                    length: 0
                                }
                            }
                        }
                    }),
                    getPageData = sinon.stub(view, 'getPageData', function () {
                        return{base:"rest"}
                    }),
                    isValidInput = sinon.stub(view.formWidget, 'isValidInput');

                view.submit();

                getPageData.called.should.be.equal(true);
                isValidInput.called.should.be.equal(true);
                closeOverlay.called.should.be.equal(false);
                isValidInput.restore();
                find.restore();
                getPageData.restore();
            });
            it('Checks for submit 3/1', function () {
                view.activity.domainCollection.where = function () {
                    return {length: 3};
                };
                view.formMode = view.MODE_EDIT;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return false})
                var find = sinon.stub(view.$el, 'find', function (val) {
                        return {
                            closest: function(){ return {addClass:function(){}}},
                            siblings: function(){ return {show:function(){ return {text: function(){}}}}},
                            prop: function () {
                                if (val !== '#initial_event_log_timestamp') {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            },
                            val: function () {
                            },

                            find: function () {
                                return {
                                    length: 0
                                }
                            }
                        }
                    }),
                    getPageData = sinon.stub(view, 'getPageData', function () {
                        return{base:"rest"}
                    }),
                    isValidInput = sinon.stub(view.formWidget, 'isValidInput');

                view.submit();

                getPageData.called.should.be.equal(true);
                isValidInput.called.should.be.equal(true);
                closeOverlay.called.should.be.equal(false);
                isValidInput.restore();
                find.restore();
                getPageData.restore();
            });
            it('Checks for submit 4/1 isDomainContollerAndLdapGridInvalid called with validation failure', function () {
                view.activity.domainCollection.where = function () {
                    return {
                        length: 0
                    };
                };
                view.formMode = view.MODE_EDIT;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return true})
                var find = sinon.stub(view.$el, 'find', function () {
                        return {
                            closest: function(){ return {addClass:function(){}}},
                            siblings: function(){ return {show:function(){ return {text: function(){}}}}},
                            prop: function (val) {
                                return false;
                            },

                            find: function () {
                                return {
                                    length: 0
                                }
                            }
                        }
                    }),
                    getPageData = sinon.stub(view, 'getPageData', function () {
                        return{base:"rest"}
                    }),
                    isValidInput = sinon.stub(view.formWidget, 'isValidInput');

                view.submit();
                isDomainContollerAndLdapGridInvalid.called.should.be.equal(true);
                getPageData.called.should.be.equal(true);
                isValidInput.called.should.be.equal(true);
                closeOverlay.called.should.be.equal(false);
                isValidInput.restore();
                find.restore();
                getPageData.restore();
            });

            it('Checks for submit 4', function () {
                view.activity.domainCollection.where = function () {
                    return {
                        length: 0
                    };
                };
                view.formMode = view.MODE_EDIT;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return false})
                var editRow = sinon.stub(view.activity.gridWidget, 'editRow'),
                    addRow = sinon.stub(view.activity.gridWidget, 'addRow'),
                    find = sinon.stub(view.$el, 'find', function () {
                        return {
                            closest: function(){ return {addClass:function(){}}},
                            siblings: function(){ return {show:function(){ return {text: function(){}}}}},
                            prop: function (val) {
                                return false;
                            },

                            find: function () {
                                return {
                                    length: 0
                                }
                            }
                        }
                    }),
                    getPageData = sinon.stub(view, 'getPageData', function () {
                        return{base:"rest"}
                    }),
                    isValidInput = sinon.stub(view.formWidget, 'isValidInput');

                view.submit();

                getPageData.called.should.be.equal(true);
                isValidInput.called.should.be.equal(true);
                closeOverlay.called.should.be.equal(true);
                editRow.called.should.be.equal(true);
                addRow.called.should.be.equal(false);
                isValidInput.restore();
                find.restore();
                getPageData.restore();
            });
            it('Checks for submit 5', function () {
                view.activity.domainCollection.where = function () {
                    return {
                        length: 0
                    };
                };
                view.activity.domainCollection.add = function () {
                };
                view.formMode = view.MODE_CREATE;
                isDomainContollerAndLdapGridInvalid = sinon.stub(view, 'isDomainContollerAndLdapGridInvalid', function(){return false})
                var editRow = sinon.stub(view.activity.gridWidget, 'editRow'),
                    addRow = sinon.stub(view.activity.gridWidget, 'addRow'),
                    find = sinon.stub(view.$el, 'find', function () {
                        return {
                            closest: function(){ return {addClass:function(){}}},
                            siblings: function(){ return {show:function(){ return {text: function(){}}}}},
                            prop: function (val) {
                                return false;
                            },
                            find: function () {
                                return {
                                    length: 0
                                }
                            }
                        }
                    }),
                    getPageData = sinon.stub(view, 'getPageData', function () {
                        return{base:"rest"}
                    }),
                    isValidInput = sinon.stub(view.formWidget, 'isValidInput');

                view.submit();

                getPageData.called.should.be.equal(true);
                isValidInput.called.should.be.equal(true);
                closeOverlay.called.should.be.equal(true);
                editRow.called.should.be.equal(false);
                addRow.called.should.be.equal(true);
                isValidInput.restore();
                find.restore();
                getPageData.restore();
            });
        });
        describe('Handle isDomainContollerAndLdapGridInvalid', function () {

            it('Checks for isDomainContollerAndLdapGridInvalid 1', function () {
                var find = sinon.stub(view.$el, 'find', function () {
                    return {
                        find: function () {
                            return [{'user-grp-ip-address':"", 'domain-controller-ip-address': ""}];
                        },
                        siblings: function () {
                            return {
                                show: function(){
                                    return {text: function(){}}
                                }
                            };
                        },
                        closest: function () {
                            return {
                                addClass: function(){}
                            };
                        }
                    };


                });

               view.domainLDAPGridView = {
                    gridWidget: {
                        getAllVisibleRows: function(){
                            return [{id:123}]
                        }
                    }
                };
                view.domainControllerGridView = {
                    gridWidget: {
                        getAllVisibleRows: function(){
                            return [{id:123}]
                        }
                    }
                };
                view.isDomainContollerAndLdapGridInvalid();
                find.called.should.be.equal(true);
                find.restore();
            });
            it('Checks for isDomainContollerAndLdapGridInvalid 2', function () {
                var find = sinon.stub(view.$el, 'find', function (val) {
                    return {
                        find: function () {
                            if (val == '#active_directory_domain_ldap' || val == '#active_directory_domain_controller'){
                                return [];
                            }
                            else{
                                return [{'domain-controller-name': "test",'user-grp-ip-address':"test", 'domain-controller-ip-address': "test"}];
                            }
                        },
                        siblings: function () {
                            return {
                                show: function(){
                                    return {text: function(){}}
                                }
                            };
                        },
                        closest: function () {
                            return {
                                removeClass: function(){},
                                addClass: function(){}
                            };
                        }
                    };


                });

                view.domainLDAPGridView = {
                    gridWidget: {
                        getAllVisibleRows: function(){
                            return [{'domain-controller-name': "test",'user-grp-ip-address':"test", 'domain-controller-ip-address': "test"}]
                        }
                    }
                };
                view.domainControllerGridView = {
                    gridWidget: {
                        getAllVisibleRows: function(){
                            return [{'domain-controller-name': "test",'user-grp-ip-address':"test", 'domain-controller-ip-address': "test"}]
                        }
                    }
                };
                view.isDomainContollerAndLdapGridInvalid();
                find.called.should.be.equal(true);
                find.restore();
            });

        });
        describe('Handle removeErrorInfo', function () {

            it('Checks for removeErrorInfo 1', function () {
                view.removeErrorInfo($('<div></div>'));
            });

        });
        describe('Handle updateFormElements', function () {

            it('Checks for updateFormElements 1', function () {
                var find = sinon.stub(view.$el, 'find', function () {
                    return {
                        parent: function(){ return {after:function(){}}}
                    }
                });
                view.updateFormElements();
                find.restore();
            });

        });

        describe('Handle baseValidation', function () {
            var removeErrorInfo;
            beforeEach(function(){
                removeErrorInfo = sinon.stub(view, 'removeErrorInfo');
            });
            afterEach(function(){
                removeErrorInfo.restore();
            });
            it('Checks for baseValidation 1', function () {
                view.$el.find = function(){
                    return {
                        val: function(){
                            return {
                                id:123
                            };
                        }
                    }
                }
                view.baseValidation();
                removeErrorInfo.called.should.be.equal(true);
            });
            it('Checks for baseValidation 2', function () {
                view.$el.find = function(){
                    return {
                        val: function(){
                            return true;
                        },
                        find: function(){
                            return {
                                each: function(){
                                }
                            }
                        }
                    }
                }
                view.baseValidation();
                removeErrorInfo.called.should.be.equal(true);
            });

        });

        describe('Handle getPageData', function () {

            it('Checks for getPageData', function () {
                var serialize = sinon.stub(Syphon, 'serialize', function(){
                    return {'user-grp-port': {id:123}};
                })

                var getAllVisibleRows1 = sinon.stub(view.domainControllerGridView.gridWidget, 'getAllVisibleRows', function (){
                    return {map: function(val){
                        val({});
                    }};
                });
                var getAllVisibleRows2 = sinon.stub(view.domainLDAPGridView.gridWidget, 'getAllVisibleRows', function (){
                    return {map: function(val){
                        val({});
                    }};
                });

                view.getPageData();
                serialize.called.should.be.equal(true);
                getAllVisibleRows1.called.should.be.equal(true);
                getAllVisibleRows2.called.should.be.equal(true);
                serialize.restore();
                getAllVisibleRows1.restore();
                getAllVisibleRows2.restore();

            });

        });
    });

});

