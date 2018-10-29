define([
    "jquery", 
    "Slipstream", 
    "sdk/URI", 
    "modules/searchIndex",
    "marionette", 
    "text!../../assets/js/apps/ui/show/templates/full_chrome.tpl", 
    "text!../../assets/js/apps/ui/show/templates/global_search.tpl"], 
function($, Slipstream, URI, SearchIndex, Marionette, chromeTemplate, globalSearchTemplate) {
    describe('Global Search Unit Tests', function() {
        var checkSearchInDom = function(hasSearch){
            var html = Marionette.Renderer.render(chromeTemplate, {
                    search: "chrome_header_search",
                    advanced: "chrome_header_advanced",
                    globalSearch: hasSearch,
                    global_search_placeholder: "global_search_placeholder",
                    logo_link: "/mainui",
                    logo_src: "/assets/images/icon_logoSD.svg",
                    logo_width: "144px",
                    logo_height: "24px",
                    global_help_id: '#cshid=1035'
                },{
                    globalSearchContainer: globalSearchTemplate
                });

            if ($(html).find(".search-section").length){
                assert(hasSearch == true, "searchProvider is discovered");
            }else{
                assert(hasSearch == false, "searchProvider is not discovered");
            }
        };

        it('searchProvider is discovered', function() {
            
            var provider = {
                "name": "search",
                "description": "Search provider",
                "publisher": "Juniper Networks, Inc.",
                "version": "0.0.1",
                "release_date": "02.24.2015",
                "min_platform_version": "0.0.1",
                "providers": [
                    {
                        "uri": "search://",
                        "module": "searchProvider"
                    }
                ],
                "module": "searchProvider",
                "context": "unit_test_plugin",
                "uri": new URI("search://")
            };

            Slipstream.vent.on("search_provider:discovered", function(provider) {
                checkSearchInDom(true);                
            });

            Slipstream.vent.trigger("search_provider:discovered", provider);   
        });

        it('searchProvider is not discovered', function() {  
            checkSearchInDom(false);
        });

        it ('Test client-side search index add/search methods', function(done) {
            var searchIndex = new SearchIndex();
            var doc1 = {
                url: "/foo/bar",
                body: "create firewall policy"
            };

            var doc2 = {
                url: "/fubar",
                body: "create user firewall policy"
            };

            searchIndex.addDoc(doc1);
            searchIndex.addDoc(doc2);

            searchIndex.search("firewall", {
                success: function(results) {
                    assert.equal(results.length, 2);
                    assert.equal(results[0].doc.id, 1);
                    assert.equal(results[1].doc.id, 2);

                    done();
                }
            });
        });

        it('Test search federation across search providers', function(done) {
            function GlobalSearchProvider() {
                Slipstream.SDK.SearchProvider.call(this);

                this.query = function(query, options) {
                    options.success({
                        totalResults: 2,
                        results: [
                            { 
                                objectName: "gobj1",
                                url: "/gobj1"
                            },
                            { 
                                objectName: "gobj2",
                                url: "/gobj2"
                            }
                        ]
                    });   
                }
            };

            GlobalSearchProvider.prototype = Object.create(Slipstream.SDK.SearchProvider.prototype);
            GlobalSearchProvider.prototype.constructor = GlobalSearchProvider;

            var provider1 = {
                "uri": new URI("search://"),
                "module": new GlobalSearchProvider()
            };

            function NavigationSearchProvider() {
                Slipstream.SDK.SearchProvider.call(this);

                this.query = function(query, options) {
                    console.log("calling succeess for nav");
                    options.success({
                        totalResults: 3,
                        results: [
                            { 
                                objectName: "obj1",
                                url: "/obj1"
                            },
                            { 
                                objectName: "obj2",
                                url: "/obj2"
                            },
                            { 
                                objectName: "obj3",
                                url: "/obj3"
                            }
                        ]
                    });
                }
            };

            NavigationSearchProvider.prototype = Object.create(Slipstream.SDK.SearchProvider.prototype);
            NavigationSearchProvider.prototype.constructor = NavigationSearchProvider;

            var provider2 = {
                "uri": new URI("search:/navigation"),
                "module": new NavigationSearchProvider()
            };

            Slipstream.vent.trigger("search_provider:discovered", provider1);
            Slipstream.vent.trigger("search_provider:discovered", provider2);

            var query = "firewall";
            var searchResolver = new Slipstream.SDK.SearchResolver();

            searchResolver.query(query, {
                success: function(results) {
                    assert.equal(results.query, query);

                    var provider1_results = results.resultSets["/"];
                    var provider2_results = results.resultSets["/navigation"];

                    assert.equal(provider1_results.totalResults, 2);
                    assert.equal(provider1_results.results.length, 2);
                    assert.equal(provider2_results.totalResults, 3);
                    assert.equal(provider2_results.results.length, 3);

                    done();
                }
            })
        });
    });
});