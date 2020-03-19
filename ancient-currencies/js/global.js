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
					"selectedPeriod" : ''
				},
				"coin2" : {
					"isRegionSelected" : false,
					"isLocationSelected" : false,
					"isDenominationSelected" : false,
					"isPeriodSelected" : false,
					"selectedRegion" : '',
					"selectedLocation" : '',
					"selectedDenomination" : '',
					"selectedPeriod" : ''
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
	$.getJSON("https://api.myjson.com/bins/15gpmk", (json)=>{
		// console.log(json);
		let entries = splitEntries(json.entries);
		console.log(entries);

		coinInfo = entries['currencies'];
		commInfo = entries['commodities'];

		console.log('coinInfo and commInfo ready');
		// console.log(coinInfo);

		periods = preparePeriods();
		console.log('periods ready');

		update(1);
		// populate(1);
		// populate(2);
		// changeName(1);
		// changeName(2);
	});
});

/*--- optionlist events ---*/
$(document).on('click','.optionList a', function(e) {
	e.preventDefault();
	// console.log('selected ' + this);

	// let wasSelectedBefore = $(this).hasClass('selected');
	$(this).toggleClass('selected');
	let which = this.getAttribute('which');
	let label = this.getAttribute('label');
	console.log('selected ' + name);
	toggleSelected(which, label, this.textContent);

	update(which);
});

