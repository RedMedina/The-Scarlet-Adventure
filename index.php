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
</head>
<body>

    <div id="large-header" class="large-header">
        <canvas id="c"></canvas>
        <img src="Assets/Images/Inicio.png" height="762" width="620">
        <button class="jugar">Jugar</button>
        <button class="Opciones" onclick="window.modal_config.showModal();"><img src="Assets/Images/gear.png" width="45" height="45" style="position: absolute; left: 2%;"></button>
        <button class="Ranking" onclick="window.modal.showModal();"><img src="Assets/Images/ranking.png" width="45" height="45" style="position: absolute; left: 2%;"></button>
        <button class="IniciarSesion" onclick="window.modal_inicio_Sesion.showModal();"><img src="Assets/Images/user.png" width="60" height="60" style="position: absolute; left: -12%;"></button>
    </div>

    <center>
    <dialog id="modal" class="modal">
        <h3>Ranking</h3>
        <table cellspacing="0">
            <tr>
                <th class="nombre">Nombre</th>
                <th>Nivel</th>
                <th>Tiempo Jugado</th>
                <th class="UConexion">Ultima Conexión</th>
            </tr>
            <tr>
                <td>Usuario</td>
                <td>1</td>
                <td>24:49 horas</td>
                <td>06-09-20220</td>
            </tr>
            <tr>
                <td>Usuario</td>
                <td>2</td>
                <td>23:44 horas</td>
                <td>07-09-20220</td>
            </tr>
        </table>
        <button onclick="window.modal.close();" class="volverBtn">Volver</button><br>
        <!--img src="Assets/Images/Pincelada.png" width="230" height="85" class="imgRanking"-->
    </dialog>

    <center>
        <dialog id="modal_inicio_Sesion" class="modal_inicio_Sesion">
            <h3 class="IS_titulo">Inicio Sesión</h3>
            <input type="text" placeholder="Usuario" class="Input_IS"><br><br><br>
            <input type="password" placeholder="Contraseña" class="Input_IS"><br><br>
            <button id="IS_enviar" class="IS_button">Iniciar Sesión</button><br><br>
            <button id="IS_volver" class="IS_button" onclick="window.modal_inicio_Sesion.close();">Volver</button><br>
            <button class="IS_button_reg" onclick="window.modal_inicio_Sesion.close(); window.modal_registro.showModal();">Registrarse</button>
        </dialog>
    </center>

    <center>
        <dialog id="modal_registro" class="modal_registro">
            <h3 class="Reg_Titulo">Registro</h3>
            <input type="text" placeholder="nombre..." class="Input_Reg"><br><br><br>
            <input type="text" placeholder="contraseña..." class="Input_Reg"><br><br><br>
            <input type="text" placeholder="confirmar contraseña..." class="Input_Reg"><br><br>
            <button class="Reg_button_reg">Registrarse</button><br><br>
            <button onclick="window.modal_registro.close();" class="Reg_button_can">Cancelar</button><br>
        </dialog>
    </center>

    </center>

    <center>
        <dialog id="modal_config" class="modal_config">
            <h3 class="TituloConfig">Ajustes</h3>
            <label class="l1">Dificultad: </label><br>
            <select class="DificultadConfig">
                <option value="Facil">Facil</option>
                <option value="Normal">Normal</option>
                <option value="Dificil">Dificil</option>
            </select><br>
            <label class="l2">Volumen: </label><input type="range" min="0" max="100" class="RangoC" value="50" oninput="this.nextElementSibling.value = this.value">
            <output class="outputRange">50</output><br>
            <button class="guardarConfig">Guardar</button>
            <button class="SalirConfig" onclick="window.modal_config.close();">Salir</button>
        </dialog>
    </center>

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

    <!--script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/three.min.js"></script-->
    <script type='text/javascript' src="modules/jquery-3.3.1.min.js"></script>
	<script type='text/javascript' src="modules/jquery.min.js"></script>
    <!--script src="modules/three.js"></script>
    <script src="modules/OrbitControls.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/LoaderSupport.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/OBJLoader2.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/MTLLoader.js"></script>
    <script src="modules/GLTFLoader.js"></script-->
    <script src="jsindex/mainindex.js" type="module"></script>
</body>
</html>