/*-------------------------------------------*/
/*---------------- REGIONS ------------------*/
/*-------------------------------------------*/
export const Region = {
    "id": '',
    "name": '',
    "locations": [],
    "coins": [],
    "standards": []
}

export const Regions = {
    selected_region: {},
    list: [],
    filtered_list_coins: [],
    filtered_list_standards: [],
    initialize: function(coins_json) {
        console.log('initializing regions');
        Regions.initialize_list(coins_json);
        Regions.build_dropdowns();
    },
    initialize_list: function (coins) {
        console.log('building regions list');
        let regions_list = new Set();
        let regionArray = [];
        for (let i in coins) {
            regions_list.add(coins[i]['region'])
        }
        //console.log(regions_list);
        let id = 0;
        for (let i of regions_list) {
            let regCoinTemp = [];
            let regLocTemp = [];
            let regStdTemp = [];
            let newRegion = Object.create(Region);
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
        regionArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
        console.log("Regions:" , regionArray);
        Regions.list = regionArray;
    },
    build_dropdowns: function () {
        console.log('building regions dropdowns');

        for (let item of Regions.list) {
            let str = item['name'];
            let tempHtml = $('<option value='+item['id']+'>'+ str+ '</option>');
            $(tempHtml).appendTo('.region-selector-from .option-list');
            let tempHtml2 = $('<option value='+item['id']+'>'+ str+ '</option>');
            $(tempHtml2).appendTo('.region-selector-to .option-list');
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
        Regions.filtered_list_coins = coinsRegions;
        Regions.filtered_list_standards = standardsRegions;
        Regions.filter();
    },
    filter: function () {
        $('.region-selector-from .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of Regions.filtered_list_coins) {
                if (item == this.text) {
                    this.disabled = false;
                }
            }
        });
        $('.region-selector-to .option-list').children().each(function(i) {
            this.disabled = true;
            for (let item of Regions.filtered_list_standards) {
                if (item == this.text) {
                    this.disabled = false;
                }
            }
        });
    }
}