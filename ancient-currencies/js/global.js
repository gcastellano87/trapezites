/*
	file sections:
		1. global variables
		2. event listeners
		3. functions that update what is displayed on user's screen
		4. functions that handle program logic (they help functions on part 3)

	there's headers to each section for easy browsing
*/

/*---------------------------------------------*/
/*------------ section 1: ---------------------*/
/*------------ global variables ---------------*/
/*---------------------------------------------*/

var coinInfo; // stores all coin data from spreadsheet, initialized after call to prepareEntries()
var commInfo; // stores all commodity data from spreadsheet, initialized after call to prepareEntries()
var periods;  // array of 25 year periods, initialized in call to preparePeriods()

// state stores data that user selected on each of the two coins
// region doesn't need to be stored because it's only purpose it to aid with search
// TODO: only 1 period should be selected for both coins (add "period" to object and store there)
    //UPDATE:should be done now
var state = {
				"isPeriodSelected" : false,
				"selectedPeriod" : -1, // index in periods array
				"coin1" : {
					"isRegionSelected" : false,
					"isLocationSelected" : false,
					"isDenominationSelected" : false,
					"selectedRegion" : '',
					"selectedLocation" : '',
					"selectedDenomination" : '',
					"value" : 0.0 // amount of coin used in conversion
				},
				"coin2" : {
					"isRegionSelected" : false,
					"isLocationSelected" : false,
					"isDenominationSelected" : false,
					"selectedRegion" : '',
					"selectedLocation" : '',
					"selectedDenomination" : '',
					"value" : 0.0 // amount of coin used in conversion
				}
			};

/*--------------------------------------------*/
/*------------ section 2: --------------------*/
/*------------ event listeners ---------------*/
/*--------------------------------------------*/

/*--- resize for map areas ---*/
window.onload = function () {
	imgMapFunc (1, 'region-map', 'region-img');
	imgMapFunc (2, 'region-map', 'region-img');
}

/*--- set up initial state 
		
		runs every time the website finishes loading (DOMContentLoaded event)
		
		needs to send a request to a server that has the data json stored
		this will possibly change in the future
		right now I'm storing it on the website called jsonbin.io
---*/
document.addEventListener("DOMContentLoaded", function() {
	console.log('reading json...');
	// http://myjson.com/k8xmq
	// $.getJSON("https://spreadsheets.google.com/feeds/cells/1AFmyU-Domc8QLXnEz-TlET-qD1rl8n0Aaxfh6_ui-DQ/1/od6/public/values?alt=json", (json)=>{
	// 	console.log(json);
	// });

	let req = new XMLHttpRequest();

	req.onreadystatechange = () => {
		if (req.readyState == XMLHttpRequest.DONE) {
			// console.log(req.responseText);
			let json = JSON.parse(req.responseText);
			let entries = prepareEntries( json.entries );
			console.log(entries);

			coinInfo = entries['currencies'];
			commInfo = entries['commodities'];

			console.log('coinInfo and commInfo ready');
			// console.log(coinInfo);

			periods = preparePeriods();
			console.log('periods ready');
			// console.log(periods);

			//set state according to url parameters (if any)
			setInitialState(window.location.href);

			updateApp(1);
			updateApp(2);
		}
	};

	req.open("GET", "https://api.jsonbin.io/b/5e88006885182d79b0632c49/1", true);
	req.setRequestHeader("secret-key", "$2b$10$d5ndnThMEyDiTKVk8G9MFuSOQfEJqvsFNYrHov86R.wuyP6bZhCEa");
	req.send();

	// $.getJSON("https://api.myjson.com/bins/15gpmk", (json)=>{
	// 	// console.log(json);
	// 	let entries = prepareEntries(json.entries);
	// 	console.log(entries);

	// 	coinInfo = entries['currencies'];
	// 	commInfo = entries['commodities'];

	// 	console.log('coinInfo and commInfo ready');
	// 	// console.log(coinInfo);

	// 	periods = preparePeriods();
	// 	console.log('periods ready');
	// 	console.log(periods);

	// 	updateApp(1);
	// 	// populate(1);
	// 	// populate(2);
	// 	// changeName(1);
	// 	// changeName(2);
	// });
});

