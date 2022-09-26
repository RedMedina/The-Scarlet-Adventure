<?php
    $response = $_POST['response'];
    if($response == 1)
    {
        session_start();
        unset ($_SESSION['loggedin']);
        unset ($_SESSION['id']);
        unset ($_SESSION['photo']);
        unset ($_SESSION['nombre']);
        unset ($_SESSION['horas_jugadas']);
        session_destroy();
        echo "Sesion fuera";
    }
?>