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

$(document).on('click','.optionList a', function() {
	console.log('selected ' + this);
	
	let wasSelectedBefore = $(this).hasClass('selected');
	$(this).toggleClass('selected');
	let which = this.getAttribute('which');
	let label = this.getAttribute('label');
	toggleSelected(which, label, this.textContent);

	flush(which);
	populate(which);
	changeName(which);
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
	name = name + (coin['isDenominationSelected'] ? coin['selectedDenomination'] : 'currency');
	name = name + ' in ';
	name = name + (coin['isLocationSelected'] ? coin['selectedLocation'] : 'location');
	name = name + ' during ';
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
	
	if (!lhs['isLocationSelected'] || !lhs['isDenominationSelected'] || !lhs['isPeriodSelected'] ||
		!rhs['isLocationSelected'] || !rhs['isDenominationSelected'] || !rhs['isPeriodSelected'] )
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

		$('#amount-box'+whichOpposite).val(result);
	}
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
