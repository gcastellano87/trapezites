<?php
function download_image_and_change_url($url,$name){
	$img = file_get_contents($url);
	$img_file = fopen('ancient-currencies/img/coins/'.$name, 'w');
	fwrite($img_file, $img);
	fclose($img_file);
}


// Remove all files image directory

array_map('unlink', glob("ancient-currencies/img/coins/*"));

/*
 *  Build currency.json
 *
 */
//  currency file
$currency_file = fopen("table.csv","r") or die("table file does not exist");
$currency_count = 0;
$currency_json_array = array();
$currency_response = array();
$currency_header = array();

while(! feof($currency_file)){

  	$currency_row = fgetcsv($currency_file);
	  
	if($currency_count==0){
		print_r($currency_row);
		   
		for($i = 0; $i<count($currency_row); $i++){
          $currency_row[$i] = str_replace(' ','_',strtolower($currency_row[$i]));
        }
		$currency_header = $currency_row;
  	} else {
		  
		$newRow = array();
     
      	for($i = 0; $i<count($currency_row); $i++){
			echo 'Does ' . $currency_header[$i] . " have coin_image in it?\n\r";
			if((strpos($currency_header[$i],'coin_image') !== false) && $currency_row[$i] ){
				// echo "Yes.  Yes it does..................................\n\r";
				$ext = pathinfo( $currency_row[$i], PATHINFO_EXTENSION);
				$file_name = $currency_header[$i] . str_replace('.','_',microtime(true)) . '.' . $ext;
				 download_image_and_change_url($currency_row[$i],$file_name);

				$newRow[$currency_header[$i]] = $file_name;
			} else {
				// Save it as it is
				$newRow[$currency_header[$i]] = $currency_row[$i];
			}
	    }
	  	array_push($currency_json_array, $newRow);
	}
	  
    $currency_count++;
}

fclose($currency_file);


$total_entries = count($currency_json_array);
$currency_response['entries'] = $currency_json_array;
$currency_response['total_entries'] = $total_entries;
$filename = 'ancient-currencies/index.html';
$original_content = file_get_contents($filename);
$fp = fopen($filename, 'w');

echo $original_content;
$new_json_prefix = "\n\r" .'<script id="data" type="application/json">' . "\n\r";
$new_json_data = json_encode($currency_response);
$new_json_suffix = "\n\r" . '</script>'. "\n\r";
$new_json = $new_json_prefix . $new_json_data . $new_json_suffix;

$new_contents = preg_replace('/(<!--BDATA--\>).*?(\<!--EDATA--\>)/s', '$1' . $new_json .'$2', $original_content);
fwrite($fp, $new_contents);
fclose($fp);

exit(0);