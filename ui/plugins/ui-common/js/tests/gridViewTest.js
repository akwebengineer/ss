define(['../../../ui-common/js/views/gridView.js', '../../../ui-common/js/mixins/PersistenceMixin.js'], function (GridView, PersistenceMixin) { 
    var activity = new Slipstream.SDK.Activity();

    describe ('gridView UT', function() {  
        var gridView, persistence,
            options = {     
                context: new Slipstream.SDK.ActivityContext(),
                search: '',
                actionEvents: {},
                conf: {
                    "columns": [{
                        "id": "id",
                        "name": "id",
                        "hidden": true
                    },{
                        "index":"name",
                        "name":"name",
                        "label":'Name',
                        "width": 150
                    }]
                },
                preferencesPath:'',
                isAppendGridInfo: false
            };
        gridView = new GridView(options);   
        _.extend(GridView.prototype, PersistenceMixin); 

        //executes before every it()
        beforeEach(function(){
            persistence = sinon.stub(Slipstream.SDK.Preferences, 'fetch', function () {
                return '';
            });
        });

        //executes after every it()
        afterEach(function(){
            persistence.restore();
        }); 

        it('render', function () {            
            var state;
            state = gridView.render();           
            assert(typeof state === "object");
        });

        it('persistConfig', function(){
            gridView.persistConfig({});
        });

    });  
});