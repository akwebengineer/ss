/**
 * Test file for Block Service.
 * @module
 * @name BlockServiceTest
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["../../service/blockService.js",
    '../../../policies/constants/fwPolicyManagementConstants.js'], function (BlockService, PolicyConstants) {

    describe('Block Service UT', function () {
        var service;
        before(function () {
            service = new BlockService();
        });

        after(function () {

        });

        it('Check if the fetch policies change list by UUID api is defined properly', function (done) {
            $.mockjax.clear();

            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/rule-placement-analysis-result?uuid=*',
                type: 'GET',
                headers: {
                    Accept: 'application/vnd.juniper.sd.policy-management.firewall.policies+json'
                },
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/sd/policy-management/firewall/policies/rule-placement-analysis-result?uuid=dummyUUID');
                    settings.headers.Accept.should.be.equal('application/vnd.juniper.sd.policy-management.firewall.policies+json');
                    settings.type.should.be.equal('GET');
                    done2();
                    done();
                }
            });

            service.getPolicyCLByUUID('dummyUUID');
        });

        it('Check if the policy publish update api is defined properly', function (done) {
            $.mockjax.clear();

            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/provisioning/publish-policy?update=*',
                type: 'POST',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/sd/policy-management/firewall/provisioning/publish-policy?update=true&schedule=dummySchedule');
                    settings.headers.Accept.should.be.equal('application/vnd.juniper.sd.fwpolicy-provisioning.monitorable-task-instances+json;version=1;q=0.01');
                    settings.headers['Content-Type'].should.be.equal('application/vnd.juniper.sd.fwpolicy-provisioning.publish+json;version=1;charset=UTF-8');
                    settings.type.should.be.equal('POST');
                    settings.data.should.be.equal(JSON.stringify({
                        "publish": {
                            "policy-ids": {
                                "policy-id": 'dummyPolicyID'
                            }
                        }
                    }));

                    done2();
                    done();
                }
            });

            service.publishAndUpdate('dummyPolicyID', true, null, null, {
                scheduleAt: 'dummySchedule'
            });
        });


        it('Check if the policy save api is defined properly', function (done) {
            $.mockjax.clear();

            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/save-policies?uuid=*',
                type: 'post',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/sd/policy-management/firewall/policies/save-policies?uuid=dummyID');
                    settings.headers.accept.should.be.equal('application/vnd.juniper.sd.policy-management.firewall.policies+json');
                    settings.headers['content-type'].should.be.equal('application/vnd.juniper.sd.policy-management.firewall.policies+json');
                    settings.type.should.be.equal('post');
                    settings.data.should.be.equal(JSON.stringify({
                        'rule-analysis-result': {
                            'fw-policy-change-list': 'dummyData'
                        }
                    }));

                    done2();
                    done();
                }
            });

            service.savePolicies('dummyID', 'dummyData');
        });


        it('Check if the calculate change list api is defined properly', function (done) {
            $.mockjax.clear();

            var appAccessDetails = {
                data: 'dummyData'
            };

            $.mockjax({
                url: '/api/juniper/sd/policy-management/block-action/calculate-changelist?screen-id=dummyID',
                type: 'post',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/sd/policy-management/block-action/calculate-changelist?screen-id=dummyID');
                    settings.headers.accept.should.be.equal('application/vnd.juniper.sd.policy-management.calculate-changelist-response+json;version=2;q=0.02');
                    settings.headers['content-type'].should.be.equal('application/vnd.juniper.sd.policy-management.calculate-changelist-request+json;version=2;charset=UTF-8');
                    settings.type.should.be.equal('POST');
                    settings.data.should.be.equal(JSON.stringify(appAccessDetails));

                    done2();
                    done();
                }
            });

            service.calculateChangeList(appAccessDetails, 'dummyID');
        });

        it('Check if the delete change list api is defined properly: Success', function (done) {
            $.mockjax.clear();


            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/delete-change-list/dummyID',
                type: 'delete',
                status: 200,
                response: function (settings, done2) {
                    done2();
                    // nothing to verify. check if the api is called with correct url
                    done();
                }
            });

            service.deleteChangeList('dummyID');
        });

        it('Check if the delete change list api is defined properly: Error', function (done) {
            $.mockjax.clear();


            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/delete-change-list/dummyID',
                type: 'DELETE',
                status: 404,
                response: function (settings, done2) {
                    done2();
                    // nothing to verify. check if the api is called with correct url
                    done();
                }
            });

            service.deleteChangeList('dummyID');
        });


        it('Check if the get policies by ecm api is defined properly: Values defined', function (done) {
            $.mockjax.clear();

            var appAccessDetails = {
                data: 'dummyData'
            };

            $.mockjax({
                url: '/api/juniper/ecm/policy-management/get-affected-policies',
                type: 'post',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/ecm/policy-management/get-affected-policies');
                    settings.headers['content-type'].should.be.equal('application/json');
                    settings.type.should.be.equal('POST');
                    settings.data.should.be.equal(JSON.stringify({
                        "policy-template":{
                            "end-time": 'dummyEnd',
                            "application-names": 'dummyApplications',
                            "start-time": 'dummyStart',
                            "source-name": 'dummySource',
                            "source-values": ['dummyValues'],
                            "lookup-event-apptrack": false
                        }
                    }));

                    done2();
                    done();
                }
            });

            service.getPolicies('dummyApplications', 'dummyStart', 'dummyEnd', 'dummySource', ['dummyValues']);
        });

        it('Check if the get policies by ecm api is defined properly: Values not defined, Source name : User', function (done) {
            $.mockjax.clear();

            var appAccessDetails = {
                data: 'dummyData'
            };
            $.mockjax({
                url: '/api/juniper/ecm/policy-management/get-affected-policies',
                type: 'post',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/ecm/policy-management/get-affected-policies');
                    settings.headers['content-type'].should.be.equal('application/json');
                    settings.type.should.be.equal('POST');
                    settings.data.should.be.equal(JSON.stringify({
                        "policy-template":{
                            "end-time": 'dummyEnd',
                            "application-names": 'dummyApplications',
                            "start-time": 'dummyStart',
                            "source-name": 'user',
                            "source-values": 'All Users',
                            "lookup-event-apptrack": false
                        }
                    }));

                    done2();
                    done();
                }
            });

            service.getPolicies('dummyApplications', 'dummyStart', 'dummyEnd', 'user', []);
        });

        it('Check if the get policies by ecm api is defined properly: Values not defined, Source name : Application', function (done) {
            $.mockjax.clear();


            $.mockjax({
                url: '/api/juniper/ecm/policy-management/get-affected-policies',
                type: 'post',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/ecm/policy-management/get-affected-policies');
                    settings.headers['content-type'].should.be.equal('application/json');
                    settings.type.should.be.equal('POST');
                    settings.data.should.be.equal(JSON.stringify({
                        "policy-template":{
                            "end-time": 'dummyEnd',
                            "application-names": 'dummyApplications',
                            "start-time": 'dummyStart',
                            "source-name": 'application',
                            "source-values": 'All Applications',
                            "lookup-event-apptrack": false
                        }
                    }));

                    done2();
                    done();
                }
            });

            service.getPolicies('dummyApplications', 'dummyStart', 'dummyEnd', 'application', []);
        });

        it('Check if the get policies by ecm api is defined properly: Values not defined, Source name : Source IP', function (done) {
            $.mockjax.clear();

            $.mockjax({
                url: '/api/juniper/ecm/policy-management/get-affected-policies',
                type: 'post',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/ecm/policy-management/get-affected-policies');
                    settings.headers['content-type'].should.be.equal('application/json');
                    settings.type.should.be.equal('POST');
                    settings.data.should.be.equal(JSON.stringify({
                        "policy-template":{
                            "end-time": 'dummyEnd',
                            "application-names": 'dummyApplications',
                            "start-time": 'dummyStart',
                            "source-name": 'source_ip',
                            "source-values": "All SourceIP",
                            "lookup-event-apptrack": false
                        }
                    }));

                    done2();
                    done();
                }
            });

            service.getPolicies('dummyApplications', 'dummyStart', 'dummyEnd', 'source_ip', []);
        });


        it('Check if the get policies by ecm api is defined properly: Values not defined, Source name : Destination IP', function (done) {
            $.mockjax.clear();

            $.mockjax({
                url: '/api/juniper/ecm/policy-management/get-affected-policies',
                type: 'post',
                status: 200,
                response: function (settings, done2) {
                    settings.url.should.be.equal('/api/juniper/ecm/policy-management/get-affected-policies');
                    settings.headers['content-type'].should.be.equal('application/json');
                    settings.type.should.be.equal('POST');
                    settings.data.should.be.equal(JSON.stringify({
                        "policy-template":{
                            "end-time": 'dummyEnd',
                            "application-names": 'dummyApplications',
                            "start-time": 'dummyStart',
                            "source-name": 'destination_ip',
                            "source-values": "All DestinationIP",
                            "lookup-event-apptrack": false
                        }
                    }));

                    done2();
                    done();
                }
            });

            service.getPolicies('dummyApplications', 'dummyStart', 'dummyEnd', 'destination_ip', []);
        });

    });


});