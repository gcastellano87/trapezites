
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


/*-------------------------------------------*/
/*--------------- STANDARDS -----------------*/
/*-------------------------------------------*/
var standard = {
    "id": '',
    "name": '',
    "location": '',
    "coins": [],
    "region": '',
    "start_date": '',
    "end_date": '',
}

var standards = {
    list: [],
    filtered_list: [],
    initialize (coins_json) {
        console.log('initializing standards');
        standards.list = standards.build_list(coins_json);
        standards.build_dropdown();
    },
    build_list: function(coins) {
        console.log('building standards list');
        let standards = new Set();
        standardsArray = [];
        for (let i in coins) {
            standards.add(coins[i]['version of standard']);
        }
        let id = 0;
        for (let i of standards) {
            stdCoinTemp = [];
            newStandard = Object.create(standard);
            newStandard['name'] = i;
            newStandard['id'] = id;
            for (let k of coins) {
                if(k['version of standard'] == i) {
                    stdCoinTemp.push(k);
                    newStandard['location'] = k['location'];
                    newStandard['region'] = k['region'];
                }
            }
            newStandard['coins'] = stdCoinTemp;
            standardsArray.push(newStandard);
            newStandard['start_date'] = app.get_dates(i)[0];
            newStandard['end_date'] = app.get_dates(i)[1];
            id++;
        }
        return standardsArray;
    },
    build_dropdown: function() {
        console.log('building standards dropdown');
        for (let item of standards.list) {
            let metaTempHtml = item['name'];
            tempHtml = $('<option value='+item['id']+'>' +metaTempHtml +'</option>');
            $(tempHtml).appendTo('.currency'+2+' .standard .option-list');
        }
    },
    build_filtered_list: function(id, filterType) {
        console.log('building standards filtered list');
        if (filterType == 'p') {
            let start_date = periods.list[id]['start_date'];
            let end_date = periods.list[id]['end_date'];
            //console.log(start_date, end_date);
            let filtered = [];
            for (let standard of standards.list) {
                if (standard['start_date'] <= start_date && standard['start_date'] >= end_date) {
                    filtered.push(standard);
                } else if (standard['end_date'] >= end_date && standard['end_date'] <= start_date) {
                    filtered.push(standard);
                }
            }
            standards.filtered_list = filtered;
            standards.filter();
        } else if (filterType == 'r') {
            let region = regions.list[id];
            //console.log(region);
            let filtered = [];
            for (let standard of standards.list) {
                if (standard['region'] == region['name']) {
                    filtered.push(standard);
                }
            }
            standards.filtered_list = filtered;
            standards.filter();
        }

    },
    filter: function() {
        $('.standard .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of standards.filtered_list) {
                if (item['name'] == this.text) {
                    this.disabled = false;
                }
            }
        });
    }
}

/*-------------------------------------------*/
/*---------------- REGIONS ------------------*/
/*-------------------------------------------*/
var region = {
    "id": '',
    "name": '',
    "locations": [],
    "coins": [],
    "standards": []
}

var regions = {
    selected_region: {},
    list: [],
    filtered_list_coins: [],
    filtered_list_standards: [],
    initialize: function(coins_json) {
        console.log('initializing regions');
        regions.list = regions.build_list(coins_json);
        regions.build_dropdown();
    },
    build_list: function (coins) {
        console.log('building regions list');
        let regions = new Set();
        regionArray = [];
        for (let i in coins) {
            regions.add(coins[i]['region'])
        }
        //console.log(regions);
        let id = 0;
        for (let i of regions) {
            regCoinTemp = [];
            regLocTemp = [];
            regStdTemp = [];
            newRegion = Object.create(region);
            newRegion['name'] = i;
            newRegion['id'] = id;
            for (let k of coins) {
                if (k['region'] == i) {
                    //console.log('tru');
                    regLocTemp.push(k['location']);
                    regCoinTemp.push(k);
                    regStdTemp.push(k['version of standard']);
                }
            }
            //console.log(region);
            newRegion['locations'] = regLocTemp;
            newRegion['coins'] = regCoinTemp;
            newRegion['standards'] = regStdTemp;
            regionArray.push(newRegion);
            id++;
        }
        return regionArray;
    },
    build_dropdown: function () {
        console.log('building regions dropdown');
        $('.currency1 .region .option-list').change(function() { //option selection event listener
            //console.log($(this).children('.option-list :selected').val());
            let id = $(this).children('.option-list :selected').val();
            coins.build_filtered_list(id,'r');
            periods.build_filtered_list(id);
            //standards.build_filtered_list(id);
        });

        $('.currency2 .region .option-list').change(function() { //option selection event listener
            //console.log($(this).children('.option-list :selected').val());
            let id = $(this).children('.option-list :selected').val();
            standards.build_filtered_list(id,'r');
        });

        for (let item of regions.list) {
            let str = item['name'];
            let tempHtml = $('<option value='+item['id']+'>'+ str+ '</option>');
            $(tempHtml).appendTo('.currency1 .region .option-list');
            let tempHtml2 = $('<option value='+item['id']+'>'+ str+ '</option>');
            $(tempHtml2).appendTo('.currency2 .region .option-list');
        }
    },
    build_filtered_list: function () {
        console.log('building regions filtered list');
        //loop through coins
        let coinsRegions = new Set();
        let standardsRegions = new Set();
        for (let coin of coins.filtered_list) {
            coinsRegions.add(coin['region']);
        }
        for (let standard of standards.filtered_list) {
            standardsRegions.add(standard['region']);
        }
        regions.filtered_list_coins = coinsRegions;
        regions.filtered_list_standards = standardsRegions;
        regions.filter();
    },
    filter: function () {
        $('.currency1 .region .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of regions.filtered_list_coins) {
                if (item == this.text) {
                    this.disabled = false;
                }
            }
        });
        $('.currency2 .region .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of regions.filtered_list_standards) {
                if (item == this.text) {
                    this.disabled = false;
                }
            }
        });
    }
}

