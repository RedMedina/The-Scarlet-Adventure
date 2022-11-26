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

    <?php
        session_start();
        if(!isset($_SESSION['loggedin']))
        {
            header("Location: index.php");
        }
    ?>

    <canvas id="c"></canvas>

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
    <div id="bg" class="bg"><p style="color: white; font-family: Permanent Marker; font-size: 80px;">GAME OVER</p></div>

    <?php include("pause.php") ?>
    <?php include("dialog.php") ?>

    <!--script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/three.min.js"></script>
    <script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/controls/OrbitControls.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/LoaderSupport.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/OBJLoader2.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/OBJLoader.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/GLTFLoader.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/MTLLoader.js"></script-->
    <!--script src="js/three.module.js"></script>
    <script src="js/Reflector.js"></script>
    <script src="js/Refractor.js"></script>
    <script src="js/Water2.js"></script-->
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
    <script type='text/javascript' src="backend/readPlayer.back.js"></script>
    <script type='text/javascript' src="backend/saveItems.back.js"></script>
    <script type='text/javascript' src="backend/getItems.back.js"></script>
    <script type='text/javascript' src="backend/updatePlayer.back.js"></script>
    <script type='text/javascript' src="frontend/Configuraciones.js"></script>
    <script>
        $(document).ready
        (
            GetConfig()
        );
    </script>
    <script src="js/camera.js" type="module"></script>
    <script src="js/audio.js" type="module"></script>
    <script src="js/light.js" type="module"></script>
    <script src="js/terrain.js" type="module"></script>
    <script src="js/skydome.js" type="module"></script>
    <script src="js/water.js" type="module"></script>
    <script src="js/scene.js" type="module"></script>
    <script src="js/main.js" type="module"></script>
</body>
</html>