/*--- option-list events 
		
		run every time someone clicks on an item inside an option-list

		basically the function determines what option was selected 
		and calls toggleSelected() to update the state
		then it calls updateApp() to update the site
---*/
$(document).on('click','.option-list a', function(e) {
	e.preventDefault();
	// console.log('selected ' + this);

	// let wasSelectedBefore = $(this).hasClass('selected');
	$(this).toggleClass('selected');
	let label = this.getAttribute('label');// region, location, denomination or period
	let which = this.getAttribute('which');// which coin is being updated (1 (left) or 2 (right))
	let value = '';// what value is the label getting set to
	console.log('selected ' + label);
	if (label == 'period') {
		value = this.getAttribute('pid');
		toggleSelected(which, label, value);
		updateApp(1);
		updateApp(2);

	} else if (label == 'denomination-location') {
		label = 'denomination';
		value = this.firstChild.textContent;
		toggleSelected(which, label, value);
		label = 'location';
		value = this.lastChild.textContent;
		toggleSelected(which, label, value);
		updateApp(which);
	} else {
		throw 'Wrong label on option-list anchor';
	}

	//constructs new url parameters and updates the url
	window.history.replaceState('', '', updateURLParameters(window.location.href));
});

/*--- clickable map events 

		run every time someone clicks on an area inside the clickable-map

		basically the function determines what option was selected 
		then it calls updateApp() to update the site


		also, there's 2 more events for hover functionality on the map
		basically when you hover above an area, the area's name should
		be shown on the bottom-left corner of the map
---*/
$(document).on('click','.clickable-map area', function(e) {
	e.preventDefault();

	//gather necessary data
	let wasSelectedBefore = $(this).hasClass('selected');
	let which = this.getAttribute('which');
	let value = this.getAttribute('value');
	let label = 'region';

	// console.log(wasSelectedBefore+' '+which+' '+value+' '+label);
	// console.log(state['coin'+which]['isRegionSelected']);

	//update the sign that is displayed
	$('.currency'+which+' .region > input').val( value );

	//handle program logic
	if (state['coin'+which]['isRegionSelected']) {
		if (wasSelectedBefore) {
			//region was selected and this object as well
			// must deselect both
			$(this).toggleClass('selected');
			toggleSelected(which, label, '');
			$('.currency'+which+' .region > input').val( '' );
		} else {
			//region was selected but not this object
			// must clear the selected class from all objects,
			// add it to this object and select this region
			// console.log('here');
			clearMapAreas();
			$(this).toggleClass('selected');
			toggleSelected(which, label, '');
			toggleSelected(which, label, value);
		}
	} else {
		//neither region nor object were selected
		// must select both
		$(this).toggleClass('selected');
		toggleSelected(which, label, value);
	}

	//update options displayed
	updateApp(which);
});
$(document).on('mouseover','.clickable-map area', function(e) {
	e.preventDefault();
	let which = this.getAttribute('which');
	let value = this.getAttribute('value');
	$('.currency'+which+' .map-label').val( value );
});
$(document).on('mouseout','.clickable-map area', function(e) {
	e.preventDefault();
	let which = this.getAttribute('which');
	// let text = state['coin'+which]['selectedRegion'];
	let text = '';
	$('.currency'+which+' .map-label').val( text );
});

/*--- conversion ammount textbox event 
		runs every time someone types into an amount-box
---*/
$(document).on('keyup', '.amount-box', function() {
	//flush previous conversions
	$('table tbody tr').remove();

	let which = this.getAttribute('which');
	let amountS = $('#amount-box'+which).val();
	if ( !allCoinOptionsSelected(1) )
	{
		$('#error-box').text("You must provide denomination, location, and period to convert.");
	}
	else if ( isNaN(amountS) ) {
		$('#error-box').text("Provide a valid number.");
	}
	else {
		$('#error-box').text("");
		displayComparableCurrencies();
		displayComparableCommodities();
	}

});

/*--- conversion ammount textbox event 
		runs every time someone types into an search box

		UPDATE: Working Now
		    TODO: this code doesn't work yet,
			search is okay but backspace is faulty
---*/
$(document).on('keyup', '.search-box', function() {
	let value = this.value;
	let label = this.getAttribute('label');

	console.log('searching on '+label+' for '+value);

	if (label == 'period') {
        value = value.toUpperCase();
		$('.period .option-list a').each(function(i, item) {
			// if (item.textContent.includes(value)) {
			if (item.textContent.indexOf(value) != -1) {
				$(item).show();
			} else {
				$(item).hide();
			}
		});
	}
	//search for denomination-location left
	else if(label == 'denomination-location-1'){
		//let which = this.getAttribute('which');
        $('.converter-left .denomination-location .option-list a').each(function(i, item) {
			//console.log(item.textContent);
			lcText = item.textContent.toLowerCase();    //make case-insensitive
			value = value.toLowerCase();
			if (lcText.indexOf(value) != -1) {
				$(item).show();
			} else {
				$(item).hide();
			}
		});

	}
	//search for denomination-location right
	else if(label = 'denomination-location-2'){

	    $('.converter-right .denomination-location .option-list a').each(function(i, item) {
            lcText = item.textContent.toLowerCase();    //make case-insensitive
            value = value.toLowerCase();
            if (lcText.indexOf(value) != -1) {
                $(item).show();
            } else {
                $(item).hide();
            }
        });
	}

});

