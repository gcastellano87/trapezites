<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="css/normalize.css">
	<link rel="stylesheet" href="css/select2.css">
	<link rel="stylesheet" href="css/style.css">	
</head>
<body>



<div class="container">
	<nav class="page-menu">
		<ol>
			<li>
				<a class="about">About</a>
			</li>
		</ol>
	</nav>
	<header class="main-header">
		<div class="site-title">
			<h1>Trapezites</h1>		
		</div>
	</header>

	<div class="content">
		<div class="convert">
			<div class="currencies">
				<header class="header">
					<h2>Currencies</h2>
				</header>
				<div class="convert-from">
					
					<div class="currency-from">
						<div class="coin-selector" >
							<label>I HAVE
								<select name="coin" class="option-list"></select>
							</label>
						</div>
						<label class="amount-selector-label" for="amount-selector">AMOUNT:
							<input type="text" placeholder="" name="amount-selector" class="amount-selector">
						</label>
					</div>
				</div>
				<div class="convert-to">
					<div class="standard-to">
						<div class="standard-selector" >
							<label>I WANT
								<select name="standard" class="option-list"></select>
							</label>
						</div>
						<label class="amount-selector-label" for="amount-selector">AMOUNT:
							<input type="text" placeholder="" name="amount-selector" class="amount-selector">
						</label>
					</div>
				</div>
			</div>

			<div class="filters">
				<header>
					<h2>Filters</h2>
				</header>
				<div class="selector region-selector-from" >
					<label>Region <span>A</span>
						<select name="region" class="option-list"></select>
					</label>
				</div>
				<div class="selector period-selector">
					<label>Select date range
						<select name="period" class="option-list">
					</select>
					</label>
				</div>
				<div class="selector region-selector-to" >
					<label>Region <span>B</span>
						<select name="region" class="option-list"></select>
					</label>
				</div>
			</div>
		</div>

		<div class="map">
			<img src="img/map.png" alt="Map of the Mediterranean">
		</div>

		<div class="output">
			<header class="conversion">
				<h3 class="title">________________</h3>
			</header>
			<div class="comparable-currencies">
				<label><h3>Comparable Local Currencies</h3></label>
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

			<div class="comp-comodities">
				<label><h3>Comparable Commodities</h3></label>
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
		</div> <!--  -->
	</div> <!-- .content -->
	<footer class="footer">
		<nav class="external-menu">
			<ol>
				<li>
					<a class="laits">Laits</a>
				</li>
				<li>
					<a class="other">other</a>
				</li>
				<li>
					<a class="other">other</a>
				</li>
				<li>
					<a class="other">other</a>
				</li>
				<li>
					<a class="other">other</a>
				</li>
			</ol>
		</nav>

	</footer>

	<div class="content modal">
		<header>
			<a>close</a>
		</header>
		<section>
			<p>content placeholder</p>
		</section>
	</div>
</div>

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
