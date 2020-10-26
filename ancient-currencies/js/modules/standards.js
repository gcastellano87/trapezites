import { Coins } from './coins.js';
/*-------------------------------------------*/
/*--------------- STANDARDS -----------------*/
/*-------------------------------------------*/
// TODO:  Change the way "version of standard" is created


import { RangedItems } from './utils/ranged_items.js';
import { RangedCoins } from './utils/ranged_coins.js';

export class StandardVersion extends RangedItems {
    constructor(coins) {

        this.coins      = coins;
        super(coins);
        this._region     = this.initialize_region();
        this._location   = this.initialize_location();
        this._name       = this.initialize_name();
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

    initialize_name() {
        let all_standard_by_locations     = this.coins.map(coin => coin.standard_by_location);
        let unique_standard_by_locations  = [...new Set(all_standard_by_locations)];

        if (unique_standard_by_locations.length != 1 ){
            console.error("Data Error: Each Standard should have only one standard_by_location.  This one had " + unique_standard_by_locations.length, unique_standard_by_locations,this);
        }
        // console.log(unique_standard_by_locations);
        return unique_standard_by_locations[0];  
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
    arrays_equal: function(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        a.sort((y, z) => (y.denomination > z.denomination) ? 1 : -1)
        b.sort((y, z) => (y.denomination > z.denomination) ? 1 : -1)
        
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      },
    initialize_list: function(coins) {
      
        let the_coins = coins.ranged_items;

        // Make an array of all of the standards by location
        let standards_by_locations = [...new Set(the_coins.map(function(coin){return coin.standard_by_location}))];

        // Create a slot to store coins by standard and location
        let standards_by_locations_with_coins_slot = standards_by_locations
            .filter(function(standard){if (standard){ return standard;}})
            .map(function(standard){ return {name: standard, coins: []}})

        // Fill the slot with coins by standard and location
        the_coins.forEach(function(coin){
            standards_by_locations_with_coins_slot.forEach(function(standard){
                if ( standard.name === coin.standard_by_location){
                    standard.coins.push(coin);
                }
            })
        })
        // Display the coins
        console.table(standards_by_locations_with_coins_slot);


        let versioned_standards = [];
        console.log("starting ---------------------")
        standards_by_locations_with_coins_slot.forEach(function(s){
            // console.log("count coins:", s.coins.length);

            let ranged_standard_coins = new RangedCoins(s.coins);

            let periods= ranged_standard_coins.distinct_periods;
            // console.log(ranged_standard_coins);
            // let coins_grouped_by_standard = ranged_standard_coins.grouped_by_distinct_periods();
            // coins_grouped_by_standard.forEach(coin_group => {
            //     versioned_standards.push(new StandardVersion(coin_group));
            // });
        });

        console.table(versioned_standards);
        // let standards_by_location_with_coins = standards_by_locations_with_coins_slot;
        window.standards_by_locations = versioned_standards;
        // console.table(standards_by_location_with_coins);
        
        // let standards_version = [];

        // standards_by_location_with_coins.forEach(function(standard){
        //     let earliest = standard.coins.sort(function(a,b){ return a.range.start.compare(b.range.start);})[0].start;
        //     let latest = standard.coins.sort(function(a,b){ return a.range.start.compare(b.range.end);})[standard.coins.length-1].end;
        //     let num_of_periods = Array(Math.ceil((end - start)/increment)).fill("");
        //     num_of_periods.forEach
        // })
        // // console.log("Coins as RangedItems");
        // // window.coins_as_RangedItems = new RangedItems(coins, 25);
        // // console.log("Coins AFTER RangedItems");
        // Standards.list = standards_by_location_with_coins
        //     .map(function(standard,index){
        //         return new StandardVersion(index, standard.name, standard.coins);})
        //     .sort(function(a,b) {
        //         var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        //         var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        //         if (nameA < nameB) {
        //           return -1;
        //         }
        //         if (nameA > nameB) {
        //           return 1;
        //         }

        //         return 0;
        //       });
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

        let start_date = period.range.start_date;
        let end_date = period.range.end_date;

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