/*--- click About event
    runs every time the About button is pressed. Should display a pop-up.
---*/
$(document).on('click','.about', function() {
    console.log('about clicked');
    document.getElementById('abtPopup').style.display = "block";
});

$(document).on('click','.abtContent a', function() {
    console.log('close clicked');
    document.getElementById('abtPopup').style.display = "none";
});

/*--------------------------------------------------------------------*/
/*------------- section 3: -------------------------------------------*/
/*------------ functions that update what is displayed ---------------*/
/*--------------------------------------------------------------------*/

/*
	a url will be formatted sorta like: url.com?parameter1=something&parameter2=something&parameter3=something...

	determines if the url has parameters included
	if it does, it'll set the values in state to those parameters 
	this way, that the correct page will load when updateApp() is called

	TODO: need to add functionality for coin2 parameters
*/
function setInitialState(url) {
	console.log('setting InitialState');

	//gets rid of the weird url encoding
	url = decodeURIComponent(url);

	//split string into the website part and the parameters (everything after '?' is parameters)
    let tempArray = url.split("?");
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1]; //parameter part of the url
    let temp = "";

    if (additionalURL) { //if parameters exist

    	//split parameter string into every individual key=value string
        tempArray = additionalURL.split("&");
        for (let i=0; i<tempArray.length; i++){

        	//for every parameter, get the key and value separately and then set on the state
        	let param = tempArray[i].split('=');
        	let key = param[0];
        	let value = param[1];
            if (key == 'location') {
            	state['coin1']['isLocationSelected'] = true;
            	state['coin1']['selectedLocation'] = value;
            	let tempHtml = $('<a href="#" which="'+1+'" label="location">'+ value +'</a>');
            	$(tempHtml).toggleClass('selected');
				$(tempHtml).appendTo('.currency'+1+' .location .option-list');
            } else if (key == 'denomination') {
            	state['coin1']['isDenominationSelected'] = true;
            	state['coin1']['selectedDenomination'] = value;
            	let tempHtml = $('<a href="#" which="'+1+'" label="denomination">'+ value +'</a>');
            	$(tempHtml).toggleClass('selected');
				$(tempHtml).appendTo('.currency'+1+' .denomination .option-list');
            } else if (key == 'period') {
            	state['coin1']['isPeriodSelected'] = true;
            	state['coin1']['selectedPeriod'] = value;
            	let item = periods[value];
				let str = item[0]+' to '+item[1];
				let tempHtml = $('<a href="#" which="'+1+'" label="period" pid="'+value+'">'+ str +'</a>');
				$(tempHtml).toggleClass('selected');
				$(tempHtml).appendTo('.currency'+1+' .period .option-list');
            } else {
            	//error will appear on console if user tries to use fake parameters
            	throw "Unrecognized url parameter.";
            }
        }
    }
}

/*
	https://stackoverflow.com/questions/1090948/change-url-parameters

	basically constructs a new url string and returns it

	in order to do this it checks if any value in the state is
	set to something, and if it is it adds the key and value to a parameter string
 */
function updateURLParameters(url, param, paramVal){

	let tempArray = url.split("?");
    let baseURL = tempArray[0];

	let newParameters = '';
	if (state['coin1']['isLocationSelected']) {
		newParameters += newParameters != '' ? '&' : '';
		newParameters += 'location1=' + state['coin1']['selectedLocation'];
	}
	if (state['coin1']['isDenominationSelected']) {
		newParameters += newParameters != '' ? '&' : '';
		newParameters += 'denomination1=' + state['coin1']['selectedDenomination'];
	}
	if (state['coin1']['isPeriodSelected']) {
		newParameters += newParameters != '' ? '&' : '';
		newParameters += 'period1=' + state['coin1']['selectedPeriod'];
	}

	if (state['coin2']['isLocationSelected']) {
		newParameters += newParameters != '' ? '&' : '';
		newParameters += 'location2=' + state['coin2']['selectedLocation'];
	}
	if (state['coin2']['isDenominationSelected']) {
		newParameters += newParameters != '' ? '&' : '';
		newParameters += 'denomination2=' + state['coin2']['selectedDenomination'];
	}
	if (state['coin2']['isPeriodSelected']) {
		newParameters += newParameters != '' ? '&' : '';
		newParameters += 'period2=' + state['coin2']['selectedPeriod'];
	}

	if (newParameters != '') {
		return baseURL + '?' + newParameters;
	} else {
		return baseURL;
	}
}

