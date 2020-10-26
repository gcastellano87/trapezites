/*-------------------------------------------*/
/*-------------------- DAT ------------------*/
/*-------------------------------------------*/

export class Dat {
    constructor(date_string_or_num){
        if(isNaN(date_string_or_num)){
            this.date   =  this.parse_date_as_string(date_string_or_num);           
        } else {
            this.date   =  this.parse_date_as_num(date_string_or_num);
        }
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

    before(dat){
        return this.abs < dat.abs;
    }

    after(dat){
        return this.abs > dat.abs;
    }    
    
    equal_or_before(dat){
        return this.abs <= dat.abs;
    }

    equal_or_after(dat){
        return this.abs >= dat.abs;
    }    
    
    equals(dat){
        return this.abs === dat.abs;
    }

    compare(dat){
        // returns negative number if smaller, positive if better, 0 if same
        return this.abs - dat.abs;
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

    parse_date_as_string(date_string){
// console.log(date_string);
        date_string = date_string.trim().toUpperCase();
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
    parse_date_as_num(date_num){

        let date_object = {};

        date_object.year = Math.abs(date_num);

        if (date_num < 0 ){
            date_object.era = "BC";
        } else if (date_num > 0) {
            date_object.era = "AD";
        } else if (date_num === 0){
            // if the number is 0, make it 1 AD
            date_object.year = 1;
            date_object.era = "AD";
        }

        return date_object;
    }
}