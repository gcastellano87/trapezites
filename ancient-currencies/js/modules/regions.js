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
    selected_region: '',
    list: [],
    active_filters: {
        standard:{
            coin: '',
            period: '',
        },
        coin:{
            standard: '',
            perioid: '',
        }
    },
    get_list: function(){
        return Regions.list;
    },
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
        console.log(regions_list);
        let id = 0;
        for (let i of regions_list) {
            let regCoinTemp =[];
            let regLocTemp =[];
            let regStdTemp =[];
            let newRegion = Object.create(Region);
            newRegion['name'] = i;
            newRegion['region_id'] = id;
            for (let coin of coins) {
                if (coin['region'] == i) {                   
                    regLocTemp.push(coin['location']);
                    regCoinTemp.push(coin);
                    regStdTemp.push(coin.version_of_standard);
                }
            }
            // console.log(region);
            // console.log('regStdTemp',regStdTemp);
            
            newRegion['locations'] = [...new Set(regLocTemp)];
            newRegion['coins'] = [...new Set(regCoinTemp)];
            newRegion['standards'] = [...new Set(regStdTemp)];
            regionArray.push(newRegion);
            id++;
        }
        regionArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
        console.log("Regions:" , regionArray);
        Regions.list = regionArray;
    },
    get_region_by_id: function(region_id){
        return Regions.get_list().filter(region => {return region.region_id == region_id;})[0];
    },
    build_dropdowns: function () {
        console.log('building regions dropdowns');
        console.log('Regions.list',Regions.list);
        
        let count = '';
        
        for (let item of Regions.list) {
            let str = item['name'];
            if(str){
                count = ' (' + item['coins'].length + ' currencies)';
            } else {
                count = '';
            }
            let tempHtml = $('<option value='+item['region_id']+'>'+ str+ count+ '</option>');
            $(tempHtml).appendTo('.region-selector-from .option-list');
            if(str) {
                count = ' (' + item['standards'].length +' standards)';
            } else {
                count ='';
            }
            let tempHtml2 = $('<option value='+item['region_id']+'>'+ str + count+'</option>');
            $(tempHtml2).appendTo('.region-selector-to .option-list');
        }
    },
    
}