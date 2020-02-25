var coinInfo;

var coin1 = {
					"isRegionSelected" : false,
					"isLocationSelected" : false,
					"isDenominationSelected" : false,
					"isPeriodSelected" : false,
					"selectedRegion" : '',
					"selectedLocation" : '',
					"selectedDenomination" : '',
					"selectedPeriod" : ''
				};

var coin2 = {
					"isRegionSelected" : false,
					"isLocationSelected" : false,
					"isDenominationSelected" : false,
					"isPeriodSelected" : false,
					"selectedRegion" : '',
					"selectedLocation" : '',
					"selectedDenomination" : '',
					"selectedPeriod" : ''
				};

window.onload = function () {
	imgMapFunc ('region-map', 'region-img');
}

document.addEventListener("DOMContentLoaded", function() {
	console.log('reading json');
	// http://myjson.com/k8xmq
	$.getJSON("https://api.myjson.com/bins/k8xmq", (json)=>{
		console.log('reading json...');
		// console.log(json);
		coinInfo = json.entries;
		// currCoins = coinInfo;
		console.log('coinInfo is ready');

		populate(1);
		populate(2);
		changeName(1);
		changeName(2);
	});
});

$(document).on('click','.optionList a', function(e) {
	e.preventDefault();
	console.log('selected ' + this);

	let wasSelectedBefore = $(this).hasClass('selected');
	$(this).toggleClass('selected');
	let which = this.getAttribute('which');
	let label = this.getAttribute('label');
	toggleSelected(which, label, this.textContent);

	flush(which);
	populate(which);
	changeName(which);

	// trigger default conversion with 10
	if ( allOptionsSelected() ) {
		$('#amount-box1').val(10);
		convertCurrency(1);
	}
});

$(document).on('keyup', '.amount-box', function() {
	let which = this.getAttribute('which');
	convertCurrency(which);
});

function populate(which) {

	let coin = getCorrectCoin(which);

	console.log('appending regions');
	let regions = new Set();
	let locations = new Set();
	let denominations = new Set();
	let periods = new Set();
	for (let item of coinInfo) {

		let itemRegion = item['region'];
		let itemLocation = item['location'];
		let itemDenomination = item['denomination'];
		let itemPeriod = item['start date'];

		if ( (!coin['isRegionSelected']       || itemRegion == coin['selectedRegion']) &&
			 (!coin['isLocationSelected']     || itemLocation == coin['selectedLocation']) &&
			 (!coin['isDenominationSelected'] || itemDenomination == coin['selectedDenomination']) &&
			 (!coin['isPeriodSelected'] 	  || itemPeriod == coin['selectedPeriod']) ) 
		{
			regions.add(itemRegion);
			locations.add(itemLocation);
			denominations.add(itemDenomination);
			periods.add(itemPeriod);
		}
	}

	if (!coin['isRegionSelected']) {
		// console.log(regions);
		for (let item of regions) {
			let tempHtml = $('<a href="#" which="'+which+'" label="region">'+ item +'</a>');
			$(tempHtml).appendTo('#block'+which+'-1 .optionList');
		}
	}

	if (!coin['isLocationSelected']) {
		// console.log(locations);
		for (let item of locations) {
			let tempHtml = $('<a href="#" which="'+which+'" label="location">'+ item +'</a>');
			$(tempHtml).appendTo('#block'+which+'-2 .optionList');
		}
	}

	if (!coin['isDenominationSelected']) {
		// console.log(denominations);
		for (let item of denominations) {
			let tempHtml = $('<a href="#" which="'+which+'" label="denomination">'+ item +'</a>');
			$(tempHtml).appendTo('#block'+which+'-3 .optionList');
		}
	}

	if (!coin['isPeriodSelected']) {
		// console.log(periods);
		for (let item of periods) {
			let tempHtml = $('<a href="#" which="'+which+'" label="start date">'+ item +'</a>');
			$(tempHtml).appendTo('#block'+which+'-4 .optionList');
		}
	}
}

function flush(which) {

	//flush textboxes
	$('#amount-box1').val("");
	$('#amount-box2').val("");

	console.log('flushing!');

	$('#block'+which+'-1 .optionList').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});

	$('#block'+which+'-2 .optionList').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});

	$('#block'+which+'-3 .optionList').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});

	$('#block'+which+'-4 .optionList').children().each(function(i) {
	    if (!$(this).hasClass('selected')) {
	    	$(this).remove();
	    }
	});
}

function toggleSelected(which, label, value) {
	
	let coin = getCorrectCoin(which);

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

function changeName(which) {
	let coin = getCorrectCoin(which);

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

function filterFunction() {
	console.log('filtering');
}

/* Converts from the currency which to the other one */
function convertCurrency(which) {
	console.log('converting!!!');

	let amountS = $('#amount-box'+which).val();

	let whichOpposite = which == '1' ? '2' : '1';

	let lhs = getCorrectCoin(which);
	let rhs = getCorrectCoin(whichOpposite);
	
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

function allOptionsSelected() {
	return coin1['isLocationSelected'] && coin1['isDenominationSelected'] && coin1['isPeriodSelected'] &&
		coin2['isLocationSelected'] && coin2['isDenominationSelected'] && coin2['isPeriodSelected'];
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

function getCorrectCoin(which) {
	if (which == '1') {
		return coin1;
	} else if (which == '2') {
		return coin2;
	} else {
		throw "Error getting the correct coin";
	}
}

//TODO: I'm assuming all dates in BC
function preparePeriods() {
	// get sets of periods
	let startDates = new Set();
	let endDates = new Set();
	for (let item of coinInfo) {
		let startDate = item['start date'];
		let endDate = item['end date'];
		startDates.add(startDate);
		endDates.add(endDate);
	}

	//get min and max dates
	let min = '9999 AD';
	for (let item of startDates) {
		if (compareYears(item, min) < 0) {
			min = item;
		}
	}
	let max = '9999 BC';
	for (let item of startDates) {
		if (compareYears(item, max) > 0) {
			max = item;
		}
	}
	min = Math.ceil(parseInt(min)/50)*50;
	max = Math.ceil(parseInt(max)/50)*50;

	//get set of periods
	
}

//y1 and y2 are strings in format 'X BC' or 'X AD'
//returns -1 if y1 < y2
//returns  1 if y1 > y2
//returns  0 if equal
function compareYears(y1, y2) {
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

// resize areas in image map 
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

