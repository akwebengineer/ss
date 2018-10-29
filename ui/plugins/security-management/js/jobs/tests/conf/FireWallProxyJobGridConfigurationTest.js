/**
 * UT forUser Fw Deploy xml and cli conf View
 *
 * @module userFwDeployXmlCliConfView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
        '../../conf/FireWallProxyJobGridConfiguration.js'
    ],


    function (Conf) {

        describe('Check user Fw Deploy Xml/Cli View UT', function () {
            var conf, context, getMessage;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                conf = new Conf({}, 123,{jobWindowMode: false,mode:{}, context:context});

                getMessage = sinon.stub(context, 'getMessage', function(val){
                    return val;
                });
            });
            after(function(){
                getMessage.restore();
            });
            it('Checks if the conf exist', function () {
                conf.should.exist;
            });

            describe('Checks if the conf exist', function () {
                var columns ;
                beforeEach(function(){
                    columns = conf.getColumns();
                });
                it('Checks if the id column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'id') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('id');
                    col.hidden.should.be.equal(true);
                });

                it('Checks if the job-id column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'job-id') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('job-id');
                    col.hidden.should.be.equal(true);
                });

                it('Checks if the cr-id column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'cr-id') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('cr-id');
                    col.hidden.should.be.equal(true);
                });


                it('Checks if the device-id column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'device-id') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('device-id');
                    col.hidden.should.be.equal(true);
                });

                it('Checks if the device-ip column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'device-ip') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('device-ip');
                });

                it('Checks if the device-name column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'device-name') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('device-name');
                });

                it('Checks if the xml-data column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'xml-data') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('xml-data');
                    col.hidden.should.be.equal(true);
                });

                it('Checks if the xml-data-reply column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'xml-data-reply') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('xml-data-reply');
                    col.hidden.should.be.equal(true);
                });
                it('Checks if the xml-data-reply1 column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'xml-data-reply1') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('xml-data-reply1');
                    col.unformat('test').should.be.equal('test');
                    col.formatter({},{},{}).should.be.equal('job_config_not_available');
                    col.formatter({},{},{'xml-data-reply':123});
                    getMessage.calledWith('job_cellvalue_view').should.be.equal(true);
                });

                it('Checks if the status column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'status') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('status');
                    col.formatter('test').should.be.equal('test');
                    col.formatter().should.be.equal('');
                });

                it('Checks if the xml-data1 column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'xml-data1') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('xml-data1');
                    col.sortable.should.be.equal(false);
                    col.bodyStyle.should.be.equal('font-weight:bold');
                    col.unformat.should.exist;
                    col.unformat('test').should.be.equal('test');
                    col.formatter.should.exist;
                    col.formatter({},{},{}).should.be.equal('job_config_not_available');
                    col.formatter({},{},{'status':'SUCCESS'});
                    getMessage.calledWith('job_cellvalue_view').should.be.equal(true);
                });
            });
        });
    });