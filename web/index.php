<?php 
	require("system/config.php");
	$ver = "?version=" . $version; 
?>
<!DOCTYPE HTML>
<html>
	<head>
		<title>Underworld GL - Jucarave</title>
		
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Vec.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Utils.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/ObjectFactory.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Matrix.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/WebGL.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/UI.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Underworld.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/MapAssembler.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/MapManager.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Player.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/TitleScreen.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/AnimatedTexture.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Door.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Billboard.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Console.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Inventory.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Item.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Enemy.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Lifter.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/ItemFactory.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Object3D.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/EnemyFactory.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/PlayerStats.js<?php echo $ver; ?>"></script>
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Missile.js<?php echo $ver; ?>"></script>
		
		<script type="text/javascript" src="<?php echo $contextPath; ?>js/Debug.js<?php echo $ver; ?>"></script>
		
		<script type="text/javascript">
			var version = "<?php echo $version; ?>";
			var cp = "<?php echo $contextPath; ?>";
		</script>
		
		<script id="vertexShader" type="x-shader/x-vertex"><?php require("shaders/vertexShader"); ?></script>
		<script id="fragmentShader" type="x-shader/x-fragment"><?php require("shaders/fragmentShader"); ?></script>
		
		<style>
			body { background-color: black; }
			#divGame {
				left: 0px;
				top: 0px;
				width: 100%;
				height: 100%;
				text-align: center;
				position: absolute;
			}
			
			canvas{ 
				left: 0px;
				right: 0px;
				margin: auto;
				
				image-rendering: optimizeSpeed;             /* Older versions of FF */
			    image-rendering: -moz-crisp-edges;          /* FF 6.0+ */
			    image-rendering: -webkit-optimize-contrast; /* Safari */
			    image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */
			    image-rendering: pixelated;                 /* Awesome future-browsers */
			    -ms-interpolation-mode: nearest-neighbor;   /* IE  */
			}
			
			#DEBUGDIV, #DEBUGDIV2{
				position: absolute; 
				background-color: rgba(255,255,255,0.8); 
				border: 1px solid #000; 
				width: 200px; 
				padding: 16px; 
				border-radius: 16px; 
				font-family: monospace;
				top: 8px; 
			}
			
			#DEBUGDIV input, #DEBUGDIV2 input{
				text-align: center;
				font-family: monospace;
			}
			
			#DEBUGDIV2 img{
				width: 48px;
				height: 48px;
				cursor: pointer;
			}
			
			.selected{
				border: 1px solid #FF0;
			}
		</style>
	</head>
	
	<body>
		<div id="divGame" ></div>
		
		<div id="DEBUGDIV" style="display: none">
			<div style="margin-bottom: 16px;">Object: <span id="KT_objLabel"></span></div>
			
			<div>X: <input type="button" value="<<" onclick="DEBUG.move('a',-1)" /><input type="button" value="<" onclick="DEBUG.move('a',-0.1)" /><input type="text" id="KT_x" onchange="DEBUG.setValue('a',this)" value="0" size="8" /><input type="button" value=">" onclick="DEBUG.move('a',0.1)" /><input type="button" value=">>" onclick="DEBUG.move('a',1)" /></div>
			<div>Y: <input type="button" value="<<" onclick="DEBUG.move('b',-1)" /><input type="button" value="<" onclick="DEBUG.move('b',-0.1)" /><input type="text" id="KT_y" onchange="DEBUG.setValue('b',this)" value="0" size="8" /><input type="button" value=">" onclick="DEBUG.move('b',0.1)" /><input type="button" value=">>" onclick="DEBUG.move('b',1)" /></div>
			<div>Z: <input type="button" value="<<" onclick="DEBUG.move('c',-1)" /><input type="button" value="<" onclick="DEBUG.move('c',-0.1)" /><input type="text" id="KT_z" onchange="DEBUG.setValue('c',this)" value="0" size="8" /><input type="button" value=">" onclick="DEBUG.move('c',0.1)" /><input type="button" value=">>" onclick="DEBUG.move('c',1)" /></div>
			
			<hr />
			<div>Height: <input type="button" value="<<" onclick="DEBUG.changeHeight(-1)" /><input type="text" id="KT_height" disabled="disabled" value="0" size="8" /><input type="button" value=">>" onclick="DEBUG.changeHeight(1)" /></div>
			
			<hr />
			<div style="text-align: center"><input type="button" value="Close" onclick="DEBUG.close();"/></div>
		</div>
		
		<div id="DEBUGDIV2" style="display: none; right: 8px;">
			<div style="margin-bottom: 16px;">Texture: </div>
			
			<div>
				<div id="KT_textures_W"><div>Wall Texture:</div></div>
				<div id="KT_textures_F"><div>Floor Texture:</div></div>
				<div id="KT_textures_C"><div>Ceil Texture:</div></div>
			</div>
		</div>
	</body>
</html>