var coinInfo;
var commInfo;
var periods;

var state = {
				"coin1" : {
					"isRegionSelected" : false,
					"isLocationSelected" : false,
					"isDenominationSelected" : false,
					"isPeriodSelected" : false,
					"selectedRegion" : '',
					"selectedLocation" : '',
					"selectedDenomination" : '',
					"selectedPeriod" : -1,
					"selectedPeriodYear" : [],
					"selectedPeriodSuf" : []
				},
				"coin2" : {
					"isRegionSelected" : false,
					"isLocationSelected" : false,
					"isDenominationSelected" : false,
					"isPeriodSelected" : false,
					"selectedRegion" : '',
					"selectedLocation" : '',
					"selectedDenomination" : '',
					"selectedPeriod" : -1,
					"selectedPeriodYear" : [],
					"selectedPeriodSuf" : []
				}
			};

/*--- resize for map areas ---*/
window.onload = function () {
	imgMapFunc ('region-map', 'region-img');
}

/*--- set up initial state ---*/
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

			updateSelectionMenu(1);
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

	// 	updateSelectionMenu(1);
	// 	// populate(1);
	// 	// populate(2);
	// 	// changeName(1);
	// 	// changeName(2);
	// });
});

/*--- optionlist events ---*/
$(document).on('click','.optionList a', function(e) {
	e.preventDefault();
	// console.log('selected ' + this);

	// let wasSelectedBefore = $(this).hasClass('selected');
	$(this).toggleClass('selected');
	let which = this.getAttribute('which');
	let label = this.getAttribute('label');
	console.log('selected ' + label);
	if (label == 'period') {
		let pid = this.getAttribute('pid');
		toggleSelected(which, label, pid);
	} else {
		toggleSelected(which, label, this.textContent);
	}

	updateSelectionMenu(which);
});

/*--- clickable map events ---*/
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
	updateSelectionMenu(which);
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

/*--- conversion ammount textbox event ---*/
$(document).on('keyup', '.amount-box', function() {
	//flush previous conversions
	$('table tbody tr').remove();

	let which = this.getAttribute('which');
	let amountS = $('#amount-box'+which).val();
	if ( !allCoinOptionsSelected(1) )
	{
		$('#errorBox').text("You must provide denomination, location, and period to convert.");
	}
	else if ( isNaN(amountS) ) {
		$('#errorBox').text("Provide a valid number.");
	}
	else {
		$('#errorBox').text("");
		displayComparableCurrencies();
		displayComparableCommodities();
	}

});

/*--- functions that updated what is displayed ---*/
function updateSelectionMenu(which) {
	flush(which);
	populate(which);
	changeName(which);

	if ( allCoinOptionsSelected(1) ) {
		console.log('allTopOptionsSelected');
		//display comparable stuff for 10
		$('#amount-box1').val(10);
		displayComparableCurrencies();
		displayComparableCommodities();

		//display menu for second currency
	} else {
		//hide comparable stuff
		// $('.comp-currencies table tr').not(':first').remove();
		// $('.comp-currencies').hide();
		// $('.comp-comodities table tr').not(':first').remove();
		// $('.comp-comodities').hide();
		$('table tbody tr').remove();
		$('.comp-currencies').hide();
		$('.comp-comodities').hide();

		//possibly hide bottom menu
		if (!anyCoinOptionsSelected(2)) {
		}
	}
	
}

