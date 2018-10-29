define(['../inSightView.js', '../inSightBarCompositeView.js'], function(InSightView , InSightBarCompositeView){ 
    //
    var SourceIpVisSightView = InSightView.extend({
        /**
        *override methods to make it dummy
        */
        buildTopRisksView: function(){
            return null;
        },
        //
        buildTopCatView: function(){
            return null;
        },
        //
        buildTopCharView: function(){
            return null;
        },
        buildTopUsersView : function(){ // overiding Top Users by Volume with Top IPs by volume
            var me=this;
            me.buildTopNView("/sourceIp/volume", false, "topusers", function(data){
                me.containers.topUsersContainer.append(new InSightBarCompositeView({collection:data, "title": me.options.context.getMessage("app_secure_insight_top_ips_title")}).render().$el);    
                if(data.length ===0 ){
                    me.displayNoData(me.containers.topUsersContainer);
                }
            });
        }
    });
    return SourceIpVisSightView;
    //
});