/*
	which indicates what coin is being updated 1 (left) or 2 (right)

	uses flush() and populate() to go through option-lists and remove items
	that don't match the coin's selected state
	(ex. if user selects locaiton=greece then denominations 
	 that are not in greece shouldn't show up in option-list)

	uses changeName() to print the user's selections on screen (names)

	displays/hides new sections of the page if program logic is met
*/
function updateApp(which) {
	flush(which);
	populate(which);

	if (which == 1) {
		changeName(which);
	}

	if ( allCoinOptionsSelected(1) ) {
		console.log('allTopOptionsSelected');
		//save value in state
		state['coin1']['value'] = getValueInSilver(state['coin1']);
        console.log(state['coin1']['value']);
		$('#amount-box1').val();
            //console.log($('#amount-box1').val());
        if($('#amount-box1').val() != ""){      //makes sure user inputs a coin amount
            displayComparableCurrencies();
            displayComparableCommodities();
        }else{
            $('#error-box').text("Provide a valid number.");    //displays error message
        }
		// makeChange();

	} else {
		$('table tbody tr').remove();
		$('.comp-currencies').hide();
		$('.comp-comodities').hide();

	}
}

function populate(which) {

	console.log('populating menu for coin'+which);

	let coin = state['coin'+which];

	// one slot for every period in periods
	// will be used below to count how many coins in every period
	let periodCounts = new Array(periods.length).fill(0);

	let locations = new Set();
	let denominations = new Set();
	let locdenPairs = [];
	for (let item of coinInfo) {

		let itemRegion = item['region'];
		let itemLocation = item['location'];
		let itemDenomination = item['denomination'];
		let itemStartDateYear = item['start_date_year'];
		let itemStartDateSuf = item['start_date_suf'];
		let itemEndDateYear = item['end_date_year'];
		let itemEndDateSuf = item['end_date_suf'];

		if (
			(!coin['isRegionSelected']       || (coin['isRegionSelected'] && itemRegion == coin['selectedRegion'])) &&
			(!coin['isLocationSelected']     || (coin['isLocationSelected'] && itemLocation == coin['selectedLocation'])) &&
			(!coin['isDenominationSelected'] || (coin['isDenominationSelected'] && itemDenomination == coin['selectedDenomination'])) &&
			(!state['isPeriodSelected'] 	 || (state['isPeriodSelected'] && isCoinInsidePeriod(itemStartDateYear, itemStartDateSuf, 
						 													itemEndDateYear, itemEndDateSuf, 
						 													state['selectedPeriod'])))
		   )
		{
			if(!state['isPeriodSelected']){
				for (let i=0; i<periods.length; i++) {
					let coinInsidePeriod = isCoinInsidePeriod(itemStartDateYear, itemStartDateSuf, 
							 						  itemEndDateYear, itemEndDateSuf, i);
					// console.log('is '+itemDenomination+' '+itemLocation+' in '+periods[i]+': '+coinInsidePeriod);
					if (coinInsidePeriod) {
						periodCounts[i] += 1;
					}
				}
			}
			locations.add(itemLocation);
			denominations.add(itemDenomination);
			locdenPairs.push([itemLocation, itemDenomination]);
		}
	}

	if (!coin['isLocationSelected'] && !coin['isDenominationSelected']) {
		// console.log(locations);
		for (let item of locdenPairs) {
			let loc = item[0];
			let den = item[1];

			if (den == '') {
				item = '--Unknown--';
			}

			// $(tempHtml).appendTo('#currency'+which+'-location .option-list');
			let metaTempHtml = '<div class="denomination">'+den+'</div><div class="location">'+loc+'</div>';
			let tempHtml = $('<a href="#" which="'+which+'" label="denomination-location">'+ metaTempHtml +'</a>');
			$(tempHtml).appendTo('.currency'+which+' .denomination-location .option-list');
		}
	}

	if (!state['isPeriodSelected']) {
		// console.log(periods);
		for (let i=0; i<periods.length; i++) {
			if (periodCounts[i] > 0) {
				let item = periods[i];
				let str = item[0]+' to '+item[1];
				let tempHtml = $('<a href="#" label="period" pid="'+i+'">'+ str +'</a>');
				$(tempHtml).appendTo('.period .option-list');
			}
		}
	}
}

