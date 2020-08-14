
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

var standard = {
    "name": '',
    "location": '',
    "coins": [],
    "region": '',
    "start_date": '',
    "end_date": '',
   /* coins: [],
        coins_by_decreasing_value: function(){
            return [];
        },
        display_value_in_coins: function(value_in_silver){
           // the_coins = this.convert_silver_to_coins_in_standard(value_in_silver)
           //for each coin generate html for
           // return html;
        },
        convert_silver_to_coins_in_standard: function(value_in_silver){
           // loop through standard.coins_by_decreasing_value

           // return number of each coin
        }*/
}

var standards = {
    list: [],
    initialize (coins_json) {
        standards.list = standards.build_list(coins_json);
        //console.log(standards.list);
        standards.build_dropdown();
    },
    build_list: function(coins) {
        console.log('building standards list');
        let standards = new Set();
        standardsArray = [];
        for (let i in coins) {
            standards.add(coins[i]['version of standard']);
        }
        for (let i of standards) {
            stdCoinTemp = [];
            newStandard = Object.create(standard);
            newStandard['name'] = i;
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
        }
        return standardsArray;
    },
    build_dropdown: function() {
        console.log('building dropdown');
        console.log(standards.list);
        for (let item of standards.list) {
            let metaTempHtml = item['name'];
            tempHtml = $('<option>' +metaTempHtml +'</option>');
            $(tempHtml).appendTo('.currency'+2+' .standard .option-list');
        }
    },


}

var region = {
    "name": '',
    "locations": [],
    "coins": [],
    "standards": []
}

//REGIONS//
var regions = {
    selected_region: {},
    list: [],
    initialize: function(coins_json) {
        regions.list = regions.build_list(coins_json);
        console.log(regions.list);
        regions.build_dropdown();
    },
    build_list: function (coins) {
        let regions = new Set();
        regionArray = [];
        for (let i in coins) {
            regions.add(coins[i]['region'])
        }
        //console.log(regions);

        for (let i of regions) {
            regCoinTemp = [];
            regLocTemp = [];
            regStdTemp = [];
            newRegion = Object.create(region);
            newRegion['name'] = i;
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
        }
        return regionArray;
    },
    build_dropdown: function () {
        for (let item of regions.list) {
            let str = item['name'];
            let tempHtml = $('<option which="'+1+'" >'+ str+ '</option>');
            $(tempHtml).appendTo('.currency'+1+' .region .option-list');
            let tempHtml2 = $('<option which="'+2+'" >'+ str+ '</option>');
            $(tempHtml2).appendTo('.currency'+2+' .region .option-list');
        }
    }
	
}

// generate periods in between min and max
var period = {
    'start_date': '',
    'end_date': ''
}
//PERIODS//
var	periods = {
	selected_period: {}, 
    list: [],
    initialize: function(coins_json){
        periods.list = periods.build_list(coins_json);
        console.log(periods.list);
        periods.build_dropdown();
    },
    build_list: function(coins) {
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
        min = minYear+' '+minSuf;
        max = maxYear+' '+maxSuf;
        // console.log('rounded min '+min);
        // console.log('rounded max '+max);

        result = [];
        while (periods.compare_years(minYear, minSuf, maxYear, maxSuf) == -1){
            prd = Object.create(period);
            let periodEnd;
            if (minSuf == 'BC') {
                periodEnd = minYear - 24;
                prd['start_date'] = min;
                prd['end_date'] = periodEnd+' '+minSuf;
                result.push(prd);
                minYear = minYear - 25;
                if (minYear == 0) {
                    minSuf = 'AD';
                }
            } else {
                periodEnd = minYear + 24;
                prd['start_date'] = min;
                prd['end_date'] = periodEnd+' '+minSuf;
                result.push(prd);
                minYear = minYear + 25;
            }
            min = minYear+' '+minSuf;
        }

        return result;
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
    },
    build_dropdown: function(){
    		//periods.dropdown_element.appendTo(search elemtn)
    		//for each	periods.filtered_list();
    		//periods.dropdown_element.appendTo(<div class="period">)
        for (let item of periods.list) {
            let str = item['start_date']+' to '+item['end_date'];
            let tempHtml = $('<option>'+ str +'</option>');
            $(tempHtml).appendTo('.period .option-list');
        }
    },
	filtered_list: function(){
		if (regions.selected_region === {}){
			return periods.list;
		}

		return periods.list.filter(function(period){
			return period.start_date >= regions.selected_region.start_date && period.end_date <= regions.selected_region.end_date;
		})
	},
	dropdown_element: function(){
		let element = document.getElementByClass('period')[0];
		return element;
	},

}


