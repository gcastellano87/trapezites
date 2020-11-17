
/*-------------------------------------------*/
/*----------------- COINS -------------------*/
/*-------------------------------------------*/
import { DatRange } from './utils/dat_range.js';
// import { RangedCoins } from './utils/ranged_coins.js';
import { StandardVersion, Standards }  from './standards.js';

export const Coins = {
    selected_coin: '',
    list: [],
    active_filters: {
        region: '',
        period: '',
        text: '',
    },
    filtered_list: [],
    comparable_standards: [],
    initialize: function(coins_json){
        // console.log('initializing coins');
        Coins.initialize_list(coins_json);
        Coins.build_dropdown();
    },
    initialize_list: function(coins){
        // DEBUGGIN ONLY
        // console.log('building coins list');
        Coins.list = coins
            .map(function(coin, index){  
                coin.coin_id = index;
                coin.standard_by_location = coin.standard && coin.location ? coin.standard + " (" + coin.location + ")" : ""; 
                coin.range = new DatRange(coin.start_date + " - " + coin.end_date);
                coin.coords = {
                    percent_of_image_x: coin.percent_of_image_x,
                    percent_of_image_y: coin.percent_of_image_y
                };
                return coin;
            });
    },
    get_coin_by_id(id){
        return Coins.get_list().filter(coin => {return coin.coin_id == id;})[0];
    },
    get_list: function(){
        return Coins.list.sort((a,b) => a.denomination.trim().localeCompare(b.denomination.trim()));
    },
    set_period_filter: function(period){
        Coins.active_filters.period = period;
    },
    set_region_filter: function(region){
        Coins.active_filters.region = region;
    },
    set_text_filter: function(text){
        Coins.active_filters.text = text;
    },
    period_filter: function(coin){
        let period = Coins.active_filters.period;

        if (!period) { return true;}

        return coin.range.overlaps(period.range);
    },
    region_filter: function(coin){
        let region = Coins.active_filters.region;
        // console.log('filter region:', region);
        if ( !region ){
            return true;
        } 
        return coin['region'] == region.name;
    },
    text_filter: function(coin){
        let text = Coins.active_filters.text.toLowerCase();
        if (!text){
            return true;
        }
        return coin.denomination.toLowerCase().includes(text);
    },
    selected_standard_filter(coin){
        if(!Standards.selected_standard){
            return true;
        } 
        return coin.range.overlaps(Standards.selected_standard.coins.range);
    },
    get_filtered_list: function(){
        return Coins.get_list()
            .filter(Coins.selected_standard_filter)
            .filter(Coins.period_filter)
            .filter(Coins.region_filter)
            .filter(Coins.text_filter);
    },
    is_coin_selected_coin(coin){
        if (!Coins.selected_coin){
            return '';
        } else {
            return Coins.selected_coin.coin_id === coin.coin_id ? 'selected' : '';
        }
    },
    build_dropdown: function(){
        // console.log('building coins dropdown');
        // console.log(Coins.get_filtered_list());
        // Clear the dropdown
        $('.currency-from .coin-selector .option-list').empty();

        let coins = Coins.get_filtered_list();
        // If there aren't any matches...
        if (coins.length == 0){
            $('<option value="" selected disabled hidden>No coins match...</option>').appendTo('.currency-from .coin-selector .option-list');
        } else {
            // Add a placeholder element
            if(Coins.selected_coin){
                $('<option value="" >--Clear Selection--</option>').appendTo('.currency-from .coin-selector .option-list');
            } else {
                $('<option value="" selected disabled hidden></option>').appendTo('.currency-from .coin-selector .option-list');
            }
            // Add an element for each of the filtered coins
            coins.forEach(coin => {
                $('<option ' + Coins.is_coin_selected_coin(coin) + ' value=' + coin.coin_id + '>' + coin.denomination.trim() + '    ' + coin.location.trim() + '</span></option>').appendTo('.currency-from .coin-selector .option-list');
            });
        }
    },
    on_coin_selected: function(id){
        console.log('coin selected');
        Coins.comparable_standards =Ccoins.get_comparable_standards();
        $(document).on('keyup', '.amount-box', function() {
            Coins.convert_to_standard();
        });
        //call conversion functions
    },
    //todo: conversion functions incomplete
    convert_to_standard: function() {        //get list of weights of coins in standard
        let amount = $('.amount-box').val();
        let selected_standard = standards.selected_standard;
        let amount_in_grams = amount * Coins.selected_coin['weight in grams'];
        //console.log(amount_in_grams);

        for (let standard of Coins.comparable_standards) {
            weights = Coins.get_weights_by_dec_value(standard);
            //console.log(weights);
            let conversion_results = [];
            for(let i=0; i<weights.length; i++){
                if(amount_in_grams >= weights[i]){ //if amount in grams is greater than weight of denomination
                    //console.log('greater than ' + weights[i]);
                    first = amount_in_grams / weights[i];
                    amount_in_grams = first - Math.floor(first);
                    conversion_results.push(Math.floor(first));
                    amount_in_grams = amount_in_grams * weights[i];
                }
            }

            if(conversion_results.length == 0) {
                first = amount_in_grams / weights[0];
                conversion_results.push(first.toFixed(2));
            }
            //console.log(conversion_results);
        }

    },
    get_weights_by_dec_value: function(standard) {
        weights = [];
        for (let coin of standard['coins']) {
            weights.push(coin['weight in grams']);
        }
        weights.sort(function(a, b){return b-a})
        return weights;
    },
    display_value_in_coins: function(value_in_silver){
       // the_coins = this.convert_silver_to_coins_in_standard(value_in_silver)
       //for each coin generate html for
       // return html;
    },
    get_comparable_standards: function() {
        console.log('getting comparable standards');
        let comparable_standards = [];
        let start_date = periods.selected_period['start_date'];
        let end_date = periods.selected_period['end_date'];
        for (let standard of standards.list) {
            if (standard['start_date'] <= start_date && standard['start_date'] >= end_date) {
                comparable_standards.push(standard);
            } else if (standard['end_date'] >= end_date && standard['end_date'] <= start_date) {
                comparable_standards.push(standard);
            }
        }
        return comparable_standards;
    }
}
