<?
	$graphChosen = $_POST["graph"];
	$allTesters = scanDir("../data");
	$allData = "";
	for($x = 2; $x < sizeOf($allTesters);$x++){
		$graphsDone = scanDir("../data/".$allTesters[$x]."");
		for($y = 2; $y < sizeOf($graphsDone);$y++){
			if($graphsDone[$y] == $graphChosen)
			{
				$filename = "../data/".$allTesters[$x]."/".$graphsDone[$y]."";
				$handle = fopen($filename,"r");
				$text = fread($handle,filesize($filename));
				$allData = $allData.$text."$";

				fclose($handle);
			}
		}//inner for for each test user
	}//outer for all directories
	echo $allData;

?>
