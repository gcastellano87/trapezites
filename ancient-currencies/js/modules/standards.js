/*-------------------------------------------*/
/*--------------- STANDARDS -----------------*/
/*-------------------------------------------*/


export const Standard = {
    "id": '',
    "name": '',
    "location": '',
    "coins": [],
    "region": '',
    "start_date": '',
    "end_date": '',
}

export const Standards = {
    selected_standard: {},
    list: [],
    active_filters: {
        region: '',
        period: '',
    },
    initialize (coins_json) {
        console.log('initializing standards');
        Standards.initialize_list(coins_json);
        console.log('Standards', Standards.list);

        Standards.build_dropdown();
    },
    initialize_list: function(coins) {
        console.log('building standards list');
        let standards_list = new Set();
        let standardsArray = [];
        for (let i in coins) {
            standards_list.add(coins[i]['version of standard']);
        }
        let id = 0;
        for (let i of standards_list) {
            let stdCoinTemp = [];
            let newStandard = Object.create(Standard);
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
            newStandard['start_date'] = Standards.get_dates(i)[0];
            newStandard['end_date'] = Standards.get_dates(i)[1];
            id++;
        }
        Standards.list = standardsArray;
    },
    get_dates: function(standard) { //function extracts start_date and end_date from standard name
        let stdName = standard;
        var ifNum = /\d/;
        var bc = "BC";
        var start_date = '';
        var end_date = '';
        var dates = [];

       // console.log(standard);
        var numId = stdName.match(ifNum);
        var bcId = stdName.match(bc);
        var hyphenId = stdName.indexOf('–');
        start_date = parseInt(stdName.substring(numId['index'], hyphenId));
        end_date = parseInt(stdName.substring(hyphenId+1,bcId['index']-1));
        dates = [start_date, end_date];

        return dates;
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

        let start_date = period.start_date;
        let end_date = period.end_date;

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
        // If there aren't any matches...
        if (standards.length == 0){
            $('<option value="" selected disabled hidden>No standards match...</option>').appendTo('.currency'+2+' .standard .option-list');
        } else {
            // Add a placeholder element
            $('<option value="" selected disabled hidden>Choose here or type in Search..</option>').appendTo('.currency'+2+' .standard .option-list');
            // Add an element for each of the filtered standards
            for (let item of standards) {
                let metaTempHtml = item['name'];
                let tempHtml = $('<option value='+item['id']+'>' +metaTempHtml +'</option>');
                $(tempHtml).appendTo('.currency'+2+' .standard .option-list');
            }
        }
    }
}