/*
	Remove every item inside every option-list
	except for the ones that have been selected
*/
function flush(which) {

	//flush textboxes
	$('#amount-box1').val("");
	$('#amount-box2').val("");

	// console.log('flushing!');

	// $('.currency'+which+' .region .option-list').children().each(function(i) {
	//     if (!$(this).hasClass('selected')) {
	//     	$(this).remove();
	//     }
	// });

	// $('#currency'+which+'-location .option-list').children().each(function(i) {
	$('.currency'+which+' .denomination-location .option-list').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});

	$('.period .option-list').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});
}

/*
	sets the text value for the name heading inside translation-section
*/
function changeName(which) {

	let coin = state['coin'+which];

	//formats string of period into [year] and [year] instead of [year,year]
    period = periods[state['selectedPeriod']];
    newStr = "";
    if(period != undefined){
        periodStr = String(period);
        comma = periodStr.search(',');
        console.log(comma);
        newStr = periodStr.slice(0,comma) + " and " + periodStr.slice(comma+1);
        console.log(newStr);
    }

	let name = '';

	name = name + (coin['isLocationSelected'] ? coin['selectedLocation'] : 'location');
	name = name + ' ';
	name = name + (coin['isDenominationSelected'] ? coin['selectedDenomination'] : 'currency');
	name = name + ' between ';
	name = name + newStr;
	//name = name + (state['isPeriodSelected'] ? periods[state['selectedPeriod']] : 'year');
	//name = name + ' and ';
	//name = name + (coin['isPeriodSelected'] ? periods[coin['selectedPeriod']][1] : 'year');

	$('#name'+which).text( name );
}

/* 
	purpose of this function is to give conversion amounts in smaller coins instead of decimals
	ex. 'a Euro is 1.25 dollars' would turn into 'a Euro is 1 dollar and 1 quarter'

	this function isn't working right now!
*/
function makeChange() {

	console.log('making change');

	$('.change').show();
	let family = [];

	// build coin family
	for (let item of coinInfo) {
		let itemDenomination = item['denomination'];
		let itemLocation = item['location'];
		let itemStartDateYear = item['start_date_year'];
		let itemStartDateSuf = item['start_date_suf'];
		let itemEndDateYear = item['end_date_year'];
		let itemEndDateSuf = item['end_date_suf'];

		let itemValue = item['value in grams of silver'];

		if (itemValue >= state['coin1']['selectedDenomination'] &&
			itemDenomination != state['coin1']['selectedDenomination'] &&
			itemLocation == state['coin1']['selectedLocation'] && 
			isCoinInsidePeriod(itemStartDateYear, itemEndDateSuf, 
 												  itemEndDateYear, itemEndDateSuf, 
 												  state['coin1']['selectedPeriod'])) 
		{
			family.push(item);
		}
	}

	// get all possible ways to make change using coins in family

    // public static void main(String[] args) {
    //     List<Integer> countOfCoins = new ArrayList<>();
    //     makeChange(7, 0, countOfCoins);
    // }

    // private static int makeChange(int amount, int startCoinIdx, List<Integer> coinsSoFar) {
    //     if(startCoinIdx == coinSet.length){
    //         if(amount == 0){
    //             System.out.println(coinsSoFar);
    //         }
    //         //System.out.println(coinsSoFar);
    //         return 0;
    //     }
    //     for(int count = 0;(count*coinSet[startCoinIdx]) <= amount;count++){
    //         List<Integer> temp = new ArrayList<>();
    //         for(int i = 0;i < coinsSoFar.size();i++) temp.add(coinsSoFar.get(i));
    //         for(int i = 0;i < count;i++) temp.add(coinSet[startCoinIdx]);
    //         makeChange(amount - (count * coinSet[startCoinIdx]),startCoinIdx+1, temp);
    //         temp.clear();
    //     }
    //     return 0;
    // }

	console.log(family);
}

