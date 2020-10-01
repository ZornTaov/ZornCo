<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
    <style type="text/css">
    body { background-color: #00A658; }
    h1 {
      font-size: 1.4em; color: #5A00A8;
      background-color: #FFF;
      padding: 1em 1em;
      text-align: center;
    }
    h2 { font-size: 1.15em; color: #0600A8; }
    </style>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" >
    <link rel="icon" type="image/png" href="favicon-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="favicon-160x160.png" sizes="160x160">
    <link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32">
<title>Title Here</title>
</head>
<body><?php
$robot_parts = array (
    "237182228" => "Battle-Worn Robot Taunt Processor",
    "237182229" => "Battle-Worn Robot Money Furnace",
    "237182230" => "Reinforced Robot Humor Suppression Pump",
    "237182231" => "Reinforced Robot Emotion Detector",
    "237182586" => "Reinforced Robot Bomb Stabilizer",
    "237183779" => "Battle-Worn Robot KB-808",
    "237193064" => "Pristine Robot Brainstorm Bulb",
    "237193078" => "Pristine Robot Currency Digester" 
);

function findKit($item) {
  if ($itemDecoded = json_decode ( file_get_contents ( "http://steamcommunity.com/market/priceoverview/?country=US&currency=0&appid=" . 440 . "&market_hash_name=" . str_replace ( " ", "+", $item ) ), TRUE )) {
    if ($itemDecoded ['success'] === TRUE) {
      $lowestPrice = $itemDecoded ['lowest_price'];
      printf ( "Lowest price for %s is %s", $item, str_replace ( "&#36;", "$", $lowestPrice ) );
    } else {
      echo "Found the game, not the item!";
    }
  } else {
    echo "Error getting data";
  }
}

$errorCount = 0;
$missing = 0;
$name = "zorntaov";
$price = 0;
$DisplayInv = FALSE;
function validateInput($data, $fieldName) {
  global $errorCount;
  if (empty ( $data )) {
    echo "\"$fieldName\" is a required field.<br/>\n";
    ++ $errorCount;
    $retval = "";
  } else {
    $retval = trim ( $data );
    $retval = stripslashes ( $retval );
  }
  return ($retval);
}
if (isset ( $_GET ['name'] )) {
  $name = validateInput ( $_GET ['name'], "name" );
}
if (isset ( $_GET ['price'] )) {
  $price = validateInput ( $_GET ['price'], "price" );
}
if ($errorCount == 0) {
  $DisplayInv = TRUE;
}


$inventory = json_decode ( file_get_contents ( "http://steamcommunity.com/id/" . $name . "/inventory/json/440/2" ), TRUE );
/* echo "<pre>";
print_r ( $inventory );
echo "</pre>"; */

function fabricators() {
  global $inventory;
  $fabricators = array ();
  foreach ( $inventory ['rgDescriptions'] as $item => $value ) {
    // print_r($value['market_hash_name'] . "\n");
    if (strpos ( $value ['market_hash_name'], 'Fabricator' ) !== false) {
      $fabricators [$item] = array (
          "name" => $value ['market_hash_name'],
          'part' => array () 
      );
      $output_array = array ();
      foreach ( $value ['descriptions'] as $part ) {
        preg_match ( "/(.*) x (\d+)/i", $part ['value'], $output_array );
        if (! empty ( $output_array )) {
          $fabricators [$item] ['parts'] [$output_array [1]] = $output_array [2];
        }
      }
      
      // printf ( "\n" );
    }
  }
  return $fabricators;
}
function parts() {
  global $inventory, $robot_parts;
  $parts_in_inv = array ();
  foreach ( $robot_parts as $value ) {
    $parts_in_inv [$value] = 0;
  }
  foreach ( $inventory ['rgInventory'] as $hash => $item ) {
    if (isset ( $robot_parts [$item ['classid']] )) {
      if (isset ( $parts_in_inv [$robot_parts [$item ['classid']]] )) {
        $parts_in_inv [$robot_parts [$item ['classid']]] ++;
      }
    }
  }
  // print_r($parts_in_inv);
  return $parts_in_inv;
}
if ($DisplayInv || $name == ("zorntaov")) {
  // $itemDecoded['rgInventory']['rgDescriptions'];
  if ($inventory ['success'] === TRUE) {
  
    $parts = parts ();
    $fabs = fabricators ();
    foreach ( $fabs as $fab ) {
      echo "<h1>{$fab['name']}</h1>\n";
      $can_make = true;
      if ($price == 1)  findKit ( str_replace ( " Fabricator", "", $fab['name']) );
      foreach ( $fab ['parts'] as $part => $value ) {
        if (isset ( $parts [$part] )) {
          echo "<p>$part: {$parts[$part]}/$value</p>";
          if ($parts [$part] < $value && $can_make) {
            $can_make = FALSE;
          }
        }
      }
      if ($can_make) {
        echo "<h2>CAN MAKE!</h2>";
      }
    }
  }
  else {
    echo $inventory['Error'];
  }
}
else {
  echo "<h1>No Name Given</h1>";
}
// echo "";
// print_r($fabs);
// print_r ( $inventory['rgInventory'] );
?>
<a href="http://www.zornco.org/">Back</a></body>
</html>