
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
import{ Tests } from './modules/tests.js';

var test = new Tests('quiet');

import { StandardVersion, Standards }  from './modules/standards.js';
import { Region, Regions }  from './modules/regions.js';
import { Period, Periods }  from './modules/periods.js';
import { Coins } from './modules/coins.js';

/*-------------------------------------------*/
/*------------------ APP --------------------*/
/*-------------------------------------------*/
var App = {
    entries: [],
    canvas: '',
    ctx: '',
    map: '',
    map_scale: 1,
    initialize: function(){
        // var the_headers = new Headers();
        // the_headers.append('secret-key', '$2b$10$yjrD4Y8FJuGo2.cLYkzKP.FI6SCpY5GW8JUazMgOxXUnYi8Tf0MT2');

        // const request = new Request('https://api.jsonbin.io/b/5f04a20b343d624b07816015/4',  {   
        //     method: 'GET',
        //     headers: the_headers,
        // });

        // fetch(request).then(response => { return response.json()}).then(jsonResponse => {

        //     let entries = App.process_entries(jsonResponse);
        //     App.initialize_data_and_dropdowns(entries);
        //     App.add_listeners();
        // });
        let data = JSON.parse(document.getElementById('data').innerHTML);
         // DEBUGGIN ONLY
        // window.entries = data.entries;
        App.initialize_data_and_dropdowns(data.entries);
        App.initialize_select2();
        App.add_listeners();
        App.initialize_map();
    },
    initialize_map: function(){
        App.initialize_map_listeners();
        App.draw_map();
    },
    get_canvas: function(){
        if(!App.canvas){
            let canvas = document.getElementById('map');
            App.canvas = canvas;            
        }
        return App.canvas;
    },
    get_ctx: function(){
        if(!App.ctx){
            let canvas = App.get_canvas();
            let ctx = canvas.getContext('2d');
            App.ctx = ctx;
            
        }        
        return App.ctx;
    },
    draw_markers: function(){
        let from = Coins.selected_coin;
        let to = Standards.selected_standard;

        this.draw_map();

        if (from && to){
            this.draw_markers_and_connector(from.coords, to.coords);
        } else {
            if (from){
                this.draw_from_marker(from.coords);
            }
    
            if (to){
                this.draw_to_marker(to.coords);
            }
        }     
    },
    draw_from_marker: function(coords){
        let from_marker = new Image();
        from_marker.src = 'img/from-marker.png';
        
        from_marker.onload = function(){
            App.draw_marker(from_marker, coords);
        }
    },
    draw_to_marker: function(coords){
        let to_marker = new Image();
        to_marker.src = 'img/to-marker.png';
        console.log('to marker coords',coords);
        
        to_marker.onload = function(){
            App.draw_marker(to_marker, coords);
        }
    },
    draw_marker: function(marker, coords){
        let ctx = this.get_ctx();
        let marker_width = marker.width*App.scale;
        let marker_height = marker.height*App.scale;
        
        let marker_width_offset = marker_width/2;
        let marker_height_offset = marker_height/2;
        let destination_x = (ctx.width*coords.percent_of_image_x)-marker_width_offset;
        let destination_y = (ctx.height*coords.percent_of_image_y)-marker_height_offset;

        ctx.drawImage(marker, destination_x, destination_y, marker_width, marker_height);
    },
    draw_markers_and_connector: function(from_coords, to_coords){
        //  get to location  
        // get from location
        // get both location coordinates
        // draw line between coordinates
        let ctx = this.get_ctx();
        let from_x = (ctx.width*from_coords.percent_of_image_x);
        let from_y = (ctx.height*from_coords.percent_of_image_y);      
        let to_x = (ctx.width*to_coords.percent_of_image_x);
        let to_y = (ctx.height*to_coords.percent_of_image_y);

        ctx.beginPath();
        ctx.moveTo(from_x,from_y);
        ctx.strokeStyle = "#e41651";
        ctx.lineWidth=15*App.scale;
        ctx.lineTo(to_x,to_y);
        ctx.stroke();
        ctx.closePath();

        App.draw_from_marker(from_coords);
        App.draw_to_marker(to_coords);

    },
    draw_map: function(){
        let canvas = App.get_canvas();
        let ctx = App.get_ctx();
        let display_area = document.getElementsByClassName('map')[0];
        ctx.width = display_area.offsetWidth;

        if(!App.map){
            let map = new Image();
            map.src = 'img/map.png';
            App.map = map;
            map.onload = function(){
                // get the width of the area where the map will be displayed
                App.render_map(map, ctx,canvas);
            }
        }

        App.render_map(this.map, ctx,canvas); 
    },
    render_map: function(map, ctx, canvas){
        let map_aspect_ratio    =   (map.height/map.width);
        ctx.height              =   ctx.width*map_aspect_ratio;
        App.scale               =   ctx.width/map.width;
        
        canvas.width            =   ctx.width;
        canvas.height           =   ctx.height;
        ctx.drawImage(map, 0, 0, ctx.width, ctx.height);
    },
    initialize_map_listeners: function(){
        window.onresize = App.draw_map();
    },
    format_state_for_select2: function(state){
        console.log("format_state_for_select2");
        // console.log(state);
        if(state.text.includes('    ')){
            let parts = state.text.split('    ');
            return $('<span class="currency-option-item"><span class="denomination">' + parts[0] + '</span><span class="location">' + parts[1] + '</span></span>');
        } else if (state.text.includes('   ')){
            let parts = state.text.split('   ');
            return $('<span class="standard-option-item"><span class="standard">' + parts[0] + '</span><span class="location">' + parts[1] + '</span><span class="period">' + parts[2] + '</span></span>');
        } else {
            return state.text;
        }
    },
    initialize_select2: function(){
        console.log("FORMAT");
       $('.currencies .option-list').select2({
           templateResult: App.format_state_for_select2,
           theme: 'currencies',
        //    width: 'width: 500px'
        });       
        
        $('.filters .option-list').select2({
           templateResult: App.format_state_for_select2,
           theme: 'filters',
        //    width: 'width: 200px'
        });

    },
    add_listeners: function(){
        
        $('.currency-from .option-list').change(function() {
           
            let id = $(this).children('.option-list :selected').val();
            App.check_for_empty_standards_and_currencies();
            Coins.selected_coin = Coins.get_coin_by_id(id);
            App.draw_markers();
        });


        $('.standard-to .option-list').change(function() {
            console.log('in standard optionlist listener');
            let id = $(this).children('.option-list :selected').val();
            
            App.check_for_empty_standards_and_currencies();
            Standards.selected_standard = Standards.get_standard_by_id(id);
            App.draw_markers();
        });

        $('.region-selector-from .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.list[id];
            console.log("THE SELECTED Region", Regions.selected_region);
            Coins.set_region_filter(Regions.selected_region);
            Coins.build_dropdown();
        });

        $('.period-selector .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Periods.selected_period = Periods.list[id];
            // console.log("THE SELECTED PERIOD", Periods.selected_period);
            Coins.set_period_filter(Periods.selected_period);
            Coins.build_dropdown();
            Standards.set_period_filter(Periods.selected_period);
            Standards.build_dropdown();
        });        
        
        $('.region-selector-to .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.list[id];
            Standards.set_region_filter(Regions.selected_region);
            Standards.build_dropdown();
        });

        $('.currency-from .amount-selector').keyup(function(){
            this.value = this.value.replace(/[^0-9\.]/g,'');

            if(this.value){
                App.check_for_empty_standards_and_currencies();
                App.update_i_want_amount(this.value);
            }
        });                
    },
    update_i_want_amount(amount){
        let result = App.convert(amount);
        if(result){
            $('.currency-from .amount-output').text(result);
        }
    },
    convert(amount){
        console.log('Coins.selected_coin',Coins.selected_coin);
        console.log('Standards.selected',Standards.selected_standard);
        let coins_value = Coins.selected_coin.value_in_grams_of_silver;
        console.log('coins_value',coins_value);
        let total_value_of_coins = amount*coins_value;
        console.log('total_value_of_coins',total_value_of_coins);
        let conversion_results = Standards.selected_standard.coin_conversion(total_value_of_coins);

        App.display_conversion_results(conversion_results);
    },
    display_conversion_results(results){
        console.log('results',results);
        results.forEach(result => {
            console.log("Coin:", result.coin.denomination, "Value of one:", result.coin.value_in_grams_of_silver, "Number:", result.number, "Total in this coin:",result.coin.value_in_grams_of_silver*result.number);
        });
    },
    check_for_empty_standards_and_currencies(){
        let currency_from = $('.currency-from .option-list :selected').val();
        let currency_to = $('.standard-to .option-list :selected').val();

        console.log('the currency from id',currency_from);
        console.log('the currency to id',currency_to);
        
        if (!currency_from ){
            $('.currency-from .select2-container--currencies').addClass('warning-empty');
        } else {
            $('.currency-from .select2-container--currencies').removeClass('warning-empty');
        } 
        
        if (!currency_to ){
            $('.standard-to .select2-container--currencies').addClass('warning-empty');
        } else {
            $('.standard-to .select2-container--currencies').removeClass('warning-empty');

        }
    },
    initialize_data_and_dropdowns: function(entries){
        
        // console.log("entries:", entries);
        //calling initialize functions for objects
        Coins.initialize(entries);
        // DEBUGGIN ONLY
        window.coins = Coins;
        var coins_list = Coins.get_filtered_list();
        
        Standards.initialize(coins_list);
        //         // DEBUGGIN ONLY
                window.standards = Standards;
        Periods.initialize(coins_list);
            // DEBUGGIN ONLY
            window.periods = Periods;
        Regions.initialize(coins_list);
            // DEBUGGIN ONLY
            window.regions = Regions;

    }
}
$(document).ready(function() {
    App.initialize();
});