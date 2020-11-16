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
		<ul>
			<li>
				<a class="about" href="#">About</a>
			</li>
		</ul>
	</nav>

	<div class="content">
		<header class="main-header">
			<h1 class="site-title">Trapezites</h1>		
		</header>
		<div class="convert">
			<div class="currencies">
				<header class="header">
					<h2 class="screen-reader-text">Currencies</h2>
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
							<input type="text" placeholder="__" name="amount-selector" class="amount-output">
						</label>
					</div>
				</div>
			</div>

			<div class="filters">
				<header class="header">
					<h2 class="screen-reader-text">Filters</h2>
				</header>
				<div class="selector region-selector-from" >
					<label>Region <span class="letter">A</span>
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
					<label>Region <span class="letter">B</span>
						<select name="region" class="option-list"></select>
					</label>
				</div>
			</div>
		</div>

		<div class="map">
			<canvas id="map"></canvas>
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
			<ul>
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
			</ul>
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