/*
	when a period, denomination and location are chosen for coin1
	this function will print conversions to contemporary currencies to the chosen one
	(those that existed in the same time)
*/
function displayComparableCurrencies() {
	// console.log('in displayComparableCurrencies');
	$('.comp-currencies').show();

	// console.log(state['coin1']);

	for (let item of coinInfo) {

		let itemStartDateYear = item['start_date_year'];
		let itemStartDateSuf = item['start_date_suf'];
		let itemEndDateYear = item['end_date_year'];
		let itemEndDateSuf = item['end_date_suf'];

		if (isCoinInsidePeriod(itemStartDateYear, itemEndDateSuf, 
 												  itemEndDateYear, itemEndDateSuf, 
 												  state['selectedPeriod']))
		{
			let itemRegion = item['region'];
			let itemLocation = item['location'];
			let itemDenomination = item['denomination'];

			let periodS = item['start_date']+' to '+item['end_date'];

			let amountS = $('#amount-box'+1).val();
			let amount = +amountS;
			let lhsSilver = state['coin1']['value'];
			let rhsSilver = +item['value in grams of silver'];
			let result = (amount * lhsSilver) / rhsSilver;


			let tempHtml = '<tr>';
			tempHtml +=    '	<td>+</td>';
			tempHtml +=    '	<td>'+result.toFixed(2)+'</td>';
			tempHtml +=    '	<td>'+itemDenomination+'</td>';
			tempHtml +=    '	<td>'+itemRegion+'</td>';
			tempHtml +=    '	<td>'+itemLocation+'</td>';
			tempHtml +=    '	<td>'+periodS+'</td>';
			tempHtml +=    '</tr>';
			$(tempHtml).appendTo('.comp-currencies table tbody');
		}
	}
}

/*
	when a period, denomination and location are chosen for coin1
	this function will print conversions to every commodity in the commodities object
*/
function displayComparableCommodities() {
	// console.log('in displayComparableCommodities');
	$('.comp-comodities').show();

	for (let item of commInfo) {

		// console.log(item);

		let itemStartDateYear = item['start_date_year'];
		let itemStartDateSuf = item['start_date_suf'];
		let itemEndDateYear = item['end_date_year'];
		let itemEndDateSuf = item['end_date_suf'];

		// if (isCoinInsidePeriod(itemStartDateYear, itemEndDateSuf, 
 	// 											  itemEndDateYear, itemEndDateSuf, 
 	// 											  state['coin1']['selectedPeriod'])) 
		// {
			let itemRegion = item['region'];
			let itemLocation = item['location'];
			let itemDenomination = item['denomination'];

			let periodS = item['start_date']+' to '+item['end_date'];

			let amountS = $('#amount-box'+1).val();
			let amount = +amountS;
			let lhsSilver = state['coin1']['value'];
			let rhsSilver = +item['value in grams of silver'];
			let result = (amount * lhsSilver) / rhsSilver;


			let tempHtml = '<tr>';
			tempHtml +=    '	<td>+</td>';
			tempHtml +=    '	<td>'+result.toFixed(2)+'</td>';
			tempHtml +=    '	<td>'+itemDenomination+'</td>';
			tempHtml +=    '	<td>'+itemRegion+'</td>';
			tempHtml +=    '	<td>'+itemLocation+'</td>';
			tempHtml +=    '	<td>'+periodS+'</td>';
			tempHtml +=    '</tr>';
			$(tempHtml).appendTo('.comp-comodities table tbody');
		// }
	}
}

// Converts from the currency which to the other one
function convertCurrency(which) {
	// console.log('converting!!!');

	let amountS = $('#amount-box'+which).val();

	let whichOpposite = which == '1' ? '2' : '1';

	let lhs = state['coin'+which];
	let rhs = state['coin'+whichOpposite];
	
	if ( !allOptionsSelected() )
	{
		$('#error-box').text("You must provide denomination, location, and period for both currencies to convert.");
	}
	else if ( isNaN(amountS) ) {
		$('#error-box').text("Provide a valid number.");
	}
	else {
		$('#error-box').text("");
		let amount = +amountS;
		let lhsSilver = getValueInSilver(lhs);
		let rhsSilver = getValueInSilver(rhs);
		let result = (amount * lhsSilver) / rhsSilver;

		console.log('amount '+amount);
		console.log('lhsSilver '+lhsSilver);
		console.log('rhsSilver '+rhsSilver);
		console.log('result '+result);

		$('#amount-box'+whichOpposite).val(result.toFixed(2));
	}
}

/*----------------------------------------------------------------*/
/*------------- section 4: ---------------------------------------*/
/*------------ functions that update program logic ---------------*/
/*----------------------------------------------------------------*/