/*-------------------------------------------*/
/*---------------- PERIODS ------------------*/
/*-------------------------------------------*/
var period = {
    'start_date': '',
    'end_date': ''
}

var	periods = {
	selected_period: {}, 
    list: [],
    filtered_list: [],
    initialize: function(coins_json){
        console.log('initializing periods');
        periods.list = periods.build_list(coins_json);
        periods.build_dropdown();
    },
    build_list: function(coins) {
        console.log('building periods list');
        // find min and max dates
        let minYear = 9999;
        let minSuf = 'AD';
        let maxYear = 9999;
        let maxSuf = 'BC';

        for (let item of coins) {
            // let startDate = item['start_date'];
            // let endDate = item['end_date'];
            // startDates.add(startDate);
            // endDates.add(endDate);
            if (periods.compare_years(item['start_date_year'],item['start_date_suf'],
                             minYear, minSuf) < 0) {
                minYear = item['start_date_year'];
                minSuf = item['start_date_suf'];
            }
            if (periods.compare_years(item['end_date_year'],item['end_date_suf'],
                             maxYear, minSuf) > 0) {
                maxYear = item['end_date_year'];
                maxSuf = item['end_date_suf'];
                //console.log(maxYear);
                //console.log(maxSuf);
            }
        }
        let min = minYear+' '+minSuf;
        let max = maxYear+' '+maxSuf;

         //console.log('min '+min);
         //console.log('max '+max);

        //round up or down
        minYear = Math.ceil(parseInt(minYear)/25)*25;
        maxYear = Math.ceil(parseInt(maxYear)/25)*25;
        min = minYear;
        max = maxYear;
        // console.log('rounded min '+min);
        // console.log('rounded max '+max);

        result = [];
        while (periods.compare_years(minYear, minSuf, maxYear, maxSuf) == -1){
            prd = Object.create(period);
            let periodEnd;
            if (minSuf == 'BC') {
                periodEnd = minYear - 24;
                prd['start_date'] = min;
                prd['end_date'] = periodEnd;
                result.push(prd);
                minYear = minYear - 25;
                if (minYear == 0) {
                    minSuf = 'AD';
                }
            } else {
                periodEnd = minYear + 24;
                prd['start_date'] = min;
                prd['end_date'] = periodEnd;
                result.push(prd);
                minYear = minYear + 25;
            }
            min = minYear;
        }

        return result;
    },
    build_dropdown: function(){
        console.log('building periods dropdown');
        $('.period .option-list').change(function() { //option selection event listener
            //console.log($(this).children('.option-list :selected').val());
            let id = $(this).children('.option-list :selected').val();
            coins.build_filtered_list(id,'p');
            standards.build_filtered_list(id,'p');
            regions.build_filtered_list();
        });

        let id = 0;
        for (let item of periods.list) {
            let str = item['start_date']+' BC to '+item['end_date']+ ' BC';
            let tempHtml = $('<option value='+id+'>'+ str +'</option>');
            //let tempHtml = item;
            $(tempHtml).appendTo('.period .option-list');
            id++;
        }
    },
    build_filtered_list: function(id){
    //todo: need to write filtering functions for periods dropdown
        //console.log('reached filtered list');
        console.log(coins.filtered_list);
        /*if (regions.selected_region === {}){
            return periods.list;
        }

        return periods.list.filter(function(period){
            return period.start_date >= regions.selected_region.start_date && period.end_date <= regions.selected_region.end_date;
        })*/
    },
    filter: function () {

    },
    //compares years for building periods
    compare_years: function(num1,suf1,num2,suf2) {
        // console.log('comparing years '+num1+' '+suf1+' '+num2+' '+suf2);
        if (num1 == num2 && suf1 == suf2) {
            return 0;
        }
        else {
            if (suf1 == 'BC' && suf2 == 'AD') {
                return -1;
            }
            else if (suf1 == 'AD' && suf2 == 'BC') {
                return 1;
            }
            else if (suf1 == 'BC' && suf2 == 'BC') {
                // console.log('both BC');
                return num1 > num2 ? -1 : 1;
            }
            else { //both AD
                return num1 < num2 ? -1 : 1;
            }
        }
    }
}