/*--- clickable map events ---*/
$(document).on('click','.clickable-map area', function(e) {
	e.preventDefault();

	//gather necessary data
	let wasSelectedBefore = $(this).hasClass('selected');
	let which = this.getAttribute('which');
	let value = this.getAttribute('value');
	let label = 'region';

	//update the sign that is displayed
	$('.currency'+which+' .region input').val( value );

	//handle program logic
	if (state['coin'+which]['isRegionSelected']) {
		if (wasSelectedBefore) {
			//region was selected and this object as well
			// must deselect both
			$(this).toggleClass('selected');
			toggleSelected(which, label, '');
		} else {
			//region was selected but not this object
			// must clear the selected class from all objects,
			// add it to this object and select this region
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
	update(which);
});
$(document).on('mouseover','.clickable-map area', function(e) {
	e.preventDefault();
	let which = this.getAttribute('which');
	let value = this.getAttribute('value');
	$('.currency'+which+' .region input').val( value );
});
$(document).on('mouseout','.clickable-map area', function(e) {
	e.preventDefault();
	let which = this.getAttribute('which');
	let text = state['coin'+which]['selectedRegion'];
	$('.currency'+which+' .region input').val( text );
});

/*--- conversion ammount textbox event ---*/
$(document).on('keyup', '.amount-box', function() {
	let which = this.getAttribute('which');
	convertCurrency(which);
});

/*--- functions that updated what is displayed ---*/
function update(which) {
	flush(which);
	populate(which);
	changeName(which);

	if ( allCoinOptionsSelected(1) ) {
		console.log('allTopOptionsSelected');
		//display commodities
		//display menu for second currency
	} else {
		//hide commodities
		//possibly hide bottom menu
		if (!anyCoinOptionsSelected(2)) {
		}
	}

	// trigger default conversion with 10
	if ( allOptionsSelected() ) {
		$('#amount-box1').val(10);
		convertCurrency(1);
	}
}

function populate(which) {

	// let coin = getCorrectCoin(which);
	let coin = state['coin'+which];

	// console.log('appending regions');

	let regions = new Set();
	let locations = new Set();
	let denominations = new Set();
	// let periods = new Set();
	for (let item of coinInfo) {

		let itemRegion = item['region'];
		let itemLocation = item['location'];
		let itemDenomination = item['denomination'];
		// let itemPeriod = item['start_date'];

		if ( (!coin['isRegionSelected']       || itemRegion == coin['selectedRegion']) &&
			 (!coin['isLocationSelected']     || itemLocation == coin['selectedLocation']) &&
			 (!coin['isDenominationSelected'] || itemDenomination == coin['selectedDenomination']) &&
			 (!coin['isPeriodSelected'] 	  || itemPeriod == coin['selectedPeriod']) ) 
		{
			regions.add(itemRegion);
			locations.add(itemLocation);
			denominations.add(itemDenomination);
			// periods.add(itemPeriod);
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
			let tempHtml = $('<a href="#" which="'+which+'" label="location">'+ item +'</a>');
			// $(tempHtml).appendTo('#currency'+which+'-location .optionList');
			$(tempHtml).appendTo('.currency'+which+' .location .optionList');
		}
	}

	if (!coin['isDenominationSelected']) {
		// console.log(denominations);
		for (let item of denominations) {
			let tempHtml = $('<a href="#" which="'+which+'" label="denomination">'+ item +'</a>');
			$(tempHtml).appendTo('.currency'+which+' .denomination .optionList');
		}
	}

	if (!coin['isPeriodSelected']) {
		// console.log(periods);
		for (let item of periods) {
			let str = item[0]+' to '+item[1];
			let tempHtml = $('<a href="#" which="'+which+'" label="period">'+ str +'</a>');
			$(tempHtml).appendTo('.currency'+which+' .period .optionList');
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
	name = name + ' in ';
	name = name + (coin['isPeriodSelected'] ? coin['selectedPeriod'] : 'period');	

	$('#name'+which).text( name );
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
	} else if (label == 'start date') {
		if (!coin['isPeriodSelected']) {
			coin['isPeriodSelected'] = true;
			coin['selectedPeriod'] = value;
		} else {
			coin['isPeriodSelected'] = false;
			coin['selectedPeriod'] = '';
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
			 item['denomination'] == coin['selectedDenomination'] &&
			 item['start date'] == coin['selectedPeriod'] ) 
		{
			return (+item['value in grams of silver']);
		}
	}
	return 0;
}

function splitEntries(entries) {
	let result = {
		"currencies" : [],
		"commodities" : []
	};
	for (let i in entries) {
		let obj = entries[i];
		if (obj['commodity or service'] == 'x') {
			result['commodities'].push(obj);
		} else {
			result['currencies'].push(obj);
		}
	}
	return result;
}

//TODO: I'm assuming all dates in BC
function preparePeriods() {
	// console.log('in preparePeriods');
	
	// find min and max dates
	let min = '9999 AD';
	let max = '9999 BC';

	for (let item of coinInfo) {
		// let startDate = item['start_date'];
		// let endDate = item['end_date'];
		// startDates.add(startDate);
		// endDates.add(endDate);
		if (compareYears(item['start_date'], min) < 0) {
			min = item['start_date'];
		}
		if (compareYears(item['end_date'], max) > 0) {
			max = item['end_date'];
		}
	}
	// console.log('min '+min);
	// console.log('max '+max);

	//round up or down
	let minSplit = min.split(' ',2);
	let maxSplit = max.split(' ',2);
	let minNum = Math.ceil(parseInt(minSplit[0])/25)*25;
	let maxNum = Math.ceil(parseInt(maxSplit[0])/25)*25;
	let minLabel = minSplit[1];
	let maxLabel = maxSplit[1];
	min = minNum+' '+minLabel;
	max = maxNum+' '+maxLabel;
	// console.log('rounded min '+min);
	// console.log('rounded max '+max);

	// generate periods in between min and max
	let result = [];
	while (compareYears(min, max) == -1){
		// let periodStart = min;
		let periodEnd;
		if (minLabel == 'BC') {
			periodEnd = minNum - 24;
			result.push([min, periodEnd+' '+minLabel]);
			minNum = minNum - 25;
			if (minNum == 0) {
				minLabel = 'AD';
			}
		} else {
			periodEnd = minNum + 24;
			result.push([min, periodEnd+' '+minLabel]);
			minNum = minNum + 25;
		}
		min = minNum+' '+minLabel;
	}
	return result;
}

//y1 and y2 are strings in format 'X BC' or 'X AD'
//returns -1 if y1 < y2
//returns  1 if y1 > y2
//returns  0 if equal
function compareYears(y1, y2) {
	// console.log('comparing years '+y1+' '+y2);
	if (y1 == y2) {
		return 0;
	}
	else {
		let suf1 = y1.slice(-2);
		let suf2 = y2.slice(-2);
		if (suf1 == 'BC' && suf2 == 'AD') {
			return -1;
		}
		else if (suf1 == 'AD' && suf2 == 'BC') {
			return 1;
		}
		else if (suf1 == 'BC' && suf2 == 'BC') {
			// console.log('both BC');
			let num1 = parseInt(y1);
			let num2 = parseInt(y2);
			return num1 > num2 ? -1 : 1;
		}
		else { //both AD
			let num1 = parseInt(y1);
			let num2 = parseInt(y2);
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

