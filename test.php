<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--link href='https://fonts.googleapis.com/css?family=Permanent Marker' rel='stylesheet'-->
    <link rel="stylesheet" href="css/inicio_sesion.css">
    <link rel="stylesheet" href="css/registro.css">
    <link rel="stylesheet" href="css/font.css">
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
            <h3 class="Reg_Titulo">Registro</h3>
            <input type="text" placeholder="nombre..." class="Input_Reg"><br><br><br>
            <input type="text" placeholder="contraseña..." class="Input_Reg"><br><br><br>
            <input type="text" placeholder="confirmar contraseña..." class="Input_Reg"><br><br>
            <button class="Reg_button_reg">Registrarse</button><br><br>
            <button onclick="window.modal_registro.close();" class="Reg_button_can">Cancelar</button><br>
        </dialog>
    </center>

</body>
</html>