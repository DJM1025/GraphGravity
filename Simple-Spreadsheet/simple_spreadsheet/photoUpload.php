<?php
define('UPLOAD_DIR', 'storedPhotos/');
if (isset($_POST['blob'])) {
	$img = $_POST['blob'];
	//$img = str_replace('data:image/jpeg;base64,', '', $img);  //Performed in the JS 
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . uniqid() . '.png';
	file_put_contents($file, $data);
	echo "./".$file;
}
?>