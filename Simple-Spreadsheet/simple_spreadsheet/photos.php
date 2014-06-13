<?php
	if(isset($_GET["row"]))
		$row = $_GET["row"];
	if(isset($_GET["col"]))
		$col = $_GET["col"];
	$photos = new DirectoryIterator('photos/');
	$cols = 0;
	$rows = 8;
	print "<script>";
	print "function imageClicked(num){\n";
	print "if(window.opener){\n";
	print "window.opener.document.getElementById(\"".$row."_".$col."\").childNodes[0].innerHTML = \"<img width = '50' height = '50' src='\"+document.images[num].src+\"'>\";\n";
	print "}\n";
	print "window.close()";
	print "}\n";
	print "</script>";
	
	print "<table>\n";
	foreach($photos as $pic){
		if($pic != "." && $pic != "..")
		{
			if($cols%$rows == 0){
				print "<tr>\n";
			}
			print "<td><img width='100' height='100' src ='photos/".$pic."' onclick='imageClicked(".$cols.")'></td>\n";
			if($cols%$rows == ($rows-1)){
				print "</tr>\n";
			}
			$cols++;
		}
	}
	print "</table>";
?>