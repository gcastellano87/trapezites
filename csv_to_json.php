<?php
$file = fopen("table2.csv","r") or die("file does not exist");
$count = 0;
$json_array = array();
$response = array();
$calendar = array();
$years = array();
$header = array();
while(! feof($file))
{
  	$row = fgetcsv($file);
  	if($count==0)
  	{
  		 print_r($row);
       for($i = 0; $i<count($row); $i++){
          // $row[$i] = strtolower(preg_replace('/\s+/', '_', $row[$i]));
          $row[$i] = strtolower($row[$i]);
       }
  		 $header = $row;
  	}
  	else
  	{
  		$newRow = array();
     
      for($i = 0; $i<count($row); $i++){
	        $newRow[$header[$i]] = $row[$i];
	    }
      // array_push($calendar, $newRow['calendar']);
      // array_push($years, $newRow['year']);
      // $newRow['calendar_id'] = preg_replace('/[\s]/', '-', preg_replace('/[\s-]+/', ' ', preg_replace("/[^a-z0-9_\s-]/", "",strtolower($row[7]))));
      // $newRow['entry_id'] = $newRow['calendar_id'] . '_' . $newRow['year'] . '-' . strtolower($newRow['date_other']) . '_' . preg_replace('/[\s]/', '-', preg_replace('/[\s-]+/', ' ', preg_replace("/[^a-z0-9_\s-]/", "",strtolower($row[3]))));
	  	array_push($json_array, $newRow);
  	}
    $count++;
}
fclose($file);
// $calendars = array_values(array_unique($calendar));
// $years = array_values(array_unique($years));
sort($years);
$total_entries = count($json_array);

echo $json_array;

$response['entries'] = $json_array;
// $response['all_calendars'] = array_values(array_diff($calendars, array('')));
$response['total_entries'] = $total_entries;
// $response['years'] = $years;
// $file_2 = fopen("KiowaCalendarCalendarData.csv","r") or die("file does not exist");
// $count = 0;
// $json_array_2 = array();
// $header_2 = array();
// while(! feof($file_2))
// {
//     $row = fgetcsv($file_2);
//     if($count==0)
//     {
//        print_r($row);
//        $header_2 = $row;
//        $count = 1;
//     }
//     else
//     {
//       $rowData = array();
//       for($i = 0; $i<count($row); $i++)
//       {
//           if ($header_2[$i] == "title")
//           {
//             $rowData['calendar_id'] = preg_replace('/[\s]/', '-', preg_replace('/[\s-]+/', ' ', preg_replace("/[^a-z0-9_\s-]/", "",strtolower($row[$i]))));
//           } 
//           $rowData[$header_2[$i]] = $row[$i];
          
//       }
//       if ($rowData["display"] == "yes"){
//         array_push($json_array_2, $rowData);
//       }
//     }
// }
// fclose($file_2);
// $response['calendars_info'] = $json_array_2;
// print_r($json_array_2);

$fp = fopen('currency.json', 'w');
// fwrite($fp, json_encode($response, JSON_HEX_QUOT | JSON_HEX_TAG));
fwrite($fp, json_encode($response));
fclose($fp);
exit(0);
?>