function toggleSelected(which, label, value) {
	
	if (label == 'period') {
		if (!state['isPeriodSelected']) {
			state['isPeriodSelected'] = true;
			state['selectedPeriod'] = value;
			console.log(state['selectedPeriod']);
		} else {
			state['isPeriodSelected'] = false;
			state['selectedPeriod'] = -1;
		}
	} else {
		let coin = state['coin'+which]

		if (label == 'region') {
			if (!coin['isRegionSelected']) {
				coin['isRegionSelected'] = true;
				coin['selectedRegion'] = value;
			} else {
				coin['isRegionSelected'] = false;
				coin['selectedRegion'] = '';
			}
		} else if (label == 'location') {
			if (!coin['isLocationSelected']) {
				coin['isLocationSelected'] = true;
				coin['selectedLocation'] = value;
			} else {
				coin['isLocationSelected'] = false;
				coin['selectedLocation'] = '';
			}
		} else if (label == 'denomination') {
			if (!coin['isDenominationSelected']) {
				coin['isDenominationSelected'] = true;
				coin['selectedDenomination'] = value;
			} else {
				coin['isDenominationSelected'] = false;
				coin['selectedDenomination'] = '';
			}
		} else {
			throw "Error in toggleSelected()";
		}
	}
}

// function allTopOptionsSelected() {
// 	return coin1['isLocationSelected'] && 
// 		   coin1['isDenominationSelected'] && 
// 		   coin1['isPeriodSelected'];
// }

function allCoinOptionsSelected(which) {
	let coin = state['coin'+which];
	    //**prints for debugging**//
        /*console.log(coin['isLocationSelected']);
        console.log(coin['isDenominationSelected']);
        console.log(state['isPeriodSelected']);
        console.log(state['selectedPeriod']);*/
	return coin['isLocationSelected'] && 
		   coin['isDenominationSelected'] && 
		   state['isPeriodSelected'];
}

function anyCoinOptionsSelected(which) {
	let coin = state['coin'+which];
	return coin['isLocationSelected'] || 
		   coin['isDenominationSelected'] || 
		   state['isPeriodSelected'] ||
		   coin['isRegionSelected'];
}

function allOptionsSelected() {
	return allCoinOptionsSelected(1) && allCoinOptionsSelected(2);
}

function getValueInSilver(coin) {
	for (let item of coinInfo) {

		if ( item['location'] == coin['selectedLocation'] &&
			 item['denomination'] == coin['selectedDenomination'] //&&
			 //item['start date'] == state['selectedPeriod']
		   ) 
		{
			return (+item['value in grams of silver']);
		}
	}
	return 0;
}

/*
	Given a coin's start date and end date and an index of periods
	checks if the coin's dates of existance overlap with the given period

	it does this by finding if the coin's start or end date is inside the period
	OR if the period's start or end date is inside the coin's dates of existance
*/
function isCoinInsidePeriod(startDateYear, startDateSuf, endDateYear, endDateSuf, pid) {
	let selectedPeriod = periods[pid];
	//console.log(selectedPeriod);
	//console.log(pid);
	// console.log('in isCoinInsidePeriod for pid:'+pid);
	// console.log('checking coin '+startDateYear+startDateSuf+' '+endDateYear+endDateSuf+' in '+selectedPeriod);

	let periodStart = selectedPeriod[0];
	let periodEnd = selectedPeriod[1];
	let periodStartYear = parseInt(periodStart);
	let periodStartSuf = periodStart.slice(-2);
	let periodEndYear = parseInt(periodEnd);
	let periodEndSuf = periodEnd.slice(-2);

	let coinStartInside = compareYears(periodStartYear,periodStartSuf, startDateYear,startDateSuf) < 1 &&
						  compareYears(periodEndYear,periodEndSuf, startDateYear,startDateSuf) > -1;
	let coinEndInside = compareYears(periodStartYear,periodStartSuf, endDateYear,endDateSuf) < 1 &&
						compareYears(periodEndYear,periodEndSuf, endDateYear,endDateSuf) > -1;
	let periodStartInside = compareYears(startDateYear,startDateSuf, periodStartYear,periodStartSuf) < 1 &&
						  compareYears(endDateYear,endDateSuf, periodStartYear,periodStartSuf) > -1;
	let periodEndInside = compareYears(startDateYear,startDateSuf, periodEndYear,periodEndSuf) < 1 &&
						compareYears(endDateYear,endDateSuf, periodEndYear,periodEndSuf) > -1;

	return coinStartInside || coinEndInside || periodStartInside || periodEndInside;
}

