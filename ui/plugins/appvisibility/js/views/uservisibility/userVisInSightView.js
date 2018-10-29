define(['../inSightView.js'], function(InSightView){
	//
	var UserVisInSightView = InSightView.extend({
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
		}
	});
	return UserVisInSightView;
	//
});