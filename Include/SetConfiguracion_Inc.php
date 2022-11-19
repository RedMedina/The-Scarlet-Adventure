<?php

    $response = json_decode($_POST['set']);

    if($response->active == true)
    {
        session_start();
        $_SESSION['volumen'] = $response->sonido;
    }
    else
    {
        session_start();
        echo json_encode($_SESSION['volumen']);
    }

?>