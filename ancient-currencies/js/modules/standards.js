/*-------------------------------------------*/
/*--------------- STANDARDS -----------------*/
/*-------------------------------------------*/
// TODO:  Change the way "version of standard" is created

import { Coins } from './coins.js';
import { DatRange } from './utils/dat_range.js';
import { RangedItems } from './utils/ranged_items.js';
import { RangedCoins } from './utils/ranged_coins.js';

export class StandardVersion {
    constructor(coins,id) {
        this._region                            =  this.initialize_region(coins);
        this._standard                          =  this.initialize_standard(coins);
        this._name                              =  this.initialize_name(coins);
        this._coords                            =  this.initialize_coords(coins);
        this._location                          = this.initialize_location(coins);
        this.version_id                         = id;
        this.coins                              = new RangedItems(coins);
        this.number_of_coins                    = this.coins.ranged_items.length;
        this.standard_version_name              = this.name + " " + this.coins.string;
        this.standard_version_name_as_option    = this.standard + " (" + this.number_of_coins+ " denoms)   " + this.location + "   " + this.coins.string;
        // this.standard_version_name_as_option    = "kljsadflkjl;kadsl;fjsldak;fjsdl;kfjdslk";
    }
    
    get name() {
        return this._name;
    }
    
    get standard() {
        return this._standard;
    }
    
    get region() {
        return this._region;
    }
        
    get location() {
        return this._location;
    }
    get coords() {
        return this._coords;
    }
    is_selected_standard(){
        return this.version_id === Standards.selected_standard.version_id ? 'selected' : '';
    }
    // returns an array of coins and the number of each coin
    // it takes to make the total grams of silver
    coin_conversion(grams_of_silver){
        let output = [];
        let coins_big_to_little = this.coins.ranged_items.sort((a,b) => {
            return b.value_in_grams_of_silver - a.value_in_grams_of_silver;            
        })
        // console.log('number_of_coins',coins_big_to_little.length);
        

        coins_big_to_little.forEach((coin,index) => {
            let coin_val = coin.value_in_grams_of_silver;
            // check to see if it's the last coin
            // express the value in last coin
            if(index == (coins_big_to_little.length-1)){
                if(grams_of_silver > 0){
                    output.push({
                        coin: coin, 
                        number: (grams_of_silver/coin_val)
                    });
                                        
                }
            } else if (grams_of_silver >= coin_val){
                output.push({
                    coin: coin, 
                    number: (Math.floor(grams_of_silver/coin_val))
                });
                grams_of_silver = grams_of_silver % coin_val;
            }
        });
        return output;
    }

    initialize_coords(coins) {
        let percent_of_image_x     = coins.map(coin => coin.percent_of_image_x);
        let unique_percent_of_image_x  = [...new Set(percent_of_image_x)];        
        let percent_of_image_y     = coins.map(coin => coin.percent_of_image_y);
        let unique_percent_of_image_y  = [...new Set(percent_of_image_y)];

        return {
            percent_of_image_x: unique_percent_of_image_x[0],
            percent_of_image_y: unique_percent_of_image_y[0]
        };
    }

    initialize_standard(coins) {
        let all_standards     = coins.map(coin => coin.standard);
        let unique_standards  = [...new Set(all_standards)];

        if (unique_standards.length != 1 ){
            console.error("Data Error: Each Standard should have only one standard.  This one had " + unique_standards.length, unique_standards,this);
        }
        // console.log(unique_standards);
        return unique_standards[0];  
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
    selected_standard: '',
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
        let version_id = 0;
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
                    versioned_standards.push(new StandardVersion(coins_in_period, version_id++))
                }
            });

        });
        
        // console.table(versioned_standards);
        return this.list = versioned_standards;
    },
    get_standard_by_id(id){
        return Standards.get_list().filter(standard => {return standard.version_id == id;})[0];
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
        if (Standards.active_filters.period){
            return Standards.active_filters.period.range.overlaps(standard.coins.range);
        } else {
            return true;
        }
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
        let text = Standards.active_filters.text.toLowerCase();
        if (text){
            return standard.standard_version_name.toLowerCase().includes(text);
        } else {
            return true;
        }
    },
    selected_coin_filter: function(standard){
        if(Coins.selected_coin){
            return Coins.selected_coin.range.overlaps(standard.coins.range);
        } else {
            return true;
        }
    },
    get_standards_by_range: function(range){
        return Standards.list.filter(function(standard){
            // console.log(range);
            return range.overlaps(standard.coins.range);
        })
    },
    get_filtered_list: function(){
        return Standards.get_list()
            .filter(Standards.selected_coin_filter)
            .filter(Standards.period_filter)
            .filter(Standards.region_filter)
            .filter(Standards.text_filter);
    },
    build_dropdown: function() {
        console.log('building standards dropdown');
        // Clear the dropdown
        $('.standard-to .standard-selector .option-list').empty();
        let standards = Standards.get_filtered_list();


        // console.table(standards)
        // console.table(Standards.get_list());
        // If there aren't any matches...
        if (standards.length === 0){
            $('<option value="" selected disabled hidden>No standards match...</option>').appendTo('.standard-to .standard-selector .option-list');
        } else {
            // Add a placeholder element
            if(Standards.selected_standard){
                $('<option value="" >--Clear Selection--</option>').appendTo('.standard-to .standard-selector .option-list');
            } else {
                $('<option value="" selected disabled hidden></option>').appendTo('.standard-to .standard-selector .option-list');
            }

            standards.forEach(standard => {
                // console.log("shortname:" + standard.short_name );
                $('<option ' + standard.is_selected_standard() + ' value='+standard.version_id+'>' + standard.standard_version_name_as_option + '</option>').appendTo('.standard-to .standard-selector .option-list');
            });
        }
    }
}