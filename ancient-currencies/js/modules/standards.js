import { Coins } from './coins.js';
/*-------------------------------------------*/
/*--------------- STANDARDS -----------------*/
/*-------------------------------------------*/
// TODO:  Change the way "version of standard" is created

import { DatRange } from './dates.js';

export class StandardVersion {
    constructor( id, name, coins) {
        if ( id === "" || name === "" || coins.length < 1){
            console.error("Invalid Standard.  id = " + id + " name = '" + name + "'", coins );
        }

        this.id         = id;
        this.name       = name;
        this.coins      = coins;
        this.region     = this.initialize_region();
        this.location   = this.initialize_location();
        this.dates      = this.initialize_dates();
    }
    get short_name() {
        // expected format:  "Milesian 525–500 BC Knidos"
        // get's the text up to the first number and then trims
        var match = this.name.match(/\(/);
        if (match){
            return this.name.substr(0,match.index).trim();
        } else {
            console.error("Invalid name (no date): " + this.name);
            return "";
        }
    }
    get start_date() {
        return this.dates.start;
    }

    get end_date() {
        return this.dates.end;
    }
    
    includes_date(date){
        return date.abs >= this.start.abs && date.abs < this.end.abs; 
    }

    get duration(){
        return this.dates.duration;
    }

    date_string(format = 'default'){
        return this.dates.as_string(format);
    }

    initialize_dates() {
        return new DatRange(this.name);
    }

    initialize_region() {
        let all_regions     = this.coins.map(coin => coin.region);
        let unique_regions  = [...new Set(all_regions)];

        if (unique_regions.length != 1 ){
            console.error("Data Error: Each Standard should have only one region.  This one had " + unique_regions.length, unique_regions,this);
        }
        // console.log(unique_regions);
        return unique_regions[0];
    }

    initialize_location() {
        let all_locations     = this.coins.map(coin => coin.location);
        let unique_locations  = [...new Set(all_locations)];

        if (unique_locations.length != 1 ){
            console.error("Data Error: Each Standard should have only one location.  This one had " + unique_locations.length, unique_locations);
        }
        // console.log(unique_locations);
        return unique_locations[0];
    }
}


export const Standards = {
    selected_standard: {},
    list: [],
    active_filters: {
        region: '',
        period: '',
    },
    initialize: function(coins_json) {
        console.log('initializing standards');
        Standards.initialize_list(coins_json);
        console.log('Standards', Standards.list);
        Standards.build_dropdown();
    },
    initialize_list: function(coins) {

        let standards_by_locations = [...new Set(coins.map(function(coin){return coin.standard_by_location}))];
// TODO  We've got the coins grouped by standard in location.  Now we need to group them by time period.  Probably this means that each DatRange also needs to be periordized?   Got to thinkg this through

        console.table(standards_by_locations);
        Standards.list = standards_by_locations
            .filter(function(standard_name){ return standard_name;})
            .map(function(standard_name,index){
                let coins_in_standard_location = coins.filter(function(coin){
                    return coin.standard_by_location && coin.standard_by_location === standard_name;
                });
                return new StandardVersion(index, standard_name, coins_in_standard_location);})
            .sort(function(a,b) {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }

                return 0;
              });
    },
    get_list: function(){
        return Standards.list;
    },
    set_period_filter: function(period){
        Standards.active_filters.period = period;
    },
    set_region_filter: function(region){
        Standards.active_filters.region = region;
    },
    period_filter: function(standard){
        let is_match = true;
        let period = Standards.active_filters.period;

        if (!period) { return is_match;}

        let start_date = period.start_date;
        let end_date = period.end_date;

        if (standard['start_date'] <= start_date && standard['start_date'] >= end_date) {
                is_match = true;
        } else if (standard['end_date'] >= end_date && standard['end_date'] <= start_date) {
                is_match = true;
        } else {
            is_match = false;
        }
        
        return is_match;
    },
    region_filter: function(standard){
        let region = Standards.active_filters.region;
        // console.log('filter region:', region);
        if ( region ){
            return standard['region'] == region.name;
        } else {
            return true;
        }
    },
    get_filtered_list: function(){
        return Standards.get_list()
            .filter(Standards.period_filter)
            .filter(Standards.region_filter);
    },
    build_dropdown: function() {
        console.log('building standards dropdown');
        // Clear the dropdown
        $('.currency'+2+' .standard .option-list').empty();
        let standards = Standards.get_filtered_list();
        // console.table(standards)
        // console.table(Standards.get_list());
        // If there aren't any matches...
        if (standards.length == 0){
            $('<option value="" selected disabled hidden>No standards match...</option>').appendTo('.currency'+2+' .standard .option-list');
        } else {
            // Add a placeholder element
            $('<option value="" selected disabled hidden>Choose here or type in Search..</option>').appendTo('.currency'+2+' .standard .option-list');

            standards.forEach(standard => {
                // console.log("shortname:" + standard.short_name );
                $('<option value='+standard.id+'>' + standard.short_name + ' (' + standard.location + ') ' + standard.date_string() + '</option>').appendTo('.currency'+2+' .standard .option-list');
            });
        }
    }
}