/*
	y1 and y2 are strings in format 'X BC' or 'X AD'
	returns -1 if y1 < y2
	returns  0 if equal
	returns  1 if y1 > y2
*/
function compareYears(num1,suf1,num2,suf2) {
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

/*
	creates a json object with an array for
	all currencies in the data and another one
	for all commodities.

	also, it adds custom fields to every item
	to speed up other methods.
	for example, it breaks down the string depicting
	the date ('345 BC') into a year and suffix (345, 'BC')
*/
function prepareEntries(entries) {
	let result = {
		"currencies" : [],
		"commodities" : []
	};
	for (let i in entries) {
		let obj = entries[i];
		if (obj['commodity or service'] == 'x') {
			obj['start_date_year'] = parseInt(obj['start_date']);
			obj['start_date_suf'] = obj['start_date'].slice(-2);
			obj['end_date_year'] = parseInt(obj['end_date']);
			obj['end_date_suf'] = obj['end_date'].slice(-2);
			result['commodities'].push(obj);
		} else {
			obj['start_date_year'] = parseInt(obj['start_date']);
			obj['start_date_suf'] = obj['start_date'].slice(-2);
			obj['end_date_year'] = parseInt(obj['end_date']);
			obj['end_date_suf'] = obj['end_date'].slice(-2);
			result['currencies'].push(obj);
		}
	}
	return result;
}

/*
	preparePeriods needs to generate an array 
	of 25 year periods from the data

	it does this by finding the earliest start_date
	and the latest end_date appearing in all the coins

	then, it generates an array by incrementally
	adding 24 to the earliest start_date until you
	hit the latest end_date
	
	TODO: store year and suffix separately to improve 
	performance on isCoinInsidePeriod()
*/
function preparePeriods() {
	console.log('in preparePeriods');
	
	// find min and max dates
	let minYear = 9999;
	let minSuf = 'AD';
	let maxYear = 9999;
	let maxSuf = 'BC';

	for (let item of coinInfo) {
		// let startDate = item['start_date'];
		// let endDate = item['end_date'];
		// startDates.add(startDate);
		// endDates.add(endDate);
		if (compareYears(item['start_date_year'],item['start_date_suf'], 
						 minYear, minSuf) < 0) {
			minYear = item['start_date_year'];
			minSuf = item['start_date_suf'];
		}
		if (compareYears(item['end_date_year'],item['end_date_suf'], 
						 maxYear, minSuf) > 0) {
			maxYear = item['end_date_year'];
			maxSuf = item['end_date_suf'];
		}
	}
	let min = minYear+' '+minSuf;
	let max = maxYear+' '+maxSuf;

	// console.log('min '+min);
	// console.log('max '+max);

	//round up or down
	minYear = Math.ceil(parseInt(minYear)/25)*25;
	maxYear = Math.ceil(parseInt(maxYear)/25)*25;
	min = minYear+' '+minSuf;
	max = maxYear+' '+maxSuf;
	// console.log('rounded min '+min);
	// console.log('rounded max '+max);

	// generate periods in between min and max
	let result = [];
	while (compareYears(minYear, minSuf, maxYear, maxSuf) == -1){
		let periodEnd;
		if (minSuf == 'BC') {
			periodEnd = minYear - 24;
			result.push([min, periodEnd+' '+minSuf]);
			minYear = minYear - 25;
			if (minYear == 0) {
				minSuf = 'AD';
			}
		} else {
			periodEnd = minYear + 24;
			result.push([min, periodEnd+' '+minSuf]);
			minYear = minYear + 25;
		}
		min = minYear+' '+minSuf;
	}
	return result;
}

/*--
	Loop through map areas and de-select them
--*/
function clearMapAreas () {
	$('.clickable-map area').each(function() {
		$(this).removeClass('selected');
	});
}

/*-- resize areas in image map 
		this needs to run every time the page loads
		to make map areas fit the size of the map on
		current screen
--*/
// TODO: resize for right map is not working for some reason!
function imgMapFunc (which, mapId, imgId) {
	mapId = mapId + which;
	imgId = imgId + which;
	console.log('imgMapFunc '+which+' '+mapId+' '+imgId);
    var ImageMap = function (map, img) {
	    var n,
	        areas = map.getElementsByTagName('area'),
	        // areas = $('.currency'+which+' map area'),
	        len = areas.length,
	        coords = [],
	        previousWidth = 909;

	        // console.log($('.currency'+which+' area'));

	    for (n = 0; n < len; n++) {
	        coords[n] = areas[n].coords.split(',');
	    }
	    this.resize = function () {
	    	console.log('resize '+this);
	        var n, m, clen,
	            x = img.offsetWidth / previousWidth;
	        for (n = 0; n < len; n++) {
	            clen = coords[n].length;
	            for (m = 0; m < clen; m++) {
	                coords[n][m] *= x;
	            }
	            areas[n].coords = coords[n].join(',');
	        }
	        previousWidth = document.body.clientWidth;
	        return true;
	    }
	    window.onresize = this.resize;
	}
    imageMap = new ImageMap(document.getElementById(mapId), document.getElementById(imgId));
    imageMap.resize();
    return;
}

