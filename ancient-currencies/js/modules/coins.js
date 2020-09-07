
/*-------------------------------------------*/
/*----------------- COINS -------------------*/
/*-------------------------------------------*/
export const Coins = {
    selected_coin: {},
    list: [],
    filtered_list: [],
    comparable_standards: [],
    initialize: function(coins_json){
        console.log('initializing coins');
        Coins.list = Coins.build_list(coins_json);
        Coins.build_dropdown(coins_json);
    },
    build_list: function(entries){
        console.log('building coins list');
        let listTemp = [];
        let id = 0;
        for (let i in entries) {
            let obj = entries[i];
            obj['id'] = id;
            id++;
            listTemp.push(obj);
        }
        //console.log(listTemp);
        return listTemp;
    },
    build_dropdown: function(){
        console.log('building coins dropdown');
        $('.denomination-location .option-list').change(function() {
            //console.log($(this).children('.option-list :selected').val());
            let id = $(this).children('.option-list :selected').val();
            for (let item of Coins.list) {
                if (item['id'] == id) {
                    Coins.selected_coin = item;
                }
            }
            Coins.on_coin_selected(id);
        });
        for (let item of Coins.list) {
            let metaTempHtml = item['denomination']+ '; '+item['location'];
            let tempHtml = $('<option value='+item['id']+'>' +metaTempHtml +'</option>');
            $(tempHtml).appendTo('.currency'+1+' .denomination-location .option-list');
        }
    },
    build_filtered_list: function(id, filterType){
        console.log('building coins filtered list');
        if (filterType == 'p') { //if period dropdown selected
            let start_date = periods.list[id]['start_date'];
            let end_date = periods.list[id]['end_date'];
            let filtered = [];
            for (let coin of Coins.list) {
                if (coin['start_date_year'] <= start_date && coin['start_date_year'] >= end_date) {
                    filtered.push(coin);
                } else if (coin['end_date_year'] >= end_date && coin['end_date_year'] <= start_date) {
                    filtered.push(coin);
                }
            }
            Coins.filtered_list = filtered;
            Coins.filter();
        } else if (filterType == 'r') { //if region dropdown selected
            let region = regions.list[id];
            //console.log(region);
            let filtered = [];
            for (let coin of Coins.list) {
                if (coin['region'] == region['name']) {
                    filtered.push(coin);
                }
            }
            Coins.filtered_list = filtered;
            Coins.filter();
            periods.build_filtered_list(id);
        }
    },
    filter: function () {
        $('.denomination-location .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of Coins.filtered_list) {
                let name = item['denomination']+ '; '+item['location'];
                if (name == this.text) {
                    this.disabled = false;
                }
            }
        });
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
