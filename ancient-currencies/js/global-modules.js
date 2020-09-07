
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

import { Standard, Standards }  from './modules/standards.js';
import { Region, Regions }  from './modules/regions.js';
import { Period, Periods }  from './modules/periods.js';
import { Coins } from './modules/coins.js';

/*-------------------------------------------*/
/*------------------ APP --------------------*/
/*-------------------------------------------*/
var App = {
    entries: [],
    initialize: function(){
        App.get_json();
        //console.log(App.entries);
    },
    get_json: function(){ //gets json frm http request
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                let json = JSON.parse(req.responseText);
                //console.log(json.entries);
                let entries = json.entries;

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
                console.log("listTemp:", listTemp);
                //calling initialize functions for objects
                Coins.initialize(listTemp);
                Standards.initialize(listTemp);
                Periods.initialize(listTemp);
                Regions.initialize(listTemp);
            }
        }

        req.open("GET", "https://api.jsonbin.io/b/5f04a20b343d624b07816015/4", true);
        req.setRequestHeader("secret-key", "$2b$10$yjrD4Y8FJuGo2.cLYkzKP.FI6SCpY5GW8JUazMgOxXUnYi8Tf0MT2");
        req.send();
    }

}

document.addEventListener("DOMContentLoaded", App.initialize());