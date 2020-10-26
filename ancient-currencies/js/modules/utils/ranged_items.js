/*--------------------------------------------------*/
/*------------------ RANGED ITEMS ------------------*/
/*--------------------------------------------------*/
import { Dat } from './dat.js';
import { DatRange } from './dat_range.js';

export class RangedItems extends DatRange {
    constructor(array_of_ranged_items = []){
        if (!Array.isArray(array_of_ranged_items)){
            console.error("RangedItems must be passed an array");
        }
        if (array_of_ranged_items.length > 0){
            array_of_ranged_items.forEach(function(item){
                if (typeof item.range === "undefined"){
                    console.error("RangedItems must be passed an array of objects with a method called range");
                }    
            })

            let first = array_of_ranged_items.sort(function(a,b){ 
                if (!(a.range instanceof DatRange)){
                    console.error("RangedItems must all respond to a method called 'range' by providing an instance of DatRange, this 'event' range was:", a.range);
                }
                return a.range.start.compare(b.range.start);
            })[0];
            let last = array_of_ranged_items.sort(function(a,b){ 
                if ((!(a.range instanceof DatRange))){
                    console.error("RangedItems must all respond to a method called 'range' by providing an instance of DatRange, this 'event' range was:", a.range);
                }
                return a.range.start.compare(b.range.start);
            })[0];

            super({start: first.range.start,end: last.range.end });
        } else  {
            super({start: new Dat(0),end: new Dat(0) });
        }

        this.ranged_items = array_of_ranged_items;
        
    }

    
    get is_empty(){
        return this.ranged_items.length === 0;
    }

    get is_single(){
        return this.ranged_items.length === 1;
    }

    get sorted_by_end(){
        return this.ranged_items.sort(function(a,b){
            return a.range.end.compare(b.range.end);
        });
    }

    get sorted_by_start(){
        return this.ranged_items.sort(function(a,b){
            return a.range.start.compare(b.range.start);
        });
    }

    get ends_first(){
        return this.sorted_by_end[0];
    }

    get ends_last(){
        return this.sorted_by_end[this.ranged_items.length-1];
    }

    get starts_first(){
        return this.sorted_by_start[0];
    }

    get starts_last(){
        return this.sorted_by_start[this.ranged_items.length-1];
    }

    get end(){
        return this.ends_last.range.end;
    }

    get start(){
        return this.starts_first.range.start;
    }

    add_item(item){
        console.log("im in ADD item")
console.log('item',item);

        if (typeof item.range === "undefined"){
            console.error("All Items must have a method called 'range'");
        } 
        if (!(item.range instanceof DatRange)){
            console.error("All Items must respond to a method called 'range' by providing an instance of DatRange, this 'event' range was:", item.range);
        }
        // console.log("here's the item:", item);

        this.ranged_items.push(item);
    }

    are_ranged_items_equal(ranged_items1,ranged_items2 ){
        if (typeof ranged_items1 === "undefined" ){
            console.error("RangedItems.compare must be passed a Ranged Item, got:", ranged_items1);
        }
        if (typeof ranged_items2 === "undefined" ){
            console.error("RangedItems.compare must be passed a Ranged Item, got:", ranged_items2);
        }  
        if (!(ranged_items1 instanceof RangedItems)){
            console.error("RangedItems.compare must be passed a Ranged Item, got:", ranged_items1);
        }        
        if (!(ranged_items2 instanceof RangedItems)){
            console.error("RangedItems.compare must be passed a Ranged Item, got:", ranged_items2);
        }
        if (ranged_items1.length != ranged_items2.length){
            return false;
        } else{
            const objectsEqual = (o1, o2) => Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every(p => o1[p] === o2[p]);
            
            console.log('ranged_items1',ranged_items1);
            console.log('ranged_items2',ranged_items2);
            window.yourmomsass = ranged_items1;
            window.yourdsdsass = ranged_items2;
            // Sort them 
            var r1 = ranged_items1.sorted_by_start;
            var r2 = ranged_items2.sorted_by_start;


            // returns false unless each item in ranged_items matches each item in the current object
            return r1.every(function(item, index){
                return objectsEqual(item, r2[index]);
            })
        }
    }

    has_start_date(start_dat){
        return this.ranged_items.filter(function(item){
            return item.start === start_dat;
        })
    }

    has_end_date(end_dat){
        return this.ranged_items.filter(function(item){
            return item.end === end_dat;
        })
    }
  
}