<?php
	$version = "7drlbf2";
	$environment = "SERVER";
	$contextPath = "/7DRL15/";
	
	if ($environment == "SERVER"){
		$contextPath = "/stygian/play/"; 
		
		if ($_SERVER['HTTP_HOST'] == "games.jucarave.net" || $_SERVER['HTTP_HOST'] == "games.jucarave.com")
			$contextPath = "/7DRL15/";
	} 
?>