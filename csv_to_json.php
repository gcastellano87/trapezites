<?php

/*
 *  Build Bibliography.json
 *
 */


$bibliography_file = fopen("bibliography.csv","r") or die("file does not exist");
$bibliography_count = 0;
$bibliography_json_array = array();
$bibliography_response = array();
$bibliography_header = array();

while(! feof($bibliography_file))
{
  	$bibliography_row = fgetcsv($bibliography_file);
	  
	if($bibliography_count==0) {
		print_r($bibliography_row);
	
		for($i = 0; $i<count($bibliography_row); $i++){
			$bibliography_row[$i] = strtolower($bibliography_row[$i]);
        }
	
		$bibliography_header = $bibliography_row;
	  
	} else {
		
		$newRow = array();
		
		for($i = 0; $i<count($bibliography_row); $i++){
	        $newRow[$bibliography_header[$i]] = $bibliography_row[$i];
		}
	 
		array_push($bibliography_json_array, $newRow);
  	}
	$bibliography_count++;
}

fclose($bibliography_file);

$total_entries = count($bibliography_json_array);

$bibliography_response['entries'] = $bibliography_json_array;
$bibliography_response['total_entries'] = $total_entries;

$bibliography_json_output = fopen('ancient-currencies/bibliography.json', 'w');
fwrite($bibliography_json_output, json_encode($bibliography_response));
fclose($bibliography_json_output);

/*
 *  Build currency.json
 *
 */

$currency_file = fopen("table.csv","r") or die("file does not exist");
$currency_count = 0;
$currency_json_array = array();
$currency_response = array();
$currency_header = array();
while(! feof($currency_file))
{
  	$currency_row = fgetcsv($currency_file);
  	if($currency_count==0)
  	{
  		 print_r($currency_row);
       for($i = 0; $i<count($currency_row); $i++){
          $currency_row[$i] = strtolower($currency_row[$i]);
       }
  		 $currency_header = $currency_row;
  	}
  	else
  	{
  		$newRow = array();
     
      for($i = 0; $i<count($currency_row); $i++){
	        $newRow[$currency_header[$i]] = $currency_row[$i];
	    }
	  	array_push($currency_json_array, $newRow);
  	}
    $currency_count++;
}
fclose($currency_file);
$total_entries = count($currency_json_array);
$currency_response['entries'] = $currency_json_array;
$currency_response['total_entries'] = $total_entries;
$fp = fopen('ancient-currencies/currency.json', 'w');
fwrite($fp, json_encode($currency_response));
fclose($fp);


exit(0);