/*-------------------------------------------*/
/*----------------- COINS -------------------*/
/*-------------------------------------------*/
var coins = {
    selected_coin: {},
    list: [],
    filtered_list: [],
    initialize: function(coins_json){
        console.log('initializing coins');
        coins.list = coins.build_list(coins_json);
        coins.build_dropdown(coins_json);
    },
    build_list: function(entries){
        console.log('building coins list');
        let listTemp = [];
        let id = 0;
        for (let i in entries) {
            let obj = entries[i];
            obj['id'] = id;
            id++;
            listTemp.push(obj);
        }
        //console.log(listTemp);
        return listTemp;
    },
    build_dropdown: function(){
        console.log('building coins dropdown');
        $('.denomination-location .option-list').change(function() {
            //console.log($(this).children('.option-list :selected').val());
            let id = $(this).children('.option-list :selected').val();
            coins.on_coin_selected(id);
        });
        for (let item of coins.list) {
            let metaTempHtml = item['denomination']+ '; '+item['location'];
            tempHtml = $('<option value='+item['id']+'>' +metaTempHtml +'</option>');
            $(tempHtml).appendTo('.currency'+1+' .denomination-location .option-list');
        }
    },
    build_filtered_list: function(id, filterType){
        console.log('building coins filtered list');
        if (filterType == 'p') { //if period dropdown selected
            let start_date = periods.list[id]['start_date'];
            let end_date = periods.list[id]['end_date'];
            let filtered = [];
            for (let coin of coins.list) {
                if (coin['start_date_year'] <= start_date && coin['start_date_year'] >= end_date) {
                    filtered.push(coin);
                } else if (coin['end_date_year'] >= end_date && coin['end_date_year'] <= start_date) {
                    filtered.push(coin);
                }
            }
            coins.filtered_list = filtered;
            coins.filter();
        } else if (filterType == 'r') { //if region dropdown selected
            let region = regions.list[id];
            //console.log(region);
            let filtered = [];
            for (let coin of coins.list) {
                if (coin['region'] == region['name']) {
                    filtered.push(coin);
                }
            }
            coins.filtered_list = filtered;
            coins.filter();
            periods.build_filtered_list(id);
        }
    },
    filter: function () {
        $('.denomination-location .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of coins.filtered_list) {
                let name = item['denomination']+ '; '+item['location'];
                if (name == this.text) {
                    this.disabled = false;
                }
            }
        });
    },
    on_coin_selected: function(id){
        console.log('coin selected');
        //if period !selected
        //else if
        for (let item of coins.list) {
            if (item['id'] == id) {
                selected_coin = item;
            }
        }
        //call conversion functions
    },
    //todo: write conversion functions
    coins_by_decreasing_value: function(){
        //return [];
    },
    display_value_in_coins: function(value_in_silver){
       // the_coins = this.convert_silver_to_coins_in_standard(value_in_silver)
       //for each coin generate html for
       // return html;
    },
    convert_silver_to_coins_in_standard: function(value_in_silver){
       // loop through standard.coins_by_decreasing_value

       // return number of each coin
    }

}

/*-------------------------------------------*/
/*------------------ APP --------------------*/
/*-------------------------------------------*/
var app = {
    entries: [],
    initialize: function(){
        app.get_json();
        //console.log(app.entries);
    },
    get_json: function(){ //gets json frm http request
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                json = JSON.parse(req.responseText);
                //console.log(json.entries);
                entries = json.entries;

                //separates commodities from currencies
                let listTemp = [];
                for (let i in entries) {
                    let obj = entries[i];
                    obj['start_date_year'] = parseInt(obj['start_date']);
                    obj['start_date_suf'] = obj['start_date'].slice(-2);
                    obj['end_date_year'] = parseInt(obj['end_date']);
                    obj['end_date_suf'] = obj['end_date'].slice(-2);
                    if (obj['commodity or service'] != 'x') {
                        listTemp.push(obj);
                    }
                }
                //calling initialize functions for objects
                coins.initialize(listTemp);
                standards.initialize(listTemp);
                periods.initialize(listTemp);
                regions.initialize(listTemp);
            }
        }

        req.open("GET", "https://api.jsonbin.io/b/5f04a20b343d624b07816015/4", true);
        req.setRequestHeader("secret-key", "$2b$10$yjrD4Y8FJuGo2.cLYkzKP.FI6SCpY5GW8JUazMgOxXUnYi8Tf0MT2");
        req.send();
    },
    get_dates: function(standard) { //function extracts start_date and end_date from standard name
        stdName = standard;
        var ifNum = /\d/;
        var bc = "BC";
        var start_date = '';
        var end_date = '';
        var dates = [];

       // console.log(standard);
        var numId = stdName.match(ifNum);
        var bcId = stdName.match(bc);
        var hyphenId = stdName.indexOf('–');
        start_date = stdName.substring(numId['index'], hyphenId);
        end_date = stdName.substring(hyphenId+1,bcId['index']-1);
        dates = [start_date, end_date];

        return dates;
    }

}


document.addEventListener("DOMContentLoaded", app.initialize());


