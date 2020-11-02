import { Coins } from './coins.js';
/*-------------------------------------------*/
/*--------------- STANDARDS -----------------*/
/*-------------------------------------------*/
// TODO:  Change the way "version of standard" is created


import { DatRange } from './utils/dat_range.js';
import { RangedItems } from './utils/ranged_items.js';
import { RangedCoins } from './utils/ranged_coins.js';

export class StandardVersion {
    constructor(coins, name ='', location = '', region = '') {
        this._region     = region || this.initialize_region(coins);
        this._location   = location || this.initialize_location(coins);
        this._name       = name || this.initialize_name(coins);
        this.coins      = new RangedItems(coins);
        this.standard_version_name =  this.name + " " + this.coins.string;
    }
    get name() {
        return this._name;
    }
    
    get region() {
        return this._region;
    }
    
    get location() {
        return this._location;
    }

    initialize_name(coins) {
        let all_standard_by_locations     = coins.map(coin => coin.standard_by_location);
        let unique_standard_by_locations  = [...new Set(all_standard_by_locations)];

        if (unique_standard_by_locations.length != 1 ){
            console.error("Data Error: Each Standard should have only one standard_by_location.  This one had " + unique_standard_by_locations.length, unique_standard_by_locations,this);
        }
        // console.log(unique_standard_by_locations);
        return unique_standard_by_locations[0];  
    }

    initialize_region(coins) {
        let all_regions     = coins.map(coin => coin.region);
        let unique_regions  = [...new Set(all_regions)];

        if (unique_regions.length != 1 ){
            console.error("Data Error: Each Standard should have only one region.  This one had " + unique_regions.length, unique_regions,this);
        }
        // console.log(unique_regions);
        return unique_regions[0];
    }

    initialize_location(coins) {
        let all_locations     = coins.map(coin => coin.location);
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
        text: '',
    },
    initialize: function(coins_json) {
        console.log('initializing standards');
        Standards.initialize_list(coins_json);
        // console.log('Standards', Standards.list);
        Standards.build_dropdown();
    },
    initialize_list: function(coins) {
    //   console.log('coins',coins);
      
        let the_coins = coins.ranged_items;

        // Make an array of all of the standards by location
        let standards_by_locations = [...new Set(coins.map(function(coin){return coin.standard_by_location}))];
        // console.table('standards_by_locations',standards_by_locations);
        
        // Create a slot to store coins by standard and location
        let standards_by_locations_with_coins_slot = standards_by_locations
            .filter(function(standard){if (standard){ return standard;}})
            .map(function(standard){ return {name: standard, coins: [], location: ""}})

        // Fill the slot with coins by standard and location
        coins.forEach(function(coin){
            standards_by_locations_with_coins_slot.forEach(function(standard){
                if ( standard.name === coin.standard_by_location){
                    standard.coins.push(coin);
                }
            })
        })
        // Display the coins
        // console.table(standards_by_locations_with_coins_slot);
        let versioned_standards = [];
        // console.log("starting ---------------------")
        let total_periods = 0;
        let periods_with_coins = 0;
        standards_by_locations_with_coins_slot.forEach(function(s){
            // console.log('standard name without version: ',s.name);
            
            let ranged_standard_coins = new RangedCoins(s.coins);

            let periods= ranged_standard_coins.distinct_periods;
            total_periods += periods.ranged_items.length;
            // console.log('periods to make standards',periods.ranged_items.length );
            
            periods.ranged_items.forEach(function(period){
                // console.log('coins before filter: ',s.coins);
                
                let coins_in_period = s.coins.filter(coin => { 
                    // console.log('coin.range',coin.range.string);
                    // console.log('period.range',new DatRange(period.range).string);
                    
                    return coin.range.overlaps(new DatRange(period.range))
                });
                // console.log('coins after filter',coins_in_period);
                
                if (coins_in_period.length > 0){
                    periods_with_coins++;
                    versioned_standards.push(new StandardVersion(coins_in_period))
                }
            });

        });
        
        // console.table(versioned_standards);
        return this.list = versioned_standards;
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
    set_text_filter: function(text){
        Standards.active_filters.text = text;
    },
    period_filter: function(standard){
        return Standards.active_filters.period.range.overlaps(standard.coins.range);
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
    text_filter: function(standard){
        let text = Standards.active_filters.text;
        if (text){
            return standard.standard_version_name.includes(text);
        } else {
            return true;
        }
    },
    get_filtered_list: function(){
        return Standards.get_list()
            .filter(Standards.period_filter)
            .filter(Standards.region_filter)
            .filter(Standards.text_filter);
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
                $('<option value='+standard.id+'>' + standard.standard_version_name + '</option>').appendTo('.currency'+2+' .standard .option-list');
            });
        }
    }
}