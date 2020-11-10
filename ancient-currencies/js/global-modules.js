
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
    initialize: function(){
        // var the_headers = new Headers();
        // the_headers.append('secret-key', '$2b$10$yjrD4Y8FJuGo2.cLYkzKP.FI6SCpY5GW8JUazMgOxXUnYi8Tf0MT2');

        // const request = new Request('https://api.jsonbin.io/b/5f04a20b343d624b07816015/4',  {   
        //     method: 'GET',
        //     headers: the_headers,
        // });

        // fetch(request).then(response => { return response.json()}).then(jsonResponse => {

        //     let entries = App.process_entries(jsonResponse);
        //     App.initialize_dropdowns(entries);
        //     App.add_listeners();
        // });
        let data = JSON.parse(document.getElementById('data').innerHTML);
         // DEBUGGIN ONLY
        // window.entries = data.entries;
        App.initialize_dropdowns(data.entries);
        App.initialize_select2();
        App.add_listeners();
    },
    format_state_for_select2: function(state){
        console.log("format_state_for_select2");
        // console.log(state);
        if(state.text.includes('    ')){
            let parts = state.text.split('    ');
            return $('<span class="currency-option-item"><span class="denomination">' + parts[0] + '</span><span class="location">' + parts[1] + '</span></span>');
        } else if ((state.text.includes('   '))){
            let parts = state.text.split('   ');
            return $('<span class="standard-option-item"><span class="standard">' + parts[0] + '</span><span class="location">' + parts[1] + '</span><span class="period">' + parts[2] + '</span></span>');
        } else {
            return state;
        }
        
    },
    initialize_select2: function(){
        console.log("FORMAT");
       $('.option-list').select2({
           templateResult: App.format_state_for_select2,
           theme: 'trapezites',
        });
    },
    add_listeners: function(){
        // $('.location .search-box').keyup(function(){
        //     let text = $(this).val();
        //     Coins.set_text_filter(text);
        //     Coins.build_dropdown(); 
        // });
        
        $('.currency-from .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Coins.selected_coin = Coins.list[id];
       //TODO
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
        $('.standard .option-list').change(function() {

        });
        $('.region-selector-from .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.list[id];
            console.log("THE SELECTED Region", Regions.selected_region);
            Coins.set_region_filter(Regions.selected_region);
            Coins.build_dropdown();
        });
        $('.region-selector-to .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.list[id];
            console.log("THE SELECTED Region 2", Regions.selected_region);
            Standards.set_region_filter(Regions.selected_region);
            Standards.build_dropdown();
        });
        // $('.currency2 .search-box').keyup(function(){
        //     let text = $(this).val();
        //     Standards.set_text_filter(text);
        //     Standards.build_dropdown(); 
        // });        
        
        // $('.period .search-box').keyup(function(){
        //     let text = $(this).val();
        //     Periods.set_text_filter(text);
        //     Periods.build_dropdown(); 
        // });

    },
    initialize_dropdowns: function(entries){
        
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
