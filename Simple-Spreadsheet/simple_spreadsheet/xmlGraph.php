<?php
    $xmlGraph = $_POST["xmlGraph"];
	$fileName = $_POST["fileName"];
    $handle = fopen("sites/".$fileName.".xml","w+");
	fwrite($handle,$xmlGraph);
	fclose($handle);
	
?>
