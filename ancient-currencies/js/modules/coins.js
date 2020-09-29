
/*-------------------------------------------*/
/*----------------- COINS -------------------*/
/*-------------------------------------------*/
import { Dat, DatRange } from './dates.js';


export const Coins = {
    selected_coin: {},
    list: [],
    active_filters: {
        region: '',
        period: '',
    },
    filtered_list: [],
    comparable_standards: [],
    initialize: function(coins_json){
        console.log('initializing coins');
        Coins.initialize_list(coins_json);
        Coins.build_dropdown();
    },
    initialize_list: function(coins){
        console.log('building coins list');
        //console.log(listTemp);
        Coins.list = coins
            .map(function(coin, index){  
                coin.id = index;
                coin.standard_by_location = coin.standard && coin.location ? coin.standard + " (" + coin.location + ")" : ""; 
                coin.range = new DatRange(coin.start_date + " - " + coin.end_date);

                return coin;
            } );
    },
    get_list: function(){
        return Coins.list;
    },
    set_period_filter: function(period){
        Coins.active_filters.period = period;
    },
    set_region_filter: function(region){
        Coins.active_filters.region = region;
    },
    period_filter: function(coin){
        let period = Coins.active_filters.period;

        if (!period) { return true;}

        return coin.range.overlaps(period);
    },
    region_filter: function(coin){
        let region = Coins.active_filters.region;
        // console.log('filter region:', region);
        if ( region ){
            return coin['region'] == region.name;
        } else {
            return true;
        }
    },
    get_filtered_list: function(){
        return Coins.get_list()
            .filter(Coins.period_filter)
            .filter(Coins.region_filter);

        return filtered_list;
    },
    build_dropdown: function(){
        console.log('building coins dropdown');
        console.log(Coins.get_filtered_list());
        // Clear the dropdown
        $('.currency'+1+' .denomination-location .option-list').empty();

        let coins = Coins.get_filtered_list();
        // If there aren't any matches...
        if (coins.length == 0){
            $('<option value="" selected disabled hidden>No coins match...</option>').appendTo('.currency'+1+' .denomination-location .option-list');
        } else {
            // Add a placeholder element
            $('<option value="" selected disabled hidden>Choose here or type in Search..</option>').appendTo('.currency'+1+' .denomination-location .option-list');
            // Add an element for each of the filtered coins
            for (let item of coins) {
                let metaTempHtml = item['denomination'].trim() + '; '+item['location'];
                let tempHtml = $('<option value='+item['id']+'>' +metaTempHtml +'</option>');
                $(tempHtml).appendTo('.currency'+1+' .denomination-location .option-list');
            }
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
