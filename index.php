<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graficas Web</title>
    <link rel="stylesheet" href="css/font.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href='https://css.gg/profile.css' rel='stylesheet'>
    <link href='https://css.gg/trophy.css' rel='stylesheet'>
    <link rel="stylesheet" href="css/game.css">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/inicio_sesion.css">
    <link rel="stylesheet" href="css/registro.css">
    <link rel="stylesheet" href="css/ranking.css">
    <link rel="stylesheet" href="css/config.css">
    <link rel="stylesheet" href="css/perfil.css">
</head>
<body>

<?php
    session_start();
?>

    <div id="large-header" class="large-header">
        <canvas id="c"></canvas>
        <img src="Assets/Images/Inicio.png" height="762" width="620">
        <button class="jugar">Jugar</button>
        <button class="Opciones" onclick="window.modal_config.showModal();"><img src="Assets/Images/gear.png" width="45" height="45" style="position: absolute; left: 2%;"></button>
        <button class="Ranking" onclick="window.modal.showModal();"><img src="Assets/Images/ranking.png" width="45" height="45" style="position: absolute; left: 2%;"></button>
        <?php
            if(isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true)
            {
        ?>
        <button class="IniciarSesion" onclick="window.modal_perfil.showModal();"><img src=<?php echo $_SESSION['photo'];?> width="60" height="60" style="position: absolute; left: -12%; border-radius: 50%;"></button>
        <?php       
            }
            else
            {
        ?>
        <button class="IniciarSesion" onclick="window.modal_inicio_Sesion.showModal();"><img src="Assets/Images/user.png" width="60" height="60" style="position: absolute; left: -12%;"></button>
        <?php         
            }
        ?> 
    </div>

    <?php include("ranking.php") ?>
    <?php include("login.php") ?>
    <?php include("config.php") ?>
    <?php include("perfil.php") ?>

    <section id="loading-screen">
        <div id="loader"></div>
        <center><p id="loading-text">Cargando...</p></center>
    </section>
    
    <script type="importmap">
		{
			"imports": {
				"three": "/PWGW/node_modules/three/build/three.module.js"
			}
		}
	 </script>

    <script type='text/javascript' src="modules/jquery-3.3.1.min.js"></script>
	<script type='text/javascript' src="modules/jquery.min.js"></script>
    <script type='text/javascript' src="backend/register.back.js"></script>
    <script type='text/javascript' src="backend/sesion.back.js"></script>
    <script type='text/javascript' src="backend/logout.back.js"></script>
    <script type='text/javascript' src="backend/update.back.js"></script>
    <script src="jsindex/mainindex.js" type="module"></script>
</body>
</html>