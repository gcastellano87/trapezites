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
    filtered_list: [],
    initialize (coins_json) {
        console.log('initializing standards');
        Standards.list = Standards.build_list(coins_json);
        Standards.build_dropdown();
    },
    build_list: function(coins) {
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
        return standardsArray;
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
    build_dropdown: function() {
        console.log('building standards dropdown');
        $('.standard .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            for (let item of Standards.list) {
                if (item['id'] == id) {
                    Standards.selected_standard = item;
                }
            }
        });
        for (let item of Standards.list) {
            let metaTempHtml = item['name'];
            let tempHtml = $('<option value='+item['id']+'>' +metaTempHtml +'</option>');
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
            for (let standard of Standards.list) {
                if (standard['start_date'] <= start_date && standard['start_date'] >= end_date) {
                    filtered.push(standard);
                } else if (standard['end_date'] >= end_date && standard['end_date'] <= start_date) {
                    filtered.push(standard);
                }
            }
            Standards.filtered_list = filtered;
            Standards.filter();
        } else if (filterType == 'r') {
            let region = regions.list[id];
            //console.log(region);
            let filtered = [];
            for (let standard of Standards.list) {
                if (standard['region'] == region['name']) {
                    filtered.push(standard);
                }
            }
            Standards.filtered_list = filtered;
            Standards.filter();
        }

    },
    filter: function() {
        $('.standard .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of Standards.filtered_list) {
                if (item['name'] == this.text) {
                    this.disabled = false;
                }
            }
        });
    }
}