
/* 

standard
	has many coins
	has a location
	has a region
	
	start_date
	end_date

coin
	has a location
	has a region
	has a standard

	start_date
	end_date

period
	start_date
	end_date

region
	has many locations
	has many coins
	has many standards
	
location
	has many coins
	has many standards
	has a region

commodity
*/

var standards = {
    list: [],

}

var standard = {
    coins: [],
    coins_by_decreasing_value: function(){
        return [];
    },
    display_value_in_coins: function(value_in_silver){
        the_coins = this.convert_silver_to_coins_in_standard(value_in_silver)
        for each coin generate html for 
        return html;
    },
    convert_silver_to_coins_in_standard: function(value_in_silver){
        loop through standard.coins_by_decreasing_value

        return number of each coin
    }
}

var coins = {
    selected_coin: {},
    list: [],
    initialize: function(coins_json){
        coins.build_list(coins_json);
        coins.build_dropdown;
    },
    filtered_list: function(){

    },
    dropdown_element: function(){

    },
    build_dropdown: function(){
        add_event_listener(coins.on_coin_selected(coin));

    },
    build_list: function(raw_json){

    },
    on_coin_selected: function(coin){
        coins.selected_coin = coin;
        periods.build_dropdown();
        regions.build_dropdown();
    },
    add_coin: function(data){
        coins.list[] = coin.initialize(data);
    }
}

var coin = {
    
    initialize: function(){

    }
}

var regions = {
    selected_region: {},
    list: [],
	
}

var	periods = {
	selected_period: {}, 
    list: [],
    initialize: function(json){
        periods.create_list(json);
        periods.build_dropdown();
    }
	filtered_list: function(){
		if (regions.selected_region === {}){
			return periods.list;
		}

		return periods.list.filter(function(period){
			return period.start_date >= regions.selected_region.start_date && period.end_date <= regions.selected_region.end_date;
		})
	},
	dropdown_element: function(){
		let element = document.getElementByClass('period')[0];
		return element;
	},
	build_dropdown: function(){
		periods.dropdown_element.appendTo(search elemtn)
		for each	periods.filtered_list();
		periods.dropdown_element.appendTo(<div class="period">)
	}
}

var initialize_all = function(){

}
var app = {
    coin_json: {},
    region_json: {},
    initialize: function(){
        let json = app.get_json();
        app.process_json();

        coins.initialize(app.coin_json);
        regions.initialize(app.region_json);

    },
    get_json: function(){
        // your code here
    },
    process_json: function(json){
        // do stuff
        app.coin_json = stuff;
    }
}


document.addEventListener("DOMContentLoaded", app.initialize());

