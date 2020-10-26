<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="style.css">
	<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> -->
	<script src="./js/jquery.min.js"></script>
	
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

		<h1>Trapezites</h1>
		<div>
			<label>Select a time period</label>
			<div class="block period">
				<input type="text" placeholder="Search.." class="input search-box" label="period">
				<select name="period" class="option-list">
				</select>
			</div>
		</div>

		<div class="converter">
			<div id="error-box"></div>
			<div class="converter-left">
				<label>Currency I Have:</label>
				<input type="text" placeholder="amount" id="amount-box1" class="amount-box">
				<div class="block-container currency1">
					<div class="block denomination-location" >
						<input type="text" placeholder="Search.." class="input search-box" label="denomination-location">
						<select name="denomination-location" class="option-list"></select>
					</div>
					<div class="block region" >
						<label>Limit by Region</label>
						<input type="text" placeholder="Search.." class="input search-box" label="region">
						<select name="region" class="option-list"></select>
					</div>
				</div>
			</div>
			<div class="converter-right">
				<label>Currency I Want:</label>
				<!--<input type="text" placeholder="amount" id="amount-box2" class="amount-box" which="2">-->
				<p id="converter-output">output placeholder</p>
				<div class="block-container currency2">
					<div class="block standard" >
						<input type="text" placeholder="Search.." class="input search-box" label="denomination-location">
						<select name="standard" class="option-list"></select>
					</div>
					<div class="block region" >
						<label>Limit by Region</label>
						<input type="text" placeholder="Search.." class="input search-box" label="region">
						<select name="region" class="option-list"></select>
					</div>
				</div>
			</div>

		</div>


	<div id="translation-section">
		<h3 id="name1" class="names">name placeholder</h3>
	</div>


	<div class="comp-currencies">
		<label>Comparable Local Currencies</label>
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
		<label>Comparable Commodities</label>
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
<?php
	echo '<script id="data" type="application/json">';
	echo file_get_contents('currency.json');
	echo '</script>';
?>
<script type="module" src="./js/global-modules.js"></script>
</body>
</html>