function populate(which) {

	// let coin = getCorrectCoin(which);
	let coin = state['coin'+which];

	let periodCounts = new Array(periods.length).fill(0);
	// console.log('appending regions');

	let regions = new Set();
	let locations = new Set();
	let denominations = new Set();
	// let periods = new Set();
	for (let item of coinInfo) {

		let itemRegion = item['region'];
		let itemLocation = item['location'];
		let itemDenomination = item['denomination'];
		let itemStartDateYear = item['start_date_year'];
		let itemStartDateSuf = item['start_date_suf'];
		let itemEndDateYear = item['end_date_year'];
		let itemEndDateSuf = item['end_date_suf'];

		if ( 
			(!coin['isRegionSelected']       || itemRegion == coin['selectedRegion']) &&
			(!coin['isLocationSelected']     || itemLocation == coin['selectedLocation']) &&
			(!coin['isDenominationSelected'] || itemDenomination == coin['selectedDenomination']) &&
			(!coin['isPeriodSelected'] 	  || isCoinInsidePeriod(itemStartDateYear, itemEndDateSuf, 
			 													itemEndDateYear, itemEndDateSuf, 
			 													coin['selectedPeriod']))
		   )
		{
			if(!coin['isPeriodSelected']){
				for (let i=0; i<periods.length; i++) {
					let coinInsidePeriod = isCoinInsidePeriod(itemStartDateYear, itemEndDateSuf, 
							 						  itemEndDateYear, itemEndDateSuf, i);
					if (coinInsidePeriod) {
						periodCounts[i] += 1;
					}
				}
			}
			regions.add(itemRegion);
			locations.add(itemLocation);
			denominations.add(itemDenomination);
		}
	}

	// if (!coin['isRegionSelected']) {
	// 	// console.log(regions);
	// 	for (let item of regions) {
	// 		let tempHtml = $('<a href="#" which="'+which+'" label="region">'+ item +'</a>');
	// 		$(tempHtml).appendTo('#currency'+which+'-region .optionList');
	// 	}
	// }

	if (!coin['isLocationSelected']) {
		// console.log(locations);
		for (let item of locations) {
			if (item == '') {
				item = '--Unknown--';
			}
			let tempHtml = $('<a href="#" which="'+which+'" label="location">'+ item +'</a>');
			// $(tempHtml).appendTo('#currency'+which+'-location .optionList');
			$(tempHtml).appendTo('.currency'+which+' .location .optionList');
		}
	}

	if (!coin['isDenominationSelected']) {
		// console.log(denominations);
		for (let item of denominations) {
			if (item == '') {
				item = '--Unknown--';
			}
			let tempHtml = $('<a href="#" which="'+which+'" label="denomination">'+ item +'</a>');
			$(tempHtml).appendTo('.currency'+which+' .denomination .optionList');
		}
	}

	if (!coin['isPeriodSelected']) {
		// console.log(periods);
		for (let i=0; i<periods.length; i++) {
			if (periodCounts[i] > 0) {
				let item = periods[i];
				let str = item[0]+' to '+item[1];
				let tempHtml = $('<a href="#" which="'+which+'" label="period" pid="'+i+'">'+ str +'</a>');
				$(tempHtml).appendTo('.currency'+which+' .period .optionList');
			}
		}
	}
}

function flush(which) {

	//flush textboxes
	$('#amount-box1').val("");
	$('#amount-box2').val("");

	// console.log('flushing!');

	// $('.currency'+which+' .region .optionList').children().each(function(i) {
	//     if (!$(this).hasClass('selected')) {
	//     	$(this).remove();
	//     }
	// });

	// $('#currency'+which+'-location .optionList').children().each(function(i) {
	$('.currency'+which+' .location .optionList').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});

	$('.currency'+which+' .denomination .optionList').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});

	$('.currency'+which+' .period .optionList').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});
}

