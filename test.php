<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://fonts.googleapis.com/css?family=Permanent Marker' rel='stylesheet'>
    <link rel="stylesheet" href="css/inicio_sesion.css">
    <title>Graficas Web</title>
    <script type='text/javascript'>
        function a()
        {
            window.modal_inicio_Sesion.showModal();
        }
    </script>
</head>
<body>

    <center>
        <dialog id="modal_inicio_Sesion" class="modal_inicio_Sesion">
            <h3 class="IS_titulo">Inicio Sesión</h3>
            <input type="text" placeholder="Usuario" class="Input_IS"><br><br><br>
            <input type="password" placeholder="Contraseña" class="Input_IS"><br><br>
            <button id="IS_enviar" class="IS_button">Iniciar Sesión</button><br><br>
            <button id="IS_volver" class="IS_button" onclick="window.modal_inicio_Sesion.close();">Volver</button><br>
            <button class="IS_button_reg" onclick="window.modal_inicio_Sesion.close(); window.modal_registro.showModal();">Registrarse</button>
        </dialog>
        <button onclick="a();">a</button>
    </center>

    <center>
        <dialog id="modal_registro" class="modal_registro">
            <h3>Registro</h3>
            <input type="text" placeholder="nombre..."><br><br>
            <input type="file"><br><br>
            <input type="text" placeholder="contraseña..."><br><br>
            <input type="text" placeholder="confirmar contraseña..."><br><br>
            <button>Registrarse</button><br>
            <button onclick="window.modal_registro.close();">Cancelar</button><br>
        </dialog>
    </center>

</body>
</html>