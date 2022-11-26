<?php

    $response = json_decode($_POST['set']);

    if($response->active == true)
    {
        session_start();
        $_SESSION['volumen'] = $response->sonido;
        $_SESSION['dif'] = 1.1 + ($response->dificultad/10);
    }
    else
    {
        session_start();
        echo json_encode(array("sonido"=> $_SESSION['volumen'], "dif"=> $_SESSION['dif']));
    }

?>