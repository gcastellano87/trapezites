/*--------------------------------------------------*/
/*------------------ RANGED COINS ------------------*/
/*--------------------------------------------------*/
import { Dat } from './dat.js';
import { DatRange } from './dat_range.js';
import { RangedItems } from './ranged_items.js';

export class RangedCoins extends RangedItems {
    constructor(coins, increment = 25){
        super(coins);
        this.increment = increment;
        this._periods = this.initialize_periods();
        this._distinct_periods = this.initialize_distinct_periods();
    }
    get periods(){
        return this._periods;
    }
    get distinct_periods(){
        return this._distinct_periods;
    }

    initialize_distinct_periods(){
        let distinct_periods = new RangedItems();
        let coins = this.sorted_by_start;
        let parent_this = this;
        // console.table(coins);
        // console.log('distinctperiod',distinct_periods.ranged_items)
        // console.log('distinctperiod.length',distinct_periods.ranged_items.length)
        // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        // console.log('this.periods',this.periods);
        // console.log('this.periods start',this.periods.start.abs);
        // console.log('this.periods end',this.periods.end.abs);
        // console.log('distinct_periods end',distinct_periods.range.end.abs);
        // console.log('starting coins',coins);
        // console.log('distinct_periods.ranged_items.length , distinct_periods.range.end.abs,this.periods.end.abs',distinct_periods.ranged_items.length , distinct_periods.range.end.abs,this.periods.end.abs);
        // console.log(' this.periods.ranged_items', this.periods.ranged_items);
        
        let the_periods = this.periods.ranged_items;
        the_periods.forEach(function(period, index) {

            if (index === 0){
                distinct_periods.add_item(period.range);
                // if the period's ranged items are the same as the last period's ranged items, then 
            } else if ( (period.ranged_items.length > 0) && ( the_periods[index-1].ranged_items.length > 0 ) &&  parent_this.are_ranged_items_equal(period.ranged_items,the_periods[index-1].ranged_items)) {
                distinct_periods.ends_last.range.end = period.range.end;
            } else {
                distinct_periods.add_item(period.range);
            }
        });
        

        // console.log('distinct_periods',distinct_periods);
        // console.log('NUM distinct_periods',distinct_periods.ranged_items.length);
        // console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');

        // console.table(distinct_periods);
        return distinct_periods;
    }

    initialize_periods(){
        
        // console.log('ranged_items',this.ranged_items);
        // console.log('this',this);
        let the_items       = this.ranged_items;
        var start           = this.starts_first.range.start.abs;
        var end             = this.ends_last.range.end.abs;
        let increment       = this.increment;
        // console.log("start", start);
        // console.log("end", end);
        // console.log("increment", increment);
        var num_of_periods  = Array(Math.ceil((end - start)/increment)).fill("");
    // console.log("num_of_periods", num_of_periods)
        var array_of_periods = num_of_periods.map(function(period,index){
            // console.log("start+(index*increment)", start+(index*increment));
            var start_year = start+(index*increment);
            var end_year = start+((index+1)*increment);
    
            // There is no year zero
            if (start_year === 0 ){
                start_year = 1;
            } 
            if (end_year === 0){
                end_year = -1;
            }
    
            var range = new DatRange({
                start:  new Dat(start_year),
                end:    new Dat(end_year),
            });
            let overlapping_ranged_items = the_items.filter(function(event){
                return event.range.contains(range);
            });
            return { 
                range:          range,
                ranged_items:   overlapping_ranged_items,
            }
        })

        let periods = new RangedItems(array_of_periods);
        // console.log("forking periods", periods)
    
        return periods;        
    }
}