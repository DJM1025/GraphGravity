<?php
$graph = $_POST['graphName'];
$folder = "/homes/gravity/public_html/botzer/gravity/data/";
$dir = scandir( $folder );
$dataDir = null;
$contents = array();



for ($i = 0; $i < count($dir); $i ++) {
	if ($dir[$i] != "." && $dir[$i] != ".." && $dir[$i] != "data.tar") {
		$dataDir = scandir($folder.$dir[$i]);
		for ($j = 0; $j < count($dataDir); $j++) {
			if ($dataDir[$j] == $graph) {
				array_push($contents, file_get_contents($folder.$dir[$i]."/".$dataDir[$j]));
			}
		}
	}
}
for ($i = 0; $i < count($contents); $i++) {
	echo $contents[$i];
	echo "!";	// delimits end of one users data
}
?>