//COINS//
var coins = {
    selected_coin: {},
    list: [],
    initialize: function(coins_json){
        console.log('reached');
        //coins.list = coins_json;
        console.log(coins_json);
        coins.list = coins_json;
        coins.build_dropdown(coins_json);
        //coins.build_dropdown();
    },
    filtered_list: function(){

    },
    dropdown_element: function(){

    },
    build_dropdown: function(){
        //add_event_listener(coins.on_coin_selected(coin));
        console.log(coins.list);
        for (let item of coins.list) {
            let metaTempHtml = item['denomination']+ '; '+item['location'];
            tempHtml = $('<option>' +metaTempHtml +'</option>');
            $(tempHtml).appendTo('.currency'+1+' .denomination-location .option-list');
        }
    },
    build_list: function(entries){
    /*let listTemp = [];
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
        coins.list = listTemp;
        console.log(coins.list);
        coins.build_dropdown();*/

    },
    on_coin_selected: function(coin){
        coins.selected_coin = coin;
        periods.build_dropdown();
        regions.build_dropdown();
    },
    add_coin: function(data){
     //   coins.list[] = coin.initialize(data);
    }
}

var initialize_all = function(){

}


var app = {
    coins_json: {},
    commodities_json: {},
    regions_json: {},
    standards_json: {},
    periods_json: {},
    entries: [],
    initialize: function(){ //calls initialize functions for other objects
        //let json = app.get_json();
        //app.process_json(json);

        app.get_json();

        console.log(app.entries);
        //coins.initialize(app.entries);
        //standards.initialize(app.standards_json);
        //regions.initialize(app.region_json);
        //periods.initialize(app.periods_json);
        //commodities.initialize(app.commodities_json);

    },
    get_json: function(){ //gets json frm http request
        // your code here
        let req = new XMLHttpRequest();
        //let json = '';

        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                json = JSON.parse(req.responseText);
                console.log(json.entries);
                entries = json.entries;
                //return json.entries;
                //app.process_json(json.entries);
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

//assigns proper json to each object (coin, commodity, etc)
    process_json: function(entries){
    //preparing coins_json & commodities_json
        commodities = [];
        coins = [];
        for (let i in entries) {
            let obj = entries[i];
            obj['start_date_year'] = parseInt(obj['start_date']);
            obj['start_date_suf'] = obj['start_date'].slice(-2);
            obj['end_date_year'] = parseInt(obj['end_date']);
            obj['end_date_suf'] = obj['end_date'].slice(-2);
            if (obj['commodity or service'] == 'x') {
                commodities.push(obj);
            } else {
                coins.push(obj);
            }
        }
        app.coins_json = coins;
        app.commodities_json = commodities;
        console.log(app.commodities_json);
        console.log(app.coins_json);

    //preparing regions_json
        let Region = {
            "name": '',
            "locations": [],
            "coins": [],
            "standards": []
        };
        let regions = new Set();
        regionArray = [];
        for (let i in coins) {
            regions.add(coins[i]['region'])
        }
        //console.log(regions);

        for (let i of regions) {
            regCoinTemp = [];
            regLocTemp = [];
            regStdTemp = [];
            region = Object.create(Region);
            region['name'] = i;
            for (let k of coins) {
                if (k['region'] == i) {
                    //console.log('tru');
                    regLocTemp.push(k['location']);
                    regCoinTemp.push(k);
                    regStdTemp.push(k['version of standard']);
                }
            }
            //console.log(region);
            region['locations'] = regLocTemp;
            region['coins'] = regCoinTemp;
            region['standards'] = regStdTemp;
            regionArray.push(region);
        }
        app.regions_json = regionArray;
        console.log(app.regions_json);

    //preparing standards json
        let Standard = {
            "name": '',
            "location": '',
            "coins": [],
            "region": '',
            "start_date": '',
            "end_date": ''
        };
        let standards = new Set();
        standardsArray = [];
        for (let i in coins) {
            standards.add(coins[i]['version of standard']);
        }
        for (let i of standards) {
            stdCoinTemp = [];
            standard = Object.create(Standard);
            standard['name'] = i;
            for (let k of coins) {
                if(k['version of standard'] == i) {
                    stdCoinTemp.push(k);
                    standard['location'] = k['location'];
                    standard['region'] = k['region'];
                }
            }
            standard['coins'] = stdCoinTemp;
            standardsArray.push(standard);
            standard['start_date'] = app.get_dates(i)[0];
            standard['end_date'] = app.get_dates(i)[1];
        }
        app.standards_json = standardsArray;
        console.log(app.standards_json);

    //preparing periods_json
        app.periods_json = app.build_periods();
        console.log(app.periods_json);
    },
 // function extracts start_date and end_date from standard name
    get_dates: function(standard) {
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