function changeName(which) {
	// let coin = getCorrectCoin(which);
	let coin = state['coin'+which];

	let name = '';
	// name = name + (coin['isDenominationSelected'] ? coin['selectedDenomination'] : 'currency');
	// name = name + ' in ';
	// name = name + (coin['isLocationSelected'] ? coin['selectedLocation'] : 'location');
	// name = name + ' during ';
	// name = name + (coin['isPeriodSelected'] ? coin['selectedPeriod'] : 'period');
	name = name + (coin['isLocationSelected'] ? coin['selectedLocation'] : 'location');
	name = name + ' ';
	name = name + (coin['isDenominationSelected'] ? coin['selectedDenomination'] : 'currency');
	name = name + ' between ';
	name = name + (coin['isPeriodSelected'] ? periods[coin['selectedPeriod']][0] : 'year');
	name = name + ' and ';
	name = name + (coin['isPeriodSelected'] ? periods[coin['selectedPeriod']][1] : 'year');

	$('#name'+which).text( name );
}

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
 												  state['coin1']['selectedPeriod'])) 
		{
			let itemRegion = item['region'];
			let itemLocation = item['location'];
			let itemDenomination = item['denomination'];

			let periodS = item['start_date']+' to '+item['end_date'];

			let amountS = $('#amount-box'+1).val();
			let amount = +amountS;
			let lhsSilver = getValueInSilver(state['coin1']);
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
			let lhsSilver = getValueInSilver(state['coin1']);
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

	// let lhs = getCorrectCoin(which);
	// let rhs = getCorrectCoin(whichOpposite);
	let lhs = state['coin'+which];
	let rhs = state['coin'+whichOpposite];
	
	if ( !allOptionsSelected() )
	{
		$('#errorBox').text("You must provide denomination, location, and period for both currencies to convert.");
	}
	else if ( isNaN(amountS) ) {
		$('#errorBox').text("Provide a valid number.");
	}
	else {
		$('#errorBox').text("");
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

/*--- functions that update program logic ---*/
function toggleSelected(which, label, value) {
	
	// let coin = getCorrectCoin(which);
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
	} else if (label == 'period') {
		if (!coin['isPeriodSelected']) {
			coin['isPeriodSelected'] = true;
			coin['selectedPeriod'] = value;
		} else {
			coin['isPeriodSelected'] = false;
			coin['selectedPeriod'] = -1;
		}
	} else {
		throw "Error in toggleSelected()";
	}
}

// TODO: for searching in optionList functionality
function filterFunction() {
	console.log('filtering');
}

// function allTopOptionsSelected() {
// 	return coin1['isLocationSelected'] && 
// 		   coin1['isDenominationSelected'] && 
// 		   coin1['isPeriodSelected'];
// }

function allCoinOptionsSelected(which) {
	let coin = state['coin'+which];
	return coin['isLocationSelected'] && 
		   coin['isDenominationSelected'] && 
		   coin['isPeriodSelected'];
}

function anyCoinOptionsSelected(which) {
	let coin = state['coin'+which];
	return coin['isLocationSelected'] || 
		   coin['isDenominationSelected'] || 
		   coin['isPeriodSelected'] ||
		   coin['isRegionSelected'];
}

function allOptionsSelected() {
	return allCoinOptionsSelected(1) && allCoinOptionsSelected(2);
}

function getValueInSilver(coin) {
	for (let item of coinInfo) {

		if ( item['location'] == coin['selectedLocation'] &&
			 item['denomination'] == coin['selectedDenomination'] //&&
			 // item['start date'] == coin['selectedPeriod'] 
		   ) 
		{
			return (+item['value in grams of silver']);
		}
	}
	return 0;
}

function isCoinInsidePeriod(startDateYear, startDateSuf, endDateYear, endDateSuf, pid) {
	let selectedPeriod = periods[pid];
	// console.log('in isCoinInsidePeriod for pid:'+pid);
	// console.log('checking coin '+startDateYear+' '+endDateYear+' in '+selectedPeriod);
	let periodStart = selectedPeriod[0];
	let periodEnd = selectedPeriod[1];
	let periodStartYear = parseInt(periodStart);
	let periodStartSuf = periodStart.slice(-2);
	let periodEndYear = parseInt(periodEnd);
	let periodEndSuf = periodEnd.slice(-2);

	let startDateInside = compareYears(periodStartYear,periodStartSuf, startDateYear,startDateSuf) < 1 &&
						  compareYears(periodEndYear,periodEndSuf, startDateYear,startDateSuf) > -1;
	let endDateInside = compareYears(periodStartYear,periodStartSuf, endDateYear,endDateSuf) < 1 &&
						compareYears(periodEndYear,periodEndSuf, endDateYear,endDateSuf) > -1;
	let periodInside = compareYears(periodStartYear,periodStartSuf, startDateYear,startDateSuf) < 1 &&
					   compareYears(periodEndYear,periodEndSuf, endDateYear,endDateSuf) > -1;
	// console.log('startDateInside ' + startDateInside);
	// console.log('endDateInside ' + endDateInside);
	// console.log('periodInside ' + periodInside);
	return startDateInside || endDateInside || periodInside;
}

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

function preparePeriods() {
	// console.log('in preparePeriods');
	
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
	// let minSplit = min.split(' ',2);
	// let maxSplit = max.split(' ',2);
	// let minYear = Math.ceil(parseInt(minSplit[0])/25)*25;
	// let maxYear = Math.ceil(parseInt(maxSplit[0])/25)*25;
	// let minSuf = minSplit[1];
	// let maxSuf = maxSplit[1];
	minYear = Math.ceil(parseInt(minYear)/25)*25;
	maxYear = Math.ceil(parseInt(maxYear)/25)*25;
	min = minYear+' '+minSuf;
	max = maxYear+' '+maxSuf;
	// console.log('rounded min '+min);
	// console.log('rounded max '+max);

	// generate periods in between min and max
	// TODO: generating periods with no coins in existence
	let result = [];
	while (compareYears(minYear, minSuf, maxYear, maxSuf) == -1){
		// let periodStart = min;
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

//y1 and y2 are strings in format 'X BC' or 'X AD'
//returns -1 if y1 < y2
//returns  1 if y1 > y2
//returns  0 if equal
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

function clearMapAreas () {
	$('.clickable-map area').each(function() {
		$(this).removeClass('selected');
	});
}

/*-- resize areas in image map --*/
function imgMapFunc (mapId, imgId) {
	console.log('imgMapFunc '+mapId+" "+imgId);
    var ImageMap = function (map, img) {
	    var n,
	        areas = map.getElementsByTagName('area'),
	        len = areas.length,
	        coords = [],
	        previousWidth = 909;
	    for (n = 0; n < len; n++) {
	        coords[n] = areas[n].coords.split(',');
	    }
	    this.resize = function () {
	    	console.log('resize');
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

