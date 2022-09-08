<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graficas Web</title>
    <link href='https://fonts.googleapis.com/css?family=Permanent Marker' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href='https://css.gg/profile.css' rel='stylesheet'>
    <link href='https://css.gg/trophy.css' rel='stylesheet'>
    <link rel="stylesheet" href="css/game.css">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/ranking.css">
</head>
<body>

    <div id="large-header" class="large-header">
        <canvas id="c"></canvas>
        <img src="Assets/Images/Inicio.png" height="762" width="620">
        <button class="jugar">Jugar</button>
        <button class="Opciones"><img src="https://cdn.pixabay.com/photo/2016/01/03/11/24/gear-1119298_640.png" width="45" height="45" style="position: absolute; left: 2%;"></button>
        <button class="Ranking" onclick="window.modal.showModal();"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077196.png" width="45" height="45" style="position: absolute; left: 2%;"></button>
        <button class="IniciarSesion"><img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" width="60" height="60" style="position: absolute; left: -12%;"></button>
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
    </center>

    <section id="loading-screen">
        <div id="loader"></div>
        <center><p id="loading-text">Cargando...</p></center>
    </section>
    
    <!--script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/three.min.js"></script-->
    <script type='text/javascript' src="modules/jquery-3.3.1.min.js"></script>
	<script type='text/javascript' src="modules/jquery.min.js"></script>
    <script src="modules/three.js"></script>
    <script src="modules/OrbitControls.js"></script>
    <!--script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/LoaderSupport.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/OBJLoader2.js"></script>
    <script src="https://r105.threejsfundamentals.org/threejs/resources/threejs/r105/js/loaders/MTLLoader.js"></script-->
    <script src="modules/GLTFLoader.js"></script>
    <script src="jsindex/mainindex.js"></script>
</body>
</html>