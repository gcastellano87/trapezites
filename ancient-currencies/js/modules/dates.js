/*-------------------------------------------*/
/*------------------ DATES ------------------*/
/*-------------------------------------------*/

export class Dat {
    constructor(date_string){
        this.date   =  this.parse_date(date_string);
    }
    
    get era(){
        return this.date.era;
    }
    
    get year(){
        return this.date.year;
    }

    get abs() {
        if (this.date.era === "BC"){
            return -Math.abs(this.year);
        } else {
            return Math.abs(this.year);
        }
    }

    as_string(format = 'full'){
        if (format == "full"){
            return this.year + ' ' + this.era;
        } else if (format == "year" || format == "bare") {
            return this.year + "";
        } else if (format == "dots" ) {
            return this.year + " " + this.era.split("").join(".") + ".";
        } else {
            console.error("Invalid format passed to Dat.as_string()");
            return this.year + ' ' + this.era;
        }
    }

    parse_date(date_string){
        date_string = date_string.trim();
        let date_letters = date_string.match(/[A-Z]+/g).toString();
        let date_numbers = date_string.match(/\d+/);
        date_numbers = date_numbers[date_numbers.length-1]

        let date_object = {};
// console.log("date_letters",date_letters);
        if (date_letters === "BC" || date_letters === "BCE"){
            date_object.era = "BC";
        } else if (date_letters === "AD" || date_letters === "CE"){
            date_object.era = "AD";
        } else {
            date_object.era = "";
            console.error("Invalid era in date string: " + date_string);
        }

        if (date_numbers === 'undefined'){
            console.error("No year in date string: " + date_string);
        } else if (date_numbers > 9999 ){
            console.error("Invalid year in date string: " + date_string);
        } else {
            date_object.year = date_numbers;
        }

        return date_object;
    }
}

export class DatRange {
    constructor(date_range_string){
        this.range_string = this.find_range_string(date_range_string);
        this.range = this.parse_range_string();
    }

    get start(){
        return this.range.start;
    }

    get end(){
        return this.range.end;
    }

    get duration(){
        this.end.abs - this.start.abs;
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

    parse_range_string(range_string = ""){
        range_string = range_string || this.range_string;
        let default_era = range_string.slice(-2);
        let two_dates = range_string.split("–");

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