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
<title>Steam Market Checker</title>
</head>
<body>
  <h1>Steam Market Checker</h1>
	<?php
$appArray = array (
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
        "appid" => 251970,
        "name" => "Sins of a Dark Age" 
    ),
    array (
        "appid" => 308080,
        "name" => "Altitude0: Lower & Faster" 
    ) 
);
$errorCount = 0;
$missing = 0;
$item = "";
$appid = 440;
$DisplayPrice = FALSE;
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
function displayForm($item) {
global $appArray;
  ?>
		<form action="steammarket.php" method="get">
    <p>
      Please use the COMPLETE name for the item (AKA, I don't do any fuzzy searches, needs to be exact!  Like Haunted Fallen Angel or Strange Professional Killstreak Australium Rocket Launcher).<br />
    </p>
    Item Name: <input name="item" type="text" value="<?php echo $item; ?>">
    <br /> 
Application: <select name="appid"><?php
  foreach ( $appArray as $value ) {
    echo "<option value='" . $value ['appid'] . "'>" . $value ['name'] . "</option>\n";
  }
  
  ?></select>
    <p>
      <input type="submit" name="submit" value="Search" /> <input type="reset" name="reset" value="Reset" />
    </p>
  </form>
			<?php
}
if (isset ( $_GET ['submit'] )) {
  if ((isset ( $_GET ['item'] ))) {
    $item = validateInput ( $_GET ['item'], "item" );
    $appid = validateInput( $_GET ['appid'], "appid");
    if ($errorCount == 0) {
      $DisplayPrice = TRUE;
    }
  }
}
if ($DisplayPrice) {
  include 'steammarketbase.php';
}
  displayForm ($item);
?>
<a href="http://www.zornco.org/">Back</a>
</body>
</html>