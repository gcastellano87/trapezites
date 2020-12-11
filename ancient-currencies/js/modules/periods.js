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
    active_filters: {
        text: '',
    },    
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
    set_text_filter: function(text){
        console.log('text seartch periods',text);
        
        Periods.active_filters.text = text;
    },
    set_list: function(new_list){
        Periods.list = new_list;
    },
    build_dropdown: function(){
        console.log('building periods dropdown');
        // console.log("Periods.get_filtered_list()", Periods.get_filtered_list())
        $('.period-selector .option-list').empty();
        let list = Periods.get_filtered_list();
        console.log('list',list);
        
        if(list.length === 0){
            $('<option value="" selected disabled hidden>No periods match...</option>').appendTo('.period-selector .option-list');
        } else {
            $('<option value="" selected disabled hidden></option>').appendTo('.period-selector .option-list');
        
            list.forEach(function(period, index){                
                $('<option value='+(index)+'>'+ period.range.string + " (" + period.ranged_items.length +  " currencies)" + '</option>').appendTo('.period-selector .option-list');
            });
        }
    },
    text_filter: function(period){  
        let text = Periods.active_filters.text.toLowerCase();
        if (!text){
            return true;
        }         
        return period.range.string.toLowerCase().includes(text);
        
    },
    get_list: function(){
        return Periods.list;
    },
    get_filtered_list: function(){
        return Periods.get_list()
        .filter(Periods.text_filter);
    }
}