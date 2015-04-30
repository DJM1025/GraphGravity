<?php
//Compile with  g++ pugixml-1.5/src/pugixml.cpp Gravity.cpp
$graph = $_POST["graph"];
$fileName = "file".uniqid().".xml";
$file = fopen($fileName, "w");
fwrite($file, $graph);
fclose($file);
echo `./a.out $fileName`;
unlink($fileName);
?>