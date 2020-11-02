/*-------------------------------------------*/
/*---------------- PERIODS ------------------*/
/*-------------------------------------------*/


import { RangedCoins } from './utils/ranged_coins.js';

export const Period = {
    'id': '',
    'start_date': '',
    'end_date': ''
}

export const Periods = {
	selected_period: {}, 
    list: [],
    filters: [], // Not currently used
    initialize: function(coins_json){
        console.log('initializing periods');
        Periods.initialize_list(coins_json);
        Periods.build_dropdown();
    },
    initialize_list: function(coins) {
        let ranged_coins = new RangedCoins(coins, 25);
        let periods = ranged_coins.periods;

        Periods.list = periods.ranged_items;
    },
    set_list: function(new_list){
        Periods.list = new_list;
    },
    build_dropdown: function(){
        console.log('building periods dropdown');
        // console.log("Periods.get_filtered_list()", Periods.get_filtered_list())
        $('<option value="" selected disabled hidden>Choose here or type in Search..</option>').appendTo('.period .option-list');
        Periods.get_filtered_list().forEach(function(period, index){
            // console.log('period',period);
            
            let tempHtml = $('<option value='+(index)+'>'+ period.range.string + " (" + period.ranged_items.length +  ")" + '</option>');
            $(tempHtml).appendTo('.period .option-list');
        });

    },
    get_list: function(){
        return Periods.list;
    },
    get_filtered_list: function(){
        let list = Periods.get_list();
        // Do we need to filter Periods ever?
        return list;
    }
}