/*----------------------------------------------*/
/*------------------ DATRANGE ------------------*/
/*----------------------------------------------*/

import { Dat } from './dat.js';

export class DatRange {
    constructor(date_range_string_or_dats){
        this._range = this.initialize_range(date_range_string_or_dats);
    }

    set start(new_start){
        if (new_start instanceof Dat){
            this._range.start = new_start;
        } else {
            console.error("Type Error: DatRange start parameter must be Dat.  We got:", new_start);
        }
    }

    set end(new_end){
        if (new_end instanceof Dat){
            this._range.end = new_end;
        } else {
            console.error("Type Error: DatRange end parameter must be Dat.  We got:", new_end);
        }
    }

    get start(){
        return this._range.start;
    }

    get end(){
        return this._range.end;
    }

    get duration(){
        return this.end.abs - this.start.abs;
    }

    get range(){
        // console.log("range",this._range)
        return this._range;
    }

    set range(date_range_string_or_dats){
        this._range = this.initialize_range(date_range_string_or_dats);
    }

    get string(){
        return this.as_string();
    }


    starts_before(dat_or_drange){
        if (dat_or_drange instanceof Dat){
            return this.start.before(dat_or_drange);
        } else if (dat_or_drange instanceof DatRange ){
            return this.start.before(dat_or_drange.start);
        } else {
            console.error("Type Error: DatRange.contains parameter must be Dat or DatRange.  We got:", dat_or_drange);
        }
    }

    ends_after(dat_or_drange){
        if (dat_or_drange instanceof Dat){
            return this.end.after(dat_or_drange);
        } else if (dat_or_drange instanceof DatRange ){
            return this.end.after(dat_or_drange.end);
        } else {
            console.error("Type Error: DatRange.contains parameter must be Dat or DatRange.  We got:", dat_or_drange);
        }
    }

    starts_same_or_before(dat_or_drange){
        if (dat_or_drange instanceof Dat){
            return this.start.equal_or_before(dat_or_drange);
        } else if (dat_or_drange instanceof DatRange ){
            return this.start.equal_or_before(dat_or_drange.start);
        } else {
            console.error("Type Error: DatRange.contains parameter must be Dat or DatRange.  We got:", dat_or_drange);
        }
    }

    ends_same_or_after(dat_or_drange){
        if (dat_or_drange instanceof Dat){
            return this.end.equal_or_after(dat_or_drange);
        } else if (dat_or_drange instanceof DatRange ){
            return this.end.equal_or_after(dat_or_drange.end);
        } else {
            console.error("Type Error: DatRange.contains parameter must be Dat or DatRange.  We got:", dat_or_drange);
        }
    }

    // Returns true if the dat_range or dat given contains the dat_range
    contains(dat_or_drange){
        return this.starts_same_or_before(dat_or_drange) && this.ends_same_or_after(dat_or_drange) ;
    }

    // Returns true if the dat_range or dat given contains the dat_range
    contains_exclusive(dat_or_drange){
        return this.starts_before(dat_or_drange) && this.ends_after(dat_or_drange) ;
    }

    // Returns true if the dat_range given overlaps with the dat_range
    overlaps(dat_range){
        if (!(dat_range instanceof DatRange)){
            console.error("Type Error: DatRange.contains parameter must be DatRange");
        }
        return this.contains_exclusive(dat_range.start) || this.contains_exclusive(dat_range.end);
    }


    as_string(format = 'default'){
        if (format === "full" || format === "both"){
            return this.start.as_string('full') + '-' + this.end.as_string('full');
        } else if (format == "default") {
            return this.start.as_string('year') + '-' + this.end.as_string('full');
        } else {
            console.error("Invalid format passed to Dat.as_string()");
            return this.start.as_string('year') + '-' + this.end.as_string('full');
        }
    }

    initialize_range(date_range_string_or_dats){
        // console.log("date_range_string_or_dats", date_range_string_or_dats)
        if ( typeof date_range_string_or_dats === 'string') {
            this.range_string = this.find_range_string(date_range_string_or_dats);
            return this.parse_range_string();
        } else if ( typeof date_range_string_or_dats === 'object' && date_range_string_or_dats !== null && date_range_string_or_dats.hasOwnProperty('start') && date_range_string_or_dats.start instanceof Dat && date_range_string_or_dats.hasOwnProperty('end') && date_range_string_or_dats.end instanceof Dat ) {
            return date_range_string_or_dats;
        } else {
            console.error("DatRange requires either a string or an object containing a start key and an end key with Dat objects but it got:", date_range_string_or_dats);
            console.trace();
        }
    }

    parse_range_string(range_string = ""){
        range_string        = range_string || this.range_string;
        let default_era     = range_string.slice(-2);
        let two_dates       = range_string.split("–");

        if (two_dates.length != 2){
            console.error("Bad range string: ", this.range_string);
        }

        let start_string        = two_dates[0];
        let end_string          = two_dates[1];
        let start_string_era    = start_string.trim().slice(-2).match(/AD|BC/);

        if (!start_string_era){
            start_string = start_string + " " + default_era;
        }
        
        return {
            start: new Dat(start_string),
            end: new Dat(end_string)
        }

    }

    find_range_string(str){
        str = str.replace("B.C.E.", "BC").replace("BCE", "BC").replace("B.C.", "BC").replace("B.C", "BC").replace("A.D.", "AD").replace("A.D", "AD").replace("C.E.", "AD").replace("C.E","AD").replace("-","–");

        // find first digit
        let date_range_start = str.match(/\d/);

        // if there are no digits, exit early
        if (!date_range_start){
            return "";
        } else {
            date_range_start = date_range_start.index;
        }
        // console.log("date_range_start" + date_range_start);

        let range_ends_in_bc = str.lastIndexOf('BC') || str.lastIndexOf('BCE') || str.lastIndexOf('B.C.');
        // console.log("range_ends_in_bc" + range_ends_in_bc);

        let range_ends_in_ad = str.lastIndexOf('AD');

        // console.log("range_ends_in_ad" + range_ends_in_ad);

        let date_range_end = range_ends_in_ad > range_ends_in_bc ? range_ends_in_ad : range_ends_in_bc;

        // console.log("date_range_end" + date_range_end);
        if (date_range_end === -1){
            return "";
        }
        let date_range = str.substring(date_range_start, date_range_end+2);
        let hyphen = date_range.indexOf('–');
        
        if (hyphen === -1){
            return "";
        }
        
        return date_range;
    }

}
