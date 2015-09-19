<?php
    $xmlGraph = $_POST["XML"];
	$fileName = "test";
    $handle = fopen("testGraphs/".$fileName.".xml","w+") or die;
	fwrite($handle,$xmlGraph);
	fclose($handle);
	return "success";
?>
