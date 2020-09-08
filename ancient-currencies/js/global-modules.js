
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

import { Standard, Standards }  from './modules/standards.js';
import { Region, Regions }  from './modules/regions.js';
import { Period, Periods }  from './modules/periods.js';
import { Coins } from './modules/coins.js';

/*-------------------------------------------*/
/*------------------ APP --------------------*/
/*-------------------------------------------*/
var App = {
    entries: [],
    initialize: function(){
        var the_headers = new Headers();
        the_headers.append('secret-key', '$2b$10$yjrD4Y8FJuGo2.cLYkzKP.FI6SCpY5GW8JUazMgOxXUnYi8Tf0MT2');

        const request = new Request('https://api.jsonbin.io/b/5f04a20b343d624b07816015/4',  {   
            method: 'GET',
            headers: the_headers,
        });

        fetch(request).then(response => { return response.json()}).then(jsonResponse => {

            let entries = App.process_entries(jsonResponse);
            App.initialize_dropdowns(entries);
            App.add_listeners();
        });
    },
    add_listeners: function(){
        $('.denomination-location .option-list').change(function() {

        });
        $('.period .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Periods.selected_period = Periods.list[id];
            console.log("THE SELECTED PERIOD", Periods.selected_period);
            Coins.set_period_filter(Periods.selected_period);
            Coins.build_dropdown();
            Standards.set_period_filter(Periods.selected_period);
            Standards.build_dropdown();

        });
        $('.standard .option-list').change(function() {

        });
        $('.currency1 .region .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.list[id];
            console.log("THE SELECTED Region", Regions.selected_region);
            Coins.set_region_filter(Regions.selected_region);
            Coins.build_dropdown();
        });
        $('.currency2 .region .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.list[id];
            console.log("THE SELECTED Region 2", Regions.selected_region);
            Standards.set_region_filter(Regions.selected_region);
            Standards.build_dropdown();
        });
    },
    initialize_dropdowns: function(entries){
        console.log("entries:", entries);
        //calling initialize functions for objects
        Coins.initialize(entries);
        Standards.initialize(entries);
        Periods.initialize(entries);
        Regions.initialize(entries);
    },
    process_entries: function(json){
        let initial_entries = json.entries;

        //separates commodities from currencies
        let processed_entries = [];
        for (let i in initial_entries) {
            let entry = initial_entries[i];
            entry['start_date_year'] = parseInt(entry['start_date']);
            entry['start_date_suf'] = entry['start_date'].slice(-2);
            entry['end_date_year'] = parseInt(entry['end_date']);
            entry['end_date_suf'] = entry['end_date'].slice(-2);
            if (entry['commodity or service'] != 'x') {
                processed_entries.push(entry);
            }
        }
        return processed_entries;
    }
}

document.addEventListener("DOMContentLoaded", App.initialize());