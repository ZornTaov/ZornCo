<?php
function decode_appID() {
  return $appArray = array (
      array (
          "appid" => 440,
          "name" => "Team Fortress 2" 
      ),
      array (
          "appid" => 570,
          "name" => "Dota 2" 
      ),
      array (
          "appid" => 730,
          "name" => "Counter-Strike: Global Offensive" 
      ),
      array (
          "appid" => 753,
          "name" => "Steam" 
      ),
      array (
          "appid" => 230410,
          "name" => "Warframe" 
      ),
      array (
          "appid" => 238460,
          "name" => "BattleBlock Theater" 
      ),
      array (
          "appid" => 238960,
          "name" => "Path of Exile" 
      ),
      array (
          "appid" => 230410,
          "name" => "Warframe" 
      ),
      array (
          "appid" => 251970,
          "name" => "Sins of a Dark Age" 
      ),
      array (
          "appid" => 308080,
          "name" => "Altitude0: Lower & Faster" 
      ) 
  );
}
// test input

if (isset($_GET['appid']) && isset($_GET['item'])) {

  $args = $_GET['appid'] . " " . $_GET['item'];
  $arg = explode(" ", $args);
}
// input end

$apps = decode_appID ();
$app = FALSE;
$i = 0;
if (count ( $arg ) >= 2) {
  while ( $app === FALSE && $i < count ( $apps ) ) {
    if (strpos ( strtolower ( $args ), strtolower ( $apps [$i] ['name'] ) ) !== FALSE || $apps [$i] ['appid'] == $arg [0]) {
      $app = $apps [$i];
    }
    $i ++;
  }
  if ($app === FALSE) {
    echo "Couldn't find your game!";
    return;
  }
  if ($arg [0] == $app ['appid']) {
    $item = ucwords ( substr ( $args, strlen ( $app ['appid'] ) + 1 ) );
  } else {
    $item = ucwords ( substr ( $args, strlen ( $app ['name'] ) + 1 ) );
  }
  if ($itemDecoded = json_decode ( file_get_contents ( "http://steamcommunity.com/market/priceoverview/?country=US&currency=0&appid=" . 
      $app ['appid'] . "&market_hash_name=" . str_replace ( " ", "+", $item ) ), TRUE )) {
    if ($itemDecoded ['success'] === TRUE) {
      if (isset($itemDecoded ['lowest_price'])) {
        $lowestPrice = $itemDecoded ['lowest_price'];
        printf ( "Lowest price for %s is %s", $item, str_replace ( "&#36;", "$", $lowestPrice) );
      }
      elseif (isset($itemDecoded ['median_price']))
      {
        $medianPrice = $itemDecoded ['median_price'];
        printf ( "Median price for %s is %s", $item, str_replace ( "&#36;", "$", $medianPrice) );
      }
    } else {
      echo "Found the game, not the item!";
    }
  } else {
    echo "Error getting data";
  }
} else {
  echo "I need a gameID, then the item name";
}
?>
