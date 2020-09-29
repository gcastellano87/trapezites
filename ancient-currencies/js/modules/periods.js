/*-------------------------------------------*/
/*---------------- PERIODS ------------------*/
/*-------------------------------------------*/

import { DatRange } from './dates.js';
import { Dat } from './dates.js';

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
        // console.log('building periods list');

        // console.log(coins);

        var start = Math.min(...coins.map(function(coin){ return coin.range.start.abs;}));
        var end = Math.max(...coins.map(function(coin){ return coin.range.end.abs;}));

        var num_of_periods = Array(Math.ceil((end - start)/25)).fill("");

        var array_of_periods = num_of_periods.map(function(period,index){
            console.log("start+(index*25)", start+(index*25));
            var start_year = start+(index*25);
            var end_year = start+((index+1)*25);

            // There is no year zero
            if (start_year === 0 ){
                start_year = 1;
            } 
            if (end_year === 0){
                end_year = -1;
            }

            var range = new DatRange({
                start:  new Dat(start_year),
                end:    new Dat(end_year),
            });

            return range;
        })

        Periods.list = array_of_periods;
    },
    set_list: function(new_list){
        Periods.list = new_list;
    },
    build_dropdown: function(){
        console.log('building periods dropdown');

        $('<option value="" selected disabled hidden>Choose here or type in Search..</option>').appendTo('.period .option-list');
        Periods.get_filtered_list().forEach(function(period, index){
            let tempHtml = $('<option value='+(index)+'>'+ period.as_string() +'</option>');
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