define(function() {
	var opts = {
		logo: {
			link: "/mainui",
			tooltip: "logo_tooltip",
			img: {
				src: "/assets/images/icon_logoSD.svg",
				width: "144px",
				height: "24px"
			}
		},

		product_name: "product_name",
		product_version: "${product_version}",
		product_release_year: "product_release_year",

		url: 'http://uat.juniper.net/techpubs/{{language}}/junos-space16.1/help/information-products/pathway-pages', 
		global_help_id: '#cshid=1035'
	};

	return opts;
});
