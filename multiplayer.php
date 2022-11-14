<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graficas Web</title>
    <link rel="stylesheet" href="css/font.css">
    <link href='https://fonts.googleapis.com/css?family=Permanent Marker' rel='stylesheet'>
    <link rel="stylesheet" href="css/game.css">
    <link rel="stylesheet" href="css/pause.css">
</head>
<body>
        <!--canvas id="c1"></canvas>
        <canvas id="c2"></canvas-->
        <div style="display: flex; height: 100%">
            <div id="scene-section-1"></div>
            <div id="scene-section-2"></div>
        </div>
        
    <script type="importmap">
		{
			"imports": {
				"three": "/PWGW/node_modules/three/build/three.module.js"
			}
		}
	 </script>

     <section id="loading-screen">
        <div id="loader"></div>
        <center><p id="loading-text">Cargando...</p></center>
    </section>

    <?php include("pause.php") ?>

    <script>
        var Pause = false;
        const AccionesMenu = {};
        function CerrarPause()
            {
                Pause = false;
                window.ModalMenu.close();
                AccionesMenu.render();
            }
            
    </script>

    <script type='text/javascript' src="modules/jquery-3.3.1.min.js"></script>
	<script type='text/javascript' src="modules/jquery.min.js"></script>
    <script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
    <script src="js/camera.js" type="module"></script>
    <script src="js/audio.js" type="module"></script>
    <script src="js/light.js" type="module"></script>
    <script src="js/terrain.js" type="module"></script>
    <script src="js/skydome.js" type="module"></script>
    <script src="js/water.js" type="module"></script>
    <script src="js/scene-multi.js" type="module"></script>
    <script src="js/main-multi.js" type="module"></script>
</body>
</html>