<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="css/normalize.css">
	<link rel="stylesheet" href="css/select2.css">
	<link rel="stylesheet" href="css/style.css">
	<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> -->
	
	
</head>
<body>

<a class="about">About</a>

<div id="abt-popup" class="popup">
	<div class="abt-content">
		<a>close</a>
		<p>content placeholder</p>
	</div>
</div>

<div class="container">
	<header>
		<h1>Trapezites</h1>
	</header>

	<section>
		<label>Select a time period</label>
		<div class="period-selector">
			<select name="period" class="option-list">
			</select>
		</div>
	</section>

	<div class="converter">
		<div id="error-box"></div>
		<div class="convert-from">
			<label>Currency I Have:</label>
			<input type="text" placeholder="amount" class="amount-selector">
			<div class="currency-from">
				<div class="coin-selector" >
					<select name="coin" class="option-list"></select>
				</div>
				<div class="region-selector" >
					<label>Limit by Region</label>
					<select name="region" class="option-list"></select>
				</div>
			</div>
		</div>
		<div class="convert-to">
			<label>Currency I Want:</label>
			<div class="standard-to">
				<div class="standard-selector" >
					<select name="standard" class="option-list"></select>
				</div>
				<div class="region-selector" >
					<label>Limit by Region</label>
					<select name="region" class="option-list"></select>
				</div>
			</div>
		</div>

	</div>


	<div class="conversion-output">
		<h3 class="names">Output</h3>
	</div>


	<div class="comp-currencies">
		<label><h3>Comparable Local Currencies</h3></label>
		<!-- <div class="comparable"> -->
		<table>
			<thead>
				<tr>
					<th>+</th>
					<th>Quantity</th>
					<th>Name</th>
					<!--<th>Region</th>-->
					<!--<th>Location</th>-->
					<!--<th>Period</th>-->
				</tr>
			</thead>
			<tbody></tbody>
		</table>
		<!-- </div> -->
	</div>

	<div class="comp-comodities">
		<label><h3>Comparable Commodities</h3></label>
		<div class="comparable">
		<table>
			<thead>
				<tr>
					<th>+</th>
					<th>Quantity</th>
					<th>Name</th>
					<th>Region</th>
					<th>Location</th>
					<th>Period</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
</div>
<!-- <div class="change">
	<h2>Make Change</h2>
	<table>
		<thead>
			<tr>
				<th>+</th>
				<th>Quantity</th>
				<th>Name</th>
				<th>Region</th>
				<th>Location</th>
				<th>Period</th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
</div> -->
<script src="./js/jquery.min.js"></script>
<?php
	echo '<script id="data" type="application/json">';
	echo file_get_contents('currency.json');
	echo '</script>';
?>
<script type="module" src="./js/select2.js"></script>
<script type="module" src="./js/global-modules.js"></script>
</body>
</html>
